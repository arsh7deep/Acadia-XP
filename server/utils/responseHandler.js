// API Response wrapper for consistent responses
exports.sendSuccess = (res, data, message = 'Success', statusCode = 200) => {
  res.status(statusCode).json({
    statusCode,
    success: true,
    data,
    message
  });
};

exports.sendError = (res, message, statusCode = 400, error = null) => {
  res.status(statusCode).json({
    statusCode,
    success: false,
    message,
    error: error ? error.message : undefined
  });
};
