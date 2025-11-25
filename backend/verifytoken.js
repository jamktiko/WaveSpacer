const jwt = require('jsonwebtoken');

// Middleware that checks JWT from cookie
function verifyToken(req, res, next) {
  // Token is taken from cookies.jwt
  const token = req.cookies?.jwt;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Missing token',
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Token faulty or expired',
      });
    }

    req.user_id = decoded.user_id;
    next();
  });
}

module.exports = verifyToken;
