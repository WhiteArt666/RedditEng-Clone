"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const router = express_1.default.Router();
// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', validation_1.registerValidation, authController_1.register);
// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', validation_1.loginValidation, authController_1.login);
// @route   GET /api/auth/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', auth_1.authenticateToken, authController_1.getProfile);
// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth_1.authenticateToken, authController_1.updateProfile);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map