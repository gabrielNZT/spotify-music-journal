const authMiddleware = require('./auth.middleware');
const optionalAuth = require('./optionalAuth.middleware');

module.exports = {
  authMiddleware,
  optionalAuth
};
