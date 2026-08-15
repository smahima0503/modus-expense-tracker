// middleware/auth.js - Lightweight Session Authentication Middleware
// Protects backend routes by ensuring a valid session exists.

function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: 'Authentication required. Please log in.' });
  }
  
  // Attach authenticated userId to request object for route handlers
  req.userId = req.session.userId;
  next();
}

module.exports = { requireAuth };
