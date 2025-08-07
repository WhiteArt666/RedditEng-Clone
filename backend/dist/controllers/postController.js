"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchPosts = exports.votePost = exports.deletePost = exports.updatePost = exports.getPost = exports.getPosts = exports.createPost = void 0;
const express_validator_1 = require("express-validator");
const Post_1 = __importDefault(require("../models/Post"));
const Comment_1 = __importDefault(require("../models/Comment"));
const User_1 = __importDefault(require("../models/User"));
const errorHandler_1 = require("../middleware/errorHandler");
// Create new post
exports.createPost = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { title, content, type, category, tags, difficulty } = req.body;
    const user = req.user;
    const post = new Post_1.default({
        title,
        content,
        type: type || 'text',
        category,
        author: user._id,
        tags: tags || [],
        difficulty: difficulty || 'Medium'
    });
    await post.save();
    await post.populate('author', 'username avatar englishLevel karma');
    res.status(201).json({
        message: 'Post created successfully',
        post
    });
});
// Get all posts with pagination and filtering
exports.getPosts = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const type = req.query.type;
    const difficulty = req.query.difficulty;
    const sortBy = req.query.sortBy || 'hot'; // hot, new, top
    // Build filter
    const filter = {};
    if (category)
        filter.category = category;
    if (type)
        filter.type = type;
    if (difficulty)
        filter.difficulty = difficulty;
    // Build sort
    let sort = {};
    switch (sortBy) {
        case 'new':
            sort = { createdAt: -1 };
            break;
        case 'top':
            sort = { score: -1, createdAt: -1 };
            break;
        case 'hot':
        default:
            // Hot algorithm: score / (age_in_hours + 2)^1.5
            sort = { score: -1, createdAt: -1 };
            break;
    }
    const posts = await Post_1.default.find(filter)
        .populate('author', 'username avatar englishLevel karma')
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();
    const total = await Post_1.default.countDocuments(filter);
    res.json({
        message: 'Posts retrieved successfully',
        data: {
            posts,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        }
    });
});
// Get single post by ID
exports.getPost = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const post = await Post_1.default.findById(id)
        .populate('author', 'username avatar englishLevel karma isVerified');
    if (!post) {
        return res.status(404).json({ message: 'Post not found' });
    }
    res.json({
        message: 'Post retrieved successfully',
        data: { post }
    });
});
// Update post
exports.updatePost = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { title, content, category, tags, difficulty } = req.body;
    const user = req.user;
    const post = await Post_1.default.findById(id);
    if (!post) {
        return res.status(404).json({ message: 'Post not found' });
    }
    // Check if user is the author
    if (post.author.toString() !== user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this post' });
    }
    const updatedPost = await Post_1.default.findByIdAndUpdate(id, {
        ...(title && { title }),
        ...(content && { content }),
        ...(category && { category }),
        ...(tags && { tags }),
        ...(difficulty && { difficulty })
    }, { new: true, runValidators: true }).populate('author', 'username avatar englishLevel karma');
    res.json({
        message: 'Post updated successfully',
        post: updatedPost
    });
});
// Delete post
exports.deletePost = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    const post = await Post_1.default.findById(id);
    if (!post) {
        return res.status(404).json({ message: 'Post not found' });
    }
    // Check if user is the author
    if (post.author.toString() !== user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to delete this post' });
    }
    // Delete all comments for this post
    await Comment_1.default.deleteMany({ post: id });
    // Delete the post
    await Post_1.default.findByIdAndDelete(id);
    res.json({ message: 'Post deleted successfully' });
});
// Vote on post
exports.votePost = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { voteType } = req.body; // 'up', 'down', or 'none'
    const user = req.user;
    const post = await Post_1.default.findById(id);
    if (!post) {
        return res.status(404).json({ message: 'Post not found' });
    }
    // Remove existing votes
    post.upvotes = post.upvotes.filter(userId => userId.toString() !== user._id.toString());
    post.downvotes = post.downvotes.filter(userId => userId.toString() !== user._id.toString());
    // Add new vote
    if (voteType === 'up') {
        post.upvotes.push(user._id);
    }
    else if (voteType === 'down') {
        post.downvotes.push(user._id);
    }
    // Update score
    post.score = post.upvotes.length - post.downvotes.length;
    await post.save();
    // Update author karma
    const karmaChange = voteType === 'up' ? 1 : voteType === 'down' ? -1 : 0;
    if (karmaChange !== 0) {
        await User_1.default.findByIdAndUpdate(post.author, { $inc: { karma: karmaChange } });
    }
    res.json({
        message: 'Vote recorded successfully',
        score: post.score,
        userVote: voteType
    });
});
// Search posts
exports.searchPosts = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { q, category, type, page = 1, limit = 10 } = req.query;
    if (!q) {
        return res.status(400).json({ message: 'Search query is required' });
    }
    const filter = {
        $or: [
            { title: { $regex: q, $options: 'i' } },
            { content: { $regex: q, $options: 'i' } },
            { tags: { $in: [new RegExp(q, 'i')] } }
        ]
    };
    if (category)
        filter.category = category;
    if (type)
        filter.type = type;
    const posts = await Post_1.default.find(filter)
        .populate('author', 'username avatar englishLevel karma')
        .sort({ score: -1, createdAt: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));
    const total = await Post_1.default.countDocuments(filter);
    res.json({
        message: 'Search results retrieved successfully',
        data: {
            posts,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        }
    });
});
//# sourceMappingURL=postController.js.map