"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCommentValidation = exports.createCommentValidation = exports.voteValidation = exports.updatePostValidation = exports.createPostValidation = exports.loginValidation = exports.registerValidation = void 0;
const express_validator_1 = require("express-validator");
// Auth validation
exports.registerValidation = [
    (0, express_validator_1.body)('username')
        .isLength({ min: 3, max: 20 })
        .withMessage('Username must be between 3 and 20 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    (0, express_validator_1.body)('englishLevel')
        .optional()
        .isIn(['Beginner', 'Intermediate', 'Advanced', 'Native'])
        .withMessage('Invalid English level'),
    (0, express_validator_1.body)('bio')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Bio cannot exceed 500 characters')
];
exports.loginValidation = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('Password is required')
];
// Post validation
exports.createPostValidation = [
    (0, express_validator_1.body)('title')
        .trim()
        .isLength({ min: 5, max: 300 })
        .withMessage('Title must be between 5 and 300 characters'),
    (0, express_validator_1.body)('content')
        .trim()
        .isLength({ min: 1, max: 10000 })
        .withMessage('Content must be between 1 and 10,000 characters'),
    (0, express_validator_1.body)('category')
        .isIn(['Grammar', 'Vocabulary', 'Speaking', 'Listening', 'Writing', 'Reading', 'IELTS', 'TOEFL', 'General'])
        .withMessage('Invalid category'),
    (0, express_validator_1.body)('type')
        .optional()
        .isIn(['text', 'flashcard', 'grammar', 'vocabulary', 'pronunciation', 'question'])
        .withMessage('Invalid post type'),
    (0, express_validator_1.body)('difficulty')
        .optional()
        .isIn(['Easy', 'Medium', 'Hard'])
        .withMessage('Invalid difficulty level'),
    (0, express_validator_1.body)('tags')
        .optional()
        .isArray({ max: 10 })
        .withMessage('Maximum 10 tags allowed'),
    (0, express_validator_1.body)('tags.*')
        .optional()
        .isLength({ min: 1, max: 50 })
        .withMessage('Each tag must be between 1 and 50 characters')
];
exports.updatePostValidation = [
    (0, express_validator_1.body)('title')
        .optional()
        .trim()
        .isLength({ min: 5, max: 300 })
        .withMessage('Title must be between 5 and 300 characters'),
    (0, express_validator_1.body)('content')
        .optional()
        .trim()
        .isLength({ min: 10, max: 10000 })
        .withMessage('Content must be between 10 and 10,000 characters'),
    (0, express_validator_1.body)('category')
        .optional()
        .isIn(['Grammar', 'Vocabulary', 'Speaking', 'Listening', 'Writing', 'Reading', 'IELTS', 'TOEFL', 'General'])
        .withMessage('Invalid category'),
    (0, express_validator_1.body)('difficulty')
        .optional()
        .isIn(['Easy', 'Medium', 'Hard'])
        .withMessage('Invalid difficulty level'),
    (0, express_validator_1.body)('tags')
        .optional()
        .isArray({ max: 10 })
        .withMessage('Maximum 10 tags allowed'),
    (0, express_validator_1.body)('tags.*')
        .optional()
        .isLength({ min: 1, max: 50 })
        .withMessage('Each tag must be between 1 and 50 characters')
];
exports.voteValidation = [
    (0, express_validator_1.body)('voteType')
        .isIn(['up', 'down', 'none'])
        .withMessage('Vote type must be up, down, or none')
];
// Comment validation
exports.createCommentValidation = [
    (0, express_validator_1.body)('content')
        .trim()
        .isLength({ min: 1, max: 5000 })
        .withMessage('Comment must be between 1 and 5,000 characters'),
    (0, express_validator_1.body)('postId')
        .isMongoId()
        .withMessage('Invalid post ID'),
    (0, express_validator_1.body)('parentId')
        .optional()
        .isMongoId()
        .withMessage('Invalid parent comment ID')
];
exports.updateCommentValidation = [
    (0, express_validator_1.body)('content')
        .trim()
        .isLength({ min: 1, max: 5000 })
        .withMessage('Comment must be between 1 and 5,000 characters')
];
//# sourceMappingURL=validation.js.map