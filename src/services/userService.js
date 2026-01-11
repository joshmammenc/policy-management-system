const User = require('../models/User');
const logger = require('../utils/logger');

class UserService {
  /**
   * Create user
   */
  async create(userData) {
    try {
      return await User.create(userData);
    } catch (error) {
      logger.error(`UserService.create error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Bulk create users
   */
  async bulkCreate(usersData) {
    try {
      const result = await User.insertMany(usersData, { ordered: false });
      logger.info(`Bulk users created: ${result.length}`);
      
      return result;
    } catch (error) {
      // Handle duplicate key errors gracefully
      if (error.code === 11000) {
        logger.warn(`Some users already exist, inserted: ${error.result?.insertedCount || 0}`);
        return error.result?.insertedDocs || [];
      }
      logger.error(`UserService.bulkCreate error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Find user by name
   */
  async findByName(name) {
    try {
      return await User.find({ 
        firstname: { $regex: new RegExp(name, 'i') } 
      });
    } catch (error) {
      logger.error(`UserService.findByName error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Find user by ID
   */
  async findById(id) {
    try {
      return await User.findById(id);
    } catch (error) {
      logger.error(`UserService.findById error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Search users
   */
  async search(query) {
    try {
      return await User.find({
        $or: [
          { firstname: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } },
        ],
      });
    } catch (error) {
      logger.error(`UserService.search error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get all users
   */
  async getAll() {
    try {
      return await User.find();
    } catch (error) {
      logger.error(`UserService.getAll error: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new UserService();
