const spotifyService = require('../services/spotifyService');
const authController = require('./authController');
const createToken = require('../../createtoken');
const tokenStore = require('../services/tokenStore');
const User_tokens = require('../models/User_tokens');

const User = require('../models/User');

exports.login = (req, res) => {
  const url = spotifyService.getLoginUrl();
  res.redirect(url);
};

exports.callback = async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send('No code returned');

  try {
    const tokens = await spotifyService.getAccessToken(code);
    const me = await spotifyService.getProfile(tokens.access_token);
    const user = new User(me.id);
    const userID = await user.getUserID();

    if (!userID) {
      userID = await user.save();
    }

    const userTokens = new User_tokens('spotify', tokens.refresh_token, userID);
    tokenStore.setAccessToken(
      userID,
      tokens.access_token,
      'spotify',
      tokens.expires_in
    );
    userTokens.save();

    return authController.loginWithSpotify(userID, tokens, res);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ success: false, message: 'Spotify login failed' });
  }
};

// exports.callback = async (req, res) => {
//   const code = req.query.code;
//   if (!code) return res.status(400).send('No code returned');

//   try {
//     const tokens = await spotifyService.getAccessToken(code);
//     const me = await spotifyService.getProfile(tokens.access_token);

//     const jwtToken = createToken({ spotifyId: me.id });

//     // lähetä cookie
//     // development mode
//     res.cookie('jwt', jwtToken, {
//       httpOnly: true,
//       secure: false,
//       sameSite: 'lax',
//       path: '/',
//       maxAge: 4 * 60 * 60 * 1000, // 4 tuntia
//     });

//     //deploy mode below:

//     // res.cookie('jwt', jwtToken, {
//     //   httpOnly: true,
//     //   secure: true,
//     //   sameSite: 'strict',
//     //   path: '/',
//     //   maxAge: 4 * 60 * 60 * 1000,
//     // });

//     // res.redirect('http://127.0.0.1:4200/playlists');
//     res.json({ login: 'success' });
//   } catch (err) {
//     console.error(err.response?.data || err.message);
//     res.status(500).send('login failed');
//   }
// };

exports.profile = async (req, res) => {
  try {
    // const access_token = await spotifyService.getAccessTokenSafe();
    const userId = req.user_id;
    const access_token = tokenStore.getAccessToken(userId);
    const profile = await spotifyService.getProfile(access_token);
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching profile');
  }
};

exports.playlists = async (req, res) => {
  try {
    const userId = req.user_id;
    const access_token = tokenStore.getAccessToken(userId);
    const playlists = await spotifyService.getPlaylists(access_token);
    res.json(playlists);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching playlists');
  }
};

exports.recents = async (req, res) => {
  try {
    const access_token = await spotifyService.getAccessTokenSafe();
    const recents = await spotifyService.getRecentlyPlayed(access_token);
    res.json(recents);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching recently played tracks');
  }
};

// res.json({
//   jwt: jwtToken,
//   access_token: spotifyTokens.access_token,
//   refresh_token: spotifyTokens.refresh_token,
//   expires_at: spotifyTokens.expires_at,
//   spotifyId: me.id,
// });
