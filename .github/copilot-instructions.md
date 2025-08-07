<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# EnglishReddit - Copilot Instructions

This is a fullstack Reddit-style English learning community platform with the following architecture:

## Tech Stack
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + React Router + TanStack Query
- **Backend**: Node.js + Express + TypeScript + MongoDB + Mongoose + JWT
- **Styling**: Tailwind CSS with custom components
- **State Management**: React Context for auth, TanStack Query for server state

## Code Style Guidelines

### TypeScript
- Use strict TypeScript with proper typing
- Prefer interfaces over types for object shapes
- Use type imports for type-only imports
- Avoid `any` type, use proper typing or `unknown`

### React
- Use functional components with hooks
- Prefer composition over inheritance
- Use React.FC for component types
- Implement proper error boundaries

### Backend
- Use async/await instead of callbacks
- Implement proper error handling with try-catch
- Use middleware for authentication and validation
- Follow RESTful API conventions

### Database
- Use Mongoose models with proper schemas
- Implement proper indexing for performance
- Use aggregation pipelines for complex queries
- Follow MongoDB naming conventions

## Project Structure

### Frontend (`/frontend/src/`)
- `components/` - Reusable UI components
- `pages/` - Route components
- `context/` - React context providers
- `services/` - API calls and external services
- `types/` - TypeScript type definitions
- `hooks/` - Custom React hooks
- `utils/` - Utility functions

### Backend (`/backend/src/`)
- `controllers/` - Route handlers
- `models/` - Mongoose schemas and models
- `routes/` - Express route definitions
- `middleware/` - Custom middleware functions
- `services/` - Business logic and external APIs
- `config/` - Configuration files
- `utils/` - Utility functions

## Key Features to Remember

1. **English Learning Focus**: All content is education-related
2. **Community-driven**: Reddit-style voting and commenting
3. **Skill Levels**: Beginner, Intermediate, Advanced, Native
4. **Categories**: Grammar, Vocabulary, Speaking, Listening, Writing, Reading, IELTS, TOEFL, General
5. **Content Types**: Text, Flashcards, Grammar questions, Vocabulary, Pronunciation tips
6. **Difficulty Levels**: Easy, Medium, Hard

## Authentication & Security
- JWT-based authentication
- Password hashing with bcrypt
- Input validation with express-validator
- Security headers with helmet
- CORS configuration

## API Patterns
- RESTful endpoints
- Consistent error responses
- Pagination for list endpoints
- Search and filtering capabilities
- Vote system for posts and comments

When writing code for this project, ensure:
- Follow the established patterns and conventions
- Maintain type safety throughout
- Implement proper error handling
- Use the existing component and utility patterns
- Focus on English learning use cases
- Maintain responsive design with Tailwind CSS
