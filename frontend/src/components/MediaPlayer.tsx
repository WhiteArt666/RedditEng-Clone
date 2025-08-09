import React from 'react';
import { Volume2, Image } from 'lucide-react';

interface MediaPlayerProps {
  content: string;
}

const MediaPlayer: React.FC<MediaPlayerProps> = ({ content }) => {
  // Extract all URLs from content
  const urlPattern = /(https?:\/\/[^\s]+)/g;
  const urls = content.match(urlPattern) || [];
  
  if (urls.length === 0) return null;

  const renderMedia = (url: string, index: number) => {
    // Check if it's a Cloudinary URL
    const isCloudinary = url.includes('cloudinary.com');
    
    // Check if it's audio based on URL pattern or file extension
    const isAudio = url.includes('/video/upload/') || 
                   url.match(/\.(mp3|wav|m4a|ogg|aac|mp4|webm)(\?|$)/i) ||
                   (isCloudinary && !url.includes('/image/upload/'));
    
    // Check if it's image
    const isImage = url.includes('/image/upload/') || 
                   url.match(/\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/i);

    if (isAudio) {
      return (
        <div key={`audio-${index}`} className="my-4 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full">
              <Volume2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Audio Recording
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Click to play audio
              </p>
            </div>
          </div>
          <audio
            controls
            className="w-full h-12 bg-white dark:bg-gray-700 rounded-md"
            preload="metadata"
            style={{ outline: 'none' }}
          >
            <source src={url} type="audio/mpeg" />
            <source src={url} type="audio/wav" />
            <source src={url} type="audio/ogg" />
            <source src={url} type="audio/mp4" />
            <source src={url} type="audio/webm" />
            <p className="text-red-500 text-sm">
              Your browser does not support the audio element.
              <a href={url} target="_blank" rel="noopener noreferrer" className="underline ml-1">
                Download audio file
              </a>
            </p>
          </audio>
        </div>
      );
    }

    if (isImage) {
      return (
        <div key={`image-${index}`} className="my-4">
          <div className="relative group">
            <img
              src={url}
              alt="Uploaded image"
              className="max-w-full h-auto rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
              loading="lazy"
              onError={(e) => {
                console.error('Image failed to load:', url);
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
              >
                <Image className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="media-player">
      {urls.map((url, index) => renderMedia(url, index))}
    </div>
  );
};

export default MediaPlayer;
