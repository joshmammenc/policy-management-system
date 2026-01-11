const validateRequest = require('../../../src/middleware/validateRequest');
const { validationResult } = require('express-validator');

jest.mock('express-validator');

describe('Validate Request Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  it('should call next() if no validation errors', () => {
    validationResult.mockReturnValue({
      isEmpty: () => true,
      array: () => [],
    });

    validateRequest(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should return 400 if validation errors exist', () => {
    const errors = [
      { msg: 'Field is required' },
      { msg: 'Invalid format' },
    ];

    validationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => errors,
    });

    validateRequest(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Validation failed',
      errors: ['Field is required', 'Invalid format'],
    });
    expect(next).not.toHaveBeenCalled();
  });
});
