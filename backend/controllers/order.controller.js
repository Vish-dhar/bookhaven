const orderService = require("../services/order.service");

class OrderController {
    async placeOrder(req, res) {
        try {
            const order = await orderService.placeOrder(req.user, req.body);

            return res.status(201).json({
                message: "Order placed successfully",
                data: order
            });
        } catch (error) {
            return res.status(error.status || 500).json({
                message: error.message
            });
        }
    }

    async getMyOrders(req, res) {
        try {
            const orders = await orderService.getMyOrders(req.user.id);

            return res.status(200).json({
                count: orders.length,
                data: orders
            });
        } catch (error) {
            return res.status(error.status || 500).json({
                message: error.message
            });
        }
    }

    async getOrder(req, res, orderId) {
        try {
            const order = await orderService.getOrderById(req.user, orderId);

            return res.status(200).json({
                data: order
            });
        } catch (error) {
            return res.status(error.status || 500).json({
                message: error.message
            });
        }
    }

    async cancelMyOrder(req, res, orderId) {
        try {
            const order = await orderService.cancelMyOrder(req.user, orderId);

            return res.status(200).json({
                message: "Order cancelled successfully",
                data: order
            });
        } catch (error) {
            return res.status(error.status || 500).json({
                message: error.message
            });
        }
    }

    async getAllOrders(req, res) {
        try {
            const orders = await orderService.getAllOrders(req.query.status);

            return res.status(200).json({
                count: orders.length,
                data: orders
            });
        } catch (error) {
            return res.status(error.status || 500).json({
                message: error.message
            });
        }
    }

    async updateOrderStatus(req, res, orderId) {
        try {
            const order = await orderService.updateOrderStatus(orderId, req.body.status);

            return res.status(200).json({
                message: "Order status updated successfully",
                data: order
            });
        } catch (error) {
            return res.status(error.status || 500).json({
                message: error.message
            });
        }
    }
}

module.exports = new OrderController();
