const jwt = require("jsonwebtoken");

class TokenService {
    generateToken(payload) {
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is missing in .env");
        }

        return jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "1d"
        });
    }

    verifyToken(token) {
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is missing in .env");
        }

        return jwt.verify(token, process.env.JWT_SECRET);
    }
}

module.exports = new TokenService();
