import express from 'express';
import {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  votePost,
  searchPosts
} from '../controllers/postController';
import { authenticateToken, optionalAuth } from '../middleware/auth';
import { 
  createPostValidation, 
  updatePostValidation, 
  voteValidation 
} from '../middleware/validation';

const router = express.Router();

// @route   POST /api/posts
// @desc    Create a new post
// @access  Private
router.post('/', authenticateToken, createPostValidation, createPost);

// @route   GET /api/posts
// @desc    Get all posts with pagination and filtering
// @access  Public
router.get('/', optionalAuth, getPosts);

// @route   GET /api/posts/search
// @desc    Search posts
// @access  Public
router.get('/search', optionalAuth, searchPosts);

// @route   GET /api/posts/:id
// @desc    Get single post by ID
// @access  Public
router.get('/:id', optionalAuth, getPost);

// @route   PUT /api/posts/:id
// @desc    Update post
// @access  Private
router.put('/:id', authenticateToken, updatePostValidation, updatePost);

// @route   DELETE /api/posts/:id
// @desc    Delete post
// @access  Private
router.delete('/:id', authenticateToken, deletePost);

// @route   POST /api/posts/:id/vote
// @desc    Vote on post
// @access  Private
router.post('/:id/vote', authenticateToken, voteValidation, votePost);

export default router;
