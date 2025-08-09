import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useViewMode = () => {
  const location = useLocation();
  const [viewMode, setViewMode] = useState<'grid' | 'video'>('video'); // Default to video mode
  const [videoMode, setVideoMode] = useState<'compact' | 'fullscreen'>('compact');

  useEffect(() => {
    // Check if user is on a category or difficulty page
    const isOnCategoryPage = location.pathname.includes('/category') || 
                            location.pathname.includes('/difficulty');
    
    // If on homepage (root path), show video mode
    // If on category/difficulty page, show grid mode
    if (location.pathname === '/' || location.pathname === '') {
      setViewMode('video');
    } else if (isOnCategoryPage) {
      setViewMode('grid');
    }
  }, [location.pathname]);

  return {
    viewMode,
    setViewMode,
    videoMode,
    setVideoMode,
    isVideoMode: viewMode === 'video',
    isFullscreen: viewMode === 'video' && videoMode === 'fullscreen'
  };
};
