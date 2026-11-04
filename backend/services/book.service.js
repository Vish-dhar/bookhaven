const mongoose = require("mongoose");
const Book = require("../models/book.model");
const createError = require("../utils/httpError");
const { calcFinalPrice } = require("../utils/price");

// Fields an ADMIN is allowed to send when creating / updating a book.
const BOOK_FIELDS = [
    "sku",
    "title",
    "author",
    "description",
    "category",
    "price",
    "discountPercentage",
    "stock",
    "rating",
    "ratingCount",
    "publisher",
    "publishedYear",
    "pages",
    "language",
    "tags",
    "coverTheme",
    "returnPolicy",
    "guarantee",
    "featured"
];

// sort name (from the frontend) -> MongoDB sort object. _id is the tie-breaker so pages never repeat a book.
const SORT_OPTIONS = {
    featured: { featured: -1, rating: -1, _id: 1 },
    priceAsc: { finalPrice: 1, _id: 1 },
    priceDesc: { finalPrice: -1, _id: 1 },
    rating: { rating: -1, ratingCount: -1, _id: 1 },
    newest: { createdAt: -1, _id: 1 }
};

// Make user typed text safe to use inside a RegExp.
const escapeRegex = (text) => {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

class BookService {
    async getBooks(query) {
        const page = Math.max(parseInt(query.page, 10) || 1, 1);
        const limit = Math.min(Math.max(parseInt(query.limit, 10) || 8, 1), 50);

        const filter = { isActive: true };

        if (query.category) {
            filter.category = String(query.category);
        }

        const minPrice = parseFloat(query.minPrice);
        const maxPrice = parseFloat(query.maxPrice);

        if (!isNaN(minPrice) || !isNaN(maxPrice)) {
            filter.finalPrice = {};
            if (!isNaN(minPrice)) filter.finalPrice.$gte = minPrice;
            if (!isNaN(maxPrice)) filter.finalPrice.$lte = maxPrice;
        }

        const minRating = parseFloat(query.minRating);
        if (!isNaN(minRating)) {
            filter.rating = { $gte: minRating };
        }

        if (query.search && String(query.search).trim()) {
            const pattern = new RegExp(escapeRegex(String(query.search).trim()), "i");
            filter.$or = [
                { title: pattern },
                { author: pattern },
                { category: pattern },
                { tags: pattern }
            ];
        }

        const sort = SORT_OPTIONS[query.sort] || SORT_OPTIONS.featured;

        const total = await Book.countDocuments(filter);
        const books = await Book.find(filter)
            .select("-reviews -__v")
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(limit);

        return {
            books,
            total,
            page,
            limit,
            pages: Math.ceil(total / limit)
        };
    }

    async getCategories() {
        const books = await Book.find({ isActive: true }).select("category");

        const counts = {};
        for (const book of books) {
            counts[book.category] = (counts[book.category] || 0) + 1;
        }

        return Object.keys(counts)
            .sort()
            .map((name) => ({ name, count: counts[name] }));
    }

    async getBookById(bookId) {
        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            throw createError("Invalid book ID", 400);
        }

        const book = await Book.findOne({ _id: bookId, isActive: true }).select("-__v");

        if (!book) {
            throw createError("Book not found", 404);
        }

        return book;
    }

    async createBook(data) {
        const bookData = {};

        for (const field of BOOK_FIELDS) {
            if (data[field] !== undefined) {
                bookData[field] = data[field];
            }
        }

        if (typeof bookData.price !== "number" || bookData.price < 0) {
            throw createError("Price must be a number (0 or more)", 400);
        }

        if (bookData.discountPercentage === undefined) {
            bookData.discountPercentage = 0;
        }

        if (typeof bookData.discountPercentage !== "number") {
            throw createError("discountPercentage must be a number", 400);
        }

        bookData.finalPrice = calcFinalPrice(bookData.price, bookData.discountPercentage);

        try {
            return await Book.create(bookData);
        } catch (error) {
            if (error.name === "ValidationError") {
                throw createError(error.message, 400);
            }
            throw error;
        }
    }

    async updateBook(bookId, data) {
        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            throw createError("Invalid book ID", 400);
        }

        const book = await Book.findOne({ _id: bookId, isActive: true });

        if (!book) {
            throw createError("Book not found", 404);
        }

        const updates = {};

        for (const field of BOOK_FIELDS) {
            if (data[field] !== undefined) {
                updates[field] = data[field];
            }
        }

        if (Object.keys(updates).length === 0) {
            throw createError("Provide at least one book field to update", 400);
        }

        const newPrice = updates.price !== undefined ? updates.price : book.price;
        const newDiscount = updates.discountPercentage !== undefined
            ? updates.discountPercentage
            : book.discountPercentage;

        if (typeof newPrice !== "number" || newPrice < 0) {
            throw createError("Price must be a number (0 or more)", 400);
        }

        if (typeof newDiscount !== "number") {
            throw createError("discountPercentage must be a number", 400);
        }

        updates.finalPrice = calcFinalPrice(newPrice, newDiscount);

        try {
            return await Book.findOneAndUpdate(
                { _id: bookId, isActive: true },
                { $set: updates },
                { new: true, runValidators: true }
            ).select("-__v");
        } catch (error) {
            if (error.name === "ValidationError") {
                throw createError(error.message, 400);
            }
            throw error;
        }
    }

    // Soft delete: the book stays in MongoDB (old orders still point to it), only isActive becomes false.
    async softDeleteBook(bookId) {
        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            throw createError("Invalid book ID", 400);
        }

        const book = await Book.findOneAndUpdate(
            { _id: bookId, isActive: true },
            { $set: { isActive: false } },
            { new: true }
        ).select("-__v");

        if (!book) {
            throw createError("Book not found", 404);
        }

        return book;
    }
}

module.exports = new BookService();
