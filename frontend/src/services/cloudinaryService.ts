// Cloudinary upload widget service
export interface CloudinaryEagerTransformation {
  transformation: string;
  width: number;
  height: number;
  bytes: number;
  format: string;
  url: string;
  secure_url: string;
}

export interface CloudinaryUploadResult {
  event: string;
  info: {
    public_id: string;
    version: number;
    signature: string;
    width: number;
    height: number;
    format: string;
    resource_type: string;
    created_at: string;
    tags: string[];
    bytes: number;
    type: string;
    etag: string;
    placeholder: boolean;
    url: string;
    secure_url: string;
    access_mode: string;
    original_filename: string;
    eager: CloudinaryEagerTransformation[];
    audio?: {
      codec: string;
      bit_rate: string;
      frequency: number;
      channels: number;
      channel_layout: string;
    };
    video?: {
      pix_format: string;
      codec: string;
      level: number;
      profile: string;
      bit_rate: string;
      dar: string;
      time_base: string;
    };
    duration?: number;
  };
}

export interface CloudinaryWidgetOptions {
  cloudName?: string;
  uploadPreset?: string;
  sources?: string[];
  multiple?: boolean;
  cropping?: boolean;
  folder?: string;
  resourceType?: string;
  clientAllowedFormats?: string[];
  maxFileSize?: number;
  maxImageWidth?: number;
  maxImageHeight?: number;
  theme?: string;
  styles?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface CloudinaryWidget {
  open: () => void;
  close: () => void;
  update: (options: CloudinaryWidgetOptions) => void;
  destroy: () => void;
}

declare global {
  interface Window {
    cloudinary?: {
      createUploadWidget: (
        options: CloudinaryWidgetOptions,
        callback: (error: Error | null, result: CloudinaryUploadResult) => void
      ) => CloudinaryWidget;
    };
  }
}

// Get Cloudinary config from environment variables
const getCloudinaryConfig = () => {
  return {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dyng1ozm0',
    imageUploadPreset: 'reddit_clone_images',
    audioUploadPreset: 'reddit_clone_audio',
    videoUploadPreset: 'reddit_clone_videos'
  };
};

// Create upload widget for images
export const createImageUploadWidget = (
  onSuccess: (result: CloudinaryUploadResult) => void,
  onError?: (error: Error) => void
): CloudinaryWidget | null => {
  if (typeof window === 'undefined' || !window.cloudinary) {
    console.error('Cloudinary widget not loaded');
    return null;
  }

  const config = getCloudinaryConfig();
  
  return window.cloudinary.createUploadWidget(
    {
      cloudName: config.cloudName,
      uploadPreset: config.imageUploadPreset,
      sources: ['local', 'url', 'camera'],
      multiple: false,
      cropping: true,
      croppingAspectRatio: null,
      croppingDefaultSelectionRatio: 1,
      croppingShowBackButton: true,
      croppingCoordinatesMode: 'custom',
      folder: 'reddit-clone/images',
      resourceType: 'image',
      clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'],
      maxFileSize: 5000000, // 5MB
      maxImageWidth: 2000,
      maxImageHeight: 2000,
      theme: 'minimal',
      styles: {
        palette: {
          window: '#FFFFFF',
          sourceBg: '#F4F4F5',
          windowBorder: '#90A0B0',
          tabIcon: '#0078FF',
          inactiveTabIcon: '#69778A',
          menuIcons: '#0078FF',
          link: '#0078FF',
          action: '#FF620C',
          inProgress: '#0078FF',
          complete: '#20B832',
          error: '#EA2727',
          textDark: '#000000',
          textLight: '#FFFFFF'
        }
      }
    },
    (error: Error | null, result: CloudinaryUploadResult) => {
      if (!error && result && result.event === 'success') {
        onSuccess(result);
      } else if (error && onError) {
        onError(error);
      }
    }
  );
};

// Create upload widget for audio files
export const createAudioUploadWidget = (
  onSuccess: (result: CloudinaryUploadResult) => void,
  onError?: (error: Error) => void
): CloudinaryWidget | null => {
  if (typeof window === 'undefined' || !window.cloudinary) {
    console.error('Cloudinary widget not loaded');
    return null;
  }

  const config = getCloudinaryConfig();
  
  return window.cloudinary.createUploadWidget(
    {
      cloudName: config.cloudName,
      uploadPreset: config.audioUploadPreset,
      sources: ['local', 'url'],
      multiple: false,
      folder: 'reddit-clone/audio',
      resourceType: 'auto',
      clientAllowedFormats: ['mp3', 'wav', 'm4a', 'aac', 'ogg', 'flac'],
      maxFileSize: 10000000, // 10MB
      theme: 'minimal',
      styles: {
        palette: {
          window: '#FFFFFF',
          sourceBg: '#F4F4F5',
          windowBorder: '#90A0B0',
          tabIcon: '#0078FF',
          inactiveTabIcon: '#69778A',
          menuIcons: '#0078FF',
          link: '#0078FF',
          action: '#FF620C',
          inProgress: '#0078FF',
          complete: '#20B832',
          error: '#EA2727',
          textDark: '#000000',
          textLight: '#FFFFFF'
        }
      }
    },
    (error: Error | null, result: CloudinaryUploadResult) => {
      if (!error && result && result.event === 'success') {
        onSuccess(result);
      } else if (error && onError) {
        onError(error);
      }
    }
  );
};

// Create upload widget for video files
export const createVideoUploadWidget = (
  onSuccess: (result: CloudinaryUploadResult) => void,
  onError?: (error: Error) => void
): CloudinaryWidget | null => {
  if (typeof window === 'undefined' || !window.cloudinary) {
    console.error('Cloudinary widget not loaded');
    return null;
  }

  const config = getCloudinaryConfig();
  
  return window.cloudinary.createUploadWidget(
    {
      cloudName: config.cloudName,
      uploadPreset: config.videoUploadPreset,
      sources: ['local', 'url', 'camera'],
      multiple: false,
      folder: 'reddit-clone/videos',
      resourceType: 'video',
      clientAllowedFormats: ['mp4', 'mov', 'avi', 'wmv', 'flv', 'webm', 'mkv'],
      maxFileSize: 50000000, // 50MB
      theme: 'minimal',
      styles: {
        palette: {
          window: '#FFFFFF',
          sourceBg: '#F4F4F5',
          windowBorder: '#90A0B0',
          tabIcon: '#0078FF',
          inactiveTabIcon: '#69778A',
          menuIcons: '#0078FF',
          link: '#0078FF',
          action: '#FF620C',
          inProgress: '#0078FF',
          complete: '#20B832',
          error: '#EA2727',
          textDark: '#000000',
          textLight: '#FFFFFF'
        }
      }
    },
    (error: Error | null, result: CloudinaryUploadResult) => {
      if (!error && result && result.event === 'success') {
        onSuccess(result);
      } else if (error && onError) {
        onError(error);
      }
    }
  );
};

// Utility function to check if Cloudinary widget is loaded
export const isCloudinaryLoaded = (): boolean => {
  return typeof window !== 'undefined' && !!window.cloudinary;
};

// Load Cloudinary widget script dynamically
export const loadCloudinaryWidget = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (isCloudinaryLoaded()) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://upload-widget.cloudinary.com/latest/global/all.js';
    script.type = 'text/javascript';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Cloudinary widget'));
    document.head.appendChild(script);
  });
};
