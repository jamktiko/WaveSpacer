const express = require('express');
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const cookieParser = require('cookie-parser');
const cors = require('cors');
// const { startCronJobs } = require('../src/jobs/recentlyPlayedJob');

// aws test push5

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  preflightContinue: false,
  credentials: true,
  optionsSuccessStatus: 204,
};

const spotifyRoutes = require('./routes/spotify');
const dbRoutes = require('./routes/db');

const app = express();

// middleware
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser()); // <- ensin lisätään cookie-parser

// reitit
app.use('/', spotifyRoutes);
app.use('/', dbRoutes);

// startCronJobs();

module.exports = app;
