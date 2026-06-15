// Backend utility helpers

/**
 * Create a standardized API response
 */
const sendResponse = (res, statusCode, data) => {
  res.status(statusCode).json(data);
};

/**
 * Create a standardized error response
 */
const sendError = (res, statusCode, message) => {
  res.status(statusCode).json({ message });
};

/**
 * Async handler wrapper to catch errors
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = { sendResponse, sendError, asyncHandler };
