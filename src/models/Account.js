const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema(
  {
    account_name: {
      type: String,
      required: true,
      trim: true,
    },
    account_type: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create index for faster queries
accountSchema.index({ account_name: 1 });

module.exports = mongoose.model('Account', accountSchema);
