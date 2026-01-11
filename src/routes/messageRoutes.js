const express = require('express');
const {
  createScheduledMessage,
  getAllMessages,
  getPendingMessages,
} = require('../controllers/messageController');
const { createMessageValidation } = require('../validators/messageValidator');
const validateRequest = require('../middleware/validateRequest');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

/**
 * @route   POST /api/messages/schedule
 * @desc    Create a scheduled message
 * @access  Public
 */
router.post(
  '/schedule',
  createMessageValidation,
  validateRequest,
  asyncHandler(createScheduledMessage)
);

/**
 * @route   GET /api/messages
 * @desc    Get all messages (with optional status filter)
 * @access  Public
 */
router.get('/', asyncHandler(getAllMessages));

/**
 * @route   GET /api/messages/pending
 * @desc    Get pending messages
 * @access  Public
 */
router.get('/pending', asyncHandler(getPendingMessages));

module.exports = router;
