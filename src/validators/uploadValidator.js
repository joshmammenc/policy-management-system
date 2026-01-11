const { body } = require('express-validator');

/**
 * Validation rules for file upload
 */
const uploadValidation = [
  body('file').custom((value, { req }) => {
    if (!req.file) {
      throw new Error('File is required');
    }
    
    const allowedTypes = ['.csv', '.xlsx', '.xls'];
    const fileExtension = req.file.originalname.substring(req.file.originalname.lastIndexOf('.')).toLowerCase();
    
    if (!allowedTypes.includes(fileExtension)) {
      throw new Error('Only CSV and XLSX files are allowed');
    }
    
    return true;
  }),
];

module.exports = {
  uploadValidation,
};
