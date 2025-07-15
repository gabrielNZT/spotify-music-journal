const { verifyToken } = require('../utils/jwt');
const { User } = require('../models');

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.userId = null;
      req.user = null;
      return next();
    }

    const token = authHeader.substring(7);

    if (!token) {
      req.userId = null;
      req.user = null;
      return next();
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId);
    
    if (user) {
      req.userId = decoded.userId;
      req.user = user;
    } else {
      req.userId = null;
      req.user = null;
    }
    
    next();
  } catch (error) {
    req.userId = null;
    req.user = null;
    next();
  }
};

module.exports = optionalAuth;
