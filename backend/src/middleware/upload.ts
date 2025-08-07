import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary';

// Configure multer with Cloudinary storage for images
const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'english-reddit/images',
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp'],
    transformation: [{ width: 800, height: 600, crop: 'limit' }],
  } as any,
});

// Configure multer with Cloudinary storage for audio
const audioStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'english-reddit/audio',
    allowed_formats: ['mp3', 'wav', 'ogg', 'm4a', 'aac'],
    resource_type: 'video', // Cloudinary treats audio as video resource
  } as any,
});

export const uploadImage = multer({ 
  storage: imageStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  },
});

export const uploadAudio = multer({ 
  storage: audioStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit for audio
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed!'));
    }
  },
});

// Mixed upload for both image and audio
export const uploadMixed = multer({
  storage: multer.memoryStorage(), // We'll handle Cloudinary upload manually
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and audio files are allowed!'));
    }
  },
});

export const upload = uploadImage; // Keep for backward compatibility
export default upload;
