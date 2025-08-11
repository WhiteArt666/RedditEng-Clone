import React from 'react';
import { Button } from '../ui';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "flex items-center justify-center space-x-2 py-8"
}) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className={className}>
      <Button
        variant="ghost"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-3 py-2 border border-gray-300 rounded text-sm"
      >
        Previous
      </Button>
      
      <div className="flex items-center space-x-1">
        {visiblePages.map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className="px-3 py-2 text-gray-500">...</span>
            ) : (
              <Button
                variant={page === currentPage ? "primary" : "ghost"}
                onClick={() => onPageChange(page as number)}
                className={`px-3 py-2 border text-sm font-medium rounded ${
                  page === currentPage
                    ? 'bg-orange-500 border-orange-500 text-white'
                    : 'border-gray-300 text-gray-500 hover:text-gray-700'
                }`}
              >
                {page}
              </Button>
            )}
          </React.Fragment>
        ))}
      </div>
      
      <Button
        variant="ghost"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-3 py-2 border border-gray-300 rounded text-sm"
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
