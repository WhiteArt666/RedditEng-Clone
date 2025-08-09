"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const uploadLocal_1 = require("../middleware/uploadLocal");
const errorHandler_1 = require("../middleware/errorHandler");
const router = express_1.default.Router();
// @route   POST /api/upload/image
// @desc    Upload image locally
// @access  Private
router.post('/image', auth_1.authenticateToken, uploadLocal_1.uploadImage.single('image'), (0, errorHandler_1.asyncHandler)(async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No image file provided' });
    }
    // Create URL for the uploaded file
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/images/${req.file.filename}`;
    res.json({
        message: 'Image uploaded successfully',
        url: fileUrl,
        filename: req.file.filename,
        type: 'image'
    });
}));
// @route   POST /api/upload/audio
// @desc    Upload audio locally
// @access  Private
router.post('/audio', auth_1.authenticateToken, uploadLocal_1.uploadAudio.single('audio'), (0, errorHandler_1.asyncHandler)(async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No audio file provided' });
    }
    // Create URL for the uploaded file
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/audio/${req.file.filename}`;
    res.json({
        message: 'Audio uploaded successfully',
        url: fileUrl,
        filename: req.file.filename,
        type: 'audio'
    });
}));
exports.default = router;
//# sourceMappingURL=uploadLocalRoutes.js.map