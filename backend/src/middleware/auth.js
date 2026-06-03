const { verifyToken } = require('../config/jwt');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    req.userId = decoded.userId;
    req.userRole = decoded.userRole;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Authentication failed' });
  }
};

const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.userRole)) {
      return res.status(403).json({ error: 'Access denied - insufficient permissions' });
    }
    next();
  };
};

module.exports = {
  authMiddleware,
  roleMiddleware,
};
