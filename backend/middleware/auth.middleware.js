const tokenService = require("../jwt/token.service");
const User = require("../models/user.model");

const authenticateUser = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Authentication token required"
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = tokenService.verifyToken(token);
        const user = await User.findOne({
            _id: decoded.id,
            isActive: true
        }).select("_id name email role isActive");

        if (!user) {
            return res.status(401).json({
                message: "Account is inactive or no longer exists"
            });
        }

        req.user = {
            id: String(user._id),
            name: user.name,
            email: user.email,
            role: user.role,
            isActive: user.isActive
        };

        return next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

module.exports = authenticateUser;
