import React from 'react';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';
import type { Post } from '../../types';

interface VideoOverlayProps {
  post: Post;
  videoMode?: 'compact' | 'fullscreen';
}

const VideoOverlay: React.FC<VideoOverlayProps> = ({ post, videoMode = 'compact' }) => {
  return (
    <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent ${
      videoMode === 'fullscreen' ? 'right-20' : 'right-16'
    }`}>
      {/* Author Info */}
      <div className="flex items-center space-x-3 mb-2">
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
          {post.author.avatar ? (
            <img 
              src={post.author.avatar} 
              alt={post.author.username}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <User size={16} className="text-gray-600" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm truncate">
            {post.author.username}
          </p>
          <p className="text-white/80 text-xs">
            {post.author.englishLevel}
          </p>
        </div>
      </div>

      {/* Title */}
      <Link 
        to={`/post/${post._id}`}
        className="block text-white font-medium text-sm mb-2 line-clamp-2 hover:text-blue-200"
      >
        {post.title}
      </Link>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {post.tags.slice(0, 2).map(tag => (
            <span 
              key={tag} 
              className="bg-white/25 text-white px-2 py-1 rounded-full text-xs backdrop-blur-sm"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Category & Difficulty */}
      <div className="flex items-center space-x-2">
        <span className="bg-blue-500/90 text-white px-2 py-1 rounded-full text-xs backdrop-blur-sm">
          {post.category}
        </span>
        <span className="bg-green-500/90 text-white px-2 py-1 rounded-full text-xs backdrop-blur-sm">
          {post.difficulty}
        </span>
      </div>
    </div>
  );
};

export default VideoOverlay;
