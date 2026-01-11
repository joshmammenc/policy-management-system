const { body } = require('express-validator');

/**
 * Validation rules for scheduled message
 */
const createMessageValidation = [
  body('message')
    .notEmpty()
    .withMessage('Message is required')
    .isString()
    .withMessage('Message must be a string')
    .trim(),
  
  body('day')
    .notEmpty()
    .withMessage('Day is required')
    .isISO8601()
    .withMessage('Day must be a valid date (YYYY-MM-DD)'),
  
  body('time')
    .notEmpty()
    .withMessage('Time is required')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Time must be in HH:MM format (e.g., 14:30)'),
];

module.exports = {
  createMessageValidation,
};
