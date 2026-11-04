const authService = require("../services/auth.service");

class AuthController {
    async signup(req, res) {
        try {
            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                return res.status(400).json({
                    message: "Name, email, and password are required"
                });
            }

            if (typeof password !== "string" || password.length < 6) {
                return res.status(400).json({
                    message: "Password must be at least 6 characters"
                });
            }

            const user = await authService.signup(name, email, password);

            return res.status(201).json({
                message: "Account created successfully",
                data: user
            });
        } catch (error) {
            const status = error.code === 11000 ? 409 : error.status || 500;

            return res.status(status).json({
                message: error.message
            });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    message: "Email and password are required"
                });
            }

            const result = await authService.login(email, password);

            return res.status(200).json({
                message: "Login successful",
                ...result
            });
        } catch (error) {
            return res.status(error.status || 500).json({
                message: error.message
            });
        }
    }

    async getProfile(req, res) {
        try {
            const user = await authService.getProfile(req.user.id);

            return res.status(200).json({
                data: user
            });
        } catch (error) {
            return res.status(error.status || 500).json({
                message: error.message
            });
        }
    }

    async updateProfile(req, res) {
        try {
            const user = await authService.updateProfile(req.user.id, req.body);

            return res.status(200).json({
                message: "Profile updated successfully",
                data: user
            });
        } catch (error) {
            return res.status(error.status || 500).json({
                message: error.message
            });
        }
    }

    async softDeleteAccount(req, res) {
        try {
            const user = await authService.softDeleteAccount(req.user.id);

            return res.status(200).json({
                message: "Account deactivated successfully",
                data: user
            });
        } catch (error) {
            return res.status(error.status || 500).json({
                message: error.message
            });
        }
    }

    async getAllUsers(req, res) {
        try {
            const users = await authService.getAllUsers();

            return res.status(200).json({
                count: users.length,
                data: users
            });
        } catch (error) {
            return res.status(error.status || 500).json({
                message: error.message
            });
        }
    }

    async softDeleteUser(req, res, targetId) {
        try {
            const user = await authService.softDeleteUser(targetId);

            return res.status(200).json({
                message: "Account deactivated successfully",
                data: user
            });
        } catch (error) {
            return res.status(error.status || 500).json({
                message: error.message
            });
        }
    }
}

module.exports = new AuthController();
