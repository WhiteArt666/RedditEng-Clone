import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  sendMessage,
  getCommunityMessages,
  editMessage,
  deleteMessage,
  addReaction,
  getRecentMessages
} from '../controllers/communityMessageController';

const router = express.Router();

// Message routes
router.post('/:communityName/messages', authenticateToken, sendMessage);
router.get('/:communityName/messages', getCommunityMessages);
router.put('/messages/:messageId', authenticateToken, editMessage);
router.delete('/messages/:messageId', authenticateToken, deleteMessage);
router.post('/messages/:messageId/reactions', authenticateToken, addReaction);

// Get recent messages for user's communities
router.get('/messages/recent', authenticateToken, getRecentMessages);

export default router;
