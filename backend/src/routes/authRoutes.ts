import express from 'express';
import { register, login, getProfile, updateProfile } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';
import { registerValidation, loginValidation } from '../middleware/validation';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', registerValidation, register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', loginValidation, login);

// @route   GET /api/auth/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', authenticateToken, getProfile);

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authenticateToken, updateProfile);

export default router;
