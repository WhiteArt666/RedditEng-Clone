import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '../ui';

interface VoteButtonsProps {
  score: number;
  userVote: 'up' | 'down' | null;
  onVote: (voteType: 'up' | 'down') => void;
  isAuthenticated: boolean;
  isVoting: boolean;
  className?: string;
}

const VoteButtons: React.FC<VoteButtonsProps> = ({
  score,
  userVote,
  onVote,
  isAuthenticated,
  isVoting,
  className = "flex flex-col items-center px-2 py-2 w-10 bg-gray-50"
}) => {
  return (
    <div className={className}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onVote('up')}
        disabled={!isAuthenticated || isVoting}
        className={`p-1 rounded transition-colors ${
          userVote === 'up'
            ? 'text-red-500 bg-red-50'
            : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
        } ${!isAuthenticated ? 'cursor-not-allowed opacity-50' : ''}`}
      >
        <ArrowUp size={20} />
      </Button>
      
      <span className={`text-xs font-bold my-1 ${
        score > 0 ? 'text-red-500' : 
        score < 0 ? 'text-blue-500' : 'text-gray-500'
      }`}>
        {score >= 1000 ? `${(score / 1000).toFixed(1)}k` : score}
      </span>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onVote('down')}
        disabled={!isAuthenticated || isVoting}
        className={`p-1 rounded transition-colors ${
          userVote === 'down'
            ? 'text-blue-500 bg-blue-50'
            : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50'
        } ${!isAuthenticated ? 'cursor-not-allowed opacity-50' : ''}`}
      >
        <ArrowDown size={20} />
      </Button>
    </div>
  );
};

export default VoteButtons;
