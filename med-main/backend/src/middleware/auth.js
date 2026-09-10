const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Verifies JWT and attaches req.user (id, role, email).
 */
async function protect(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: 'Not authorized, invalid token' });
  }
}

/** Only authenticated users with role 'admin' */
function adminOnly(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
}

/** Block admins from using normal user-only routes if needed */
function userOnly(req, res, next) {
  if (req.user.role === 'admin') {
    return res.status(403).json({ message: 'Use admin tools for admin accounts' });
  }
  next();
}

/** Sets req.user if valid Bearer token; does not reject if missing */
async function optionalAuth(req, _res, next) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) return next();
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (user) req.user = user;
  } catch {
    /* ignore invalid optional token */
  }
  next();
}

module.exports = { protect, adminOnly, userOnly, optionalAuth };
