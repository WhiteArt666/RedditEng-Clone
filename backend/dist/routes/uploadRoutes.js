"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const upload_1 = require("../middleware/upload");
const errorHandler_1 = require("../middleware/errorHandler");
const router = express_1.default.Router();
// @route   POST /api/upload/image
// @desc    Upload image to Cloudinary
// @access  Private
router.post('/image', auth_1.authenticateToken, upload_1.uploadImage.single('image'), (0, errorHandler_1.asyncHandler)(async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No image file provided' });
    }
    res.json({
        message: 'Image uploaded successfully',
        url: req.file.path,
        publicId: req.file.filename,
        type: 'image'
    });
}));
// @route   POST /api/upload/audio
// @desc    Upload audio to Cloudinary
// @access  Private
router.post('/audio', auth_1.authenticateToken, upload_1.uploadAudio.single('audio'), (0, errorHandler_1.asyncHandler)(async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No audio file provided' });
    }
    res.json({
        message: 'Audio uploaded successfully',
        url: req.file.path,
        publicId: req.file.filename,
        type: 'audio'
    });
}));
// @route   POST /api/upload (backward compatibility)
// @desc    Upload image to Cloudinary
// @access  Private
router.post('/', auth_1.authenticateToken, upload_1.uploadImage.single('image'), (0, errorHandler_1.asyncHandler)(async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No image file provided' });
    }
    res.json({
        message: 'Image uploaded successfully',
        imageUrl: req.file.path,
        publicId: req.file.filename,
    });
}));
exports.default = router;
//# sourceMappingURL=uploadRoutes.js.map