const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
    {
        book: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book",
            required: true
        },
        title: {
            type: String,
            required: true
        },
        author: {
            type: String,
            default: ""
        },
        coverTheme: {
            type: Number,
            default: 1
        },
        unitPrice: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        lineTotal: {
            type: Number,
            required: true
        }
    },
    {
        _id: false
    }
);

const addressSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true, trim: true },
        phone: { type: String, required: true, trim: true },
        line1: { type: String, required: true, trim: true },
        line2: { type: String, default: "", trim: true },
        city: { type: String, required: true, trim: true },
        state: { type: String, required: true, trim: true },
        postalCode: { type: String, required: true, trim: true },
        country: { type: String, default: "India", trim: true }
    },
    {
        _id: false
    }
);

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        items: {
            type: [orderItemSchema],
            required: true
        },
        shippingAddress: {
            type: addressSchema,
            required: true
        },
        paymentMethod: {
            type: String,
            enum: ["COD"],
            default: "COD"
        },
        paymentStatus: {
            type: String,
            enum: ["PENDING", "PAID"],
            default: "PENDING"
        },
        orderStatus: {
            type: String,
            enum: ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"],
            default: "PLACED"
        },
        couponCode: {
            type: String,
            default: ""
        },
        subtotal: {
            type: Number,
            required: true
        },
        discount: {
            type: Number,
            default: 0
        },
        shippingFee: {
            type: Number,
            default: 0
        },
        total: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Order", orderSchema);
