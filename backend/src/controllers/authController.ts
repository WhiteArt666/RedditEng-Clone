import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User, { IUser } from '../models/User';
import { config } from '../config/config';
import { asyncHandler } from '../middleware/errorHandler';

const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, config.jwtSecret, { expiresIn: config.jwtExpire } as jwt.SignOptions);
};

// Register new user
export const register = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password, englishLevel, bio } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (existingUser) {
    return res.status(400).json({
      message: existingUser.email === email ? 'Email already registered' : 'Username already taken'
    });
  }

  // Create new user
  const user = new User({
    username,
    email,
    password,
    englishLevel: englishLevel || 'Beginner',
    bio: bio || ''
  });

  await user.save();

  // Generate token
  const token = generateToken((user._id as any).toString());

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
export const login = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Generate token
  const token = generateToken((user._id as any).toString());

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
export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user as IUser;
  
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
export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user as IUser;
  const { username, bio, englishLevel, avatar } = req.body;

  // Check if username is taken by another user
  if (username && username !== user.username) {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken' });
    }
  }

  // Update user
  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    {
      ...(username && { username }),
      ...(bio !== undefined && { bio }),
      ...(englishLevel && { englishLevel }),
      ...(avatar !== undefined && { avatar })
    },
    { new: true, runValidators: true }
  );

  res.json({
    message: 'Profile updated successfully',
    user: {
      id: updatedUser!._id,
      username: updatedUser!.username,
      email: updatedUser!.email,
      englishLevel: updatedUser!.englishLevel,
      bio: updatedUser!.bio,
      karma: updatedUser!.karma,
      avatar: updatedUser!.avatar,
      isVerified: updatedUser!.isVerified,
      joinedAt: updatedUser!.joinedAt
    }
  });
});
