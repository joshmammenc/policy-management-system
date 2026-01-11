const { Worker } = require('worker_threads');
const path = require('path');
const fs = require('fs');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const { parseFile } = require('../utils/csvParser');
const logger = require('../utils/logger');
const constants = require('../config/constants');

/**
 * Upload and process CSV/XLSX file using worker threads
 */
const uploadFile = async (req, res) => {
  let filePath = null;

  try {
    if (!req.file) {
      return sendError(res, 'No file uploaded', 400);
    }

    filePath = req.file.path;
    logger.info(`File uploaded: ${req.file.originalname}`);

    // Parse the file
    const data = await parseFile(filePath);

    if (!data || data.length === 0) {
      return sendError(res, 'No data found in file', 400);
    }

    logger.info(`Parsed ${data.length} rows from file`);

    // Create worker thread to process data
    const workerPath = path.join(__dirname, '../workers/csvWorker.js');
    
    const worker = new Worker(workerPath, {
      workerData: {
        data,
        mongoUri: constants.MONGODB_URI,
      },
    });

    let processingComplete = false;
    let result = null;

    // Handle messages from worker
    worker.on('message', (message) => {
      if (message.type === 'progress') {
        logger.info(`Worker progress: ${message.message} (${message.progress}%)`);
      } else if (message.type === 'complete') {
        logger.info('Worker completed successfully');
        processingComplete = true;
        result = message.result;
      } else if (message.type === 'error') {
        logger.error(`Worker error: ${message.message}`);
      }
    });

    // Handle worker errors
    worker.on('error', (error) => {
      logger.error(`Worker thread error: ${error.message}`);
      
      // Clean up file
      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      
      return sendError(res, 'Error processing file', 500);
    });

    // Handle worker exit
    worker.on('exit', (code) => {
      logger.info(`Worker exited with code ${code}`);
      
      // Clean up file
      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      if (code === 0 && processingComplete) {
        return sendSuccess(
          res,
          result,
          'File uploaded and processed successfully',
          200
        );
      } else if (!res.headersSent) {
        return sendError(res, 'Error processing file', 500);
      }
    });

  } catch (error) {
    logger.error(`Upload error: ${error.message}`);
    
    // Clean up file
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    return sendError(res, error.message, 500);
  }
};

/**
 * Get upload status
 */
const getUploadStatus = async (req, res) => {
  try {
    return sendSuccess(res, { status: 'ready' }, 'Upload service is ready');
  } catch (error) {
    logger.error(`Status error: ${error.message}`);
    return sendError(res, error.message, 500);
  }
};

module.exports = {
  uploadFile,
  getUploadStatus,
};
