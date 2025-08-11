import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { postsAPI, communitiesAPI } from '../services/api';
import { useCloudinaryUpload } from '../hooks/useCloudinaryUpload';
import type { CloudinaryWidget } from '../services/cloudinaryService';
import type { Community } from '../types';
import { X, Send, BookOpen, Hash, Mic, Headphones, PenTool, Eye, Award, GraduationCap, MessageSquare, Upload, Video, Music } from 'lucide-react';

const categories = [
  { name: 'Grammar', icon: BookOpen },
  { name: 'Vocabulary', icon: Hash },
  { name: 'Speaking', icon: Mic },
  { name: 'Listening', icon: Headphones },
  { name: 'Writing', icon: PenTool },
  { name: 'Reading', icon: Eye },
  { name: 'IELTS', icon: Award },
  { name: 'TOEFL', icon: GraduationCap },
  { name: 'General', icon: MessageSquare },
];

const types = [
  { value: 'text', label: '📝 Text Post' },
  { value: 'flashcard', label: '🎴 Flashcard' },
  { value: 'grammar', label: '📚 Grammar Question' },
  { value: 'vocabulary', label: '📖 Vocabulary' },
  { value: 'pronunciation', label: '🗣️ Pronunciation' },
  { value: 'question', label: '❓ Question' },
];

const difficulties = ['Easy', 'Medium', 'Hard'];

const CreatePostPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const communityParam = searchParams.get('community');

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'text' as 'text' | 'flashcard' | 'grammar' | 'vocabulary' | 'pronunciation' | 'question',
    category: 'General' as 'Grammar' | 'Vocabulary' | 'Speaking' | 'Listening' | 'Writing' | 'Reading' | 'IELTS' | 'TOEFL' | 'General',
    difficulty: 'Medium' as 'Easy' | 'Medium' | 'Hard',
    tags: [] as string[],
    communityName: '' as string,
  });
  const [tagInput, setTagInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [userCommunities, setUserCommunities] = useState<Community[]>([]);

  // Cloudinary upload hook
  const {
    uploadedFiles,
    isWidgetReady,
    createImageWidget,
    createAudioWidget,
    createVideoWidget,
    removeFile
  } = useCloudinaryUpload();

  // Widget references
  const imageWidgetRef = useRef<CloudinaryWidget | null>(null);
  const audioWidgetRef = useRef<CloudinaryWidget | null>(null);
  const videoWidgetRef = useRef<CloudinaryWidget | null>(null);

  // Initialize widgets when ready
  useEffect(() => {
    if (isWidgetReady) {
      imageWidgetRef.current = createImageWidget();
      audioWidgetRef.current = createAudioWidget();
      videoWidgetRef.current = createVideoWidget();
    }
  }, [isWidgetReady, createImageWidget, createAudioWidget, createVideoWidget]);

  // Fetch user communities
  useEffect(() => {
    const fetchUserCommunities = async () => {
      try {
        const response = await communitiesAPI.getUserCommunities();
        setUserCommunities(response.data.data || []);
        
        // Pre-select community if parameter exists
        if (communityParam) {
          setFormData(prev => ({
            ...prev,
            communityName: communityParam
          }));
        }
      } catch (error) {
        console.error('Error fetching user communities:', error);
      }
    };

    fetchUserCommunities();
  }, [communityParam]);

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Cloudinary upload handlers
  const openImageWidget = () => {
    if (imageWidgetRef.current) {
      imageWidgetRef.current.open();
    }
  };

  const openAudioWidget = () => {
    if (audioWidgetRef.current) {
      audioWidgetRef.current.open();
    }
  };

  const openVideoWidget = () => {
    if (videoWidgetRef.current) {
      videoWidgetRef.current.open();
    }
  };

  const removeCloudinaryFile = (publicId: string) => {
    removeFile(publicId);
  };

  const getUploadedImages = () => uploadedFiles.filter(file => file.resourceType === 'image');
  const getUploadedAudios = () => uploadedFiles.filter(file => file.resourceType === 'audio');
  const getUploadedVideos = () => uploadedFiles.filter(file => file.resourceType === 'video');

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log('=== Starting form submission ===');
      console.log('Form data:', formData);
      console.log('Cloudinary uploaded files:', uploadedFiles);
      console.log('API URL:', import.meta.env.VITE_API_URL);

      // Create post with attachments
      let contentWithMedia = formData.content;
      console.log('Original content:', contentWithMedia);

      // Add Cloudinary uploads
      const cloudinaryImages = getUploadedImages();
      const cloudinaryAudios = getUploadedAudios();
      const cloudinaryVideos = getUploadedVideos();

      cloudinaryImages.forEach(file => {
        contentWithMedia += `\n\n![${file.originalFilename}](${file.secureUrl})`;
        console.log('Added Cloudinary image:', file.secureUrl);
      });

      cloudinaryAudios.forEach(file => {
        contentWithMedia += `\n\n🎵 [Audio: ${file.originalFilename}](${file.secureUrl})`;
        console.log('Added Cloudinary audio:', file.secureUrl);
      });

      cloudinaryVideos.forEach(file => {
        contentWithMedia += `\n\n🎥 [Video: ${file.originalFilename}](${file.secureUrl})`;
        console.log('Added Cloudinary video:', file.secureUrl);
      });
      
      console.log('Final content with media:', contentWithMedia);

      // Create post
      console.log('Creating post with data:', {
        ...formData,
        content: contentWithMedia,
      });
      
      await postsAPI.createPost({
        ...formData,
        content: contentWithMedia,
        communityName: formData.communityName || undefined,
      });

      console.log('Post created successfully');
      
      // Invalidate posts cache to refetch data
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      
      navigate('/');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create post';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-0">
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Create New Post</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-3 sm:px-4 py-3 rounded-md mb-4 sm:mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
              placeholder="What's your post about?"
            />
          </div>

          {/* Type and Category Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                Post Type
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
              >
                {types.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
              >
                {categories.map(category => (
                  <option key={category.name} value={category.name}>{category.name}</option>
                ))}
              </select>
            </div>

            {/* Community Selection */}
            <div>
              <label htmlFor="communityName" className="block text-sm font-medium text-gray-700 mb-2">
                Community (Optional)
              </label>
              <select
                id="communityName"
                name="communityName"
                value={formData.communityName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
              >
                <option value="">Post to your profile</option>
                {userCommunities.map(community => (
                  <option key={community._id} value={community.name}>
                    r/{community.name} - {community.displayName}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Choose a community to post in, or leave blank to post to your profile
              </p>
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty Level
            </label>
            <select
              id="difficulty"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleInputChange}
              className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
            >
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>{difficulty}</option>
              ))}
            </select>
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              required
              rows={6}
              className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base resize-none sm:resize-y"
              placeholder="Share your knowledge, ask a question, or start a discussion..."
            />
          </div>

          {/* Media Upload Section */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-base sm:text-lg font-medium text-gray-900">Add Media</h3>
            
            {/* Cloudinary Upload Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {/* Image Upload Widget */}
              <div>
                <button
                  type="button"
                  onClick={openImageWidget}
                  disabled={!isWidgetReady}
                  className="w-full p-3 sm:p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-target"
                >
                  <div className="text-center">
                    <Upload className="mx-auto h-6 w-6 sm:h-8 sm:w-8 text-gray-400 mb-2" />
                    <span className="text-xs sm:text-sm font-medium text-gray-900">Upload Images</span>
                    <p className="text-xs text-gray-500 mt-1 hidden sm:block">JPG, PNG, GIF up to 5MB</p>
                  </div>
                </button>
              </div>

              {/* Audio Upload Widget */}
              <div>
                <button
                  type="button"
                  onClick={openAudioWidget}
                  disabled={!isWidgetReady}
                  className="w-full p-3 sm:p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-target"
                >
                  <div className="text-center">
                    <Music className="mx-auto h-6 w-6 sm:h-8 sm:w-8 text-gray-400 mb-2" />
                    <span className="text-xs sm:text-sm font-medium text-gray-900">Upload Audio</span>
                    <p className="text-xs text-gray-500 mt-1 hidden sm:block">MP3, WAV, M4A up to 10MB</p>
                  </div>
                </button>
              </div>

              {/* Video Upload Widget */}
              <div>
                <button
                  type="button"
                  onClick={openVideoWidget}
                  disabled={!isWidgetReady}
                  className="w-full p-3 sm:p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-target"
                >
                  <div className="text-center">
                    <Video className="mx-auto h-6 w-6 sm:h-8 sm:w-8 text-gray-400 mb-2" />
                    <span className="text-xs sm:text-sm font-medium text-gray-900">Upload Videos</span>
                    <p className="text-xs text-gray-500 mt-1 hidden sm:block">MP4, MOV, AVI up to 50MB</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Display Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-3 sm:space-y-4">
                <h4 className="text-sm sm:text-base font-medium text-gray-900">Uploaded Files ({uploadedFiles.length})</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {uploadedFiles.map((file) => (
                    <div key={file.publicId} className="relative border border-gray-300 rounded-lg p-3 sm:p-4">
                      {file.resourceType === 'image' && (
                        <div>
                          <img
                            src={file.secureUrl}
                            alt={file.originalFilename}
                            className="w-full h-24 sm:h-32 object-cover rounded-md mb-2"
                          />
                          <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{file.originalFilename}</p>
                          <p className="text-xs text-gray-500">{(file.bytes / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      )}
                      
                      {(file.resourceType === 'video' || file.resourceType === 'audio') && (
                        <div>
                          {file.resourceType === 'video' ? (
                            <video
                              src={file.secureUrl}
                              controls
                              className="w-full h-24 sm:h-32 rounded-md mb-2"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-24 sm:h-32 bg-gray-100 rounded-md mb-2">
                              <Music className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
                            </div>
                          )}
                          
                          {file.resourceType === 'audio' && (
                            <audio controls className="w-full mb-2">
                              <source src={file.secureUrl} type={`audio/${file.format}`} />
                              Your browser does not support the audio element.
                            </audio>
                          )}
                          
                          <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{file.originalFilename}</p>
                          <p className="text-xs text-gray-500">
                            {(file.bytes / 1024 / 1024).toFixed(2)} MB
                            {file.duration && ` • ${Math.round(file.duration)}s`}
                          </p>
                        </div>
                      )}
                      
                      <button
                        type="button"
                        onClick={() => removeCloudinaryFile(file.publicId)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 touch-target"
                      >
                        <X size={14} className="sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm bg-primary-100 text-primary-700"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-primary-500 hover:text-primary-700 touch-target"
                  >
                    <X size={12} className="sm:w-3.5 sm:h-3.5" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
                placeholder="Add a tag..."
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 sm:py-2.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm sm:text-base touch-target"
              >
                Add
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm sm:text-base touch-target"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base touch-target"
            >
              {isLoading ? (
                <div className="loading-spinner w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                <Send size={14} className="sm:w-4 sm:h-4" />
              )}
              {isLoading ? 'Creating...' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostPage;
