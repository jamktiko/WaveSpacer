const express = require('express');
const router = express.Router();
const cors = require('cors');
const verifyToken = require('../../verifytoken');
const spotifyController = require('../controllers/spotifyController');

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:4200',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

// Routes
router.get('/login', spotifyController.login);
router.get('/callback', cors(corsOptions), spotifyController.callback);
router.get(
  '/profile',
  cors(corsOptions),
  verifyToken,
  spotifyController.profile
);
router.get(
  '/playlists',
  cors(corsOptions),
  verifyToken,
  spotifyController.playlists
);
router.get(
  '/recents',
  cors(corsOptions),
  verifyToken,
  spotifyController.recents
);

module.exports = router;
