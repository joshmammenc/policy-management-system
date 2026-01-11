const messageService = require('../services/messageService');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const logger = require('../utils/logger');

/**
 * Create a scheduled message
 */
const createScheduledMessage = async (req, res) => {
  try {
    const { message, day, time } = req.body;

    logger.info(`Creating scheduled message for ${day} at ${time}`);

    // Combine day and time to create scheduled_at datetime
    const [hours, minutes] = time.split(':');
    const scheduledDate = new Date(day);
    scheduledDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    // Check if scheduled time is in the future
    if (scheduledDate < new Date()) {
      return sendError(res, 'Scheduled time must be in the future', 400);
    }

    const messageData = {
      message,
      day: new Date(day),
      time,
      scheduled_at: scheduledDate,
      status: 'pending',
    };

    const createdMessage = await messageService.create(messageData);

    return sendSuccess(
      res,
      createdMessage,
      'Scheduled message created successfully',
      201
    );
  } catch (error) {
    logger.error(`Create scheduled message error: ${error.message}`);
    return sendError(res, error.message, 500);
  }
};

/**
 * Get all scheduled messages
 */
const getAllMessages = async (req, res) => {
  try {
    const { status } = req.query;

    logger.info(`Getting all messages${status ? ` with status: ${status}` : ''}`);

    let messages;
    if (status) {
      messages = await messageService.getByStatus(status);
    } else {
      messages = await messageService.getAll();
    }

    return sendSuccess(
      res,
      messages,
      `Retrieved ${messages.length} messages`,
      200
    );
  } catch (error) {
    logger.error(`Get all messages error: ${error.message}`);
    return sendError(res, error.message, 500);
  }
};

/**
 * Get pending messages
 */
const getPendingMessages = async (req, res) => {
  try {
    logger.info('Getting pending messages');

    const messages = await messageService.getPendingMessages();

    return sendSuccess(
      res,
      messages,
      `Retrieved ${messages.length} pending messages`,
      200
    );
  } catch (error) {
    logger.error(`Get pending messages error: ${error.message}`);
    return sendError(res, error.message, 500);
  }
};

module.exports = {
  createScheduledMessage,
  getAllMessages,
  getPendingMessages,
};
