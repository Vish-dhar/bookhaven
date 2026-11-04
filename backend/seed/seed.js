// Run with:  npm run seed
// 1) fills the books collection with sample books
// 2) creates the first ADMIN account (only if no admin exists yet)

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const connectDB = require("../config/db");
const Book = require("../models/book.model");
const User = require("../models/user.model");
const books = require("./booksData");
const { calcFinalPrice } = require("../utils/price");

// Fake review text about delivery and print quality only (sample data for the demo).
const reviewers = ["Priya R.", "Arun K.", "Meena S.", "Karthik V.", "Divya M."];
const comments = [
    "Arrived on time and well packed. The print quality is very good.",
    "Pages and binding feel solid. Happy with the purchase.",
    "Good value for the price. The delivery was quick.",
    "Neat copy, no damage at all. Would order again.",
    "Nice paper and clear text. Exactly as described."
];

const makeReviews = (rating, index) => {
    const reviews = [];

    for (let i = 0; i < 3; i++) {
        reviews.push({
            name: reviewers[(index + i) % reviewers.length],
            rating: Math.max(3, Math.min(5, Math.round(rating) - (i === 2 ? 1 : 0))),
            comment: comments[(index + i * 2) % comments.length]
        });
    }

    return reviews;
};

const seed = async () => {
    await connectDB();

    // ----- books -----
    await Book.deleteMany({});

    const bookDocs = [];

    for (let index = 0; index < books.length; index++) {
        const book = books[index];

        book.sku = "BH-" + String(index + 1).padStart(4, "0");
        book.finalPrice = calcFinalPrice(book.price, book.discountPercentage);
        book.reviews = makeReviews(book.rating, index);

        bookDocs.push(book);
    }

    await Book.create(bookDocs);
    console.log(`${bookDocs.length} books added`);

    // ----- admin -----
    const adminEmail = (process.env.ADMIN_EMAIL || "admin@bookhaven.com").trim().toLowerCase();
    const existingAdmin = await User.findOne({ role: "ADMIN" });

    if (existingAdmin) {
        console.log(`Admin already exists: ${existingAdmin.email}`);
    } else {
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || "Admin@123", 10);

        await User.create({
            name: process.env.ADMIN_NAME || "Bookhaven Admin",
            email: adminEmail,
            password: hashedPassword,
            role: "ADMIN"
        });

        console.log(`Admin created: ${adminEmail}`);
    }

    await mongoose.disconnect();
    console.log("Seeding finished");
};

seed().catch((error) => {
    console.error("Seeding failed:", error.message);
    process.exit(1);
});
