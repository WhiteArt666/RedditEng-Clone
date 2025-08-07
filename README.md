# 🎓 EnglishReddit - English Learning Community Platform

A Reddit-style community platform specifically designed for English language learners, built with modern web technologies.

## 🌟 Features

### Core Features
- **User Authentication**: Register, login, profile management with JWT
- **Community Posts**: Create, read, update, delete posts with voting system
- **Categories**: Grammar, Vocabulary, Speaking, Listening, Writing, Reading, IELTS, TOEFL, General
- **Difficulty Levels**: Easy, Medium, Hard content filtering
- **Comments System**: Nested comments with voting
- **Real-time Interaction**: Upvote/downvote posts and comments

### English Learning Specific
- **Post Types**: Text, Flashcards, Grammar questions, Vocabulary, Pronunciation tips
- **User Levels**: Beginner, Intermediate, Advanced, Native speaker tags
- **AI Integration**: Grammar checking and suggestions (planned)
- **Tags System**: Topic-based content organization
- **Karma System**: Community reputation based on contributions

### Technical Features
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **TypeScript**: Full type safety across frontend and backend
- **RESTful API**: Well-structured backend with proper error handling
- **Data Validation**: Input validation and sanitization
- **Security**: JWT authentication, helmet security headers, CORS

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **React Router** for routing
- **TanStack Query** for server state management
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Axios** for API calls

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Express Validator** for input validation
- **Bcrypt** for password hashing
- **Helmet** for security headers
- **CORS** for cross-origin requests

## 📁 Project Structure

```
Reddit-Clone/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   ├── package.json
│   ├── tailwind.config.js
│   └── .env.example
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- Git

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/english-reddit
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env`:
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

### Database Setup

1. **Install MongoDB** locally or use MongoDB Atlas (cloud)
2. **Create a database** named `english-reddit`
3. **Update connection string** in backend `.env` file

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Posts
- `GET /api/posts` - Get all posts (with pagination/filtering)
- `POST /api/posts` - Create new post (protected)
- `GET /api/posts/:id` - Get single post
- `PUT /api/posts/:id` - Update post (protected)
- `DELETE /api/posts/:id` - Delete post (protected)
- `POST /api/posts/:id/vote` - Vote on post (protected)
- `GET /api/posts/search` - Search posts

### Comments
- `POST /api/comments` - Create comment (protected)
- `GET /api/comments/post/:postId` - Get post comments
- `PUT /api/comments/:id` - Update comment (protected)
- `DELETE /api/comments/:id` - Delete comment (protected)
- `POST /api/comments/:id/vote` - Vote on comment (protected)

## 📱 Usage

1. **Register/Login**: Create an account or sign in
2. **Browse Posts**: Explore posts by category, difficulty, or popularity
3. **Create Content**: Share learning materials, questions, or tips
4. **Engage**: Vote on helpful content and leave comments
5. **Learn**: Use the community to improve your English skills

## 🎯 Features for Learners

### Content Categories
- **Grammar**: Explanations, exercises, common mistakes
- **Vocabulary**: New words, usage examples, memory techniques
- **Speaking**: Pronunciation tips, conversation practice
- **Listening**: Audio resources, comprehension exercises
- **Writing**: Essay tips, grammar in context, peer review
- **Reading**: Comprehension strategies, text analysis
- **IELTS/TOEFL**: Test preparation, practice questions

### Difficulty Levels
- **Easy**: Beginner-friendly content
- **Medium**: Intermediate level materials
- **Hard**: Advanced concepts and challenges

### Community Features
- **Voting System**: Identify high-quality content
- **Karma Points**: Build reputation through helpful contributions
- **User Levels**: See community members' English proficiency
- **Tags**: Find specific topics easily

## 🔮 Future Enhancements

- **AI Integration**: Grammar checking, content suggestions
- **File Uploads**: Audio recordings, images via Cloudinary
- **Real-time Chat**: Study groups and language exchange
- **Progress Tracking**: Personal learning analytics
- **Mobile App**: React Native version
- **Gamification**: Badges, streaks, learning challenges
- **Teacher Tools**: Special features for educators

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👥 Community

Join our English learning community and help others improve their language skills!

- **Post Questions**: Get help with grammar, vocabulary, or pronunciation
- **Share Resources**: Upload useful learning materials
- **Give Feedback**: Help others by reviewing their content
- **Stay Active**: Regular participation builds a stronger community

---

**Happy Learning! 🎓✨**
