const mongoose = require("mongoose");
const User = require("../models/user.model");
const Book = require("../models/book.model");
const createError = require("../utils/httpError");

class FavouriteService {
    // All favourite books of this user
    async getFavourites(userId) {
        const user = await User.findOne({
            _id: userId,
            isActive: true
        }).select("favourites");

        if (!user) {
            throw createError("Active account not found", 404);
        }

        const ids = user.favourites || [];

        if (ids.length === 0) {
            return [];
        }

        return Book.find({
            _id: { $in: ids },
            isActive: true
        })
            .select("-reviews -__v")
            .sort({ createdAt: -1 });
    }

    async addFavourite(userId, bookId) {
        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            throw createError("Invalid book ID", 400);
        }

        const book = await Book.findOne({ _id: bookId, isActive: true });

        if (!book) {
            throw createError("Book not found", 404);
        }

        // $addToSet: adding the same book twice does nothing
        await User.findOneAndUpdate(
            { _id: userId, isActive: true },
            { $addToSet: { favourites: bookId } }
        );

        return this.getFavourites(userId);
    }

    async removeFavourite(userId, bookId) {
        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            throw createError("Invalid book ID", 400);
        }

        await User.findOneAndUpdate(
            { _id: userId, isActive: true },
            { $pull: { favourites: bookId } }
        );

        return this.getFavourites(userId);
    }
}

module.exports = new FavouriteService();
