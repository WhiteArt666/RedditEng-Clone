import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Share2, ExternalLink, MoreHorizontal } from 'lucide-react';
import { Button } from '../ui';

interface PostActionsProps {
  postId: string;
  commentCount: number;
}

const PostActions: React.FC<PostActionsProps> = ({ postId, commentCount }) => {
  return (
    <div className="flex items-center space-x-4 text-xs text-gray-500 font-bold">
      <Link
        to={`/post/${postId}`}
        className="flex items-center space-x-1 hover:bg-gray-100 p-1 rounded transition-colors"
      >
        <MessageCircle size={16} />
        <span>{commentCount} Comments</span>
      </Link>
      
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center space-x-1 hover:bg-gray-100 p-1 rounded transition-colors"
      >
        <Share2 size={16} />
        <span>Share</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="flex items-center space-x-1 hover:bg-gray-100 p-1 rounded transition-colors"
      >
        <ExternalLink size={16} />
        <span>Save</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="flex items-center space-x-1 hover:bg-gray-100 p-1 rounded transition-colors ml-auto"
      >
        <MoreHorizontal size={16} />
      </Button>
    </div>
  );
};

export default PostActions;
