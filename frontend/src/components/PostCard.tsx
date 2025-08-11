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
  ExternalLink
} from 'lucide-react';
import type { Post } from '../types';
import { useAuth } from '../context/AuthContext';
import { postsAPI } from '../services/api';
import MediaRenderer from './MediaRenderer';

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
    <article className="bg-white border border-gray-300 rounded hover:border-gray-400 transition-colors mb-2">
      <div className="flex">
        {/* Vote Section */}
        <div className="flex flex-col items-center px-2 py-2 w-10 bg-gray-50">
          <button
            onClick={() => handleVote('up')}
            disabled={!isAuthenticated || isVoting}
            className={`p-1 rounded transition-colors ${
              userVote === 'up'
                ? 'text-red-500 bg-red-50'
                : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
            } ${!isAuthenticated ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            <ArrowUp size={20} />
          </button>
          
          <span className={`text-xs font-bold my-1 ${
            score > 0 ? 'text-red-500' : 
            score < 0 ? 'text-blue-500' : 'text-gray-500'
          }`}>
            {score >= 1000 ? `${(score / 1000).toFixed(1)}k` : score}
          </span>
          
          <button
            onClick={() => handleVote('down')}
            disabled={!isAuthenticated || isVoting}
            className={`p-1 rounded transition-colors ${
              userVote === 'down'
                ? 'text-blue-500 bg-blue-50'
                : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50'
            } ${!isAuthenticated ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            <ArrowDown size={20} />
          </button>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-3 min-w-0">
          {/* Meta Information */}
          <div className="flex items-center text-xs text-gray-500 mb-1 space-x-1">
            <span className="text-sm">{getTypeIcon(post.type)}</span>
            {post.community ? (
              <Link
                to={`/community/${post.community.name}`}
                className="font-medium text-black hover:underline flex items-center space-x-1"
              >
                {post.community.avatar && (
                  <img 
                    src={post.community.avatar} 
                    alt=""
                    className="w-4 h-4 rounded-full object-cover"
                  />
                )}
                <span>r/{post.community.name}</span>
              </Link>
            ) : (
              <Link
                to={`/category/${post.category.toLowerCase()}`}
                className="font-medium text-black hover:underline"
              >
                r/{post.category}
              </Link>
            )}
            <span>•</span>
            <span>Posted by</span>
            <Link
              to={`/user/${post.author.username}`}
              className="hover:underline flex items-center space-x-1"
            >
              {post.author.isVerified && <Award size={12} className="text-yellow-500" />}
              <span>u/{post.author.username}</span>
            </Link>
            <span>•</span>
            <div className="flex items-center space-x-1">
              <Clock size={12} />
              <span>{formatTimeAgo(post.createdAt)}</span>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(post.difficulty)}`}>
              {post.difficulty}
            </span>
          </div>

          {/* Title */}
          <Link to={`/post/${post._id}`}>
            <h2 className="text-lg font-medium text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2">
              {post.title}
            </h2>
          </Link>

          {/* Content Preview and Media */}
          {textContent && (
            <div className="text-sm text-gray-700 mb-3 line-clamp-3">
              {textContent.length > 300
                ? `${textContent.substring(0, 300)}...` 
                : textContent
              }
            </div>
          )}

          {/* Media Content */}
          <div className="mb-3">
            <MediaRenderer content={post.content} compact={true} />
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {post.tags.slice(0, 5).map((tag, index) => (
                <Link
                  key={index}
                  to={`/tag/${tag}`}
                  className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
              {post.tags.length > 5 && (
                <span className="text-xs text-gray-500">
                  +{post.tags.length - 5} more
                </span>
              )}
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center space-x-4 text-xs text-gray-500 font-bold">
            <Link
              to={`/post/${post._id}`}
              className="flex items-center space-x-1 hover:bg-gray-100 p-1 rounded transition-colors"
            >
              <MessageCircle size={16} />
              <span>{post.commentCount} Comments</span>
            </Link>
            
            <button className="flex items-center space-x-1 hover:bg-gray-100 p-1 rounded transition-colors">
              <Share2 size={16} />
              <span>Share</span>
            </button>

            <button className="flex items-center space-x-1 hover:bg-gray-100 p-1 rounded transition-colors">
              <ExternalLink size={16} />
              <span>Save</span>
            </button>

            <button className="flex items-center space-x-1 hover:bg-gray-100 p-1 rounded transition-colors ml-auto">
              <MoreHorizontal size={16} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
