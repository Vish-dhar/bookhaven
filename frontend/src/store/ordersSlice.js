import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "../utils/api";
import { logout } from "./authSlice";

export const placeOrder = createAsyncThunk(
    "orders/placeOrder",
    async ({ shippingAddress }, { getState, rejectWithValue }) => {
        const { cart, auth } = getState();

        try {
            // Only ids and quantities are sent. The server works out every price itself.
            const result = await apiRequest(
                "POST",
                "/orders",
                {
                    items: cart.items.map((item) => ({ bookId: item.id, quantity: item.quantity })),
                    shippingAddress,
                    couponCode: cart.couponCode,
                    paymentMethod: "COD"
                },
                auth.token
            );

            // the cart is emptied by cartSlice when this action is fulfilled
            return result.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchMyOrders = createAsyncThunk(
    "orders/fetchMyOrders",
    async (_, { getState, rejectWithValue }) => {
        try {
            const result = await apiRequest("GET", "/orders/my", null, getState().auth.token);
            return result.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const cancelOrder = createAsyncThunk(
    "orders/cancelOrder",
    async (orderId, { getState, rejectWithValue }) => {
        try {
            const result = await apiRequest(
                "PATCH",
                "/orders/" + orderId + "/cancel",
                null,
                getState().auth.token
            );
            return result.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    list: [],
    status: "idle",        // idle | loading | succeeded | failed
    error: "",
    placing: false,
    placeError: "",
    placed: null           // the order that was just placed
};

const ordersSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {
        resetPlaced(state) {
            state.placed = null;
            state.placeError = "";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(placeOrder.pending, (state) => {
                state.placing = true;
                state.placeError = "";
            })
            .addCase(placeOrder.fulfilled, (state, action) => {
                state.placing = false;
                state.placed = action.payload;
            })
            .addCase(placeOrder.rejected, (state, action) => {
                state.placing = false;
                state.placeError = action.payload || "Could not place the order.";
            })

            .addCase(fetchMyOrders.pending, (state) => {
                state.status = "loading";
                state.error = "";
            })
            .addCase(fetchMyOrders.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.list = action.payload;
            })
            .addCase(fetchMyOrders.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || "Could not load your orders.";
            })

            .addCase(cancelOrder.fulfilled, (state, action) => {
                state.list = state.list.map((order) =>
                    order._id === action.payload._id ? action.payload : order
                );
            })
            .addCase(cancelOrder.rejected, (state, action) => {
                state.error = action.payload || "Could not cancel the order.";
            })

            // signing out clears the order data of that account
            .addCase(logout, () => initialState);
    }
});

export const { resetPlaced } = ordersSlice.actions;
export default ordersSlice.reducer;
