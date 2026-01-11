const Policy = require('../models/Policy');
const User = require('../models/User');
const Agent = require('../models/Agent');
const Account = require('../models/Account');
const LOB = require('../models/LOB');
const Carrier = require('../models/Carrier');
const logger = require('../utils/logger');

class PolicyService {
  /**
   * Create policy
   */
  async create(policyData) {
    try {
      return await Policy.create(policyData);
    } catch (error) {
      logger.error(`PolicyService.create error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Bulk create policies
   */
  async bulkCreate(policiesData) {
    try {
      const result = await Policy.insertMany(policiesData, { ordered: false });
      logger.info(`Bulk policies created: ${result.length}`);
      
      return result;
    } catch (error) {
      logger.error(`PolicyService.bulkCreate error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Find policies by user ID
   */
  async findByUserId(userId) {
    try {
      return await Policy.find({ user_id: userId })
        .populate('user_id', 'firstname email')
        .populate('agent_id', 'agent_name')
        .populate('account_id', 'account_name')
        .populate('lob_id', 'category_name')
        .populate('carrier_id', 'company_name');
    } catch (error) {
      logger.error(`PolicyService.findByUserId error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Search policies by username
   */
  async searchByUsername(username) {
    try {
      const policies = await Policy.find()
        .populate({
          path: 'user_id',
          match: { firstname: { $regex: new RegExp(username, 'i') } },
        })
        .populate('agent_id', 'agent_name')
        .populate('account_id', 'account_name')
        .populate('lob_id', 'category_name')
        .populate('carrier_id', 'company_name');

      // Filter out null user_id (where match didn't succeed)
      return policies.filter((policy) => policy.user_id !== null);
    } catch (error) {
      logger.error(`PolicyService.searchByUsername error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get aggregated policies by user
   */
  async getAggregatedByUser() {
    try {
      const aggregation = await Policy.aggregate([
        {
          $group: {
            _id: '$user_id',
            totalPolicies: { $sum: 1 },
            totalPremium: { $sum: '$premium_amount' },
            policies: {
              $push: {
                policy_number: '$policy_number',
                policy_type: '$policy_type',
                premium_amount: '$premium_amount',
                policy_start_date: '$policy_start_date',
                policy_end_date: '$policy_end_date',
              },
            },
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $unwind: '$user',
        },
        {
          $project: {
            _id: 1,
            user: {
              firstname: '$user.firstname',
              email: '$user.email',
              phone: '$user.phone',
            },
            totalPolicies: 1,
            totalPremium: 1,
            policies: 1,
          },
        },
        {
          $sort: { totalPolicies: -1 },
        },
      ]);

      return aggregation;
    } catch (error) {
      logger.error(`PolicyService.getAggregatedByUser error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get all policies
   */
  async getAll(limit = 100) {
    try {
      return await Policy.find()
        .limit(limit)
        .populate('user_id', 'firstname email')
        .populate('agent_id', 'agent_name')
        .populate('account_id', 'account_name')
        .populate('lob_id', 'category_name')
        .populate('carrier_id', 'company_name');
    } catch (error) {
      logger.error(`PolicyService.getAll error: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new PolicyService();
