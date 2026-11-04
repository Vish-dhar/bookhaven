const bookService = require("../services/book.service");

class BookController {
    async getBooks(req, res) {
        try {
            const result = await bookService.getBooks(req.query);

            return res.status(200).json(result);
        } catch (error) {
            return res.status(error.status || 500).json({
                message: error.message
            });
        }
    }

    async getCategories(req, res) {
        try {
            const categories = await bookService.getCategories();

            return res.status(200).json({
                data: categories
            });
        } catch (error) {
            return res.status(error.status || 500).json({
                message: error.message
            });
        }
    }

    async getBook(req, res, bookId) {
        try {
            const book = await bookService.getBookById(bookId);

            return res.status(200).json({
                data: book
            });
        } catch (error) {
            return res.status(error.status || 500).json({
                message: error.message
            });
        }
    }

    async createBook(req, res) {
        try {
            const book = await bookService.createBook(req.body);

            return res.status(201).json({
                message: "Book created successfully",
                data: book
            });
        } catch (error) {
            return res.status(error.status || 500).json({
                message: error.message
            });
        }
    }

    async updateBook(req, res, bookId) {
        try {
            const book = await bookService.updateBook(bookId, req.body);

            return res.status(200).json({
                message: "Book updated successfully",
                data: book
            });
        } catch (error) {
            return res.status(error.status || 500).json({
                message: error.message
            });
        }
    }

    async softDeleteBook(req, res, bookId) {
        try {
            const book = await bookService.softDeleteBook(bookId);

            return res.status(200).json({
                message: "Book removed successfully",
                data: book
            });
        } catch (error) {
            return res.status(error.status || 500).json({
                message: error.message
            });
        }
    }
}

module.exports = new BookController();
