const agentService = require('../../../src/services/agentService');
const Agent = require('../../../src/models/Agent');
const { sampleAgent } = require('../../fixtures/testData');

describe('Agent Service', () => {
  describe('createOrFind', () => {
    it('should create a new agent if not exists', async () => {
      const agent = await agentService.createOrFind(sampleAgent);

      expect(agent).toBeDefined();
      expect(agent.agent_name).toBe(sampleAgent.agent_name);
      expect(agent.agency_id).toBe(sampleAgent.agency_id);
    });

    it('should return existing agent if already exists', async () => {
      // Create first agent
      await agentService.createOrFind(sampleAgent);

      // Try to create again
      const agent = await agentService.createOrFind(sampleAgent);

      expect(agent).toBeDefined();
      expect(agent.agent_name).toBe(sampleAgent.agent_name);

      // Verify only one agent exists
      const count = await Agent.countDocuments({ agent_name: sampleAgent.agent_name });
      expect(count).toBe(1);
    });
  });

  describe('findByName', () => {
    it('should find agent by name', async () => {
      await agentService.createOrFind(sampleAgent);

      const agent = await agentService.findByName(sampleAgent.agent_name);

      expect(agent).toBeDefined();
      expect(agent.agent_name).toBe(sampleAgent.agent_name);
    });

    it('should return null if agent not found', async () => {
      const agent = await agentService.findByName('Non Existent Agent');

      expect(agent).toBeNull();
    });
  });

  describe('getAll', () => {
    it('should return all agents', async () => {
      await agentService.createOrFind(sampleAgent);
      await agentService.createOrFind({ ...sampleAgent, agent_name: 'Another Agent' });

      const agents = await agentService.getAll();

      expect(agents).toBeDefined();
      expect(agents.length).toBe(2);
    });

    it('should return empty array if no agents', async () => {
      const agents = await agentService.getAll();

      expect(agents).toBeDefined();
      expect(agents.length).toBe(0);
    });
  });

  describe('bulkCreate', () => {
    it('should create multiple agents', async () => {
      const agentsData = [
        { agent_name: 'Agent 1', agency_id: 'AGN001' },
        { agent_name: 'Agent 2', agency_id: 'AGN002' },
        { agent_name: 'Agent 3', agency_id: 'AGN003' },
      ];

      const result = await agentService.bulkCreate(agentsData);

      expect(result).toBeDefined();
      expect(result.upsertedCount + result.modifiedCount).toBeGreaterThanOrEqual(0);

      const agents = await Agent.find();
      expect(agents.length).toBe(3);
    });
  });
});
