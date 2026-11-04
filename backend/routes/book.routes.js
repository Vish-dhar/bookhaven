const express = require("express");
const router = express.Router();

const bookController = require("../controllers/book.controller");
const authenticateUser = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

// Public routes (anyone can browse books)
router.get("/", (req, res) =>
    bookController.getBooks(req, res)
);

// "/categories" must stay above "/:bookId", otherwise "categories" is read as an id
router.get("/categories", (req, res) =>
    bookController.getCategories(req, res)
);

router.get("/:bookId", (req, res) =>
    bookController.getBook(req, res, req.params.bookId)
);

// ADMIN only routes
router.post(
    "/",
    authenticateUser,
    authorizeRoles("ADMIN"),
    (req, res) => bookController.createBook(req, res)
);

router.patch(
    "/:bookId",
    authenticateUser,
    authorizeRoles("ADMIN"),
    (req, res) => bookController.updateBook(req, res, req.params.bookId)
);

router.delete(
    "/:bookId",
    authenticateUser,
    authorizeRoles("ADMIN"),
    (req, res) => bookController.softDeleteBook(req, res, req.params.bookId)
);

module.exports = router;
