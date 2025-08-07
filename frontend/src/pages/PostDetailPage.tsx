import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  ArrowUp, 
  ArrowDown, 
  MessageCircle, 
  Share2, 
  Edit, 
  Trash2, 
  Clock,
  Award,
  User,
  Send
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { postsAPI, commentsAPI } from '../services/api';
import MediaRenderer from '../components/MediaRenderer';
import type { Comment } from '../types';

const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [commentContent, setCommentContent] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [score, setScore] = useState(0);

  const { data: postData, isLoading: postLoading, error: postError, refetch: refetchPost } = useQuery({
    queryKey: ['post', id],
    queryFn: () => postsAPI.getPost(id!),
    enabled: !!id,
  });

  const { data: commentsData, isLoading: commentsLoading, refetch: refetchComments } = useQuery({
    queryKey: ['comments', id],
    queryFn: () => commentsAPI.getComments(id!),
    enabled: !!id,
  });

  const post = postData?.data?.data?.post;
  const comments = commentsData?.data?.data?.comments || [];

  React.useEffect(() => {
    if (post && user) {
      if (post.upvotes.includes(user.id)) {
        setUserVote('up');
      } else if (post.downvotes.includes(user.id)) {
        setUserVote('down');
      }
      setScore(post.score);
    }
  }, [post, user]);

  const handleVote = async (voteType: 'up' | 'down') => {
    if (!isAuthenticated || !post) {
      navigate('/login');
      return;
    }

    try {
      const newVoteType = userVote === voteType ? 'none' : voteType;
      await postsAPI.votePost(post._id, { voteType: newVoteType });
      
      setUserVote(newVoteType === 'none' ? null : newVoteType);
      
      // Update score optimistically
      const scoreChange = 
        newVoteType === 'up' ? (userVote === 'down' ? 2 : 1) :
        newVoteType === 'down' ? (userVote === 'up' ? -2 : -1) :
        userVote === 'up' ? -1 : 1;
      
      setScore(prev => prev + scoreChange);
      refetchPost();
    } catch (error) {
      console.error('Vote failed:', error);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!commentContent.trim()) return;

    setIsSubmittingComment(true);
    try {
      await commentsAPI.createComment({
        content: commentContent,
        postId: id!,
      });
      setCommentContent('');
      refetchComments();
      refetchPost(); // Update comment count
    } catch (error) {
      console.error('Comment submission failed:', error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleCommentVote = async (commentId: string, voteType: 'up' | 'down') => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await commentsAPI.voteComment(commentId, { voteType });
      refetchComments();
    } catch (error) {
      console.error('Comment vote failed:', error);
    }
  };

  if (postLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="loading-spinner w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full"></div>
      </div>
    );
  }

  if (postError || !post) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Failed to load post</p>
        <button
          onClick={() => navigate('/')}
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isAuthor = user && post.author._id === user.id;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Post */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-6">
          {/* Post Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                {post.author.avatar ? (
                  <img 
                    src={post.author.avatar} 
                    alt={post.author.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <User size={20} className="text-primary-600" />
                )}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">{post.author.username}</span>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-500">{post.author.englishLevel}</span>
                  {post.author.karma > 100 && (
                    <>
                      <Award size={14} className="text-yellow-500" />
                      <span className="text-sm text-yellow-600">{post.author.karma}</span>
                    </>
                  )}
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Clock size={14} />
                  <span>{formatDate(post.createdAt)}</span>
                  <span>•</span>
                  <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                    {post.category}
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {post.difficulty}
                  </span>
                </div>
              </div>
            </div>
            
            {isAuthor && (
              <div className="flex items-center space-x-2">
                <button className="text-gray-400 hover:text-blue-600">
                  <Edit size={16} />
                </button>
                <button className="text-gray-400 hover:text-red-600">
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Post Content */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{post.title}</h1>
            <MediaRenderer content={post.content} />
            
            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {post.tags.map(tag => (
                  <Link
                    key={tag}
                    to={`/search?q=${tag}`}
                    className="text-sm text-primary-600 hover:text-primary-800"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Post Actions */}
          <div className="flex items-center justify-between border-t border-gray-200 pt-4">
            <div className="flex items-center space-x-4">
              {/* Vote Buttons */}
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleVote('up')}
                  className={`vote-btn p-2 rounded-md ${
                    userVote === 'up' 
                      ? 'text-green-600 bg-green-50' 
                      : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                  }`}
                >
                  <ArrowUp size={20} />
                </button>
                <span className={`font-medium ${
                  score > 0 ? 'text-green-600' : score < 0 ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {score}
                </span>
                <button
                  onClick={() => handleVote('down')}
                  className={`vote-btn p-2 rounded-md ${
                    userVote === 'down' 
                      ? 'text-red-600 bg-red-50' 
                      : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                  }`}
                >
                  <ArrowDown size={20} />
                </button>
              </div>

              {/* Comment Count */}
              <div className="flex items-center space-x-1 text-gray-500">
                <MessageCircle size={16} />
                <span className="text-sm">{comments.length} comments</span>
              </div>

              {/* Share */}
              <button className="flex items-center space-x-1 text-gray-400 hover:text-gray-600">
                <Share2 size={16} />
                <span className="text-sm">Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Comments ({comments.length})
        </h2>

        {/* Add Comment Form */}
        {isAuthenticated ? (
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Share your thoughts..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent mb-3"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!commentContent.trim() || isSubmittingComment}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmittingComment ? (
                  <div className="loading-spinner w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                ) : (
                  <Send size={16} />
                )}
                Comment
              </button>
            </div>
          </form>
        ) : (
          <div className="mb-8 p-4 bg-gray-50 rounded-md text-center">
            <p className="text-gray-600 mb-3">
              <Link to="/login" className="text-primary-600 hover:text-primary-800">
                Log in
              </Link> to join the discussion
            </p>
          </div>
        )}

        {/* Comments List */}
        {commentsLoading ? (
          <div className="flex justify-center py-8">
            <div className="loading-spinner w-6 h-6 border-2 border-primary-200 border-t-primary-600 rounded-full"></div>
          </div>
        ) : comments.length > 0 ? (
          <div className="space-y-6">
            {comments.map((comment: Comment) => (
              <div key={comment._id} className="border-l-2 border-gray-200 pl-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      {comment.author.avatar ? (
                        <img 
                          src={comment.author.avatar} 
                          alt={comment.author.username}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <User size={16} className="text-primary-600" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900 text-sm">{comment.author.username}</span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-3 whitespace-pre-wrap">{comment.content}</p>
                
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleCommentVote(comment._id, 'up')}
                    className="vote-btn p-1 rounded text-gray-400 hover:text-green-600"
                  >
                    <ArrowUp size={16} />
                  </button>
                  <span className="text-sm text-gray-600">{comment.score}</span>
                  <button
                    onClick={() => handleCommentVote(comment._id, 'down')}
                    className="vote-btn p-1 rounded text-gray-400 hover:text-red-600"
                  >
                    <ArrowDown size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  );
};

export default PostDetailPage;
