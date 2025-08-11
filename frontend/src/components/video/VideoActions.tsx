import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, ArrowDown, MessageCircle, Share2 } from 'lucide-react';
import { Button } from '../ui';

interface VideoActionsProps {
  postId: string;
  score: number;
  userVote: 'up' | 'down' | null;
  commentCount: number;
  onVote: (voteType: 'up' | 'down') => void;
  isVoting: boolean;
}

const VideoActions: React.FC<VideoActionsProps> = ({
  postId,
  score,
  userVote,
  commentCount,
  onVote,
  isVoting,
}) => {
  return (
    <div className="absolute right-2 bottom-20 flex flex-col items-center space-y-3 z-40">
      {/* Upvote */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onVote('up')}
        disabled={isVoting}
        className={`p-2 rounded-full transition-colors ${
          userVote === 'up' 
            ? 'bg-green-500 text-white' 
            : 'bg-black/50 text-white hover:bg-green-500/80'
        }`}
      >
        <ArrowUp size={20} />
      </Button>
      
      {/* Score */}
      <span className="text-white font-bold text-xs text-center">
        {score}
      </span>
      
      {/* Downvote */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onVote('down')}
        disabled={isVoting}
        className={`p-2 rounded-full transition-colors ${
          userVote === 'down' 
            ? 'bg-red-500 text-white' 
            : 'bg-black/50 text-white hover:bg-red-500/80'
        }`}
      >
        <ArrowDown size={20} />
      </Button>

      {/* Comments */}
      <Link
        to={`/post/${postId}`}
        className="p-2 rounded-full bg-black/50 text-white hover:bg-gray-600/80 transition-colors"
      >
        <MessageCircle size={20} />
      </Link>
      <span className="text-white font-medium text-xs text-center">
        {commentCount}
      </span>

      {/* Share */}
      <Button
        variant="ghost"
        size="sm"
        className="p-2 rounded-full bg-black/50 text-white hover:bg-gray-600/80 transition-colors"
      >
        <Share2 size={20} />
      </Button>
    </div>
  );
};

export default VideoActions;
