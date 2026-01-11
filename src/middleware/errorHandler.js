const logger = require('../utils/logger');
const { sendError } = require('../utils/responseHandler');

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  logger.error(`Error: ${err.message}`, {
    stack: err.stack,
    url: req.url,
    method: req.method,
  });

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    return sendError(res, 'Validation Error', 400, errors);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    return sendError(res, 'Duplicate entry found', 400);
  }

  // Mongoose cast error
  if (err.name === 'CastError') {
    return sendError(res, 'Invalid ID format', 400);
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return sendError(res, message, statusCode);
};

module.exports = errorHandler;
