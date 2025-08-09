import { useState } from 'react';

export const useViewMode = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'video'>('video');
  const [videoMode, setVideoMode] = useState<'compact' | 'fullscreen'>('compact');

  return {
    viewMode,
    setViewMode,
    videoMode,
    setVideoMode,
    isVideoMode: viewMode === 'video',
    isFullscreen: viewMode === 'video' && videoMode === 'fullscreen'
  };
};
