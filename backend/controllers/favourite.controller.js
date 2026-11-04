const favouriteService = require("../services/favourite.service");

class FavouriteController {
    async getFavourites(req, res) {
        try {
            const books = await favouriteService.getFavourites(req.user.id);

            return res.status(200).json({
                count: books.length,
                data: books
            });
        } catch (error) {
            return res.status(error.status || 500).json({
                message: error.message
            });
        }
    }

    async addFavourite(req, res, bookId) {
        try {
            const books = await favouriteService.addFavourite(req.user.id, bookId);

            return res.status(200).json({
                message: "Added to favourites",
                count: books.length,
                data: books
            });
        } catch (error) {
            return res.status(error.status || 500).json({
                message: error.message
            });
        }
    }

    async removeFavourite(req, res, bookId) {
        try {
            const books = await favouriteService.removeFavourite(req.user.id, bookId);

            return res.status(200).json({
                message: "Removed from favourites",
                count: books.length,
                data: books
            });
        } catch (error) {
            return res.status(error.status || 500).json({
                message: error.message
            });
        }
    }
}

module.exports = new FavouriteController();
