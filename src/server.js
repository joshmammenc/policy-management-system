require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const constants = require('./config/constants');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const uploadRoutes = require('./routes/uploadRoutes');
const policyRoutes = require('./routes/policyRoutes');
const messageRoutes = require('./routes/messageRoutes');

// Import jobs
const startCPUMonitoring = require('./jobs/cpuMonitorJob');
const startMessageScheduler = require('./jobs/messageScheduler');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Health check route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Policy Management System API',
    version: '1.0.0',
    endpoints: {
      upload: '/api/upload',
      policies: '/api/policies',
      messages: '/api/messages',
    },
  });
});

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/upload', uploadRoutes);
app.use('/api/policies', policyRoutes);
app.use('/api/messages', messageRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = constants.PORT;
const server = app.listen(PORT, () => {
  logger.info(`Server running in ${constants.NODE_ENV} mode on port ${PORT}`);
  
  // Start background jobs
  startCPUMonitoring();
  startMessageScheduler();
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  logger.error(err.stack);
  
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  logger.error(err.stack);
  
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

module.exports = app;
