const express = require('express');
const router = express.Router();
const cors = require('cors');
const pool = require('../database');
const verifyToken = require('../../verifytoken');
const spotifyController = require('../controllers/spotifyController');

// Routes
router.get('/login', spotifyController.login);
router.get('/callback', spotifyController.callback);
router.get('/profile', verifyToken, spotifyController.profile);
router.get('/playlists', verifyToken, spotifyController.playlists);
router.get('/recents', verifyToken, spotifyController.recents);

router.get('/db-test', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT NOW() as now');
    res.json({ success: true, server_time: rows[0].now });
  } catch (err) {
    console.error('DB connection error:', err);
    res.status(500).json({ success: false, message: 'DB connection failed' });
  }
});

module.exports = router;
