import React from 'react';
import { Link } from 'react-router-dom';
import type { Post } from '../types';
import { usePostVote } from '../hooks/usePostVote';
import { VoteButtons, PostMeta, PostTags, PostActions } from './post';
import MediaRenderer from './MediaRenderer';

interface PostCardProps {
  post: Post;
  onVote?: (postId: string, newScore: number, userVote: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onVote }) => {
  const { userVote, score, isVoting, handleVote, isAuthenticated } = usePostVote({ post, onVote });

  // Extract text content without media tags for preview
  const getTextContent = (content: string) => {
    return content
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '[Image]') // Replace images with [Image]
      .replace(/🎵\s*\[([^\]]*)\]\(([^)]+)\)/g, '🎵 [Audio]') // Replace audio with [Audio]
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1'); // Remove other links but keep text
  };

  const textContent = getTextContent(post.content);

  return (
    <article className="bg-white border border-gray-300 rounded hover:border-gray-400 transition-colors mb-2">
      <div className="flex">
        {/* Vote Section */}
        <VoteButtons
          score={score}
          userVote={userVote}
          onVote={handleVote}
          isAuthenticated={isAuthenticated}
          isVoting={isVoting}
        />

        {/* Content Section */}
        <div className="flex-1 p-3 min-w-0">
          {/* Meta Information */}
          <PostMeta post={post} />

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
          <PostTags post={post} />

          {/* Footer Actions */}
          <PostActions postId={post._id} commentCount={post.commentCount} />
        </div>
      </div>
    </article>
  );
};

export default PostCard;
