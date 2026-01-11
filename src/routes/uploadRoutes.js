const express = require('express');
const multer = require('multer');
const path = require('path');
const { uploadFile, getUploadStatus } = require('../controllers/uploadController');
const asyncHandler = require('../middleware/asyncHandler');
const constants = require('../config/constants');

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, constants.UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: constants.MAX_FILE_SIZE,
  },
  fileFilter: (req, file, cb) => {
    const allowedExtensions = ['.csv', '.xlsx', '.xls'];
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV and XLSX files are allowed'));
    }
  },
});

/**
 * @route   POST /api/upload
 * @desc    Upload and process CSV/XLSX file
 * @access  Public
 */
router.post('/', upload.single('file'), asyncHandler(uploadFile));

/**
 * @route   GET /api/upload/status
 * @desc    Get upload service status
 * @access  Public
 */
router.get('/status', asyncHandler(getUploadStatus));

module.exports = router;
