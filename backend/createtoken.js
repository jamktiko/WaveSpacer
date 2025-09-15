const jwt = require('jsonwebtoken');
require('dotenv').config(); // dotenv lataa .env:n

function createToken(user) {
  const payload = {
    username: user.username,
    isadmin: user.isadmin,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: 60 * 60 * 4, // 4h
  });

  return token;
}

module.exports = createToken;
