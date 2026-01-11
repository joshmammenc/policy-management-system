const policyService = require('../services/policyService');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const logger = require('../utils/logger');

/**
 * Search policies by username
 */
const searchPolicies = async (req, res) => {
  try {
    const { username } = req.query;

    logger.info(`Searching policies for username: ${username}`);

    const policies = await policyService.searchByUsername(username);

    if (!policies || policies.length === 0) {
      return sendSuccess(res, [], 'No policies found for the given username', 200);
    }

    return sendSuccess(
      res,
      policies,
      `Found ${policies.length} policies for username: ${username}`,
      200
    );
  } catch (error) {
    logger.error(`Search policies error: ${error.message}`);
    return sendError(res, error.message, 500);
  }
};

/**
 * Get aggregated policies by user
 */
const getAggregatedPolicies = async (req, res) => {
  try {
    logger.info('Getting aggregated policies by user');

    const aggregatedData = await policyService.getAggregatedByUser();

    return sendSuccess(
      res,
      aggregatedData,
      `Retrieved aggregated policies for ${aggregatedData.length} users`,
      200
    );
  } catch (error) {
    logger.error(`Get aggregated policies error: ${error.message}`);
    return sendError(res, error.message, 500);
  }
};

/**
 * Get all policies (with limit)
 */
const getAllPolicies = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;

    logger.info(`Getting all policies (limit: ${limit})`);

    const policies = await policyService.getAll(limit);

    return sendSuccess(
      res,
      policies,
      `Retrieved ${policies.length} policies`,
      200
    );
  } catch (error) {
    logger.error(`Get all policies error: ${error.message}`);
    return sendError(res, error.message, 500);
  }
};

module.exports = {
  searchPolicies,
  getAggregatedPolicies,
  getAllPolicies,
};
