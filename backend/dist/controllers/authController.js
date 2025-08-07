"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getProfile = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
const User_1 = __importDefault(require("../models/User"));
const config_1 = require("../config/config");
const errorHandler_1 = require("../middleware/errorHandler");
const generateToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, config_1.config.jwtSecret, { expiresIn: config_1.config.jwtExpire });
};
// Register new user
exports.register = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { username, email, password, englishLevel, bio } = req.body;
    // Check if user already exists
    const existingUser = await User_1.default.findOne({
        $or: [{ email }, { username }]
    });
    if (existingUser) {
        return res.status(400).json({
            message: existingUser.email === email ? 'Email already registered' : 'Username already taken'
        });
    }
    // Create new user
    const user = new User_1.default({
        username,
        email,
        password,
        englishLevel: englishLevel || 'Beginner',
        bio: bio || ''
    });
    await user.save();
    // Generate token
    const token = generateToken(user._id.toString());
    res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            englishLevel: user.englishLevel,
            bio: user.bio,
            karma: user.karma,
            joinedAt: user.joinedAt
        }
    });
});
// Login user
exports.login = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    // Find user by email
    const user = await User_1.default.findOne({ email });
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    // Generate token
    const token = generateToken(user._id.toString());
    res.json({
        message: 'Login successful',
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            englishLevel: user.englishLevel,
            bio: user.bio,
            karma: user.karma,
            avatar: user.avatar,
            joinedAt: user.joinedAt
        }
    });
});
// Get current user profile
exports.getProfile = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const user = req.user;
    res.json({
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            englishLevel: user.englishLevel,
            bio: user.bio,
            karma: user.karma,
            avatar: user.avatar,
            isVerified: user.isVerified,
            joinedAt: user.joinedAt
        }
    });
});
// Update user profile
exports.updateProfile = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const user = req.user;
    const { username, bio, englishLevel, avatar } = req.body;
    // Check if username is taken by another user
    if (username && username !== user.username) {
        const existingUser = await User_1.default.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already taken' });
        }
    }
    // Update user
    const updatedUser = await User_1.default.findByIdAndUpdate(user._id, {
        ...(username && { username }),
        ...(bio !== undefined && { bio }),
        ...(englishLevel && { englishLevel }),
        ...(avatar !== undefined && { avatar })
    }, { new: true, runValidators: true });
    res.json({
        message: 'Profile updated successfully',
        user: {
            id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            englishLevel: updatedUser.englishLevel,
            bio: updatedUser.bio,
            karma: updatedUser.karma,
            avatar: updatedUser.avatar,
            isVerified: updatedUser.isVerified,
            joinedAt: updatedUser.joinedAt
        }
    });
});
//# sourceMappingURL=authController.js.map