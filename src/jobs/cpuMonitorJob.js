const cron = require('node-cron');
const cpuMonitor = require('../utils/cpuMonitor');
const constants = require('../config/constants');
const logger = require('../utils/logger');

/**
 * Start CPU monitoring job
 * Runs every 10 seconds to check CPU usage
 */
const startCPUMonitoring = () => {
  logger.info('Starting CPU monitoring job...');
  
  // Run every 10 seconds
  cron.schedule('*/10 * * * * *', async () => {
    try {
      await cpuMonitor.checkAndRestart(constants.CPU_THRESHOLD);
    } catch (error) {
      logger.error(`CPU monitoring job error: ${error.message}`);
    }
  });

  logger.info(`CPU monitoring started. Threshold: ${constants.CPU_THRESHOLD}%`);
};

module.exports = startCPUMonitoring;
