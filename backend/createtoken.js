const jwt = require('jsonwebtoken');
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
function createToken(userID) {
  const payload = {
    user_id: userID,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: 60 * 60 * 4, // 4h
  });

  return token;
}

module.exports = createToken;
