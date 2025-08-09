import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { postsAPI } from '../services/api';
import { useCloudinaryUpload } from '../hooks/useCloudinaryUpload';
import type { CloudinaryWidget } from '../services/cloudinaryService';
import { Camera, X, Send, BookOpen, Hash, Mic, Headphones, PenTool, Eye, Award, GraduationCap, MessageSquare, Upload, Video, Music } from 'lucide-react';

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

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'text' as 'text' | 'flashcard' | 'grammar' | 'vocabulary' | 'pronunciation' | 'question',
    category: 'General' as 'Grammar' | 'Vocabulary' | 'Speaking' | 'Listening' | 'Writing' | 'Reading' | 'IELTS' | 'TOEFL' | 'General',
    difficulty: 'Medium' as 'Easy' | 'Medium' | 'Hard',
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedAudio, setSelectedAudio] = useState<File | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image size must be less than 5MB');
        return;
      }
      
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleAudioSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('Audio size must be less than 10MB');
        return;
      }
      
      setSelectedAudio(file);
      const reader = new FileReader();
      reader.onload = (e) => setAudioPreview(e.target?.result as string);
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const removeAudio = () => {
    setSelectedAudio(null);
    setAudioPreview(null);
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
      console.log('Selected image:', selectedImage?.name);
      console.log('Selected audio:', selectedAudio?.name);
      console.log('Cloudinary uploaded files:', uploadedFiles);
      console.log('API URL:', import.meta.env.VITE_API_URL);

      let imageUrl = '';
      let audioUrl = '';
      
      // Upload image if selected (traditional upload)
      if (selectedImage) {
        const formDataUpload = new FormData();
        formDataUpload.append('image', selectedImage);
        
        const uploadResponse = await fetch(`${import.meta.env.VITE_API_URL}/upload/image`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: formDataUpload,
        });
        
        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          imageUrl = uploadData.url;
        }
      }

      // Upload audio if selected (traditional upload)
      if (selectedAudio) {
        console.log('Uploading audio file:', selectedAudio.name);
        const formDataUpload = new FormData();
        formDataUpload.append('audio', selectedAudio);
        
        const uploadResponse = await fetch(`${import.meta.env.VITE_API_URL}/upload/audio`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: formDataUpload,
        });
        
        console.log('Audio upload response status:', uploadResponse.status);
        
        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          console.log('Audio upload successful:', uploadData);
          audioUrl = uploadData.url;
        } else {
          const errorData = await uploadResponse.text();
          console.error('Audio upload failed:', errorData);
        }
      }

      // Create post with attachments
      let contentWithMedia = formData.content;
      console.log('Original content:', contentWithMedia);
      
      // Add traditional uploads
      if (imageUrl) {
        contentWithMedia += `\n\n![Image](${imageUrl})`;
        console.log('Added image URL:', imageUrl);
      }
      if (audioUrl) {
        contentWithMedia += `\n\n🎵 [Audio Recording](${audioUrl})`;
        console.log('Added audio URL:', audioUrl);
      }

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
      });

      console.log('Post created successfully');
      navigate('/');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create post';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Post</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="What's your post about?"
            />
          </div>

          {/* Type and Category Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                Post Type
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.name} value={category.name}>{category.name}</option>
                ))}
              </select>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Share your knowledge, ask a question, or start a discussion..."
            />
          </div>

          {/* Media Upload Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Add Media</h3>
            
            {/* Cloudinary Upload Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Image Upload Widget */}
              <div>
                <button
                  type="button"
                  onClick={openImageWidget}
                  disabled={!isWidgetReady}
                  className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <div className="text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm font-medium text-gray-900">Upload Images</span>
                    <p className="text-xs text-gray-500 mt-1">JPG, PNG, GIF up to 5MB</p>
                  </div>
                </button>
              </div>

              {/* Audio Upload Widget */}
              <div>
                <button
                  type="button"
                  onClick={openAudioWidget}
                  disabled={!isWidgetReady}
                  className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <div className="text-center">
                    <Music className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm font-medium text-gray-900">Upload Audio</span>
                    <p className="text-xs text-gray-500 mt-1">MP3, WAV, M4A up to 10MB</p>
                  </div>
                </button>
              </div>

              {/* Video Upload Widget */}
              <div>
                <button
                  type="button"
                  onClick={openVideoWidget}
                  disabled={!isWidgetReady}
                  className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <div className="text-center">
                    <Video className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm font-medium text-gray-900">Upload Videos</span>
                    <p className="text-xs text-gray-500 mt-1">MP4, MOV, AVI up to 50MB</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Display Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-900">Uploaded Files ({uploadedFiles.length})</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {uploadedFiles.map((file) => (
                    <div key={file.publicId} className="relative border border-gray-300 rounded-lg p-4">
                      {file.resourceType === 'image' && (
                        <div>
                          <img
                            src={file.secureUrl}
                            alt={file.originalFilename}
                            className="w-full h-32 object-cover rounded-md mb-2"
                          />
                          <p className="text-sm font-medium text-gray-900 truncate">{file.originalFilename}</p>
                          <p className="text-xs text-gray-500">{(file.bytes / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      )}
                      
                      {(file.resourceType === 'video' || file.resourceType === 'audio') && (
                        <div>
                          {file.resourceType === 'video' ? (
                            <video
                              src={file.secureUrl}
                              controls
                              className="w-full h-32 rounded-md mb-2"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-32 bg-gray-100 rounded-md mb-2">
                              <Music className="h-12 w-12 text-gray-400" />
                            </div>
                          )}
                          
                          {file.resourceType === 'audio' && (
                            <audio controls className="w-full mb-2">
                              <source src={file.secureUrl} type={`audio/${file.format}`} />
                              Your browser does not support the audio element.
                            </audio>
                          )}
                          
                          <p className="text-sm font-medium text-gray-900 truncate">{file.originalFilename}</p>
                          <p className="text-xs text-gray-500">
                            {(file.bytes / 1024 / 1024).toFixed(2)} MB
                            {file.duration && ` • ${Math.round(file.duration)}s`}
                          </p>
                        </div>
                      )}
                      
                      <button
                        type="button"
                        onClick={() => removeCloudinaryFile(file.publicId)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Traditional Upload Section (Fallback) */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Traditional Upload (Fallback)</h3>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Image (Optional)
              </label>
              
              {!imagePreview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <Camera className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          Upload an image
                        </span>
                        <span className="mt-1 block text-sm text-gray-500">
                          PNG, JPG, GIF up to 5MB
                        </span>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageSelect}
                          className="sr-only"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Audio Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Audio (Optional)
              </label>
              
              {!audioPreview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <Mic className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label htmlFor="audio-upload" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          Upload an audio file
                        </span>
                        <span className="mt-1 block text-sm text-gray-500">
                          MP3, WAV, M4A up to 10MB
                        </span>
                        <input
                          id="audio-upload"
                          type="file"
                          accept="audio/*"
                          onChange={handleAudioSelect}
                          className="sr-only"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative border border-gray-300 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <Mic className="h-8 w-8 text-primary-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Audio file uploaded</p>
                      <audio controls className="w-full mt-2">
                        <source src={audioPreview} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeAudio}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
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
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-700"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-primary-500 hover:text-primary-700"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Add a tag..."
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Add
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <div className="loading-spinner w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                <Send size={16} />
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
