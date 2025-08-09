import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowUp, 
  ArrowDown, 
  MessageCircle, 
  Share2,
  User,
  Play,
  Pause
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
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto-play when video comes into view
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(console.error);
            setIsPlaying(true);
          } else {
            video.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

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
    const video = e.currentTarget.parentElement?.querySelector('video');
    if (video) {
      if (video.paused) {
        video.play();
        setIsPlaying(true);
      } else {
        video.pause();
        setIsPlaying(false);
      }
    }
  };

  if (!videoUrl) return null;

  return (
    <div 
      className="relative bg-black overflow-hidden rounded-lg" 
      style={videoMode === 'fullscreen' 
        ? { width: '100vw', height: 'calc(100vh - 4rem)', maxWidth: 'none', borderRadius: '0' }
        : { width: '90vw', maxWidth: '400px', height: '600px' }
      }
    >
      {/* Video */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        loop
        muted
        playsInline
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video element.
      </video>

      {/* Play/Pause Overlay */}
      <button
        onClick={togglePlay}
        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity"
      >
        {isPlaying ? (
          <Pause className="w-16 h-16 text-white" />
        ) : (
          <Play className="w-16 h-16 text-white" />
        )}
      </button>

      {/* Content Overlay */}
      <div className={videoMode === 'fullscreen'
        ? "absolute bottom-0 left-0 right-20 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
        : "absolute bottom-0 left-0 right-14 p-4 bg-gradient-to-t from-black/70 to-transparent"
      }>
        {/* Author Info */}
        <div className={`flex items-center space-x-3 ${videoMode === 'fullscreen' ? 'mb-3' : 'mb-2'}`}>
          <div className={`bg-white rounded-full flex items-center justify-center ${
            videoMode === 'fullscreen' ? 'w-10 h-10' : 'w-8 h-8'
          }`}>
            {post.author.avatar ? (
              <img 
                src={post.author.avatar} 
                alt={post.author.username}
                className={`rounded-full object-cover ${videoMode === 'fullscreen' ? 'w-10 h-10' : 'w-8 h-8'}`}
              />
            ) : (
              <User size={videoMode === 'fullscreen' ? 20 : 16} className="text-gray-600" />
            )}
          </div>
          <div>
            <p className={`text-white font-semibold ${videoMode === 'fullscreen' ? 'text-base' : 'text-sm'}`}>
              {post.author.username}
            </p>
            <p className={`text-white/80 ${videoMode === 'fullscreen' ? 'text-sm' : 'text-xs'}`}>
              {post.author.englishLevel}
            </p>
          </div>
        </div>

        {/* Title */}
        <Link 
          to={`/post/${post._id}`}
          className={`block text-white font-medium line-clamp-2 hover:text-blue-200 ${
            videoMode === 'fullscreen' ? 'text-base mb-3' : 'text-sm mb-2'
          }`}
        >
          {post.title}
        </Link>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className={`flex flex-wrap gap-2 ${videoMode === 'fullscreen' ? 'mb-4' : 'mb-3'}`}>
            {post.tags.slice(0, 3).map(tag => (
              <span 
                key={tag} 
                className={`bg-white/25 text-white px-3 py-1 rounded-full backdrop-blur-sm ${
                  videoMode === 'fullscreen' ? 'text-sm' : 'text-xs'
                }`}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Category & Difficulty */}
        <div className="flex items-center space-x-3">
          <span className={`bg-blue-500/90 text-white px-3 py-1 rounded-full backdrop-blur-sm ${
            videoMode === 'fullscreen' ? 'text-sm' : 'text-xs'
          }`}>
            {post.category}
          </span>
          <span className={`bg-green-500/90 text-white px-3 py-1 rounded-full backdrop-blur-sm ${
            videoMode === 'fullscreen' ? 'text-sm' : 'text-xs'
          }`}>
            {post.difficulty}
          </span>
        </div>
      </div>

      {/* Right Side Actions */}
      <div className={videoMode === 'fullscreen'
        ? "absolute right-4 bottom-32 flex flex-col items-center space-y-6 z-40"
        : "absolute right-3 bottom-20 flex flex-col items-center space-y-4"
      }>
        {/* Upvote */}
        <button
          onClick={() => handleVote('up')}
          disabled={isVoting}
          className={`${videoMode === 'fullscreen' ? 'p-3' : 'p-2'} rounded-full ${
            userVote === 'up' 
              ? 'bg-green-500 text-white' 
              : 'bg-black/50 text-white hover:bg-green-500/80'
          } transition-colors`}
        >
          <ArrowUp size={videoMode === 'fullscreen' ? 24 : 20} />
        </button>
        
        {/* Score */}
        <span className={`text-white font-bold ${videoMode === 'fullscreen' ? 'text-sm' : 'text-xs'}`}>
          {score}
        </span>
        
        {/* Downvote */}
        <button
          onClick={() => handleVote('down')}
          disabled={isVoting}
          className={`${videoMode === 'fullscreen' ? 'p-3' : 'p-2'} rounded-full ${
            userVote === 'down' 
              ? 'bg-red-500 text-white' 
              : 'bg-black/50 text-white hover:bg-red-500/80'
          } transition-colors`}
        >
          <ArrowDown size={videoMode === 'fullscreen' ? 24 : 20} />
        </button>

        {/* Comments */}
        <Link
          to={`/post/${post._id}`}
          className={`${videoMode === 'fullscreen' ? 'p-3' : 'p-2'} rounded-full bg-black/50 text-white hover:bg-gray-600/80 transition-colors`}
        >
          <MessageCircle size={videoMode === 'fullscreen' ? 24 : 20} />
        </Link>
        <span className={`text-white font-medium ${videoMode === 'fullscreen' ? 'text-xs' : 'text-xs'}`}>
          {post.commentCount}
        </span>

        {/* Share */}
        <button className={`${videoMode === 'fullscreen' ? 'p-3' : 'p-2'} rounded-full bg-black/50 text-white hover:bg-gray-600/80 transition-colors`}>
          <Share2 size={videoMode === 'fullscreen' ? 24 : 20} />
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
      ? "fixed top-16 left-0 right-0 bottom-0 h-full overflow-y-auto snap-y snap-mandatory scrollbar-hide bg-black"
      : "flex flex-col items-center space-y-6 pb-20 pt-4"
    }>
      {videoPosts.map((post) => (
        <div 
          key={post._id} 
          className={videoMode === 'fullscreen'
            ? "h-full w-full snap-start snap-always flex items-center justify-center video-container"
            : "w-full flex justify-center"
          }
          style={videoMode === 'fullscreen' ? { scrollSnapAlign: 'start', scrollSnapStop: 'always' } : {}}
        >
          <VideoPost post={post} onVote={onVote} videoMode={videoMode} />
        </div>
      ))}
    </div>
  );
};

export default VideoFeed;
