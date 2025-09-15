const express = require('express');
const router = express.Router();
const spotifyController = require('../controllers/spotifyController');
const cors = require('cors');

const corsOptions = {
  origin: 'http://localhost:4200',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

let accessToken = '';

// LOGIN: ohjaa Spotify-kirjautumiseen
router.get('/login', spotifyController.login);

// CALLBACK: saa Spotify access tokenin
router.get('/callback', cors(corsOptions), async (req, res) => {
  const code = req.query.code;
  if (!code) return res.send('No code returned');

  try {
    accessToken = await spotifyController.getAccessToken(code);
    res.redirect('http://localhost:4200?login=success');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error getting access token');
  }
});

// PROFILE: hakee käyttäjän profiilin
router.get('/profile', cors(corsOptions), async (req, res) => {
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
router.get('/playlists', cors(corsOptions), async (req, res) => {
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
router.get('/recents', cors(corsOptions), async (req, res) => {
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
