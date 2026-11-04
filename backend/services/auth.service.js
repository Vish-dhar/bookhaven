const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const tokenService = require("../jwt/token.service");
const createError = require("../utils/httpError");

class AuthService {
    async signup(name, email, password) {
        const existingUser = await User.findOne({
            email: email.trim().toLowerCase()
        });

        if (existingUser) {
            throw createError("Email already exists", 409);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Everyone who signs up is a CUSTOMER. The ADMIN account is created by "npm run seed".
        const user = await User.create({
            name,
            email: email.trim().toLowerCase(),
            password: hashedPassword,
            role: "CUSTOMER"
        });

        const result = user.toObject();
        delete result.password;

        return result;
    }

    async login(email, password) {
        const user = await User.findOne({
            email: email.trim().toLowerCase()
        }).select("+password");

        if (!user) {
            throw createError("Invalid email or password", 401);
        }

        if (!user.isActive) {
            throw createError("Account is inactive", 403);
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw createError("Invalid email or password", 401);
        }

        const payload = {
            id: user._id,
            email: user.email,
            role: user.role,
            isActive: user.isActive
        };

        const token = tokenService.generateToken(payload);

        const userData = user.toObject();
        delete userData.password;

        return {
            user: userData,
            token
        };
    }

    async getProfile(userId) {
        const user = await User.findOne({
            _id: userId,
            isActive: true
        }).select("-password");

        if (!user) {
            throw createError("Active account not found", 404);
        }

        return user;
    }

    async updateProfile(userId, updateData) {
        const allowedFields = ["name", "email", "password"];
        const updates = {};

        for (const field of allowedFields) {
            if (updateData[field] !== undefined) {
                updates[field] = updateData[field];
            }
        }

        if (Object.keys(updates).length === 0) {
            throw createError("Provide name, email, or password to update", 400);
        }

        if (updates.name !== undefined) {
            if (typeof updates.name !== "string" || !updates.name.trim()) {
                throw createError("Name cannot be empty", 400);
            }
            updates.name = updates.name.trim();
        }

        if (updates.email !== undefined) {
            if (typeof updates.email !== "string" || !updates.email.trim()) {
                throw createError("Email cannot be empty", 400);
            }
            updates.email = updates.email.trim().toLowerCase();

            const existingUser = await User.findOne({
                email: updates.email,
                _id: { $ne: userId }
            });

            if (existingUser) {
                throw createError("Email already exists", 409);
            }
        }

        if (updates.password !== undefined) {
            if (typeof updates.password !== "string" || updates.password.length < 6) {
                throw createError("Password must be at least 6 characters", 400);
            }
            updates.password = await bcrypt.hash(updates.password, 10);
        }

        const user = await User.findOneAndUpdate(
            { _id: userId, isActive: true },
            { $set: updates },
            { new: true, runValidators: true }
        ).select("-password");

        if (!user) {
            throw createError("Active account not found", 404);
        }

        return user;
    }

    // Soft delete: the document stays in MongoDB, only isActive becomes false.
    async softDeleteAccount(userId) {
        const user = await User.findOneAndUpdate(
            { _id: userId, isActive: true },
            { $set: { isActive: false } },
            { new: true }
        ).select("-password");

        if (!user) {
            throw createError("Active account not found", 404);
        }

        return user;
    }

    // ADMIN only
    async getAllUsers() {
        return User.find().select("-password").sort({ createdAt: -1 });
    }

    // ADMIN only: deactivate a customer account by id
    async softDeleteUser(targetId) {
        if (!mongoose.Types.ObjectId.isValid(targetId)) {
            throw createError("Invalid user ID", 400);
        }

        const target = await User.findOne({ _id: targetId, isActive: true });

        if (!target) {
            throw createError("Active account not found", 404);
        }

        if (target.role === "ADMIN") {
            throw createError("Admin accounts cannot be deactivated here", 403);
        }

        return User.findOneAndUpdate(
            { _id: targetId, isActive: true },
            { $set: { isActive: false } },
            { new: true }
        ).select("-password");
    }
}

module.exports = new AuthService();
