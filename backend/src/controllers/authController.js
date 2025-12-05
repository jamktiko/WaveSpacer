const createToken = require('../../createtoken');

// Logs in a user via Spotify and sends a JWT token as a secure cookie.
exports.loginWithSpotify = async (userID, res) => {
  const jwtToken = createToken(userID);

  // Send the JWT as an httpOnly cookie
  res.cookie('jwt', jwtToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
    maxAge: 4 * 60 * 60 * 1000,
  });

  res.json({ login: 'success' });
};
