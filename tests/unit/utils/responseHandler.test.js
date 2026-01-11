const { sendSuccess, sendError } = require('../../../src/utils/responseHandler');

describe('Response Handler', () => {
  let res;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe('sendSuccess', () => {
    it('should send success response with default status 200', () => {
      const data = { id: 1, name: 'Test' };
      sendSuccess(res, data, 'Success message');

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Success message',
        data,
      });
    });

    it('should send success response with custom status code', () => {
      const data = { id: 1 };
      sendSuccess(res, data, 'Created', 201);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Created',
        data,
      });
    });

    it('should use default message if not provided', () => {
      sendSuccess(res, {});

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Success',
        data: {},
      });
    });
  });

  describe('sendError', () => {
    it('should send error response with default status 500', () => {
      sendError(res, 'Error message');

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error message',
      });
    });

    it('should send error response with custom status code', () => {
      sendError(res, 'Not found', 404);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Not found',
      });
    });

    it('should include errors array if provided', () => {
      const errors = ['Error 1', 'Error 2'];
      sendError(res, 'Validation failed', 400, errors);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation failed',
        errors,
      });
    });
  });
});
