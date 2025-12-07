const logError = require("../utils/logger");

function errorHandler(err, req, res, next) {
  logError({
    error_type: err.name || "Error",
    message: err.message,
    endpoint: req.originalUrl,
    user_id: req.user ? req.user.id : null
  });

  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error"
  });
}

module.exports = errorHandler;
