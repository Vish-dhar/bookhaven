const mongoose = require("mongoose");
const Book = require("../models/book.model");
const Order = require("../models/order.model");
const createError = require("../utils/httpError");
const { round2, calcFinalPrice } = require("../utils/price");
const { FREE_SHIPPING_MIN, SHIPPING_FEE, COUPONS } = require("../config/storeRules");

const MAX_QUANTITY_PER_BOOK = 10;

const ADDRESS_FIELDS = ["fullName", "phone", "line1", "city", "state", "postalCode"];

// which status an order is allowed to move to next
const NEXT_STATUS = {
    PLACED: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["SHIPPED", "CANCELLED"],
    SHIPPED: ["DELIVERED"],
    DELIVERED: [],
    CANCELLED: []
};

class OrderService {
    // The server calculates every amount itself. Prices sent by the browser are never trusted.
    calculateTotals(subtotal, couponCode) {
        let discount = 0;
        let appliedCoupon = "";

        if (couponCode) {
            const code = String(couponCode).trim().toUpperCase();
            const percent = COUPONS[code];

            if (!percent) {
                throw createError("Invalid coupon code", 400);
            }

            appliedCoupon = code;
            discount = round2(subtotal * percent / 100);
        }

        const shippingFee = subtotal >= FREE_SHIPPING_MIN ? 0 : SHIPPING_FEE;
        const total = round2(subtotal - discount + shippingFee);

        return { appliedCoupon, discount, shippingFee, total };
    }

    async restoreStock(order) {
        for (const item of order.items) {
            await Book.findOneAndUpdate(
                { _id: item.book },
                { $inc: { stock: item.quantity } }
            );
        }
    }

    async placeOrder(user, body) {
        const { items, shippingAddress, couponCode } = body;
        const paymentMethod = body.paymentMethod || "COD";

        if (!Array.isArray(items) || items.length === 0) {
            throw createError("Order must contain at least one item", 400);
        }

        if (paymentMethod !== "COD") {
            throw createError("Only COD (cash on delivery) is available", 400);
        }

        if (!shippingAddress || typeof shippingAddress !== "object") {
            throw createError("Shipping address is required", 400);
        }

        for (const field of ADDRESS_FIELDS) {
            if (!shippingAddress[field] || !String(shippingAddress[field]).trim()) {
                throw createError(`Shipping address ${field} is required`, 400);
            }
        }

        // 1) clean the requested items (merge the same book sent twice)
        const wanted = [];

        for (const item of items) {
            if (!item || !mongoose.Types.ObjectId.isValid(item.bookId)) {
                throw createError("Invalid book ID in items", 400);
            }

            const quantity = Number(item.quantity);

            if (!Number.isInteger(quantity) || quantity < 1) {
                throw createError("Quantity must be a whole number of 1 or more", 400);
            }

            const existing = wanted.find((w) => w.bookId === String(item.bookId));

            if (existing) {
                existing.quantity += quantity;
            } else {
                wanted.push({ bookId: String(item.bookId), quantity });
            }
        }

        // 2) read the real books from the database and build the order lines
        const lines = [];

        for (const w of wanted) {
            if (w.quantity > MAX_QUANTITY_PER_BOOK) {
                throw createError(`You can order at most ${MAX_QUANTITY_PER_BOOK} copies of one book`, 400);
            }

            const book = await Book.findOne({ _id: w.bookId, isActive: true });

            if (!book) {
                throw createError("One of the books is no longer available", 404);
            }

            if (book.stock < w.quantity) {
                throw createError(
                    book.stock === 0
                        ? `"${book.title}" is out of stock`
                        : `Only ${book.stock} left for "${book.title}"`,
                    409
                );
            }

            const unitPrice = calcFinalPrice(book.price, book.discountPercentage);

            lines.push({
                book: book._id,
                title: book.title,
                author: book.author,
                coverTheme: book.coverTheme,
                unitPrice,
                quantity: w.quantity,
                lineTotal: round2(unitPrice * w.quantity)
            });
        }

        let subtotal = 0;
        for (const line of lines) {
            subtotal += line.lineTotal;
        }
        subtotal = round2(subtotal);

        const totals = this.calculateTotals(subtotal, couponCode);

        // 3) take the stock, then save the order. If anything fails, give the stock back.
        const reserved = [];

        try {
            for (const line of lines) {
                const updated = await Book.findOneAndUpdate(
                    { _id: line.book, stock: { $gte: line.quantity } },
                    { $inc: { stock: -line.quantity } },
                    { new: true }
                );

                if (!updated) {
                    throw createError(`"${line.title}" just went out of stock`, 409);
                }

                reserved.push(line);
            }

            return await Order.create({
                user: user.id,
                items: lines,
                shippingAddress: {
                    fullName: shippingAddress.fullName,
                    phone: shippingAddress.phone,
                    line1: shippingAddress.line1,
                    line2: shippingAddress.line2 || "",
                    city: shippingAddress.city,
                    state: shippingAddress.state,
                    postalCode: shippingAddress.postalCode,
                    country: shippingAddress.country || "India"
                },
                paymentMethod,
                couponCode: totals.appliedCoupon,
                subtotal,
                discount: totals.discount,
                shippingFee: totals.shippingFee,
                total: totals.total
            });
        } catch (error) {
            await this.restoreStock({ items: reserved });

            if (error.name === "ValidationError") {
                throw createError(error.message, 400);
            }
            throw error;
        }
    }

    async getMyOrders(userId) {
        return Order.find({ user: userId }).sort({ createdAt: -1 });
    }

    async getOrderById(actor, orderId) {
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            throw createError("Invalid order ID", 400);
        }

        const order = await Order.findOne({ _id: orderId });

        if (!order) {
            throw createError("Order not found", 404);
        }

        if (actor.role !== "ADMIN" && String(order.user) !== actor.id) {
            throw createError("You can view only your own orders", 403);
        }

        return order;
    }

    // Customer cancels own order (only while it is still PLACED)
    async cancelMyOrder(actor, orderId) {
        const order = await this.getOrderById(actor, orderId);

        if (order.orderStatus !== "PLACED") {
            throw createError("Only a PLACED order can be cancelled", 400);
        }

        return this.changeStatus(order, "CANCELLED");
    }

    // ADMIN: all orders, optional ?status=SHIPPED
    async getAllOrders(status) {
        const filter = {};

        if (status) {
            filter.orderStatus = String(status).toUpperCase();
        }

        return Order.find(filter).sort({ createdAt: -1 });
    }

    // ADMIN: move an order to the next status
    async updateOrderStatus(orderId, newStatus) {
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            throw createError("Invalid order ID", 400);
        }

        if (!newStatus || !Object.keys(NEXT_STATUS).includes(String(newStatus).toUpperCase())) {
            throw createError("Status must be one of: " + Object.keys(NEXT_STATUS).join(", "), 400);
        }

        const order = await Order.findOne({ _id: orderId });

        if (!order) {
            throw createError("Order not found", 404);
        }

        return this.changeStatus(order, String(newStatus).toUpperCase());
    }

    async changeStatus(order, newStatus) {
        if (!NEXT_STATUS[order.orderStatus].includes(newStatus)) {
            throw createError(
                `Cannot change order from ${order.orderStatus} to ${newStatus}`,
                400
            );
        }

        const updates = { orderStatus: newStatus };

        // Cash on delivery: the money is received when the order is delivered
        if (newStatus === "DELIVERED") {
            updates.paymentStatus = "PAID";
        }

        // The old status is part of the filter, so the same order can never be changed twice at once
        const updated = await Order.findOneAndUpdate(
            { _id: order._id, orderStatus: order.orderStatus },
            { $set: updates },
            { new: true }
        );

        if (!updated) {
            throw createError("Order status was changed by someone else. Please try again", 409);
        }

        if (newStatus === "CANCELLED") {
            await this.restoreStock(updated);
        }

        return updated;
    }
}

module.exports = new OrderService();
