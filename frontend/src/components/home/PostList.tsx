import React from 'react';
import type { Post } from '../../types';
import PostCard from '../PostCard';

interface PostListProps {
  posts: Post[];
  onVote: () => void;
}

const PostList: React.FC<PostListProps> = ({ posts, onVote }) => {
  return (
    <div>
      {posts.map((post: Post) => (
        <PostCard key={post._id} post={post} onVote={onVote} />
      ))}
    </div>
  );
};

export default PostList;
