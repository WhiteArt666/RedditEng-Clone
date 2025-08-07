"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.uploadMixed = exports.uploadAudio = exports.uploadImage = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
// Configure multer with Cloudinary storage for images
const imageStorage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.default,
    params: {
        folder: 'english-reddit/images',
        allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp'],
        transformation: [{ width: 800, height: 600, crop: 'limit' }],
    },
});
// Configure multer with Cloudinary storage for audio
const audioStorage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.default,
    params: {
        folder: 'english-reddit/audio',
        allowed_formats: ['mp3', 'wav', 'ogg', 'm4a', 'aac'],
        resource_type: 'video', // Cloudinary treats audio as video resource
    },
});
exports.uploadImage = (0, multer_1.default)({
    storage: imageStorage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        }
        else {
            cb(new Error('Only image files are allowed!'));
        }
    },
});
exports.uploadAudio = (0, multer_1.default)({
    storage: audioStorage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit for audio
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('audio/')) {
            cb(null, true);
        }
        else {
            cb(new Error('Only audio files are allowed!'));
        }
    },
});
// Mixed upload for both image and audio
exports.uploadMixed = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(), // We'll handle Cloudinary upload manually
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('audio/')) {
            cb(null, true);
        }
        else {
            cb(new Error('Only image and audio files are allowed!'));
        }
    },
});
exports.upload = exports.uploadImage; // Keep for backward compatibility
exports.default = exports.upload;
//# sourceMappingURL=upload.js.map