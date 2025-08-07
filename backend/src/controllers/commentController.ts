import { Response } from 'express';
import { validationResult } from 'express-validator';
import Comment, { IComment } from '../models/Comment';
import Post from '../models/Post';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

// Create new comment
export const createComment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { content, postId, parentId } = req.body;
  const user = req.user!;

  // Check if post exists
  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  let depth = 0;
  let parent = null;

  // If replying to a comment, check parent and calculate depth
  if (parentId) {
    parent = await Comment.findById(parentId);
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

  const comment = new Comment({
    content,
    author: user._id,
    post: postId,
    parent: parentId || null,
    depth
  });

  await comment.save();
  await comment.populate('author', 'username avatar englishLevel karma');

  // Update post comment count
  await Post.findByIdAndUpdate(postId, { $inc: { commentCount: 1 } });

  res.status(201).json({
    message: 'Comment created successfully',
    comment
  });
});

// Get comments for a post
export const getComments = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { postId } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const sortBy = req.query.sortBy as string || 'top'; // top, new, old

  // Check if post exists
  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  // Build sort
  let sort: any = {};
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
  const comments = await Comment.find({ 
    post: postId, 
    parent: null 
  })
    .populate('author', 'username avatar englishLevel karma isVerified')
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  // Get replies for each comment (recursive structure)
  const commentsWithReplies = await Promise.all(
    comments.map(async (comment) => {
      const replies = await getCommentReplies(comment._id.toString(), 3); // Max 3 levels of replies shown initially
      return { ...comment, replies };
    })
  );

  const total = await Comment.countDocuments({ post: postId, parent: null });

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
async function getCommentReplies(commentId: string, maxDepth: number = 3): Promise<any[]> {
  if (maxDepth <= 0) return [];

  const replies = await Comment.find({ parent: commentId })
    .populate('author', 'username avatar englishLevel karma isVerified')
    .sort({ score: -1, createdAt: -1 })
    .lean();

  return await Promise.all(
    replies.map(async (reply) => {
      const nestedReplies = await getCommentReplies(reply._id.toString(), maxDepth - 1);
      return { ...reply, replies: nestedReplies };
    })
  );
}

// Update comment
export const updateComment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { content } = req.body;
  const user = req.user!;

  const comment = await Comment.findById(id);
  if (!comment) {
    return res.status(404).json({ message: 'Comment not found' });
  }

  // Check if user is the author
  if (comment.author.toString() !== (user._id as any).toString()) {
    return res.status(403).json({ message: 'Not authorized to update this comment' });
  }

  const updatedComment = await Comment.findByIdAndUpdate(
    id,
    { content },
    { new: true, runValidators: true }
  ).populate('author', 'username avatar englishLevel karma');

  res.json({
    message: 'Comment updated successfully',
    comment: updatedComment
  });
});

// Delete comment
export const deleteComment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const user = req.user!;

  const comment = await Comment.findById(id);
  if (!comment) {
    return res.status(404).json({ message: 'Comment not found' });
  }

  // Check if user is the author
  if (comment.author.toString() !== (user._id as any).toString()) {
    return res.status(403).json({ message: 'Not authorized to delete this comment' });
  }

  // Delete all nested replies recursively
  await deleteCommentAndReplies(id);

  // Update post comment count
  const deletedCount = await Comment.countDocuments({ 
    $or: [
      { _id: id },
      { parent: id }
    ]
  });
  
  await Post.findByIdAndUpdate(comment.post, { $inc: { commentCount: -deletedCount } });

  res.json({ message: 'Comment deleted successfully' });
});

// Helper function to delete comment and all its replies
async function deleteCommentAndReplies(commentId: string): Promise<void> {
  // Find all replies to this comment
  const replies = await Comment.find({ parent: commentId });
  
  // Recursively delete replies
  for (const reply of replies) {
    await deleteCommentAndReplies((reply._id as any).toString());
  }
  
  // Delete the comment itself
  await Comment.findByIdAndDelete(commentId);
}

// Vote on comment
export const voteComment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { voteType } = req.body; // 'up', 'down', or 'none'
  const user = req.user!;

  const comment = await Comment.findById(id);
  if (!comment) {
    return res.status(404).json({ message: 'Comment not found' });
  }

  // Remove existing votes
  comment.upvotes = comment.upvotes.filter(userId => userId.toString() !== (user._id as any).toString());
  comment.downvotes = comment.downvotes.filter(userId => userId.toString() !== (user._id as any).toString());

  // Add new vote
  if (voteType === 'up') {
    comment.upvotes.push(user._id as any);
  } else if (voteType === 'down') {
    comment.downvotes.push(user._id as any);
  }

  // Update score
  comment.score = comment.upvotes.length - comment.downvotes.length;
  
  await comment.save();

  // Update author karma
  const karmaChange = voteType === 'up' ? 1 : voteType === 'down' ? -1 : 0;
  if (karmaChange !== 0) {
    await User.findByIdAndUpdate(comment.author, { $inc: { karma: karmaChange } });
  }

  res.json({
    message: 'Vote recorded successfully',
    score: comment.score,
    userVote: voteType
  });
});
