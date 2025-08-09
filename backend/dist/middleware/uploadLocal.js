"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.uploadAudio = exports.uploadImage = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const promises_1 = require("fs/promises");
// Create uploads directory if it doesn't exist
const createUploadsDir = async () => {
    try {
        await (0, promises_1.mkdir)(path_1.default.join(process.cwd(), 'uploads', 'images'), { recursive: true });
        await (0, promises_1.mkdir)(path_1.default.join(process.cwd(), 'uploads', 'audio'), { recursive: true });
    }
    catch (error) {
        console.log('Uploads directory already exists or error creating:', error);
    }
};
createUploadsDir();
// Configure multer for local storage
const imageStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path_1.default.join(process.cwd(), 'uploads', 'images'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'image-' + uniqueSuffix + path_1.default.extname(file.originalname));
    }
});
const audioStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path_1.default.join(process.cwd(), 'uploads', 'audio'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'audio-' + uniqueSuffix + path_1.default.extname(file.originalname));
    }
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
exports.upload = exports.uploadImage; // Keep for backward compatibility
exports.default = exports.upload;
//# sourceMappingURL=uploadLocal.js.map