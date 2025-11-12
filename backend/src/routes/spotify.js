const express = require('express');
const router = express.Router();
const verifyToken = require('../../verifytoken');
const spotifyController = require('../controllers/spotifyController');
const trackRepository = require('../repositories/trackRepository');
const genreRepository = require('../repositories/genreRepository');

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
router.get('/lastMonthFav', verifyToken, async (req, res) => {
  const userId = req.user_id;
  const result = await trackRepository.favoriteFromLastMonth(userId);
  res.json(result);
});
router.get('/genres', verifyToken, async (req, res) => {
  const userId = req.user_id;
  const result = await genreRepository.getTopGenres(userId);
  res.json(result);
});

module.exports = router;
