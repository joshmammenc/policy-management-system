const { validationResult } = require('express-validator');
const { sendError } = require('../utils/responseHandler');

/**
 * Validate request and return errors if any
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => err.msg);
    return sendError(res, 'Validation failed', 400, errorMessages);
  }
  
  next();
};

module.exports = validateRequest;
