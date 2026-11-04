import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "../utils/api";

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async ({ email, password }, { rejectWithValue }) => {
        try {
            return await apiRequest("POST", "/auth/login", { email, password });
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// creates the account, then signs in with the same details
export const signupUser = createAsyncThunk(
    "auth/signupUser",
    async ({ name, email, password }, { rejectWithValue }) => {
        try {
            await apiRequest("POST", "/auth/signup", { name, email, password });
            return await apiRequest("POST", "/auth/login", { email, password });
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    user: null,
    token: "",
    status: "idle",   // idle | loading | failed
    error: ""
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout(state) {
            state.user = null;
            state.token = "";
            state.status = "idle";
            state.error = "";
        },
        clearAuthError(state) {
            state.error = "";
            state.status = "idle";
        }
    },
    extraReducers: (builder) => {
        const pending = (state) => {
            state.status = "loading";
            state.error = "";
        };
        const fulfilled = (state, action) => {
            state.status = "idle";
            state.user = action.payload.user;
            state.token = action.payload.token;
        };
        const rejected = (state, action) => {
            state.status = "failed";
            state.error = action.payload || "Could not sign in.";
        };

        builder
            .addCase(loginUser.pending, pending)
            .addCase(loginUser.fulfilled, fulfilled)
            .addCase(loginUser.rejected, rejected)
            .addCase(signupUser.pending, pending)
            .addCase(signupUser.fulfilled, fulfilled)
            .addCase(signupUser.rejected, rejected);
    }
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
