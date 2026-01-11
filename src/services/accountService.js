const Account = require('../models/Account');
const logger = require('../utils/logger');

class AccountService {
  /**
   * Create or find account
   */
  async createOrFind(accountData) {
    try {
      const account = await Account.findOne({ account_name: accountData.account_name });
      
      if (account) {
        return account;
      }
      
      return await Account.create(accountData);
    } catch (error) {
      logger.error(`AccountService.createOrFind error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Bulk create accounts
   */
  async bulkCreate(accountsData) {
    try {
      const operations = accountsData.map((account) => ({
        updateOne: {
          filter: { account_name: account.account_name },
          update: { $setOnInsert: account },
          upsert: true,
        },
      }));

      const result = await Account.bulkWrite(operations);
      logger.info(`Bulk accounts created/updated: ${result.upsertedCount + result.modifiedCount}`);
      
      return result;
    } catch (error) {
      logger.error(`AccountService.bulkCreate error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get all accounts
   */
  async getAll() {
    try {
      return await Account.find();
    } catch (error) {
      logger.error(`AccountService.getAll error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Find account by name
   */
  async findByName(name) {
    try {
      return await Account.findOne({ account_name: name });
    } catch (error) {
      logger.error(`AccountService.findByName error: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new AccountService();
