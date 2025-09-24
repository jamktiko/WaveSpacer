const pool = require('../database');
const express = require('express');
const router = express.Router();
const dbController = require('../controllers/dbController');

router.get('/db-test', dbController.test);

module.exports = router;
