const express = require('express');
const {
  searchPolicies,
  getAggregatedPolicies,
  getAllPolicies,
} = require('../controllers/policyController');
const { searchPolicyValidation } = require('../validators/policyValidator');
const validateRequest = require('../middleware/validateRequest');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

/**
 * @route   GET /api/policies/search?username=:name
 * @desc    Search policies by username
 * @access  Public
 */
router.get(
  '/search',
  searchPolicyValidation,
  validateRequest,
  asyncHandler(searchPolicies)
);

/**
 * @route   GET /api/policies/aggregate
 * @desc    Get aggregated policies by user
 * @access  Public
 */
router.get('/aggregate', asyncHandler(getAggregatedPolicies));

/**
 * @route   GET /api/policies
 * @desc    Get all policies
 * @access  Public
 */
router.get('/', asyncHandler(getAllPolicies));

module.exports = router;
