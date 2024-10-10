const jwt = require('jsonwebtoken');

// Middleware to check for authenticated users
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Save the decoded user info to the request object
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware to check for admin users
const isAdmin = (req, res, next) => {
  // Ensure the user is authenticated first
  authMiddleware(req, res, () => {
    // Check if the user has admin privileges
    if (req.user && req.user.role === 'admin') {
      next(); // User is admin, proceed to the next middleware/route handler
    } else {
      return res.status(403).json({ message: 'Access denied, admin only' });
    }
  });
};

module.exports = { authMiddleware, isAdmin };
