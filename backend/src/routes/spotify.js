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

let accessToken = '';

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

    res.redirect(`http://localhost:4200?login=success&token=${jwtToken}`);
  } catch (err) {
    console.error('Spotify callback error:', err.response?.data || err.message);
    res.status(500).send('Error during Spotify login');
  }
});

// PROFILE: hakee käyttäjän profiilin
router.get('/profile', cors(corsOptions), verifyToken, async (req, res) => {
  // const access_token = req.query.token;
  try {
    const profile = await spotifyController.getProfile(accessToken);
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
    const playlists = await spotifyController.getPlaylists(accessToken);
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
      accessToken
    );
    res.json(recently_played);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching recently played tracks');
  }
});

module.exports = router;
