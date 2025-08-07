import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowUp, 
  ArrowDown, 
  MessageCircle, 
  Share2, 
  MoreHorizontal,
  Clock,
  Award,
  User
} from 'lucide-react';
import type { Post } from '../types';
import { useAuth } from '../context/AuthContext';
import { postsAPI } from '../services/api';

interface PostCardProps {
  post: Post;
  onVote?: (postId: string, newScore: number, userVote: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onVote }) => {
  const { isAuthenticated, user } = useAuth();
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(
    post.upvotes.includes(user?.id || '') ? 'up' : 
    post.downvotes.includes(user?.id || '') ? 'down' : null
  );
  const [score, setScore] = useState(post.score);
  const [isVoting, setIsVoting] = useState(false);

  // Extract text content without media tags for preview
  const getTextContent = (content: string) => {
    return content
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '[Image]') // Replace images with [Image]
      .replace(/🎵\s*\[([^\]]*)\]\(([^)]+)\)/g, '🎵 [Audio]') // Replace audio with [Audio]
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1'); // Remove other links but keep text
  };

  const textContent = getTextContent(post.content);

  const handleVote = async (voteType: 'up' | 'down') => {
    if (!isAuthenticated || isVoting) return;

    const newVoteType = userVote === voteType ? 'none' : voteType;
    
    try {
      setIsVoting(true);
      const response = await postsAPI.votePost(post._id, { voteType: newVoteType });
      
      setScore(response.data.data!.score);
      setUserVote(newVoteType === 'none' ? null : newVoteType as 'up' | 'down');
      
      if (onVote) {
        onVote(post._id, response.data.data!.score, response.data.data!.userVote);
      }
    } catch (error) {
      console.error('Failed to vote on post:', error);
    } finally {
      setIsVoting(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'flashcard': return '🗃️';
      case 'grammar': return '📝';
      case 'vocabulary': return '📚';
      case 'pronunciation': return '🗣️';
      case 'question': return '❓';
      default: return '💬';
    }
  };

  return (
    <article className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow card-hover">
      <div className="flex">
        {/* Vote Section */}
        <div className="flex flex-col items-center p-4 bg-gray-50 rounded-l-lg">
          <button
            onClick={() => handleVote('up')}
            disabled={!isAuthenticated || isVoting}
            className={`vote-btn p-1 rounded transition-colors ${
              userVote === 'up'
                ? 'text-orange-500 bg-orange-100'
                : 'text-gray-400 hover:text-orange-500 hover:bg-orange-50'
            } ${!isAuthenticated ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            <ArrowUp size={20} />
          </button>
          
          <span className={`text-sm font-semibold my-1 ${
            score > 0 ? 'text-orange-500' : 
            score < 0 ? 'text-blue-500' : 'text-gray-500'
          }`}>
            {score}
          </span>
          
          <button
            onClick={() => handleVote('down')}
            disabled={!isAuthenticated || isVoting}
            className={`vote-btn p-1 rounded transition-colors ${
              userVote === 'down'
                ? 'text-blue-500 bg-blue-100'
                : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50'
            } ${!isAuthenticated ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            <ArrowDown size={20} />
          </button>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span className="text-lg">{getTypeIcon(post.type)}</span>
              <Link
                to={`/category/${post.category.toLowerCase()}`}
                className="font-medium text-primary-600 hover:text-primary-800"
              >
                r/{post.category}
              </Link>
              <span>•</span>
              <span>Posted by</span>
              <Link
                to={`/user/${post.author.username}`}
                className="hover:underline flex items-center space-x-1"
              >
                {post.author.isVerified && <Award size={14} className="text-yellow-500" />}
                <span>u/{post.author.username}</span>
              </Link>
              <span>•</span>
              <div className="flex items-center space-x-1">
                <Clock size={14} />
                <span>{formatTimeAgo(post.createdAt)}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(post.difficulty)}`}>
                {post.difficulty}
              </span>
              <button className="p-1 rounded hover:bg-gray-100">
                <MoreHorizontal size={16} className="text-gray-400" />
              </button>
            </div>
          </div>

          {/* Title */}
          <Link to={`/post/${post._id}`}>
            <h2 className="text-lg font-semibold text-gray-900 mb-2 hover:text-primary-600 transition-colors">
              {post.title}
            </h2>
          </Link>

          {/* Content Preview */}
          <div className="text-gray-700 mb-3 line-clamp-3">
            {textContent.length > 200 
              ? `${textContent.substring(0, 200)}...` 
              : textContent
            }
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags.slice(0, 5).map((tag, index) => (
                <Link
                  key={index}
                  to={`/tag/${tag}`}
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
              {post.tags.length > 5 && (
                <span className="text-xs text-gray-500">+{post.tags.length - 5} more</span>
              )}
            </div>
          )}

          {/* AI Suggestions */}
          {post.aiSuggestions && Object.keys(post.aiSuggestions).length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm font-medium text-blue-900">🤖 AI Suggestions</span>
              </div>
              {post.aiSuggestions.grammarCheck && (
                <p className="text-sm text-blue-800 mb-1">
                  <strong>Grammar:</strong> {post.aiSuggestions.grammarCheck}
                </p>
              )}
              {post.aiSuggestions.betterPhrase && (
                <p className="text-sm text-blue-800">
                  <strong>Better phrase:</strong> {post.aiSuggestions.betterPhrase}
                </p>
              )}
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <Link
              to={`/post/${post._id}`}
              className="flex items-center space-x-1 hover:text-gray-700 transition-colors"
            >
              <MessageCircle size={16} />
              <span>{post.commentCount} comments</span>
            </Link>
            
            <button className="flex items-center space-x-1 hover:text-gray-700 transition-colors">
              <Share2 size={16} />
              <span>Share</span>
            </button>

            <div className="flex items-center space-x-1 ml-auto">
              <User size={14} />
              <span className="text-xs">
                {post.author.englishLevel} • {post.author.karma} karma
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
