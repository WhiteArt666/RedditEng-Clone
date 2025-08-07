import express from 'express';
import {
  createComment,
  getComments,
  updateComment,
  deleteComment,
  voteComment
} from '../controllers/commentController';
import { authenticateToken, optionalAuth } from '../middleware/auth';
import { 
  createCommentValidation, 
  updateCommentValidation, 
  voteValidation 
} from '../middleware/validation';

const router = express.Router();

// @route   POST /api/comments
// @desc    Create a new comment
// @access  Private
router.post('/', authenticateToken, createCommentValidation, createComment);

// @route   GET /api/comments/post/:postId
// @desc    Get all comments for a post
// @access  Public
router.get('/post/:postId', optionalAuth, getComments);

// @route   PUT /api/comments/:id
// @desc    Update comment
// @access  Private
router.put('/:id', authenticateToken, updateCommentValidation, updateComment);

// @route   DELETE /api/comments/:id
// @desc    Delete comment
// @access  Private
router.delete('/:id', authenticateToken, deleteComment);

// @route   POST /api/comments/:id/vote
// @desc    Vote on comment
// @access  Private
router.post('/:id/vote', authenticateToken, voteValidation, voteComment);

export default router;
