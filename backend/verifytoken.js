const jwt = require('jsonwebtoken');

// Middleware joka tarkistaa JWT:n cookiesta
function verifyToken(req, res, next) {
  // Token otetaan cookies.jwt:stä
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

    // Tallennetaan dekoodattu data requestiin
    req.user_id = decoded.user_id;
    next();
  });
}

module.exports = verifyToken;
