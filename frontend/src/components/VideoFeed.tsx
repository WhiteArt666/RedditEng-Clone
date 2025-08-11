import React, { useEffect } from 'react';
import type { Post } from '../types';
import { VideoPost } from './video';

interface VideoFeedProps {
  posts: Post[];
  onVote?: () => void;
  videoMode?: 'compact' | 'fullscreen';
}

const VideoFeed: React.FC<VideoFeedProps> = ({ posts, onVote, videoMode = 'compact' }) => {
  // Filter posts that contain videos - check for both emoji and markdown format
  const videoPosts = posts.filter(post => 
    post.content.includes('🎥') || // Contains video emoji
    /\[Video:.*?\]\(.*?\)/i.test(post.content) // Contains video markdown format
  );

  // Add resize handler to ensure videos stay centered in compact mode
  useEffect(() => {
    if (videoMode === 'compact') {
      const handleResize = () => {
        // Force reflow to ensure proper centering
        const compactVideos = document.querySelectorAll('.video-snap-item.compact');
        compactVideos.forEach(video => {
          const wrapper = video.querySelector('.video-center-wrapper') as HTMLElement;
          if (wrapper) {
            wrapper.style.display = 'none';
            void wrapper.offsetHeight; // Force reflow
            wrapper.style.display = 'flex';
          }
        });
      };

      window.addEventListener('resize', handleResize);
      // Initial centering
      setTimeout(handleResize, 100);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [videoMode, videoPosts.length]);

  if (videoPosts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No videos found</p>
        <p className="text-gray-400 text-sm mt-2">Try creating some video posts to see them here!</p>
      </div>
    );
  }

  return (
    <div className={videoMode === 'fullscreen' 
      ? "video-feed-container scrollbar-hide"
      : "video-feed-container scrollbar-hide compact-feed"
    }>
      {videoPosts.map((post) => (
        <div 
          key={post._id} 
          className={videoMode === 'fullscreen'
            ? "video-snap-item"
            : "video-snap-item compact"
          }
        >
          <div className={videoMode === 'compact' ? "video-center-wrapper" : ""}>
            <VideoPost post={post} onVote={onVote} videoMode={videoMode} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default VideoFeed;
