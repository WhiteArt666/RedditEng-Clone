import React from 'react';

interface LoadingStateProps {
  count?: number;
  className?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ 
  count = 5, 
  className = "max-w-2xl mx-auto" 
}) => {
  return (
    <div className={className}>
      {[...Array(count)].map((_, i) => (
        <div key={i} className="bg-white border border-gray-300 rounded mb-2 p-4 animate-pulse">
          <div className="flex">
            <div className="w-10 bg-gray-200 rounded mr-3">
              <div className="h-16"></div>
            </div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingState;
