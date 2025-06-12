// middlewares/validateSignup.js
import { body } from 'express-validator';

const validateSignup = [
  // Email validation
  body('email')
    .exists({ checkFalsy: true }).withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),

  // Password validation
  body('password')
    .exists({ checkFalsy: true }).withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/[a-z]/).withMessage('Must contain at least one lowercase letter')
    .matches(/[A-Z]/).withMessage('Must contain at least one uppercase letter')
    .matches(/\d/).withMessage('Must contain at least one number')
    .matches(/[^A-Za-z0-9]/).withMessage('Must contain at least one special character'),


  body('username')
    .exists({ checkFalsy: true }).withMessage('Username is required')
    .isLength({ max: 15 }).withMessage('Username must be at most 15 characters long')
    .matches(/^[A-Za-z][A-Za-z0-9_]*$/).withMessage(
      'Username must start with a letter and can contain only letters, numbers, and underscores (_)'
    )
    .not().matches(/-/).withMessage('Username must not contain hyphens (-)'),
];

export default validateSignup;
