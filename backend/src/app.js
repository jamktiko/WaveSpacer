const express = require('express');
require('dotenv').config();

const spotifyRoutes = require('./routes/spotify');

const app = express();

// middleware
app.use(express.json());

// reitit
app.use('/', spotifyRoutes);

module.exports = app;
