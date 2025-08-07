const mongoose = require('mongoose');
require('dotenv').config();

async function fixAudioPosts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/englishreddit');
    console.log('Connected to MongoDB');
    
    const Post = require('./src/models/Post');
    
    // Find posts with cloudinary audio URLs that aren't properly formatted
    const posts = await Post.find({
      content: { 
        $regex: 'cloudinary.*\\.(mp3|wav|m4a|ogg|aac)',
        $options: 'i'
      }
    });
    
    console.log(`Found ${posts.length} posts with audio URLs`);
    
    for (const post of posts) {
      console.log(`\nProcessing post: ${post.title}`);
      console.log('Original content:', post.content);
      
      // Extract audio URLs from content
      const audioUrlMatch = post.content.match(/(https:\/\/[^\s]+cloudinary[^\s]+\.(mp3|wav|m4a|ogg|aac))/i);
      if (audioUrlMatch) {
        const audioUrl = audioUrlMatch[1];
        console.log('Found audio URL:', audioUrl);
        
        // Check if already formatted
        if (!post.content.includes('🎵 [Audio Recording]')) {
          // Add proper audio markdown
          post.content += `\n\n🎵 [Audio Recording](${audioUrl})`;
          await post.save();
          console.log('Updated post content');
        } else {
          console.log('Post already properly formatted');
        }
      }
    }
    
    console.log('\nDone fixing posts');
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
  }
}

fixAudioPosts();
