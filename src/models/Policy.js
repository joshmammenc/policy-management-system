const mongoose = require('mongoose');

const policySchema = new mongoose.Schema(
  {
    policy_number: {
      type: String,
      required: true,
      trim: true,
    },
    policy_start_date: {
      type: Date,
      required: true,
    },
    policy_end_date: {
      type: Date,
      required: true,
    },
    policy_mode: {
      type: Number,
    },
    policy_type: {
      type: String,
      trim: true,
    },
    premium_amount: {
      type: Number,
      default: 0,
    },
    premium_amount_written: {
      type: Number,
    },
    producer: {
      type: String,
      trim: true,
    },
    csr: {
      type: String,
      trim: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    lob_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LOB',
      required: true,
    },
    carrier_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Carrier',
      required: true,
    },
    agent_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Agent',
      required: true,
    },
    account_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    hasActiveClientPolicy: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for faster queries
policySchema.index({ policy_number: 1 });
policySchema.index({ user_id: 1 });
policySchema.index({ agent_id: 1 });
policySchema.index({ policy_start_date: 1, policy_end_date: 1 });

module.exports = mongoose.model('Policy', policySchema);
