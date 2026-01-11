const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema(
  {
    agent_name: {
      type: String,
      required: true,
      trim: true,
    },
    agency_id: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create index for faster queries
agentSchema.index({ agent_name: 1 });

module.exports = mongoose.model('Agent', agentSchema);
