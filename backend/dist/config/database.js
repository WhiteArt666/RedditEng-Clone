"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("./config");
const connectDB = async () => {
    try {
        const conn = await mongoose_1.default.connect(config_1.config.mongoUri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.error('MongoDB connection error:', error);
        // For development, we'll keep the app running even if DB fails
        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        }
        else {
            console.warn('Running in development mode without database connection');
        }
    }
};
exports.connectDB = connectDB;
// Handle MongoDB connection events
mongoose_1.default.connection.on('error', (error) => {
    console.error('MongoDB connection error:', error);
});
mongoose_1.default.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});
// Graceful shutdown
process.on('SIGINT', async () => {
    try {
        await mongoose_1.default.connection.close();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
    }
    catch (error) {
        console.error('Error closing MongoDB connection:', error);
        process.exit(1);
    }
});
//# sourceMappingURL=database.js.map