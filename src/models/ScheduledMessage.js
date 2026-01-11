const mongoose = require('mongoose');

const scheduledMessageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    day: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    scheduled_at: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Create index for faster queries
scheduledMessageSchema.index({ scheduled_at: 1, status: 1 });

module.exports = mongoose.model('ScheduledMessage', scheduledMessageSchema);
