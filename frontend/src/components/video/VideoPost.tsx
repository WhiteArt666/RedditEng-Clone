import React from 'react';
import type { Post } from '../../types';
import { usePostVote } from '../../hooks/usePostVote';
import { useVideoPlayer } from '../../hooks/useVideoPlayer';
import VideoOverlay from './VideoOverlay';
import VideoActions from './VideoActions';

interface VideoPostProps {
  post: Post;
  onVote?: () => void;
  videoMode?: 'compact' | 'fullscreen';
}

const VideoPost: React.FC<VideoPostProps> = ({ post, onVote, videoMode = 'compact' }) => {
  const { userVote, score, isVoting, handleVote } = usePostVote({ post, onVote });
  const { videoRef, isMuted, isPlaying, togglePlay, toggleMute } = useVideoPlayer({ videoMode });

  // Extract video URL from content
  const getVideoUrl = (content: string) => {
    // Try to find video with emoji first
    const videoWithEmoji = content.match(/🎥\s*\[([^\]]*)\]\(([^)]+)\)/);
    if (videoWithEmoji) return videoWithEmoji[2];
    
    // Fall back to regular video markdown format
    const videoMatch = content.match(/\[Video:\s*([^\]]*)\]\(([^)]+)\)/i);
    return videoMatch ? videoMatch[2] : null;
  };

  const videoUrl = getVideoUrl(post.content);

  if (!videoUrl) return null;

  return (
    <div 
      className={`relative bg-black overflow-hidden ${
        videoMode === 'fullscreen' 
          ? 'w-full h-full' 
          : 'w-full max-w-sm mx-auto rounded-xl shadow-2xl'
      }`}
      style={videoMode === 'fullscreen' 
        ? { height: '100vh', maxHeight: '100vh' }
        : { 
            height: '80vh', 
            maxHeight: '80vh', 
            aspectRatio: '9/16',
            maxWidth: '400px',
            width: '90vw'
          }
      }
    >
      {/* Video */}
      <div className="relative group">
        <video
          ref={videoRef}
          className="w-full h-full object-cover cursor-pointer"
          loop
          muted={isMuted}
          playsInline
          autoPlay
          controls={false} // Hide native controls for both modes
          preload="metadata"
          onClick={togglePlay}
          src={videoUrl || ''}
        >
          Your browser does not support the video element.
        </video>

        {/* Play/Pause indicator */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white bg-opacity-90 rounded-full p-4">
              <svg className="w-12 h-12 text-black" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        )}

        {/* Mute button for both modes - positioned on the right */}
        <button
          onClick={toggleMute}
          className="absolute top-4 right-4 bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition-opacity z-10"
        >
          {isMuted ? (
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.828 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.828l3.555-3.793A1 1 0 019.383 3.076zM8 5.04L5.045 7.293A1 1 0 004.414 7H3v6h1.414a1 1 0 00.631.293L8 14.96V5.04zM16.707 9.293a1 1 0 00-1.414 1.414L16.586 12l-1.293 1.293a1 1 0 101.414 1.414L18 13.414l1.293 1.293a1 1 0 001.414-1.414L19.414 12l1.293-1.293a1 1 0 00-1.414-1.414L18 10.586l-1.293-1.293z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.828 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.828l3.555-3.793A1 1 0 019.383 3.076zM8 5.04L5.045 7.293A1 1 0 004.414 7H3v6h1.414a1 1 0 00.631.293L8 14.96V5.04zm4.553 2.838a1 1 0 011.414 0 5 5 0 010 7.071 1 1 0 01-1.414-1.414 3 3 0 000-4.243 1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>

      {/* Content Overlay */}
      <VideoOverlay post={post} videoMode={videoMode} />

      {/* Right Side Actions */}
      <VideoActions
        postId={post._id}
        score={score}
        userVote={userVote}
        commentCount={post.commentCount}
        onVote={handleVote}
        isVoting={isVoting}
      />
    </div>
  );
};

export default VideoPost;
