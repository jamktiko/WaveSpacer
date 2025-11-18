const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  preflightContinue: false,
  credentials: true,
  optionsSuccessStatus: 204,
};

const spotifyRoutes = require('./routes/spotify');
const userRoutes = require('./routes/user');

const app = express();

// middleware
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

// reitit
app.use('/api', spotifyRoutes);
app.use('/user', userRoutes);

module.exports = app;
