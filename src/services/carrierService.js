const Carrier = require('../models/Carrier');
const logger = require('../utils/logger');

class CarrierService {
  /**
   * Create or find carrier
   */
  async createOrFind(carrierData) {
    try {
      const carrier = await Carrier.findOne({ company_name: carrierData.company_name });
      
      if (carrier) {
        return carrier;
      }
      
      return await Carrier.create(carrierData);
    } catch (error) {
      logger.error(`CarrierService.createOrFind error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Bulk create carriers
   */
  async bulkCreate(carriersData) {
    try {
      const operations = carriersData.map((carrier) => ({
        updateOne: {
          filter: { company_name: carrier.company_name },
          update: { $setOnInsert: carrier },
          upsert: true,
        },
      }));

      const result = await Carrier.bulkWrite(operations);
      logger.info(`Bulk carriers created/updated: ${result.upsertedCount + result.modifiedCount}`);
      
      return result;
    } catch (error) {
      logger.error(`CarrierService.bulkCreate error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get all carriers
   */
  async getAll() {
    try {
      return await Carrier.find();
    } catch (error) {
      logger.error(`CarrierService.getAll error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Find carrier by company name
   */
  async findByName(name) {
    try {
      return await Carrier.findOne({ company_name: name });
    } catch (error) {
      logger.error(`CarrierService.findByName error: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new CarrierService();
