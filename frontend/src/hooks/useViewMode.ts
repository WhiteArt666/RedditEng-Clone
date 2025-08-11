import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useViewMode = () => {
  const location = useLocation();
  const [viewMode, setViewMode] = useState<'grid' | 'video'>('grid'); // Default to grid mode
  const [videoMode, setVideoMode] = useState<'compact' | 'fullscreen'>('compact');

  useEffect(() => {
    // Check if user is on a category or difficulty page
    const isOnCategoryPage = location.pathname.includes('/category') || 
                            location.pathname.includes('/difficulty');
    
    // Default to grid mode for all pages
    // Users can manually switch to video mode if they want
    if (location.pathname === '/' || location.pathname === '' || isOnCategoryPage) {
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
