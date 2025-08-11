import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  createCommunity,
  getCommunities,
  getCommunity,
  updateCommunity,
  deleteCommunity,
  joinCommunity,
  leaveCommunity,
  getCommunityMembers,
  getUserCommunities,
  toggleModerator
} from '../controllers/communityController';

const router = express.Router();

// Community CRUD
router.post('/', authenticateToken, createCommunity);
router.get('/', getCommunities);
router.get('/user', authenticateToken, getUserCommunities);
router.get('/:name', getCommunity);
router.put('/:name', authenticateToken, updateCommunity);
router.delete('/:name', authenticateToken, deleteCommunity);

// Community membership
router.post('/:name/join', authenticateToken, joinCommunity);
router.post('/:name/leave', authenticateToken, leaveCommunity);
router.get('/:name/members', getCommunityMembers);

// Moderation
router.post('/:name/moderators', authenticateToken, toggleModerator);

export default router;
