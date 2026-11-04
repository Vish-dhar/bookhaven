import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest, buildQuery } from "../utils/api";
import { PAGE_SIZE } from "../config/constants";

// ---------- thunks ----------

// Reads the current filters from the store and asks our own backend for books.
export const fetchBooks = createAsyncThunk(
    "products/fetchBooks",
    async (_, { getState, rejectWithValue }) => {
        const { filters } = getState().products;

        try {
            const query = buildQuery({
                category: filters.category,
                minPrice: filters.minPrice,
                maxPrice: filters.maxPrice,
                minRating: filters.minRating,
                search: filters.search,
                sort: filters.sort,
                page: filters.page,
                limit: PAGE_SIZE
            });

            return await apiRequest("GET", "/books" + query);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchCategories = createAsyncThunk(
    "products/fetchCategories",
    async (_, { rejectWithValue }) => {
        try {
            const result = await apiRequest("GET", "/books/categories");
            return result.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchBookById = createAsyncThunk(
    "products/fetchBookById",
    async (id, { rejectWithValue }) => {
        try {
            const result = await apiRequest("GET", "/books/" + id);
            return result.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// "You may also like": other books of the same category
export const fetchRelated = createAsyncThunk(
    "products/fetchRelated",
    async ({ category, excludeId }, { rejectWithValue }) => {
        try {
            const result = await apiRequest(
                "GET",
                "/books" + buildQuery({ category, sort: "rating", limit: 5 })
            );
            return result.books.filter((book) => book._id !== excludeId).slice(0, 4);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// ---------- slice ----------

export const defaultFilters = {
    category: "",
    minPrice: "",
    maxPrice: "",
    minRating: 0,
    search: "",
    sort: "featured",
    page: 1
};

const initialState = {
    items: [],
    total: 0,
    pages: 1,
    status: "idle",        // idle | loading | succeeded | failed
    error: "",
    requestId: null,       // only the newest request may update the list
    filters: defaultFilters,

    categories: [],

    detail: { item: null, status: "idle", error: "" },
    related: { items: [], status: "idle" }
};

const productsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        // change some filters; going back to page 1 unless a page is given
        setFilters(state, action) {
            const changes = action.payload;
            state.filters = Object.assign({}, state.filters, { page: 1 }, changes);
        },
        clearFilters(state) {
            state.filters = defaultFilters;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBooks.pending, (state, action) => {
                state.status = "loading";
                state.error = "";
                state.requestId = action.meta.requestId;
            })
            .addCase(fetchBooks.fulfilled, (state, action) => {
                if (state.requestId !== action.meta.requestId) return;
                state.status = "succeeded";
                state.items = action.payload.books;
                state.total = action.payload.total;
                state.pages = action.payload.pages;
            })
            .addCase(fetchBooks.rejected, (state, action) => {
                if (state.requestId !== action.meta.requestId) return;
                state.status = "failed";
                state.error = action.payload || "Could not load books.";
            })

            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.categories = action.payload;
            })

            .addCase(fetchBookById.pending, (state) => {
                state.detail = { item: null, status: "loading", error: "" };
            })
            .addCase(fetchBookById.fulfilled, (state, action) => {
                state.detail = { item: action.payload, status: "succeeded", error: "" };
            })
            .addCase(fetchBookById.rejected, (state, action) => {
                state.detail = {
                    item: null,
                    status: "failed",
                    error: action.payload || "Could not load this book."
                };
            })

            .addCase(fetchRelated.pending, (state) => {
                state.related = { items: [], status: "loading" };
            })
            .addCase(fetchRelated.fulfilled, (state, action) => {
                state.related = { items: action.payload, status: "succeeded" };
            })
            .addCase(fetchRelated.rejected, (state) => {
                state.related = { items: [], status: "failed" };
            });
    }
});

export const { setFilters, clearFilters } = productsSlice.actions;
export default productsSlice.reducer;
