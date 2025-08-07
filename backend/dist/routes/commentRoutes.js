"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const commentController_1 = require("../controllers/commentController");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const router = express_1.default.Router();
// @route   POST /api/comments
// @desc    Create a new comment
// @access  Private
router.post('/', auth_1.authenticateToken, validation_1.createCommentValidation, commentController_1.createComment);
// @route   GET /api/comments/post/:postId
// @desc    Get all comments for a post
// @access  Public
router.get('/post/:postId', auth_1.optionalAuth, commentController_1.getComments);
// @route   PUT /api/comments/:id
// @desc    Update comment
// @access  Private
router.put('/:id', auth_1.authenticateToken, validation_1.updateCommentValidation, commentController_1.updateComment);
// @route   DELETE /api/comments/:id
// @desc    Delete comment
// @access  Private
router.delete('/:id', auth_1.authenticateToken, commentController_1.deleteComment);
// @route   POST /api/comments/:id/vote
// @desc    Vote on comment
// @access  Private
router.post('/:id/vote', auth_1.authenticateToken, validation_1.voteValidation, commentController_1.voteComment);
exports.default = router;
//# sourceMappingURL=commentRoutes.js.map