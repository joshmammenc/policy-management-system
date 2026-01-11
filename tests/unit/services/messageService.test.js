const messageService = require('../../../src/services/messageService');
const ScheduledMessage = require('../../../src/models/ScheduledMessage');
const { sampleScheduledMessage } = require('../../fixtures/testData');

describe('Message Service', () => {
  describe('create', () => {
    it('should create a scheduled message', async () => {
      const message = await messageService.create(sampleScheduledMessage);

      expect(message).toBeDefined();
      expect(message.message).toBe(sampleScheduledMessage.message);
      expect(message.status).toBe('pending');
    });

    it('should throw error if required fields are missing', async () => {
      const invalidMessage = { message: 'Test' };

      await expect(messageService.create(invalidMessage)).rejects.toThrow();
    });
  });

  describe('getPendingMessages', () => {
    it('should return only pending messages', async () => {
      // Create a pending message scheduled in the past
      const pastMessage = {
        ...sampleScheduledMessage,
        scheduled_at: new Date(Date.now() - 1000 * 60), // 1 minute ago
        status: 'pending',
      };
      await messageService.create(pastMessage);

      // Create a completed message
      const completedMessage = {
        ...sampleScheduledMessage,
        message: 'Completed message',
        scheduled_at: new Date(Date.now() - 1000 * 60),
        status: 'completed',
      };
      await messageService.create(completedMessage);

      const pendingMessages = await messageService.getPendingMessages();

      expect(pendingMessages).toBeDefined();
      expect(pendingMessages.length).toBe(1);
      expect(pendingMessages[0].status).toBe('pending');
    });

    it('should not return future messages', async () => {
      // Create a pending message scheduled in the future
      const futureMessage = {
        ...sampleScheduledMessage,
        scheduled_at: new Date(Date.now() + 1000 * 60 * 60), // 1 hour from now
        status: 'pending',
      };
      await messageService.create(futureMessage);

      const pendingMessages = await messageService.getPendingMessages();

      expect(pendingMessages.length).toBe(0);
    });
  });

  describe('updateStatus', () => {
    it('should update message status', async () => {
      const message = await messageService.create(sampleScheduledMessage);

      const updated = await messageService.updateStatus(message._id, 'completed');

      expect(updated).toBeDefined();
      expect(updated.status).toBe('completed');
    });
  });

  describe('getByStatus', () => {
    it('should filter messages by status', async () => {
      await messageService.create({ ...sampleScheduledMessage, status: 'pending' });
      await messageService.create({ ...sampleScheduledMessage, message: 'Completed', status: 'completed' });
      await messageService.create({ ...sampleScheduledMessage, message: 'Failed', status: 'failed' });

      const pending = await messageService.getByStatus('pending');
      const completed = await messageService.getByStatus('completed');

      expect(pending.length).toBe(1);
      expect(completed.length).toBe(1);
    });
  });

  describe('getAll', () => {
    it('should return all messages', async () => {
      await messageService.create(sampleScheduledMessage);
      await messageService.create({ ...sampleScheduledMessage, message: 'Another message' });

      const messages = await messageService.getAll();

      expect(messages).toBeDefined();
      expect(messages.length).toBe(2);
    });
  });
});
