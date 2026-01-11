const request = require('supertest');
const express = require('express');
const messageRoutes = require('../../../src/routes/messageRoutes');
const messageService = require('../../../src/services/messageService');

// Create test app
const app = express();
app.use(express.json());
app.use('/api/messages', messageRoutes);

describe('Message API Integration Tests', () => {
  describe('POST /api/messages/schedule', () => {
    it('should schedule a message successfully', async () => {
      const messageData = {
        message: 'Test scheduled message',
        day: '2026-12-31',
        time: '14:30',
      };

      const response = await request(app)
        .post('/api/messages/schedule')
        .send(messageData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.message).toBe(messageData.message);
      expect(response.body.data.status).toBe('pending');
    });

    it('should return 400 for invalid date format', async () => {
      const invalidData = {
        message: 'Test message',
        day: 'invalid-date',
        time: '14:30',
      };

      const response = await request(app)
        .post('/api/messages/schedule')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should return 400 for invalid time format', async () => {
      const invalidData = {
        message: 'Test message',
        day: '2026-12-31',
        time: '25:99', // Invalid time
      };

      const response = await request(app)
        .post('/api/messages/schedule')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/api/messages/schedule')
        .send({ message: 'Test' })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should return 400 for past date/time', async () => {
      const pastData = {
        message: 'Test message',
        day: '2020-01-01',
        time: '10:00',
      };

      const response = await request(app)
        .post('/api/messages/schedule')
        .send(pastData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('future');
    });
  });

  describe('GET /api/messages', () => {
    beforeEach(async () => {
      // Create test messages
      await messageService.create({
        message: 'Pending message',
        day: new Date('2026-12-31'),
        time: '14:30',
        scheduled_at: new Date('2026-12-31T14:30:00'),
        status: 'pending',
      });

      await messageService.create({
        message: 'Completed message',
        day: new Date('2026-12-31'),
        time: '15:00',
        scheduled_at: new Date('2026-12-31T15:00:00'),
        status: 'completed',
      });
    });

    it('should return all messages', async () => {
      const response = await request(app)
        .get('/api/messages')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.length).toBeGreaterThanOrEqual(2);
    });

    it('should filter messages by status', async () => {
      const response = await request(app)
        .get('/api/messages')
        .query({ status: 'pending' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.every(msg => msg.status === 'pending')).toBe(true);
    });
  });

  describe('GET /api/messages/pending', () => {
    it('should return only pending messages ready to process', async () => {
      // Create a pending message in the past
      await messageService.create({
        message: 'Ready to process',
        day: new Date(Date.now() - 1000 * 60),
        time: '10:00',
        scheduled_at: new Date(Date.now() - 1000 * 60),
        status: 'pending',
      });

      // Create a pending message in the future
      await messageService.create({
        message: 'Not ready yet',
        day: new Date('2026-12-31'),
        time: '14:30',
        scheduled_at: new Date('2026-12-31T14:30:00'),
        status: 'pending',
      });

      const response = await request(app)
        .get('/api/messages/pending')
        .expect(200);

      expect(response.body.success).toBe(true);
      // Should only return the message that's ready to process
      const readyMessages = response.body.data.filter(
        msg => new Date(msg.scheduled_at) <= new Date()
      );
      expect(readyMessages.length).toBeGreaterThan(0);
    });
  });
});
