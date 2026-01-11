const policyService = require('../../../src/services/policyService');
const agentService = require('../../../src/services/agentService');
const userService = require('../../../src/services/userService');
const accountService = require('../../../src/services/accountService');
const lobService = require('../../../src/services/lobService');
const carrierService = require('../../../src/services/carrierService');
const Policy = require('../../../src/models/Policy');
const {
  sampleAgent,
  sampleUser,
  sampleAccount,
  sampleLOB,
  sampleCarrier,
  samplePolicy,
} = require('../../fixtures/testData');

describe('Policy Service', () => {
  let agent, user, account, lob, carrier;

  beforeEach(async () => {
    // Create dependencies
    agent = await agentService.createOrFind(sampleAgent);
    user = await userService.create(sampleUser);
    account = await accountService.createOrFind(sampleAccount);
    lob = await lobService.createOrFind(sampleLOB);
    carrier = await carrierService.createOrFind(sampleCarrier);
  });

  describe('create', () => {
    it('should create a new policy', async () => {
      const policyData = samplePolicy(user._id, agent._id, account._id, lob._id, carrier._id);
      const policy = await policyService.create(policyData);

      expect(policy).toBeDefined();
      expect(policy.policy_number).toBe(policyData.policy_number);
      expect(policy.user_id.toString()).toBe(user._id.toString());
    });

    it('should throw error if required fields are missing', async () => {
      const invalidPolicy = { policy_number: 'TEST123' };

      await expect(policyService.create(invalidPolicy)).rejects.toThrow();
    });
  });

  describe('findByUserId', () => {
    it('should find policies by user ID', async () => {
      const policyData = samplePolicy(user._id, agent._id, account._id, lob._id, carrier._id);
      await policyService.create(policyData);

      const policies = await policyService.findByUserId(user._id);

      expect(policies).toBeDefined();
      expect(policies.length).toBe(1);
      expect(policies[0].user_id.firstname).toBe(sampleUser.firstname);
    });

    it('should return empty array if no policies found', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const policies = await policyService.findByUserId(fakeId);

      expect(policies).toBeDefined();
      expect(policies.length).toBe(0);
    });
  });

  describe('searchByUsername', () => {
    it('should search policies by username', async () => {
      const policyData = samplePolicy(user._id, agent._id, account._id, lob._id, carrier._id);
      await policyService.create(policyData);

      const policies = await policyService.searchByUsername('John');

      expect(policies).toBeDefined();
      expect(policies.length).toBe(1);
      expect(policies[0].user_id.firstname).toBe('John');
    });

    it('should be case-insensitive', async () => {
      const policyData = samplePolicy(user._id, agent._id, account._id, lob._id, carrier._id);
      await policyService.create(policyData);

      const policies = await policyService.searchByUsername('john');

      expect(policies).toBeDefined();
      expect(policies.length).toBe(1);
    });
  });

  describe('getAggregatedByUser', () => {
    it('should return aggregated policy data', async () => {
      const policyData1 = samplePolicy(user._id, agent._id, account._id, lob._id, carrier._id);
      const policyData2 = {
        ...samplePolicy(user._id, agent._id, account._id, lob._id, carrier._id),
        policy_number: 'POL789',
        premium_amount: 2000,
      };

      await policyService.create(policyData1);
      await policyService.create(policyData2);

      const aggregated = await policyService.getAggregatedByUser();

      expect(aggregated).toBeDefined();
      expect(aggregated.length).toBe(1);
      expect(aggregated[0].totalPolicies).toBe(2);
      expect(aggregated[0].totalPremium).toBe(3500);
    });
  });

  describe('bulkCreate', () => {
    it('should create multiple policies', async () => {
      const policiesData = [
        samplePolicy(user._id, agent._id, account._id, lob._id, carrier._id),
        { ...samplePolicy(user._id, agent._id, account._id, lob._id, carrier._id), policy_number: 'POL456' },
        { ...samplePolicy(user._id, agent._id, account._id, lob._id, carrier._id), policy_number: 'POL789' },
      ];

      const result = await policyService.bulkCreate(policiesData);

      expect(result).toBeDefined();
      expect(result.length).toBe(3);

      const policies = await Policy.find();
      expect(policies.length).toBe(3);
    });
  });
});
