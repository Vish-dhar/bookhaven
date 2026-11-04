const mongoose = require("mongoose");

const connectDB = async () => {
    const MONGO_URI = process.env.MONGODB_URL;

    if (!MONGO_URI) {
        console.error("MONGODB_URL is missing in .env");
        process.exit(1);
    }

    try {
        await mongoose.connect(MONGO_URI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
