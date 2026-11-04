import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "../utils/api";
import { logout } from "./authSlice";

// Favourites are saved on the server for the logged in user, so every account has its own list.

export const fetchFavourites = createAsyncThunk(
    "favourites/fetchFavourites",
    async (_, { getState, rejectWithValue }) => {
        try {
            const result = await apiRequest("GET", "/favourites", null, getState().auth.token);
            return result.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const addFavourite = createAsyncThunk(
    "favourites/addFavourite",
    async (bookId, { getState, rejectWithValue }) => {
        try {
            const result = await apiRequest("POST", "/favourites/" + bookId, null, getState().auth.token);
            return result.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const removeFavourite = createAsyncThunk(
    "favourites/removeFavourite",
    async (bookId, { getState, rejectWithValue }) => {
        try {
            const result = await apiRequest("DELETE", "/favourites/" + bookId, null, getState().auth.token);
            return result.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    items: [],           // full book objects
    status: "idle",      // idle | loading | succeeded | failed
    error: ""
};

const favouritesSlice = createSlice({
    name: "favourites",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchFavourites.pending, (state) => {
                state.status = "loading";
                state.error = "";
            })
            .addCase(fetchFavourites.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.items = action.payload;
            })
            .addCase(fetchFavourites.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || "Could not load your favourites.";
            })

            // add and remove both return the new full list
            .addCase(addFavourite.fulfilled, (state, action) => {
                state.items = action.payload;
            })
            .addCase(removeFavourite.fulfilled, (state, action) => {
                state.items = action.payload;
            })

            // signing out clears the list, the next user loads their own
            .addCase(logout, () => initialState);
    }
});

export const selectIsFavourite = (bookId) => (state) => {
    return state.favourites.items.some((book) => book._id === bookId);
};

export default favouritesSlice.reducer;
