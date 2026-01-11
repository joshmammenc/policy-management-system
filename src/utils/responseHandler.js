const logger = require('./logger');

/**
 * Send success response
 */
const sendSuccess = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Send error response
 */
const sendError = (res, message = 'Error', statusCode = 500, errors = null) => {
  logger.error(`Error Response: ${message}`, { errors });
  
  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
  });
};

module.exports = {
  sendSuccess,
  sendError,
};
