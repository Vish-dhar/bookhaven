const express = require("express");
const router = express.Router();

const favouriteController = require("../controllers/favourite.controller");
const authenticateUser = require("../middleware/auth.middleware");

// Every route needs login. The favourites always belong to the logged in user (from the token).
router.get(
    "/",
    authenticateUser,
    (req, res) => favouriteController.getFavourites(req, res)
);

router.post(
    "/:bookId",
    authenticateUser,
    (req, res) => favouriteController.addFavourite(req, res, req.params.bookId)
);

router.delete(
    "/:bookId",
    authenticateUser,
    (req, res) => favouriteController.removeFavourite(req, res, req.params.bookId)
);

module.exports = router;
