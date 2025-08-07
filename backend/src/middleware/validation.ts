import { body } from 'express-validator';

// Auth validation
export const registerValidation = [
  body('username')
    .isLength({ min: 3, max: 20 })
    .withMessage('Username must be between 3 and 20 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
    
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
    
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
    
  body('englishLevel')
    .optional()
    .isIn(['Beginner', 'Intermediate', 'Advanced', 'Native'])
    .withMessage('Invalid English level'),
    
  body('bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters')
];

export const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
    
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Post validation
export const createPostValidation = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 300 })
    .withMessage('Title must be between 5 and 300 characters'),
    
  body('content')
    .trim()
    .isLength({ min: 1, max: 10000 })
    .withMessage('Content must be between 1 and 10,000 characters'),
    
  body('category')
    .isIn(['Grammar', 'Vocabulary', 'Speaking', 'Listening', 'Writing', 'Reading', 'IELTS', 'TOEFL', 'General'])
    .withMessage('Invalid category'),
    
  body('type')
    .optional()
    .isIn(['text', 'flashcard', 'grammar', 'vocabulary', 'pronunciation', 'question'])
    .withMessage('Invalid post type'),
    
  body('difficulty')
    .optional()
    .isIn(['Easy', 'Medium', 'Hard'])
    .withMessage('Invalid difficulty level'),
    
  body('tags')
    .optional()
    .isArray({ max: 10 })
    .withMessage('Maximum 10 tags allowed'),
    
  body('tags.*')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Each tag must be between 1 and 50 characters')
];

export const updatePostValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 300 })
    .withMessage('Title must be between 5 and 300 characters'),
    
  body('content')
    .optional()
    .trim()
    .isLength({ min: 10, max: 10000 })
    .withMessage('Content must be between 10 and 10,000 characters'),
    
  body('category')
    .optional()
    .isIn(['Grammar', 'Vocabulary', 'Speaking', 'Listening', 'Writing', 'Reading', 'IELTS', 'TOEFL', 'General'])
    .withMessage('Invalid category'),
    
  body('difficulty')
    .optional()
    .isIn(['Easy', 'Medium', 'Hard'])
    .withMessage('Invalid difficulty level'),
    
  body('tags')
    .optional()
    .isArray({ max: 10 })
    .withMessage('Maximum 10 tags allowed'),
    
  body('tags.*')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Each tag must be between 1 and 50 characters')
];

export const voteValidation = [
  body('voteType')
    .isIn(['up', 'down', 'none'])
    .withMessage('Vote type must be up, down, or none')
];

// Comment validation
export const createCommentValidation = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 5000 })
    .withMessage('Comment must be between 1 and 5,000 characters'),
    
  body('postId')
    .isMongoId()
    .withMessage('Invalid post ID'),
    
  body('parentId')
    .optional()
    .isMongoId()
    .withMessage('Invalid parent comment ID')
];

export const updateCommentValidation = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 5000 })
    .withMessage('Comment must be between 1 and 5,000 characters')
];
