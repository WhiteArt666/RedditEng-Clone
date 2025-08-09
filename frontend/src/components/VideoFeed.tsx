import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowUp, 
  ArrowDown, 
  MessageCircle, 
  Share2,
  User
} from 'lucide-react';
import type { Post } from '../types';
import { useAuth } from '../context/AuthContext';
import { postsAPI } from '../services/api';

interface VideoFeedProps {
  posts: Post[];
  onVote?: () => void;
  videoMode?: 'compact' | 'fullscreen';
}

const VideoPost: React.FC<{ post: Post; onVote?: () => void; videoMode?: 'compact' | 'fullscreen' }> = ({ post, onVote, videoMode = 'compact' }) => {
  const { isAuthenticated, user } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(
    post.upvotes.includes(user?.id || '') ? 'up' : 
    post.downvotes.includes(user?.id || '') ? 'down' : null
  );
  const [score, setScore] = useState(post.score);
  const [isVoting, setIsVoting] = useState(false);
  const [isMuted, setIsMuted] = useState(false); // Start unmuted for both modes

  // Auto-play when video comes into view (only in fullscreen mode)
  useEffect(() => {
    const video = videoRef.current;
    if (!video || videoMode !== 'fullscreen') return;

    // Set initial state
    video.muted = isMuted;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Auto play when in view
            video.play().catch(console.error);
          } else {
            // Pause when out of view
            video.pause();
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [videoMode, isMuted]);

  // Also ensure video plays when component mounts
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = isMuted;
      // Auto-play for both modes
      video.play().catch(console.error);
    }
  }, [isMuted]);

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

  const handleVote = async (voteType: 'up' | 'down') => {
    if (!isAuthenticated || isVoting) return;

    const newVoteType = userVote === voteType ? 'none' : voteType;
    
    try {
      setIsVoting(true);
      const response = await postsAPI.votePost(post._id, { voteType: newVoteType });
      
      setScore(response.data.data!.score);
      setUserVote(newVoteType === 'none' ? null : newVoteType as 'up' | 'down');
      
      onVote?.();
    } catch (error) {
      console.error('Vote failed:', error);
    } finally {
      setIsVoting(false);
    }
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const video = videoRef.current;
    if (video) {
      if (videoMode === 'fullscreen') {
        // In fullscreen mode, only toggle mute
        setIsMuted(!isMuted);
        video.muted = !isMuted;
      } else {
        // In compact mode, toggle play/pause
        if (video.paused) {
          video.play();
        } else {
          video.pause();
        }
      }
    }
  };

  if (!videoUrl) return null;

  return (
    <div 
      className={`relative bg-black overflow-hidden ${
        videoMode === 'fullscreen' 
          ? 'w-full h-full' 
          : 'w-full h-full'
      }`}
      style={videoMode === 'fullscreen' 
        ? { height: '100vh', maxHeight: '100vh' }
        : { height: '100vh', maxHeight: '100vh' }
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
          controls={videoMode === 'compact'}
          preload="metadata"
          onClick={togglePlay}
          src={videoUrl || ''}
        >
          Your browser does not support the video element.
        </video>

        {/* Mute button for both modes - positioned on the right */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsMuted(!isMuted);
            if (videoRef.current) {
              videoRef.current.muted = !isMuted;
            }
          }}
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
      <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent ${
        videoMode === 'fullscreen' ? 'right-20' : 'right-16'
      }`}>
        {/* Author Info */}
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
            {post.author.avatar ? (
              <img 
                src={post.author.avatar} 
                alt={post.author.username}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <User size={16} className="text-gray-600" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm truncate">
              {post.author.username}
            </p>
            <p className="text-white/80 text-xs">
              {post.author.englishLevel}
            </p>
          </div>
        </div>

        {/* Title */}
        <Link 
          to={`/post/${post._id}`}
          className="block text-white font-medium text-sm mb-2 line-clamp-2 hover:text-blue-200"
        >
          {post.title}
        </Link>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {post.tags.slice(0, 2).map(tag => (
              <span 
                key={tag} 
                className="bg-white/25 text-white px-2 py-1 rounded-full text-xs backdrop-blur-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Category & Difficulty */}
        <div className="flex items-center space-x-2">
          <span className="bg-blue-500/90 text-white px-2 py-1 rounded-full text-xs backdrop-blur-sm">
            {post.category}
          </span>
          <span className="bg-green-500/90 text-white px-2 py-1 rounded-full text-xs backdrop-blur-sm">
            {post.difficulty}
          </span>
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="absolute right-2 bottom-20 flex flex-col items-center space-y-3 z-40">
        {/* Upvote */}
        <button
          onClick={() => handleVote('up')}
          disabled={isVoting}
          className={`p-2 rounded-full transition-colors ${
            userVote === 'up' 
              ? 'bg-green-500 text-white' 
              : 'bg-black/50 text-white hover:bg-green-500/80'
          }`}
        >
          <ArrowUp size={20} />
        </button>
        
        {/* Score */}
        <span className="text-white font-bold text-xs text-center">
          {score}
        </span>
        
        {/* Downvote */}
        <button
          onClick={() => handleVote('down')}
          disabled={isVoting}
          className={`p-2 rounded-full transition-colors ${
            userVote === 'down' 
              ? 'bg-red-500 text-white' 
              : 'bg-black/50 text-white hover:bg-red-500/80'
          }`}
        >
          <ArrowDown size={20} />
        </button>

        {/* Comments */}
        <Link
          to={`/post/${post._id}`}
          className="p-2 rounded-full bg-black/50 text-white hover:bg-gray-600/80 transition-colors"
        >
          <MessageCircle size={20} />
        </Link>
        <span className="text-white font-medium text-xs text-center">
          {post.commentCount}
        </span>

        {/* Share */}
        <button className="p-2 rounded-full bg-black/50 text-white hover:bg-gray-600/80 transition-colors">
          <Share2 size={20} />
        </button>
      </div>
    </div>
  );
};

const VideoFeed: React.FC<VideoFeedProps> = ({ posts, onVote, videoMode = 'compact' }) => {
  // Filter posts that contain videos - check for both emoji and markdown format
  const videoPosts = posts.filter(post => 
    post.content.includes('🎥') || // Contains video emoji
    /\[Video:.*?\]\(.*?\)/i.test(post.content) // Contains video markdown format
  );

  // Debug: Log all posts and video posts
  console.log('All posts:', posts.length);
  console.log('Video posts:', videoPosts.length);
  console.log('Posts with video content:', posts.filter(p => 
    p.content.includes('🎥') || /\[Video:.*?\]\(.*?\)/i.test(p.content)
  ).map(p => ({ title: p.title, content: p.content.substring(0, 100) })));

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
      : "video-feed-container scrollbar-hide bg-gray-100"
    }>
      {videoPosts.map((post) => (
        <div 
          key={post._id} 
          className={videoMode === 'fullscreen'
            ? "video-snap-item"
            : "video-snap-item"
          }
        >
          <VideoPost post={post} onVote={onVote} videoMode={videoMode} />
        </div>
      ))}
    </div>
  );
};

export default VideoFeed;
