const ScheduledMessage = require('../models/ScheduledMessage');
const logger = require('../utils/logger');

class MessageService {
  /**
   * Create scheduled message
   */
  async create(messageData) {
    try {
      return await ScheduledMessage.create(messageData);
    } catch (error) {
      logger.error(`MessageService.create error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get pending messages for current time
   */
  async getPendingMessages() {
    try {
      const now = new Date();
      
      return await ScheduledMessage.find({
        scheduled_at: { $lte: now },
        status: 'pending',
      });
    } catch (error) {
      logger.error(`MessageService.getPendingMessages error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Update message status
   */
  async updateStatus(messageId, status) {
    try {
      return await ScheduledMessage.findByIdAndUpdate(
        messageId,
        { status },
        { new: true }
      );
    } catch (error) {
      logger.error(`MessageService.updateStatus error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get all messages
   */
  async getAll() {
    try {
      return await ScheduledMessage.find().sort({ scheduled_at: -1 });
    } catch (error) {
      logger.error(`MessageService.getAll error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get messages by status
   */
  async getByStatus(status) {
    try {
      return await ScheduledMessage.find({ status }).sort({ scheduled_at: -1 });
    } catch (error) {
      logger.error(`MessageService.getByStatus error: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new MessageService();
