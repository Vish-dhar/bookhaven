import { createSlice } from "@reduxjs/toolkit";

// Small "Added to cart" toast
const uiSlice = createSlice({
    name: "ui",
    initialState: {
        toast: null   // { id, message, linkLabel, linkTo }
    },
    reducers: {
        showToast(state, action) {
            state.toast = Object.assign({ id: Date.now() }, action.payload);
        },
        hideToast(state) {
            state.toast = null;
        }
    }
});

export const { showToast, hideToast } = uiSlice.actions;
export default uiSlice.reducer;
