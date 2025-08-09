const mongoose = require('mongoose');
require('dotenv').config();

async function checkRecentPost() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/englishreddit');
    console.log('Connected to MongoDB');
    
    const Post = require('./src/models/Post');
    const recentPost = await Post.findOne().sort({ createdAt: -1 });
    
    if (recentPost) {
      console.log('\n=== Most Recent Post ===');
      console.log('Title:', recentPost.title);
      console.log('Category:', recentPost.category);
      console.log('Content:');
      console.log(recentPost.content);
      console.log('\n=== Content Analysis ===');
      console.log('Has cloudinary?', recentPost.content.includes('cloudinary'));
      console.log('Has audio keyword?', recentPost.content.toLowerCase().includes('audio'));
      console.log('Has 🎵?', recentPost.content.includes('🎵'));
    } else {
      console.log('No posts found');
    }
    
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
  }
}

checkRecentPost();
