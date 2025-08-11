import React from 'react';
import { Link } from 'react-router-dom';
import type { Post } from '../../types';

interface PostTagsProps {
  post: Post;
  maxTags?: number;
}

const PostTags: React.FC<PostTagsProps> = ({ post, maxTags = 5 }) => {
  if (post.tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1 mb-3">
      {post.tags.slice(0, maxTags).map((tag, index) => (
        <Link
          key={index}
          to={`/tag/${tag}`}
          className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300 transition-colors"
        >
          #{tag}
        </Link>
      ))}
      {post.tags.length > maxTags && (
        <span className="text-xs text-gray-500">
          +{post.tags.length - maxTags} more
        </span>
      )}
    </div>
  );
};

export default PostTags;
