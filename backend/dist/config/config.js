"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    port: process.env.PORT || 3000,
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/english-reddit',
    jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
    jwtExpire: process.env.JWT_EXPIRE || '7d',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    openaiApiKey: process.env.OPENAI_API_KEY || '',
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || '',
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || ''
};
//# sourceMappingURL=config.js.map