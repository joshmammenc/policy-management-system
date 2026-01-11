const cron = require('node-cron');
const messageService = require('../services/messageService');
const logger = require('../utils/logger');

/**
 * Start message scheduler job
 * Runs every minute to check and process pending messages
 */
const startMessageScheduler = () => {
  logger.info('Starting message scheduler job...');
  
  // Run every minute
  cron.schedule('* * * * *', async () => {
    try {
      const pendingMessages = await messageService.getPendingMessages();
      
      if (pendingMessages.length > 0) {
        logger.info(`Found ${pendingMessages.length} pending messages to process`);
        
        for (const message of pendingMessages) {
          try {
            // Log the message (in production, you would insert to DB or send notification)
            logger.info(`Processing scheduled message: ${message.message}`);
            logger.info(`Scheduled for: ${message.scheduled_at}`);
            
            // Here you can add your logic to insert the message to DB or perform any action
            // For now, we'll just mark it as completed
            
            await messageService.updateStatus(message._id, 'completed');
            logger.info(`Message ${message._id} marked as completed`);
          } catch (error) {
            logger.error(`Error processing message ${message._id}: ${error.message}`);
            await messageService.updateStatus(message._id, 'failed');
          }
        }
      }
    } catch (error) {
      logger.error(`Message scheduler job error: ${error.message}`);
    }
  });

  logger.info('Message scheduler started. Running every minute.');
};

module.exports = startMessageScheduler;
