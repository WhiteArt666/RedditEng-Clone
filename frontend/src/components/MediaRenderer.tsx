import React from 'react';
import { Volume2, Video } from 'lucide-react';

interface MediaRendererProps {
  content: string;
}

const MediaRenderer: React.FC<MediaRendererProps> = ({ content }) => {
  console.log('MediaRenderer received content:', content);
  
  // Split content by lines to process each line
  const lines = content.split('\n');
  const processedUrls = new Set<string>(); // Track processed URLs to avoid duplicates
  
  const renderLine = (line: string, index: number) => {
    // Debug: log each line being processed
    console.log(`Line ${index}:`, line);
    
    // Check for image markdown ![alt](url)
    const imageMatch = line.match(/!\[([^\]]*)\]\(([^)]+)\)/);
    if (imageMatch) {
      const [, alt, url] = imageMatch;
      if (processedUrls.has(url)) {
        console.log('Skipping duplicate image:', url);
        return null; // Skip duplicate
      }
      processedUrls.add(url);
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
    
    // Check for video link - 🎥 [Video: filename](url)
    const videoMatch = line.match(/�\s*\[([^\]]*)\]\(([^)]+)\)/) || 
                      line.match(/\[Video[^\]]*\]\(([^)]+)\)/) ||
                      line.match(/\[([^\]]*video[^\]]*)\]\(([^)]+)\)/i);
    if (videoMatch) {
      const text = videoMatch[1] || videoMatch[2] || 'Video';
      const url = videoMatch[2] || videoMatch[1];
      if (processedUrls.has(url)) {
        console.log('Skipping duplicate video:', url);
        return null; // Skip duplicate
      }
      processedUrls.add(url);
      console.log('Found video:', { text, url });
      return (
        <div key={index} className="my-4 bg-gray-50 rounded-lg p-4 border">
          <div className="flex items-center space-x-3 mb-3">
            <Video className="h-5 w-5 text-primary-600" />
            <span className="text-sm font-medium text-gray-900">
              {text || 'Video'}
            </span>
          </div>
          <video
            controls
            className="w-full max-w-2xl rounded-lg"
            preload="metadata"
          >
            <source src={url} type="video/mp4" />
            <source src={url} type="video/webm" />
            <source src={url} type="video/ogg" />
            Your browser does not support the video element.
          </video>
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
      if (processedUrls.has(url)) {
        console.log('Skipping duplicate audio:', url);
        return null; // Skip duplicate
      }
      processedUrls.add(url);
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
      {lines.map((line, index) => renderLine(line, index)).filter(Boolean)}
    </div>
  );
};

export default MediaRenderer;
