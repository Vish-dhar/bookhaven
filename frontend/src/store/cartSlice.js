import { createSlice } from "@reduxjs/toolkit";
import { COUPONS, FREE_SHIPPING_MIN, SHIPPING_FEE, MAX_PER_BOOK } from "../config/constants";
import { getDiscountPrice, round2 } from "../utils/price";
import { logout } from "./authSlice";

// most copies of one book the customer can add
export const maxQuantity = (stock) => Math.min(stock, MAX_PER_BOOK);

const initialState = {
    items: [],          // { id, title, author, category, coverTheme, price, discountPercentage, unitPrice, stock, quantity }
    couponCode: "",     // applied coupon, for example SAVE10
    couponError: ""
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        // payload: { book, quantity }
        addItem(state, action) {
            const { book, quantity = 1 } = action.payload;
            const existing = state.items.find((item) => item.id === book._id);

            if (existing) {
                existing.stock = book.stock;
                existing.quantity = Math.min(existing.quantity + quantity, maxQuantity(book.stock));
            } else {
                state.items.push({
                    id: book._id,
                    title: book.title,
                    author: book.author,
                    category: book.category,
                    coverTheme: book.coverTheme,
                    price: book.price,
                    discountPercentage: book.discountPercentage,
                    unitPrice: getDiscountPrice(book.price, book.discountPercentage),
                    stock: book.stock,
                    quantity: Math.min(quantity, maxQuantity(book.stock))
                });
            }
        },
        increase(state, action) {
            const item = state.items.find((entry) => entry.id === action.payload);
            if (item && item.quantity < maxQuantity(item.stock)) {
                item.quantity += 1;
            }
        },
        // going below 1 removes the book
        decrease(state, action) {
            const item = state.items.find((entry) => entry.id === action.payload);
            if (!item) return;

            if (item.quantity <= 1) {
                state.items = state.items.filter((entry) => entry.id !== action.payload);
            } else {
                item.quantity -= 1;
            }
        },
        remove(state, action) {
            state.items = state.items.filter((item) => item.id !== action.payload);
        },
        clear(state) {
            state.items = [];
            state.couponCode = "";
            state.couponError = "";
        },
        applyCoupon(state, action) {
            const code = String(action.payload || "").trim().toUpperCase();

            if (COUPONS[code]) {
                state.couponCode = code;
                state.couponError = "";
            } else {
                state.couponCode = "";
                state.couponError = "Invalid coupon code";
            }
        },
        removeCoupon(state) {
            state.couponCode = "";
            state.couponError = "";
        }
    },
    extraReducers: (builder) => {
        // signing out empties the cart, so the next person who signs in starts fresh
        builder.addCase(logout, () => initialState);

        // when an order is placed successfully, empty the cart in the same step
        builder.addMatcher(
            (action) => action.type === "orders/placeOrder/fulfilled",
            (state) => {
                state.items = [];
                state.couponCode = "";
                state.couponError = "";
            }
        );
    }
});

export const { addItem, increase, decrease, remove, clear, applyCoupon, removeCoupon } = cartSlice.actions;

// ---------- selectors ----------

export const selectCartItems = (state) => state.cart.items;

export const selectItemCount = (state) => {
    return state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
};

export const selectQuantityById = (id) => (state) => {
    const item = state.cart.items.find((entry) => entry.id === id);
    return item ? item.quantity : 0;
};

export const selectSubtotal = (state) => {
    return round2(state.cart.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0));
};

export const selectDiscount = (state) => {
    const percent = COUPONS[state.cart.couponCode] || 0;
    return round2(selectSubtotal(state) * percent / 100);
};

// free shipping when subtotal is 50 or more (an empty cart pays nothing)
export const selectShipping = (state) => {
    const subtotal = selectSubtotal(state);
    if (subtotal === 0) return 0;
    return subtotal >= FREE_SHIPPING_MIN ? 0 : SHIPPING_FEE;
};

export const selectTotal = (state) => {
    return round2(selectSubtotal(state) - selectDiscount(state) + selectShipping(state));
};

export default cartSlice.reducer;
