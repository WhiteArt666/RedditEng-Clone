"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const postController_1 = require("../controllers/postController");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const router = express_1.default.Router();
// @route   POST /api/posts
// @desc    Create a new post
// @access  Private
router.post('/', auth_1.authenticateToken, validation_1.createPostValidation, postController_1.createPost);
// @route   GET /api/posts
// @desc    Get all posts with pagination and filtering
// @access  Public
router.get('/', auth_1.optionalAuth, postController_1.getPosts);
// @route   GET /api/posts/search
// @desc    Search posts
// @access  Public
router.get('/search', auth_1.optionalAuth, postController_1.searchPosts);
// @route   GET /api/posts/:id
// @desc    Get single post by ID
// @access  Public
router.get('/:id', auth_1.optionalAuth, postController_1.getPost);
// @route   PUT /api/posts/:id
// @desc    Update post
// @access  Private
router.put('/:id', auth_1.authenticateToken, validation_1.updatePostValidation, postController_1.updatePost);
// @route   DELETE /api/posts/:id
// @desc    Delete post
// @access  Private
router.delete('/:id', auth_1.authenticateToken, postController_1.deletePost);
// @route   POST /api/posts/:id/vote
// @desc    Vote on post
// @access  Private
router.post('/:id/vote', auth_1.authenticateToken, validation_1.voteValidation, postController_1.votePost);
exports.default = router;
//# sourceMappingURL=postRoutes.js.map