import React from 'react';
import { useCloudinaryUpload } from '../hooks/useCloudinaryUpload';
import { Camera, Music, Video, X } from 'lucide-react';

const CloudinaryUploadDemo: React.FC = () => {
  const {
    uploadedFiles,
    isWidgetReady,
    createImageWidget,
    createAudioWidget,
    createVideoWidget,
    removeFile
  } = useCloudinaryUpload();

  const openImageWidget = () => {
    const widget = createImageWidget();
    if (widget) {
      widget.open();
    }
  };

  const openAudioWidget = () => {
    const widget = createAudioWidget();
    if (widget) {
      widget.open();
    }
  };

  const openVideoWidget = () => {
    const widget = createVideoWidget();
    if (widget) {
      widget.open();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Cloudinary Upload Test</h1>
      
      {/* Upload Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <button
          onClick={openImageWidget}
          disabled={!isWidgetReady}
          className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Camera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <div className="text-center">
            <h3 className="font-medium">Upload Images</h3>
            <p className="text-sm text-gray-500">JPG, PNG, GIF up to 5MB</p>
          </div>
        </button>

        <button
          onClick={openAudioWidget}
          disabled={!isWidgetReady}
          className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Music className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <div className="text-center">
            <h3 className="font-medium">Upload Audio</h3>
            <p className="text-sm text-gray-500">MP3, WAV, M4A up to 10MB</p>
          </div>
        </button>

        <button
          onClick={openVideoWidget}
          disabled={!isWidgetReady}
          className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Video className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <div className="text-center">
            <h3 className="font-medium">Upload Videos</h3>
            <p className="text-sm text-gray-500">MP4, MOV, AVI up to 50MB</p>
          </div>
        </button>
      </div>

      {/* Widget Ready Status */}
      <div className="mb-6">
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
          isWidgetReady 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          <div className={`w-2 h-2 rounded-full mr-2 ${
            isWidgetReady ? 'bg-green-400' : 'bg-yellow-400'
          }`}></div>
          {isWidgetReady ? 'Cloudinary Widget Ready' : 'Loading Cloudinary Widget...'}
        </div>
      </div>

      {/* Uploaded Files Display */}
      {uploadedFiles.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">
            Uploaded Files ({uploadedFiles.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uploadedFiles.map((file) => (
              <div key={file.publicId} className="relative border border-gray-300 rounded-lg p-4">
                {/* Image Display */}
                {file.resourceType === 'image' && (
                  <div>
                    <img
                      src={file.secureUrl}
                      alt={file.originalFilename}
                      className="w-full h-48 object-cover rounded-md mb-3"
                    />
                    <div className="space-y-1">
                      <h3 className="font-medium text-sm truncate">{file.originalFilename}</h3>
                      <p className="text-xs text-gray-500">
                        {file.width} × {file.height} • {(file.bytes / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <p className="text-xs text-gray-500">{file.format.toUpperCase()}</p>
                    </div>
                  </div>
                )}

                {/* Audio Display */}
                {file.resourceType === 'video' && file.format !== 'mp4' && (
                  <div>
                    <div className="flex items-center justify-center h-48 bg-gray-100 rounded-md mb-3">
                      <Music className="h-16 w-16 text-gray-400" />
                    </div>
                    <audio controls className="w-full mb-3">
                      <source src={file.secureUrl} type={`audio/${file.format}`} />
                      Your browser does not support the audio element.
                    </audio>
                    <div className="space-y-1">
                      <h3 className="font-medium text-sm truncate">{file.originalFilename}</h3>
                      <p className="text-xs text-gray-500">
                        {(file.bytes / 1024 / 1024).toFixed(2)} MB
                        {file.duration && ` • ${Math.round(file.duration)}s`}
                      </p>
                      <p className="text-xs text-gray-500">{file.format.toUpperCase()}</p>
                    </div>
                  </div>
                )}

                {/* Video Display */}
                {file.resourceType === 'video' && file.format === 'mp4' && (
                  <div>
                    <video
                      src={file.secureUrl}
                      controls
                      className="w-full h-48 rounded-md mb-3"
                    />
                    <div className="space-y-1">
                      <h3 className="font-medium text-sm truncate">{file.originalFilename}</h3>
                      <p className="text-xs text-gray-500">
                        {file.width} × {file.height} • {(file.bytes / 1024 / 1024).toFixed(2)} MB
                        {file.duration && ` • ${Math.round(file.duration)}s`}
                      </p>
                      <p className="text-xs text-gray-500">{file.format.toUpperCase()}</p>
                    </div>
                  </div>
                )}

                {/* Remove Button */}
                <button
                  onClick={() => removeFile(file.publicId)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X size={16} />
                </button>

                {/* Copy URL Button */}
                <button
                  onClick={() => navigator.clipboard.writeText(file.secureUrl)}
                  className="absolute bottom-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded hover:bg-blue-600 transition-colors"
                >
                  Copy URL
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Files Message */}
      {uploadedFiles.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Camera className="mx-auto h-16 w-16" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No files uploaded yet</h3>
          <p className="text-gray-500">Use the buttons above to upload images, audio, or video files</p>
        </div>
      )}
    </div>
  );
};

export default CloudinaryUploadDemo;
