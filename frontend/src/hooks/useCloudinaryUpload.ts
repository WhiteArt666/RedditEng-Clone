import { useState, useEffect, useCallback } from 'react';
import {
  createImageUploadWidget,
  createAudioUploadWidget,
  createVideoUploadWidget,
  loadCloudinaryWidget,
  isCloudinaryLoaded
} from '../services/cloudinaryService';
import type { CloudinaryUploadResult, CloudinaryWidget } from '../services/cloudinaryService';

export interface UploadedFile {
  url: string;
  secureUrl: string;
  publicId: string;
  originalFilename: string;
  format: string;
  resourceType: string;
  bytes: number;
  width?: number;
  height?: number;
  duration?: number;
}

export const useCloudinaryUpload = () => {
  const [error, setError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isWidgetReady, setIsWidgetReady] = useState(false);

  useEffect(() => {
    const initializeWidget = async () => {
      try {
        if (!isCloudinaryLoaded()) {
          await loadCloudinaryWidget();
        }
        setIsWidgetReady(true);
      } catch (err) {
        setError('Failed to load Cloudinary widget');
        console.error('Cloudinary widget loading error:', err);
      }
    };

    initializeWidget();
  }, []);

  const handleUploadSuccess = useCallback((result: CloudinaryUploadResult) => {
    const uploadedFile: UploadedFile = {
      url: result.info.url,
      secureUrl: result.info.secure_url,
      publicId: result.info.public_id,
      originalFilename: result.info.original_filename,
      format: result.info.format,
      resourceType: result.info.resource_type,
      bytes: result.info.bytes,
      width: result.info.width,
      height: result.info.height,
      duration: result.info.duration
    };

    setUploadedFiles(prev => [...prev, uploadedFile]);
    setError(null);
  }, []);

  const handleUploadError = useCallback((error: Error) => {
    setError(error.message || 'Upload failed');
    console.error('Upload error:', error);
  }, []);

  const createImageWidget = useCallback((): CloudinaryWidget | null => {
    if (!isWidgetReady) return null;
    return createImageUploadWidget(handleUploadSuccess, handleUploadError);
  }, [isWidgetReady, handleUploadSuccess, handleUploadError]);

  const createAudioWidget = useCallback((): CloudinaryWidget | null => {
    if (!isWidgetReady) return null;
    return createAudioUploadWidget(handleUploadSuccess, handleUploadError);
  }, [isWidgetReady, handleUploadSuccess, handleUploadError]);

  const createVideoWidget = useCallback((): CloudinaryWidget | null => {
    if (!isWidgetReady) return null;
    return createVideoUploadWidget(handleUploadSuccess, handleUploadError);
  }, [isWidgetReady, handleUploadSuccess, handleUploadError]);

  const removeFile = useCallback((publicId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.publicId !== publicId));
  }, []);

  const clearFiles = useCallback(() => {
    setUploadedFiles([]);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    uploadedFiles,
    isWidgetReady,
    createImageWidget,
    createAudioWidget,
    createVideoWidget,
    removeFile,
    clearFiles,
    clearError
  };
};
