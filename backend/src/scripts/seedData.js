import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Import models
import User from '../models/User.js';
import Post from '../models/Post.js';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});
    console.log('Cleared existing data');

    // Create demo users
    const hashedPassword = await bcrypt.hash('123456', 12);
    
    const users = await User.create([
      {
        username: 'teacher_anna',
        email: 'anna@example.com',
        password: hashedPassword,
        skillLevel: 'native',
        bio: 'English teacher with 10 years experience'
      },
      {
        username: 'student_john',
        email: 'john@example.com',
        password: hashedPassword,
        skillLevel: 'intermediate',
        bio: 'Learning English for work'
      },
      {
        username: 'learner_mai',
        email: 'mai@example.com',
        password: hashedPassword,
        skillLevel: 'beginner',
        bio: 'Just started learning English'
      },
      {
        username: 'advanced_tom',
        email: 'tom@example.com',
        password: hashedPassword,
        skillLevel: 'advanced',
        bio: 'Preparing for IELTS exam'
      }
    ]);

    console.log('Created demo users');

    // Create demo posts for each category
    const posts = await Post.create([
      // Grammar posts
      {
        title: 'Present Perfect vs Past Simple - When to Use Which?',
        content: 'Many students struggle with when to use present perfect versus past simple. Here\'s a comprehensive guide:\n\n**Present Perfect:**\n- Actions that happened at an unspecified time in the past\n- Experience: "I have been to Japan"\n- Recent actions: "I have just finished my homework"\n\n**Past Simple:**\n- Actions at a specific time in the past\n- "I went to Japan last year"\n- "I finished my homework yesterday"',
        author: users[0]._id,
        category: 'grammar',
        difficulty: 'medium',
        contentType: 'text',
        tags: ['present-perfect', 'past-simple', 'tenses']
      },
      {
        title: 'Common Grammar Mistakes to Avoid',
        content: 'Here are the most common grammar mistakes I see from my students:\n\n1. **Subject-Verb Agreement**: "He go to school" → "He goes to school"\n2. **Articles**: "I am student" → "I am a student"\n3. **Prepositions**: "I am good in English" → "I am good at English"\n\nPractice these daily!',
        author: users[0]._id,
        category: 'grammar',
        difficulty: 'easy',
        contentType: 'text',
        tags: ['common-mistakes', 'basics']
      },

      // Vocabulary posts
      {
        title: 'Business English Vocabulary - Essential Words',
        content: '**Essential Business Vocabulary:**\n\n📊 **Meetings**\n- Agenda - List of topics to discuss\n- Minutes - Written record of meeting\n- Deadline - Final date for completion\n\n💼 **Finance**\n- Revenue - Total income\n- Profit - Money gained after expenses\n- Budget - Financial plan\n\n🤝 **Networking**\n- Collaborate - Work together\n- Negotiate - Discuss to reach agreement\n- Implement - Put into action',
        author: users[1]._id,
        category: 'vocabulary',
        difficulty: 'hard',
        contentType: 'flashcards',
        tags: ['business', 'professional', 'workplace']
      },
      {
        title: 'Daily Life Vocabulary for Beginners',
        content: '**Home & Family**\n- Kitchen: fridge, stove, microwave\n- Living room: sofa, TV, table\n- Bedroom: bed, pillow, blanket\n\n**Food & Drinks**\n- Breakfast: cereal, toast, coffee\n- Lunch: sandwich, salad, soup\n- Dinner: rice, chicken, vegetables\n\n**Transportation**\n- Car, bus, train, bicycle, walk',
        author: users[2]._id,
        category: 'vocabulary',
        difficulty: 'easy',
        contentType: 'flashcards',
        tags: ['daily-life', 'beginner', 'basic-words']
      },

      // Speaking posts
      {
        title: 'How to Sound More Natural in English Conversations',
        content: '**Tips for Natural Speaking:**\n\n1. **Use Contractions**: "I am" → "I\'m", "Do not" → "Don\'t"\n2. **Filler Words**: "Um", "Well", "You know" (use sparingly)\n3. **Intonation**: Rising tone for questions, falling for statements\n4. **Linking Words**: Connect your ideas with "however", "moreover", "besides"\n\n**Practice Exercise:**\nRecord yourself having a 2-minute conversation about your day. Listen back and note areas for improvement.',
        author: users[3]._id,
        category: 'speaking',
        difficulty: 'medium',
        contentType: 'pronunciation',
        tags: ['conversation', 'natural-speech', 'intonation']
      },
      {
        title: 'Pronunciation: The TH Sound',
        content: '**Mastering the TH Sound 👅**\n\nMany non-native speakers struggle with "th". Here\'s how:\n\n**Voiceless TH [θ]:**\n- Think, thank, three\n- Put tongue between teeth, blow air\n\n**Voiced TH [ð]:**\n- This, that, they\n- Same position, but voice vibrates\n\n**Practice Words:**\n- Thin vs. Sin\n- Thank vs. Sank\n- The vs. De\n\n**Audio tip:** Record yourself saying these words and compare with native speakers!',
        author: users[0]._id,
        category: 'speaking',
        difficulty: 'easy',
        contentType: 'pronunciation',
        tags: ['pronunciation', 'th-sound', 'phonetics']
      },

      // Listening posts
      {
        title: 'Best Podcasts for English Learners',
        content: '🎧 **Recommended English Learning Podcasts:**\n\n**For Beginners:**\n- English Pod (short, structured lessons)\n- Voice of America Learning English\n- BBC Learning English\n\n**For Intermediate:**\n- This American Life\n- TED Talks Daily\n- The English We Speak (BBC)\n\n**For Advanced:**\n- Serial (investigative journalism)\n- Radiolab (science topics)\n- The Daily (news)\n\n**Listening Tips:**\n1. Start with transcripts\n2. Listen multiple times\n3. Focus on one podcast consistently',
        author: users[1]._id,
        category: 'listening',
        difficulty: 'medium',
        contentType: 'text',
        tags: ['podcasts', 'listening-practice', 'recommendations']
      },

      // Writing posts  
      {
        title: 'IELTS Writing Task 1: How to Describe Charts',
        content: '**IELTS Writing Task 1 - Chart Description:**\n\n**Structure:**\n1. **Introduction** - Paraphrase the question\n2. **Overview** - Main trends (2-3 sentences)\n3. **Body 1** - Key features\n4. **Body 2** - Supporting details\n\n**Useful Language:**\n📈 **Increase**: rise, grow, climb, surge\n📉 **Decrease**: fall, drop, decline, plummet\n➡️ **Stable**: remain steady, plateau, level off\n\n**Example Opening:**\n"The chart illustrates the changes in smartphone usage among teenagers between 2010 and 2020."',
        author: users[3]._id,
        category: 'writing',
        difficulty: 'hard',
        contentType: 'text',
        tags: ['ielts', 'writing-task-1', 'charts', 'academic']
      },

      // Reading posts
      {
        title: 'Speed Reading Techniques for English Learners',
        content: '**Improve Your Reading Speed 📖**\n\n**Techniques:**\n\n1. **Skimming** - Read for general idea\n   - Read first/last paragraphs\n   - Look at headings and subheadings\n   - Read first sentence of each paragraph\n\n2. **Scanning** - Look for specific information\n   - Use keywords\n   - Look for numbers, dates, names\n\n3. **Avoid Bad Habits:**\n   - Don\'t read word by word\n   - Don\'t move your lips\n   - Don\'t re-read constantly\n\n**Practice:** Read news articles for 10 minutes daily, focus on main ideas only.',
        author: users[1]._id,
        category: 'reading',
        difficulty: 'medium',
        contentType: 'text',
        tags: ['speed-reading', 'comprehension', 'techniques']
      },

      // IELTS posts
      {
        title: 'IELTS Speaking Band 7+ Strategies',
        content: '**IELTS Speaking: How to Get Band 7+**\n\n**Part 1 (Introduction):**\n- Give detailed answers (2-3 sentences)\n- Use present tense mostly\n- Add personal examples\n\n**Part 2 (Long Turn):**\n- Use all 2 minutes\n- Follow the cue card structure\n- Include past, present, future tenses\n\n**Part 3 (Discussion):**\n- Give opinions with reasons\n- Use complex grammar\n- Compare and contrast\n\n**Key Language:**\n- "From my perspective..."\n- "It depends on..."\n- "Generally speaking..."\n- "On the other hand..."',
        author: users[3]._id,
        category: 'ielts',
        difficulty: 'hard',
        contentType: 'text',
        tags: ['ielts-speaking', 'band-7', 'strategies', 'exam-prep']
      },

      // TOEFL posts
      {
        title: 'TOEFL Reading: Time Management Tips',
        content: '**TOEFL Reading Section - Beat the Clock! ⏰**\n\n**Time Allocation (54 minutes total):**\n- 3 passages × 18 minutes each\n- Quick preview: 1-2 minutes per passage\n- Reading: 10-12 minutes\n- Questions: 5-6 minutes\n\n**Strategy:**\n1. **Skim first** - Get main idea\n2. **Read questions** - Know what to look for\n3. **Scan for answers** - Don\'t re-read entire text\n4. **Guess smartly** - Eliminate wrong options\n\n**Question Types:**\n- Main idea (read introduction/conclusion)\n- Detail questions (scan for keywords)\n- Inference (read between the lines)',
        author: users[3]._id,
        category: 'toefl',
        difficulty: 'hard',
        contentType: 'text',
        tags: ['toefl-reading', 'time-management', 'strategy', 'exam-prep']
      },

      // General posts
      {
        title: 'How I Improved My English in 6 Months',
        content: '**My English Learning Journey 🌟**\n\nHi everyone! I want to share how I went from beginner to intermediate in just 6 months:\n\n**Month 1-2: Foundation**\n- Learned basic grammar (present/past tense)\n- Memorized 500 common words\n- Watched Disney movies with subtitles\n\n**Month 3-4: Building Confidence**\n- Started speaking with language exchange partner\n- Read simple news articles\n- Listened to beginner podcasts\n\n**Month 5-6: Acceleration**\n- Joined English conversation groups\n- Read novels (Harry Potter!)\n- Watched Netflix without subtitles\n\n**Key Tips:**\n✅ Consistency over intensity\n✅ Don\'t fear mistakes\n✅ Use English daily\n✅ Find topics you love',
        author: users[2]._id,
        category: 'general',
        difficulty: 'easy',
        contentType: 'text',
        tags: ['success-story', 'motivation', 'learning-journey', 'tips']
      }
    ]);

    console.log(`Created ${posts.length} demo posts`);

    // Add some votes to make it realistic
    for (let i = 0; i < posts.length; i++) {
      const randomVotes = Math.floor(Math.random() * 20) + 1;
      posts[i].votes = randomVotes;
      await posts[i].save();
    }

    console.log('Added random votes to posts');
    console.log('✅ Seed data created successfully!');
    
    console.log('\n📊 Summary:');
    console.log(`- Users created: ${users.length}`);
    console.log(`- Posts created: ${posts.length}`);
    console.log('- Categories: Grammar, Vocabulary, Speaking, Listening, Writing, Reading, IELTS, TOEFL, General');
    console.log('- Difficulties: Easy, Medium, Hard');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
};

seedData();
