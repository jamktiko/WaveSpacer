const createToken = require('../../createtoken');

exports.loginWithSpotify = async (spotifyProfile, tokens, res) => {
  const jwtToken = createToken({ spotifyId: spotifyProfile.id });

  // lähetä cookie
  // development mode
  res.cookie('jwt', jwtToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/',
    maxAge: 4 * 60 * 60 * 1000, // 4 tuntia
  });

  //deploy mode below:

  // res.cookie('jwt', jwtToken, {
  //   httpOnly: true,
  //   secure: true,
  //   sameSite: 'strict',
  //   path: '/',
  //   maxAge: 4 * 60 * 60 * 1000,
  // });

  // res.redirect('http://127.0.0.1:4200/playlists');
  res.json({ login: 'success' });
};
