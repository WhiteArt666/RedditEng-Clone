const mongoose = require('mongoose');
require('dotenv').config();

async function checkPosts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/englishreddit');
    console.log('Connected to MongoDB');
    
    const Post = require('./src/models/Post');
    const posts = await Post.find({ category: 'Listening' }).sort({ createdAt: -1 }).limit(3);
    
    console.log('Recent Listening posts:');
    posts.forEach((post, i) => {
      console.log(`\n--- Post ${i+1} ---`);
      console.log('Title:', post.title);
      console.log('Content:', post.content);
      console.log('Has audio URL?', post.content.includes('cloudinary'));
      console.log('Has .mp3?', post.content.includes('.mp3'));
    });
    
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
  }
}

checkPosts();
