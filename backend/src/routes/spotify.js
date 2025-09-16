const express = require('express');
const router = express.Router();
const spotifyController = require('../controllers/spotifyController');
const cors = require('cors');
const createToken = require('../../createtoken');
const verifyToken = require('../../verifytoken');

const corsOptions = {
  origin: 'http://localhost:4200',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

let spotifyTokens = {
  access_token: '',
  refresh_token: '',
  expires_at: 0,
};

// LOGIN: ohjaa Spotify-kirjautumiseen
router.get('/login', spotifyController.login);

// CALLBACK: saa Spotify access tokenin
router.get('/callback', cors(corsOptions), async (req, res) => {
  const code = req.query.code;
  if (!code) return res.send('No code returned');

  try {
    const tokenData = await spotifyController.getAccessToken(code);

    const me = await spotifyController.getProfile(tokenData.access_token);
    const spotifyID = me.id;

    const user = { spotifyId: me.id };
    const jwtToken = createToken(user);

    spotifyTokens.access_token = tokenData.access_token;
    spotifyTokens.refresh_token = tokenData.refresh_token;
    spotifyTokens.expires_at = Date.now() + tokenData.expires_in * 1000;

    // development mode
    res.cookie('jwt', jwtToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
    });

    // res.json({
    //   jwt: jwtToken,
    //   access_token: spotifyTokens.access_token,
    //   refresh_token: spotifyTokens.refresh_token,
    //   expires_at: spotifyTokens.expires_at,
    //   spotifyId: me.id,
    // });

    //deploy mode below:

    // res.cookie('jwt', jwtToken, {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: 'strict',
    //   path: '/',
    //   maxAge: 4 * 60 * 60 * 1000,
    // });
  } catch (err) {
    console.error('Spotify callback error:', err.response?.data || err.message);
    res.status(500).send('Error during Spotify login');
  }
});

// PROFILE: hakee käyttäjän profiilin
router.get('/profile', cors(corsOptions), verifyToken, async (req, res) => {
  // const access_token = req.query.token;
  if (Date.now() > spotifyTokens.expires_at) {
    const newAccessToken = spotifyController.getRefreshToken(
      spotifyTokens.refresh_token
    );
    spotifyTokens.access_token = newAccessToken.access_token;
    spotifyTokens.expires_at = newAccessToken.expires_at;
    spotifyTokens.refresh_token = newAccessToken.refresh_token;
  }
  try {
    const profile = await spotifyController.getProfile(
      spotifyTokens.access_token
    );
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching profile');
  }
});

// PLAYLISTS: hakee käyttäjän soittolistat
router.get('/playlists', cors(corsOptions), verifyToken, async (req, res) => {
  // const access_token = req.query.token;
  try {
    const playlists = await spotifyController.getPlaylists(
      spotifyTokens.access_token
    );
    res.json(playlists);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching playlists');
  }
});

// RECENTLY PLAYED: hakee käyttäjän viimeksi kuuntelemat kappaleet
router.get('/recents', cors(corsOptions), verifyToken, async (req, res) => {
  try {
    const recently_played = await spotifyController.getRecentlyPlayed(
      spotifyTokens.access_token
    );
    res.json(recently_played);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching recently played tracks');
  }
});

module.exports = router;
