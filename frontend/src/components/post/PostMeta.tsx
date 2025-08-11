import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Award } from 'lucide-react';
import type { Post } from '../../types';

interface PostMetaProps {
  post: Post;
}

const PostMeta: React.FC<PostMetaProps> = ({ post }) => {
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
  );
};

export default PostMeta;
