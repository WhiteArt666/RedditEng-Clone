"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const postRoutes_1 = __importDefault(require("./routes/postRoutes"));
const commentRoutes_1 = __importDefault(require("./routes/commentRoutes"));
const uploadRoutes_1 = __importDefault(require("./routes/uploadRoutes"));
const errorHandler_1 = require("./middleware/errorHandler");
const config_1 = require("./config/config");
const database_1 = require("./config/database");
const app = (0, express_1.default)();
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.get('/', (req, res) => {
    res.json({
        message: 'English Learning Reddit API',
        version: '1.0.0',
        endpoints: {
            upload: '/api/upload',
            auth: '/api/auth',
            posts: '/api/posts',
            comments: '/api/comments'
        }
    });
});
app.use('/api/auth', authRoutes_1.default);
app.use('/api/posts', postRoutes_1.default);
app.use('/api/comments', commentRoutes_1.default);
app.use('/api/upload', uploadRoutes_1.default);
// Health check
app.get('/api/health', (req, res) => {
    res.json({ message: 'English Learning Reddit API is running!' });
});
// Error handling
app.use(errorHandler_1.errorHandler);
const startServer = async () => {
    try {
        await (0, database_1.connectDB)();
        app.listen(config_1.config.port, () => {
            console.log(`🚀 Server running on port ${config_1.config.port}`);
        });
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=app.js.map