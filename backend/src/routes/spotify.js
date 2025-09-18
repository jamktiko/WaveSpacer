const express = require('express');
const router = express.Router();
const cors = require('cors');
const verifyToken = require('../../verifytoken');
const spotifyController = require('../controllers/spotifyController');

// Routes
router.get('/login', spotifyController.login);
router.get('/callback', spotifyController.callback);
router.get('/profile', verifyToken, spotifyController.profile);
router.get('/playlists', verifyToken, spotifyController.playlists);
router.get('/recents', verifyToken, spotifyController.recents);

module.exports = router;
