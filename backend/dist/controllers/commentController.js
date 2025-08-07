"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.voteComment = exports.deleteComment = exports.updateComment = exports.getComments = exports.createComment = void 0;
const express_validator_1 = require("express-validator");
const Comment_1 = __importDefault(require("../models/Comment"));
const Post_1 = __importDefault(require("../models/Post"));
const User_1 = __importDefault(require("../models/User"));
const errorHandler_1 = require("../middleware/errorHandler");
// Create new comment
exports.createComment = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { content, postId, parentId } = req.body;
    const user = req.user;
    // Check if post exists
    const post = await Post_1.default.findById(postId);
    if (!post) {
        return res.status(404).json({ message: 'Post not found' });
    }
    let depth = 0;
    let parent = null;
    // If replying to a comment, check parent and calculate depth
    if (parentId) {
        parent = await Comment_1.default.findById(parentId);
        if (!parent) {
            return res.status(404).json({ message: 'Parent comment not found' });
        }
        if (parent.post.toString() !== postId) {
            return res.status(400).json({ message: 'Parent comment does not belong to this post' });
        }
        depth = parent.depth + 1;
        if (depth > 5) {
            return res.status(400).json({ message: 'Maximum nesting depth reached' });
        }
    }
    const comment = new Comment_1.default({
        content,
        author: user._id,
        post: postId,
        parent: parentId || null,
        depth
    });
    await comment.save();
    await comment.populate('author', 'username avatar englishLevel karma');
    // Update post comment count
    await Post_1.default.findByIdAndUpdate(postId, { $inc: { commentCount: 1 } });
    res.status(201).json({
        message: 'Comment created successfully',
        comment
    });
});
// Get comments for a post
exports.getComments = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { postId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const sortBy = req.query.sortBy || 'top'; // top, new, old
    // Check if post exists
    const post = await Post_1.default.findById(postId);
    if (!post) {
        return res.status(404).json({ message: 'Post not found' });
    }
    // Build sort
    let sort = {};
    switch (sortBy) {
        case 'new':
            sort = { createdAt: -1 };
            break;
        case 'old':
            sort = { createdAt: 1 };
            break;
        case 'top':
        default:
            sort = { score: -1, createdAt: -1 };
            break;
    }
    // Get top-level comments first
    const comments = await Comment_1.default.find({
        post: postId,
        parent: null
    })
        .populate('author', 'username avatar englishLevel karma isVerified')
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();
    // Get replies for each comment (recursive structure)
    const commentsWithReplies = await Promise.all(comments.map(async (comment) => {
        const replies = await getCommentReplies(comment._id.toString(), 3); // Max 3 levels of replies shown initially
        return { ...comment, replies };
    }));
    const total = await Comment_1.default.countDocuments({ post: postId, parent: null });
    res.json({
        message: 'Comments retrieved successfully',
        data: {
            comments: commentsWithReplies,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        }
    });
});
// Helper function to get comment replies recursively
async function getCommentReplies(commentId, maxDepth = 3) {
    if (maxDepth <= 0)
        return [];
    const replies = await Comment_1.default.find({ parent: commentId })
        .populate('author', 'username avatar englishLevel karma isVerified')
        .sort({ score: -1, createdAt: -1 })
        .lean();
    return await Promise.all(replies.map(async (reply) => {
        const nestedReplies = await getCommentReplies(reply._id.toString(), maxDepth - 1);
        return { ...reply, replies: nestedReplies };
    }));
}
// Update comment
exports.updateComment = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    const user = req.user;
    const comment = await Comment_1.default.findById(id);
    if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
    }
    // Check if user is the author
    if (comment.author.toString() !== user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this comment' });
    }
    const updatedComment = await Comment_1.default.findByIdAndUpdate(id, { content }, { new: true, runValidators: true }).populate('author', 'username avatar englishLevel karma');
    res.json({
        message: 'Comment updated successfully',
        comment: updatedComment
    });
});
// Delete comment
exports.deleteComment = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    const comment = await Comment_1.default.findById(id);
    if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
    }
    // Check if user is the author
    if (comment.author.toString() !== user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }
    // Delete all nested replies recursively
    await deleteCommentAndReplies(id);
    // Update post comment count
    const deletedCount = await Comment_1.default.countDocuments({
        $or: [
            { _id: id },
            { parent: id }
        ]
    });
    await Post_1.default.findByIdAndUpdate(comment.post, { $inc: { commentCount: -deletedCount } });
    res.json({ message: 'Comment deleted successfully' });
});
// Helper function to delete comment and all its replies
async function deleteCommentAndReplies(commentId) {
    // Find all replies to this comment
    const replies = await Comment_1.default.find({ parent: commentId });
    // Recursively delete replies
    for (const reply of replies) {
        await deleteCommentAndReplies(reply._id.toString());
    }
    // Delete the comment itself
    await Comment_1.default.findByIdAndDelete(commentId);
}
// Vote on comment
exports.voteComment = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { voteType } = req.body; // 'up', 'down', or 'none'
    const user = req.user;
    const comment = await Comment_1.default.findById(id);
    if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
    }
    // Remove existing votes
    comment.upvotes = comment.upvotes.filter(userId => userId.toString() !== user._id.toString());
    comment.downvotes = comment.downvotes.filter(userId => userId.toString() !== user._id.toString());
    // Add new vote
    if (voteType === 'up') {
        comment.upvotes.push(user._id);
    }
    else if (voteType === 'down') {
        comment.downvotes.push(user._id);
    }
    // Update score
    comment.score = comment.upvotes.length - comment.downvotes.length;
    await comment.save();
    // Update author karma
    const karmaChange = voteType === 'up' ? 1 : voteType === 'down' ? -1 : 0;
    if (karmaChange !== 0) {
        await User_1.default.findByIdAndUpdate(comment.author, { $inc: { karma: karmaChange } });
    }
    res.json({
        message: 'Vote recorded successfully',
        score: comment.score,
        userVote: voteType
    });
});
//# sourceMappingURL=commentController.js.map