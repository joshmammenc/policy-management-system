const Agent = require('../models/Agent');
const logger = require('../utils/logger');

class AgentService {
  /**
   * Create or find agent
   */
  async createOrFind(agentData) {
    try {
      const agent = await Agent.findOne({ agent_name: agentData.agent_name });
      
      if (agent) {
        return agent;
      }
      
      return await Agent.create(agentData);
    } catch (error) {
      logger.error(`AgentService.createOrFind error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Bulk create agents
   */
  async bulkCreate(agentsData) {
    try {
      const operations = agentsData.map((agent) => ({
        updateOne: {
          filter: { agent_name: agent.agent_name },
          update: { $setOnInsert: agent },
          upsert: true,
        },
      }));

      const result = await Agent.bulkWrite(operations);
      logger.info(`Bulk agents created/updated: ${result.upsertedCount + result.modifiedCount}`);
      
      return result;
    } catch (error) {
      logger.error(`AgentService.bulkCreate error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get all agents
   */
  async getAll() {
    try {
      return await Agent.find();
    } catch (error) {
      logger.error(`AgentService.getAll error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Find agent by name
   */
  async findByName(name) {
    try {
      return await Agent.findOne({ agent_name: name });
    } catch (error) {
      logger.error(`AgentService.findByName error: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new AgentService();
