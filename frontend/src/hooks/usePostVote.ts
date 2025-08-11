import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { postsAPI } from '../services/api';
import type { Post } from '../types';

interface UsePostVoteOptions {
  post: Post;
  onVote?: (postId: string, newScore: number, userVote: string) => void;
}

export const usePostVote = ({ post, onVote }: UsePostVoteOptions) => {
  const { isAuthenticated, user } = useAuth();
  
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(
    post.upvotes.includes(user?.id || '') ? 'up' : 
    post.downvotes.includes(user?.id || '') ? 'down' : null
  );
  const [score, setScore] = useState(post.score);
  const [isVoting, setIsVoting] = useState(false);

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

  return {
    userVote,
    score,
    isVoting,
    handleVote,
    isAuthenticated,
  };
};
