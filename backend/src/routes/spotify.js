const express = require('express');
const router = express.Router();
const verifyToken = require('../../verifytoken');
const spotifyController = require('../controllers/spotifyController');

// Routes
router.get('/login', spotifyController.login);
router.get('/callback', spotifyController.callback);
router.get('/profile', verifyToken, spotifyController.profile);
router.get('/playlists', verifyToken, spotifyController.playlists);
router.get('/recents', verifyToken, spotifyController.recents);
router.get('/verify-token', verifyToken, (req, res) => {
  res.json({
    success: true,
  });
});
router.post(
  '/playlistId',
  verifyToken,
  spotifyController.getTracksFromFrontend
);
router.post(
  '/deleteTracks',
  verifyToken,
  spotifyController.deleteTracksFromPlaylist
);

module.exports = router;
