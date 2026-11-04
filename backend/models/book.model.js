const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

const bookSchema = new mongoose.Schema(
    {
        sku: {
            type: String,
            trim: true
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        author: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        category: {
            type: String,
            required: true,
            trim: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        discountPercentage: {
            type: Number,
            default: 0,
            min: 0,
            max: 90
        },
        // price x (1 - discountPercentage / 100). Calculated in book.service.js
        finalPrice: {
            type: Number,
            required: true,
            min: 0
        },
        stock: {
            type: Number,
            default: 0,
            min: 0
        },
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        ratingCount: {
            type: Number,
            default: 0,
            min: 0
        },
        publisher: {
            type: String,
            default: "",
            trim: true
        },
        publishedYear: {
            type: Number
        },
        pages: {
            type: Number
        },
        language: {
            type: String,
            default: "English",
            trim: true
        },
        tags: {
            type: [String],
            default: []
        },
        // 1 to 8 : picks one of the cover colour themes in the frontend
        coverTheme: {
            type: Number,
            default: 1,
            min: 1,
            max: 8
        },
        returnPolicy: {
            type: String,
            default: "7-day returns"
        },
        guarantee: {
            type: String,
            default: "100% original print"
        },
        reviews: {
            type: [reviewSchema],
            default: []
        },
        featured: {
            type: Boolean,
            default: false
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Book", bookSchema);
