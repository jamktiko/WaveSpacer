const createToken = require('../../createtoken');

exports.loginWithSpotify = async (userID, tokens, res) => {
  const jwtToken = createToken(userID);
  const isProd = process.env.NODE_ENV === 'production';

  // lähetä cookie
  res.cookie('jwt', jwtToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
    maxAge: 4 * 60 * 60 * 1000,
  });

  res.json({ login: 'success' });
};
