const csv = require('csv-parser');
const XLSX = require('xlsx');
const fs = require('fs');
const logger = require('./logger');

/**
 * Parse CSV file
 */
const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        logger.info(`CSV parsed successfully. Total rows: ${results.length}`);
        resolve(results);
      })
      .on('error', (error) => {
        logger.error(`CSV parsing error: ${error.message}`);
        reject(error);
      });
  });
};

/**
 * Parse XLSX file
 */
const parseXLSX = (filePath) => {
  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    logger.info(`XLSX parsed successfully. Total rows: ${data.length}`);
    return data;
  } catch (error) {
    logger.error(`XLSX parsing error: ${error.message}`);
    throw error;
  }
};

/**
 * Parse file based on extension
 */
const parseFile = async (filePath) => {
  const extension = filePath.split('.').pop().toLowerCase();
  
  if (extension === 'csv') {
    return await parseCSV(filePath);
  } else if (extension === 'xlsx' || extension === 'xls') {
    return parseXLSX(filePath);
  } else {
    throw new Error('Unsupported file format. Only CSV and XLSX are supported.');
  }
};

module.exports = {
  parseCSV,
  parseXLSX,
  parseFile,
};
