import { Response } from 'express';
import { validationResult } from 'express-validator';
import Post, { IPost } from '../models/Post';
import Comment from '../models/Comment';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

// Create new post
export const createPost = asyncHandler(async (req: AuthRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, content, type, category, tags, difficulty } = req.body;
  const user = req.user!;

  const post = new Post({
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
export const getPosts = asyncHandler(async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const category = req.query.category as string;
  const type = req.query.type as string;
  const difficulty = req.query.difficulty as string;
  const sortBy = req.query.sortBy as string || 'hot'; // hot, new, top

  // Build filter
  const filter: any = {};
  if (category) filter.category = category;
  if (type) filter.type = type;
  if (difficulty) filter.difficulty = difficulty;

  // Build sort
  let sort: any = {};
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

  const posts = await Post.find(filter)
    .populate('author', 'username avatar englishLevel karma')
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  const total = await Post.countDocuments(filter);

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
export const getPost = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const post = await Post.findById(id)
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
export const updatePost = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { title, content, category, tags, difficulty } = req.body;
  const user = req.user!;

  const post = await Post.findById(id);
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  // Check if user is the author
  if (post.author.toString() !== (user._id as any).toString()) {
    return res.status(403).json({ message: 'Not authorized to update this post' });
  }

  const updatedPost = await Post.findByIdAndUpdate(
    id,
    {
      ...(title && { title }),
      ...(content && { content }),
      ...(category && { category }),
      ...(tags && { tags }),
      ...(difficulty && { difficulty })
    },
    { new: true, runValidators: true }
  ).populate('author', 'username avatar englishLevel karma');

  res.json({
    message: 'Post updated successfully',
    post: updatedPost
  });
});

// Delete post
export const deletePost = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const user = req.user!;

  const post = await Post.findById(id);
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  // Check if user is the author
  if (post.author.toString() !== (user._id as any).toString()) {
    return res.status(403).json({ message: 'Not authorized to delete this post' });
  }

  // Delete all comments for this post
  await Comment.deleteMany({ post: id });
  
  // Delete the post
  await Post.findByIdAndDelete(id);

  res.json({ message: 'Post deleted successfully' });
});

// Vote on post
export const votePost = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { voteType } = req.body; // 'up', 'down', or 'none'
  const user = req.user!;

  const post = await Post.findById(id);
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  // Remove existing votes
  post.upvotes = post.upvotes.filter(userId => userId.toString() !== (user._id as any).toString());
  post.downvotes = post.downvotes.filter(userId => userId.toString() !== (user._id as any).toString());

  // Add new vote
  if (voteType === 'up') {
    post.upvotes.push(user._id as any);
  } else if (voteType === 'down') {
    post.downvotes.push(user._id as any);
  }

  // Update score
  post.score = post.upvotes.length - post.downvotes.length;
  
  await post.save();

  // Update author karma
  const karmaChange = voteType === 'up' ? 1 : voteType === 'down' ? -1 : 0;
  if (karmaChange !== 0) {
    await User.findByIdAndUpdate(post.author, { $inc: { karma: karmaChange } });
  }

  res.json({
    message: 'Vote recorded successfully',
    score: post.score,
    userVote: voteType
  });
});

// Search posts
export const searchPosts = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { q, category, type, page = 1, limit = 10 } = req.query;

  if (!q) {
    return res.status(400).json({ message: 'Search query is required' });
  }

  const filter: any = {
    $or: [
      { title: { $regex: q, $options: 'i' } },
      { content: { $regex: q, $options: 'i' } },
      { tags: { $in: [new RegExp(q as string, 'i')] } }
    ]
  };

  if (category) filter.category = category;
  if (type) filter.type = type;

  const posts = await Post.find(filter)
    .populate('author', 'username avatar englishLevel karma')
    .sort({ score: -1, createdAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  const total = await Post.countDocuments(filter);

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
