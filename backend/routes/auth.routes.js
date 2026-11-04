const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const authenticateUser = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

router.post("/signup", (req, res) =>
    authController.signup(req, res)
);

router.post("/login", (req, res) =>
    authController.login(req, res)
);

router.get(
    "/profile",
    authenticateUser,
    (req, res) => authController.getProfile(req, res)
);

router.patch(
    "/profile",
    authenticateUser,
    (req, res) => authController.updateProfile(req, res)
);

router.delete(
    "/profile",
    authenticateUser,
    (req, res) => authController.softDeleteAccount(req, res)
);

// ADMIN: list all users
router.get(
    "/users",
    authenticateUser,
    authorizeRoles("ADMIN"),
    (req, res) => authController.getAllUsers(req, res)
);

// ADMIN: deactivate a customer account
router.delete(
    "/users/:userId",
    authenticateUser,
    authorizeRoles("ADMIN"),
    (req, res) => authController.softDeleteUser(req, res, req.params.userId)
);

module.exports = router;
