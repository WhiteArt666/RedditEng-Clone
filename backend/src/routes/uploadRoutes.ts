import express, { Response } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { uploadImage, uploadAudio } from '../middleware/upload';
import { asyncHandler } from '../middleware/errorHandler';
import cloudinary from '../config/cloudinary';

const router = express.Router();

// @route   POST /api/upload/image
// @desc    Upload image to Cloudinary
// @access  Private
router.post('/image', authenticateToken, uploadImage.single('image'), asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file provided' });
  }

  res.json({
    message: 'Image uploaded successfully',
    url: req.file.path,
    publicId: (req.file as any).filename,
    type: 'image'
  });
}));

// @route   POST /api/upload/audio
// @desc    Upload audio to Cloudinary
// @access  Private
router.post('/audio', authenticateToken, uploadAudio.single('audio'), asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No audio file provided' });
  }

  res.json({
    message: 'Audio uploaded successfully',
    url: req.file.path,
    publicId: (req.file as any).filename,
    type: 'audio'
  });
}));

// @route   POST /api/upload (backward compatibility)
// @desc    Upload image to Cloudinary
// @access  Private
router.post('/', authenticateToken, uploadImage.single('image'), asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file provided' });
  }

  res.json({
    message: 'Image uploaded successfully',
    imageUrl: req.file.path,
    publicId: (req.file as any).filename,
  });
}));

export default router;
