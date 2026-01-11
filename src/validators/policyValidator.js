const { query, param } = require('express-validator');

/**
 * Validation rules for policy search
 */
const searchPolicyValidation = [
  query('username')
    .notEmpty()
    .withMessage('Username is required')
    .isString()
    .withMessage('Username must be a string')
    .trim(),
];

/**
 * Validation rules for policy ID
 */
const policyIdValidation = [
  param('id')
    .notEmpty()
    .withMessage('Policy ID is required')
    .isMongoId()
    .withMessage('Invalid policy ID format'),
];

module.exports = {
  searchPolicyValidation,
  policyIdValidation,
};
