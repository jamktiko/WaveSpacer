const jwt = require('jsonwebtoken');

// Middleware joka tarkistaa JWT:n
function verifyToken(req, res, next) {
  // otetaan token Authorization-headerista (Bearer <token>)
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token puuttuu.',
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Token virheellinen tai vanhentunut.',
      });
    }

    // tallennetaan dekoodattu data requestiin
    req.user = decoded;
    next();
  });
}

module.exports = verifyToken;
