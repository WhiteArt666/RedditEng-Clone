import { useState, useRef, useEffect } from 'react';

interface UseVideoPlayerOptions {
  videoMode?: 'compact' | 'fullscreen';
}

export const useVideoPlayer = ({ videoMode = 'compact' }: UseVideoPlayerOptions = {}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Set initial state
    video.muted = isMuted;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Auto play when in view
            video.play().catch(console.error);
            setIsPlaying(true);
          } else {
            // Pause when out of view
            video.pause();
            setIsPlaying(false);
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

  const togglePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const video = videoRef.current;
    if (video) {
      // For both modes, toggle play/pause when clicking video
      if (video.paused) {
        video.play();
        setIsPlaying(true);
      } else {
        video.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  return {
    videoRef,
    isMuted,
    isPlaying,
    togglePlay,
    toggleMute,
  };
};
