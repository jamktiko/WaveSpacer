const express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const spotifyRoutes = require('./routes/spotify');

const app = express();

// middleware
app.use(express.json());
app.use(cookieParser()); // <- ensin lisätään cookie-parser

// reitit
app.use('/', spotifyRoutes);

module.exports = app;
