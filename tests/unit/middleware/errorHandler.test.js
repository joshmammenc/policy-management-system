const errorHandler = require('../../../src/middleware/errorHandler');

describe('Error Handler Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      url: '/test',
      method: 'GET',
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  it('should handle validation errors', () => {
    const error = {
      name: 'ValidationError',
      errors: {
        field1: { message: 'Field 1 is required' },
        field2: { message: 'Field 2 is invalid' },
      },
    };

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Validation Error',
      errors: expect.any(Array),
    });
  });

  it('should handle duplicate key errors', () => {
    const error = {
      code: 11000,
      message: 'Duplicate key error',
    };

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Duplicate entry found',
    });
  });

  it('should handle cast errors (invalid ID)', () => {
    const error = {
      name: 'CastError',
      message: 'Cast to ObjectId failed',
    };

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Invalid ID format',
    });
  });

  it('should handle generic errors with custom status code', () => {
    const error = {
      statusCode: 403,
      message: 'Forbidden access',
    };

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Forbidden access',
    });
  });

  it('should default to 500 for unknown errors', () => {
    const error = {
      message: 'Unknown error',
    };

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
