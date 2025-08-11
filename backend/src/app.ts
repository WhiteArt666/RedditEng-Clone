import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/authRoutes';
import postRoutes from './routes/postRoutes';
import commentRoutes from './routes/commentRoutes';
import uploadRoutes from './routes/uploadRoutes';
import communityRoutes from './routes/communityRoutes';
import communityMessageRoutes from './routes/communityMessageRoutes';
import { errorHandler } from './middleware/errorHandler';
import { config } from './config/config';
import { connectDB } from './config/database';

const app = express();

// Middleware
app.use(helmet());

const allowedOrigins = [
  'http://localhost:5173',
  'https://reddit-eng-clone.vercel.app',
  'https://reddit-eng-clone-git-main-duys-projects-38bc9861.vercel.app',
  process.env.FRONTEND_URL
].filter((origin): origin is string => Boolean(origin));

app.use(cors({
  origin: [
    ...allowedOrigins,
    /^https:\/\/reddit-eng-clone.*\.vercel\.app$/
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'English Learning Reddit API', 
    version: '1.0.0',
    endpoints: {
      upload: '/api/upload',
      auth: '/api/auth',
      posts: '/api/posts',
      comments: '/api/comments',
      communities: '/api/communities',
      messages: '/api/community-messages'
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/communities', communityRoutes);
app.use('/api/community-messages', communityMessageRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'English Learning Reddit API is running!' });
});

// Error handling
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(config.port, () => {
      console.log(`🚀 Server running on port ${config.port}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
