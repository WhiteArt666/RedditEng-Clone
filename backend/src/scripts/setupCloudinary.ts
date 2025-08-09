import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config/config';

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinaryCloudName,
  api_key: config.cloudinaryApiKey,
  api_secret: config.cloudinaryApiSecret,
});

async function createUploadPresets() {
  try {
    console.log('Creating Cloudinary upload presets...');
    
    // Create preset for images
    const imagePreset = await cloudinary.api.create_upload_preset({
      name: 'reddit_clone_images',
      unsigned: true,
      folder: 'reddit-clone/images',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'],
      max_file_size: 5000000, // 5MB
      max_image_width: 2000,
      max_image_height: 2000,
      quality: 'auto',
      fetch_format: 'auto',
      transformation: [
        { width: 1000, height: 1000, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });
    console.log('Image preset created:', imagePreset);

    // Create preset for audio
    const audioPreset = await cloudinary.api.create_upload_preset({
      name: 'reddit_clone_audio',
      unsigned: true,
      folder: 'reddit-clone/audio',
      resource_type: 'auto',
      allowed_formats: ['mp3', 'wav', 'm4a', 'aac', 'ogg', 'flac'],
      max_file_size: 10000000, // 10MB
    });
    console.log('Audio preset created:', audioPreset);

    // Create preset for videos
    const videoPreset = await cloudinary.api.create_upload_preset({
      name: 'reddit_clone_videos',
      unsigned: true,
      folder: 'reddit-clone/videos',
      resource_type: 'video',
      allowed_formats: ['mp4', 'mov', 'avi', 'wmv', 'flv', 'webm', 'mkv'],
      max_file_size: 50000000, // 50MB
      video_codec: 'h264',
      quality: 'auto',
      transformation: [
        { width: 1280, height: 720, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });
    console.log('Video preset created:', videoPreset);

    console.log('All upload presets created successfully!');
    
  } catch (error: any) {
    if (error.http_code === 409) {
      console.log('Upload presets already exist, updating them...');
      
      try {
        // Update existing presets
        await cloudinary.api.update_upload_preset('reddit_clone_images', {
          unsigned: true,
          folder: 'reddit-clone/images',
          allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'],
          max_file_size: 5000000,
        });
        
        await cloudinary.api.update_upload_preset('reddit_clone_audio', {
          unsigned: true,
          folder: 'reddit-clone/audio',
          resource_type: 'auto',
          allowed_formats: ['mp3', 'wav', 'm4a', 'aac', 'ogg', 'flac'],
          max_file_size: 10000000,
        });
        
        await cloudinary.api.update_upload_preset('reddit_clone_videos', {
          unsigned: true,
          folder: 'reddit-clone/videos',
          resource_type: 'video',
          allowed_formats: ['mp4', 'mov', 'avi', 'wmv', 'flv', 'webm', 'mkv'],
          max_file_size: 50000000,
        });
        
        console.log('Upload presets updated successfully!');
      } catch (updateError) {
        console.error('Error updating presets:', updateError);
      }
    } else {
      console.error('Error creating upload presets:', error);
    }
  }
}

// Run the function
createUploadPresets().then(() => {
  console.log('Setup complete!');
  process.exit(0);
}).catch((error) => {
  console.error('Setup failed:', error);
  process.exit(1);
});
