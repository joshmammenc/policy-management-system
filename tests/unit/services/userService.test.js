const userService = require('../../../src/services/userService');
const User = require('../../../src/models/User');
const { sampleUser } = require('../../fixtures/testData');

describe('User Service', () => {
  describe('create', () => {
    it('should create a new user', async () => {
      const user = await userService.create(sampleUser);

      expect(user).toBeDefined();
      expect(user.firstname).toBe(sampleUser.firstname);
      expect(user.email).toBe(sampleUser.email);
      expect(user.phone).toBe(sampleUser.phone);
    });

    it('should throw error if required fields are missing', async () => {
      const invalidUser = { firstname: 'Test' }; // missing required dob

      await expect(userService.create(invalidUser)).rejects.toThrow();
    });
  });

  describe('findByName', () => {
    it('should find users by name (case-insensitive)', async () => {
      await userService.create(sampleUser);

      const users = await userService.findByName('john');

      expect(users).toBeDefined();
      expect(users.length).toBe(1);
      expect(users[0].firstname).toBe(sampleUser.firstname);
    });

    it('should find users with partial match', async () => {
      await userService.create(sampleUser);
      await userService.create({ ...sampleUser, firstname: 'Johnny', email: 'johnny@test.com' });

      const users = await userService.findByName('John');

      expect(users).toBeDefined();
      expect(users.length).toBe(2);
    });

    it('should return empty array if no match', async () => {
      const users = await userService.findByName('NonExistent');

      expect(users).toBeDefined();
      expect(users.length).toBe(0);
    });
  });

  describe('findById', () => {
    it('should find user by ID', async () => {
      const createdUser = await userService.create(sampleUser);

      const user = await userService.findById(createdUser._id);

      expect(user).toBeDefined();
      expect(user._id.toString()).toBe(createdUser._id.toString());
    });

    it('should return null if user not found', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const user = await userService.findById(fakeId);

      expect(user).toBeNull();
    });
  });

  describe('search', () => {
    it('should search users by name or email', async () => {
      await userService.create(sampleUser);

      const usersByName = await userService.search('John');
      expect(usersByName.length).toBe(1);

      const usersByEmail = await userService.search('john@test.com');
      expect(usersByEmail.length).toBe(1);
    });
  });

  describe('bulkCreate', () => {
    it('should create multiple users', async () => {
      const usersData = [
        sampleUser,
        { ...sampleUser, firstname: 'Jane', email: 'jane@test.com' },
        { ...sampleUser, firstname: 'Bob', email: 'bob@test.com' },
      ];

      const result = await userService.bulkCreate(usersData);

      expect(result).toBeDefined();
      expect(result.length).toBe(3);

      const users = await User.find();
      expect(users.length).toBe(3);
    });
  });
});
