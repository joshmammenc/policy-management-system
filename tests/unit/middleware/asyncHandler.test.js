const asyncHandler = require('../../../src/middleware/asyncHandler');

describe('Async Handler Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {};
    next = jest.fn();
  });

  it('should call the wrapped function', async () => {
    const mockFn = jest.fn().mockResolvedValue('success');
    const wrapped = asyncHandler(mockFn);

    await wrapped(req, res, next);

    expect(mockFn).toHaveBeenCalledWith(req, res, next);
  });

  it('should catch errors and pass to next', async () => {
    const error = new Error('Test error');
    const mockFn = jest.fn().mockRejectedValue(error);
    const wrapped = asyncHandler(mockFn);

    await wrapped(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it('should not call next if no error', async () => {
    const mockFn = jest.fn().mockResolvedValue('success');
    const wrapped = asyncHandler(mockFn);

    await wrapped(req, res, next);

    expect(next).not.toHaveBeenCalled();
  });
});
