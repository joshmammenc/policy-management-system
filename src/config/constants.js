module.exports = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/policy_management',
  CPU_THRESHOLD: parseInt(process.env.CPU_THRESHOLD) || 70,
  CPU_CHECK_INTERVAL: parseInt(process.env.CPU_CHECK_INTERVAL) || 10000,
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE) || 52428800, // 50MB
  UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  BATCH_SIZE: 1000, // For bulk operations
};
