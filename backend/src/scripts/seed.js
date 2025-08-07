const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected');

    // Clear data
    await mongoose.connection.db.collection('users').deleteMany({});
    await mongoose.connection.db.collection('posts').deleteMany({});

    // Create user
    const hashedPassword = await bcrypt.hash('123456', 12);
    const userResult = await mongoose.connection.db.collection('users').insertOne({
      username: 'testuser',
      email: 'test@test.com',
      password: hashedPassword,
      skillLevel: 'intermediate',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Create posts for each category
    const posts = [
      {
        title: 'Grammar Test Post',
        content: 'This is a grammar test post',
        author: userResult.insertedId,
        category: 'Grammar',
        difficulty: 'Easy',
        type: 'text',
        upvotes: [],
        downvotes: [],
        score: 0,
        commentCount: 0,
        tags: ['test'],
        isAiGenerated: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Vocabulary Test Post',
        content: 'This is a vocabulary test post',
        author: userResult.insertedId,
        category: 'Vocabulary',
        difficulty: 'Medium',
        type: 'text',
        upvotes: [],
        downvotes: [],
        score: 0,
        commentCount: 0,
        tags: ['test'],
        isAiGenerated: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Speaking Test Post',
        content: 'This is a speaking test post',
        author: userResult.insertedId,
        category: 'Speaking',
        difficulty: 'Hard',
        type: 'text',
        upvotes: [],
        downvotes: [],
        score: 0,
        commentCount: 0,
        tags: ['test'],
        isAiGenerated: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await mongoose.connection.db.collection('posts').insertMany(posts);
    console.log('✅ Seed data created! 3 posts for Grammar, Vocabulary, Speaking');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seedData();
