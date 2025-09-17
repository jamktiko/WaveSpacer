const express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const cors = require('cors');

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:4200',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  credentials: true,
  optionsSuccessStatus: 204,
};

const spotifyRoutes = require('./routes/spotify');

const app = express();

// middleware
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser()); // <- ensin lisätään cookie-parser

// reitit
app.use('/', spotifyRoutes);

module.exports = app;
