import React from 'react';
import { Volume2 } from 'lucide-react';

interface MediaRendererProps {
  content: string;
}

const MediaRenderer: React.FC<MediaRendererProps> = ({ content }) => {
  console.log('MediaRenderer received content:', content);
  
  // First, check for any Cloudinary URLs and render them directly
  const cloudinaryMatches = content.match(/https:\/\/res\.cloudinary\.com\/[^\s]+/g);
  if (cloudinaryMatches) {
    console.log('Found Cloudinary URLs:', cloudinaryMatches);
  }
  
  // Split content by lines to process each line
  const lines = content.split('\n');
  
  const renderLine = (line: string, index: number) => {
    // Debug: log each line being processed
    console.log(`Line ${index}:`, line);
    
    // Check for image markdown ![alt](url)
    const imageMatch = line.match(/!\[([^\]]*)\]\(([^)]+)\)/);
    if (imageMatch) {
      const [, alt, url] = imageMatch;
      console.log('Found image:', { alt, url });
      return (
        <div key={index} className="my-4">
          <img
            src={url}
            alt={alt || 'Image'}
            className="max-w-full h-auto rounded-lg shadow-md"
            loading="lazy"
          />
        </div>
      );
    }
    
    // Check for audio link - more flexible patterns
    const audioMatch = line.match(/🎵\s*\[([^\]]*)\]\(([^)]+)\)/) || 
                      line.match(/\[Audio[^\]]*\]\(([^)]+)\)/) ||
                      line.match(/\[([^\]]*audio[^\]]*)\]\(([^)]+)\)/i) ||
                      line.match(/\[([^\]]*recording[^\]]*)\]\(([^)]+)\)/i);
    if (audioMatch) {
      const text = audioMatch[1] || audioMatch[2] || 'Audio Recording';
      const url = audioMatch[2] || audioMatch[1];
      console.log('Found audio:', { text, url });
      return (
        <div key={index} className="my-4 bg-gray-50 rounded-lg p-4 border">
          <div className="flex items-center space-x-3 mb-3">
            <Volume2 className="h-5 w-5 text-primary-600" />
            <span className="text-sm font-medium text-gray-900">
              {text || 'Audio Recording'}
            </span>
          </div>
          <audio
            controls
            className="w-full"
            preload="metadata"
          >
            <source src={url} type="audio/mpeg" />
            <source src={url} type="audio/wav" />
            <source src={url} type="audio/ogg" />
            <source src={url} type="audio/mp4" />
            Your browser does not support the audio element.
          </audio>
        </div>
      );
    }
    
    // Check for direct Cloudinary URLs
    const cloudinaryMatch = line.match(/(https:\/\/res\.cloudinary\.com\/[^\s]+)/);
    if (cloudinaryMatch) {
      const url = cloudinaryMatch[1];
      console.log('Found Cloudinary URL:', url);
      
      // Check if it's an audio file based on URL patterns or common audio formats
      if (url.includes('/video/upload/') || url.match(/\.(mp3|wav|m4a|ogg|aac|mp4|webm)($|\?)/i)) {
        console.log('Treating as audio:', url);
        return (
          <div key={index} className="my-4 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border">
            <div className="flex items-center space-x-3 mb-3">
              <Volume2 className="h-5 w-5 text-primary-600" />
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Audio Recording
              </span>
            </div>
            <audio
              controls
              className="w-full"
              preload="metadata"
            >
              <source src={url} type="audio/mpeg" />
              <source src={url} type="audio/wav" />
              <source src={url} type="audio/ogg" />
              <source src={url} type="audio/mp4" />
              Your browser does not support the audio element.
            </audio>
          </div>
        );
      } else {
        // Treat as image
        console.log('Treating as image:', url);
        return (
          <div key={index} className="my-4">
            <img
              src={url}
              alt="Uploaded content"
              className="max-w-full h-auto rounded-lg shadow-md"
              loading="lazy"
            />
          </div>
        );
      }
    }

    // Check for direct audio URLs (fallback)
    if (line.includes('.mp3') || line.includes('.wav') || line.includes('.m4a') || line.includes('.ogg') || line.includes('cloudinary')) {
      const urlMatch = line.match(/(https?:\/\/[^\s]+\.(mp3|wav|m4a|ogg|aac))/i) ||
                      line.match(/(https?:\/\/[^\s]*cloudinary[^\s]*)/i);
      if (urlMatch) {
        const url = urlMatch[1];
        console.log('Found direct audio URL:', url);
        return (
          <div key={index} className="my-4 bg-gray-50 rounded-lg p-4 border">
            <div className="flex items-center space-x-3 mb-3">
              <Volume2 className="h-5 w-5 text-primary-600" />
              <span className="text-sm font-medium text-gray-900">
                Audio Recording
              </span>
            </div>
            <audio
              controls
              className="w-full"
              preload="metadata"
            >
              <source src={url} type="audio/mpeg" />
              <source src={url} type="audio/wav" />
              <source src={url} type="audio/ogg" />
              <source src={url} type="audio/mp4" />
              Your browser does not support the audio element.
            </audio>
          </div>
        );
      }
    }
    
    // Check for regular links [text](url)
    const linkMatch = line.match(/\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      const [fullMatch, text, url] = linkMatch;
      const beforeLink = line.substring(0, line.indexOf(fullMatch));
      const afterLink = line.substring(line.indexOf(fullMatch) + fullMatch.length);
      
      return (
        <p key={index} className="mb-2">
          {beforeLink}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-800 underline"
          >
            {text}
          </a>
          {afterLink}
        </p>
      );
    }
    
    // Regular text line
    if (line.trim()) {
      return (
        <p key={index} className="mb-2">
          {line}
        </p>
      );
    }
    
    // Empty line for spacing
    return <br key={index} />;
  };
  
  return (
    <div className="prose max-w-none text-gray-700">
      {/* First render any standalone Cloudinary URLs found */}
      {cloudinaryMatches && cloudinaryMatches.map((url, index) => {
        // Check if URL is already processed in markdown format
        const isInMarkdown = content.includes(`](${url})`) || content.includes(`(${url})`);
        if (!isInMarkdown) {
          console.log('Rendering standalone Cloudinary URL:', url);
          if (url.includes('/video/upload/') || url.match(/\.(mp3|wav|m4a|ogg|aac|mp4|webm)($|\?)/i)) {
            return (
              <div key={`cloudinary-audio-${index}`} className="my-4 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border">
                <div className="flex items-center space-x-3 mb-3">
                  <Volume2 className="h-5 w-5 text-primary-600" />
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Audio Recording
                  </span>
                </div>
                <audio
                  controls
                  className="w-full"
                  preload="metadata"
                >
                  <source src={url} type="audio/mpeg" />
                  <source src={url} type="audio/wav" />
                  <source src={url} type="audio/ogg" />
                  <source src={url} type="audio/mp4" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            );
          } else {
            return (
              <div key={`cloudinary-image-${index}`} className="my-4">
                <img
                  src={url}
                  alt="Uploaded content"
                  className="max-w-full h-auto rounded-lg shadow-md"
                  loading="lazy"
                />
              </div>
            );
          }
        }
        return null;
      })}
      
      {/* Then render the rest of the content */}
      {lines.map((line, index) => renderLine(line, index))}
    </div>
  );
};

export default MediaRenderer;
