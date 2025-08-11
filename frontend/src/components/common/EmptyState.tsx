import React from 'react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  title = "No posts found",
  description = "Be the first to create a post!",
  className = "bg-white border border-gray-300 rounded p-8 text-center" 
}) => {
  return (
    <div className={className}>
      <p className="text-gray-500 text-lg mb-2">{title}</p>
      <p className="text-gray-400">{description}</p>
    </div>
  );
};

export default EmptyState;
