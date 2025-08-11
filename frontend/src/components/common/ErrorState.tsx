import React from 'react';
import { Button } from '../ui';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({ 
  message = "Failed to load content",
  onRetry,
  className = "max-w-2xl mx-auto text-center py-12" 
}) => {
  return (
    <div className={className}>
      <p className="text-red-600 mb-4">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="primary">
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
