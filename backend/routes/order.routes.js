const express = require("express");
const router = express.Router();

const orderController = require("../controllers/order.controller");
const authenticateUser = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

// Customer routes (login required)
router.post(
    "/",
    authenticateUser,
    (req, res) => orderController.placeOrder(req, res)
);

// "/my" must stay above "/:orderId"
router.get(
    "/my",
    authenticateUser,
    (req, res) => orderController.getMyOrders(req, res)
);

// ADMIN: all orders
router.get(
    "/",
    authenticateUser,
    authorizeRoles("ADMIN"),
    (req, res) => orderController.getAllOrders(req, res)
);

router.get(
    "/:orderId",
    authenticateUser,
    (req, res) => orderController.getOrder(req, res, req.params.orderId)
);

router.patch(
    "/:orderId/cancel",
    authenticateUser,
    (req, res) => orderController.cancelMyOrder(req, res, req.params.orderId)
);

// ADMIN: change order status
router.patch(
    "/:orderId/status",
    authenticateUser,
    authorizeRoles("ADMIN"),
    (req, res) => orderController.updateOrderStatus(req, res, req.params.orderId)
);

module.exports = router;
