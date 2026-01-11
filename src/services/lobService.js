const LOB = require('../models/LOB');
const logger = require('../utils/logger');

class LOBService {
  /**
   * Create or find LOB
   */
  async createOrFind(lobData) {
    try {
      const lob = await LOB.findOne({ category_name: lobData.category_name });
      
      if (lob) {
        return lob;
      }
      
      return await LOB.create(lobData);
    } catch (error) {
      logger.error(`LOBService.createOrFind error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Bulk create LOBs
   */
  async bulkCreate(lobsData) {
    try {
      const operations = lobsData.map((lob) => ({
        updateOne: {
          filter: { category_name: lob.category_name },
          update: { $setOnInsert: lob },
          upsert: true,
        },
      }));

      const result = await LOB.bulkWrite(operations);
      logger.info(`Bulk LOBs created/updated: ${result.upsertedCount + result.modifiedCount}`);
      
      return result;
    } catch (error) {
      logger.error(`LOBService.bulkCreate error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get all LOBs
   */
  async getAll() {
    try {
      return await LOB.find();
    } catch (error) {
      logger.error(`LOBService.getAll error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Find LOB by category name
   */
  async findByName(name) {
    try {
      return await LOB.findOne({ category_name: name });
    } catch (error) {
      logger.error(`LOBService.findByName error: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new LOBService();
