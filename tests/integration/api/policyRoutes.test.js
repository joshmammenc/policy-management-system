const request = require('supertest');
const express = require('express');
const policyRoutes = require('../../../src/routes/policyRoutes');
const policyService = require('../../../src/services/policyService');
const agentService = require('../../../src/services/agentService');
const userService = require('../../../src/services/userService');
const accountService = require('../../../src/services/accountService');
const lobService = require('../../../src/services/lobService');
const carrierService = require('../../../src/services/carrierService');
const {
  sampleAgent,
  sampleUser,
  sampleAccount,
  sampleLOB,
  sampleCarrier,
  samplePolicy,
} = require('../../fixtures/testData');

// Create test app
const app = express();
app.use(express.json());
app.use('/api/policies', policyRoutes);

describe('Policy API Integration Tests', () => {
  let agent, user, account, lob, carrier, policy;

  beforeEach(async () => {
    // Create test data
    agent = await agentService.createOrFind(sampleAgent);
    user = await userService.create(sampleUser);
    account = await accountService.createOrFind(sampleAccount);
    lob = await lobService.createOrFind(sampleLOB);
    carrier = await carrierService.createOrFind(sampleCarrier);

    const policyData = samplePolicy(user._id, agent._id, account._id, lob._id, carrier._id);
    policy = await policyService.create(policyData);
  });

  describe('GET /api/policies/search', () => {
    it('should search policies by username', async () => {
      const response = await request(app)
        .get('/api/policies/search')
        .query({ username: 'John' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should return 400 if username is missing', async () => {
      const response = await request(app)
        .get('/api/policies/search')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Validation');
    });

    it('should return empty array if no match found', async () => {
      const response = await request(app)
        .get('/api/policies/search')
        .query({ username: 'NonExistent' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(0);
    });
  });

  describe('GET /api/policies/aggregate', () => {
    it('should return aggregated policies', async () => {
      const response = await request(app)
        .get('/api/policies/aggregate')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should calculate total policies and premium correctly', async () => {
      const response = await request(app)
        .get('/api/policies/aggregate')
        .expect(200);

      const aggregatedUser = response.body.data[0];
      expect(aggregatedUser).toBeDefined();
      expect(aggregatedUser.totalPolicies).toBeGreaterThan(0);
      expect(aggregatedUser.totalPremium).toBeGreaterThan(0);
    });
  });

  describe('GET /api/policies', () => {
    it('should return all policies with default limit', async () => {
      const response = await request(app)
        .get('/api/policies')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should respect limit parameter', async () => {
      // Create multiple policies
      const policyData2 = {
        ...samplePolicy(user._id, agent._id, account._id, lob._id, carrier._id),
        policy_number: 'POL456',
      };
      await policyService.create(policyData2);

      const response = await request(app)
        .get('/api/policies')
        .query({ limit: 1 })
        .expect(200);

      expect(response.body.data.length).toBeLessThanOrEqual(1);
    });
  });
});
