const axios = require('axios');
const querystring = require('querystring');
const randomUtils = require('../utils/randomUtils');

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri =
  process.env.SPOTIFY_REDIRECT_URI || 'http://127.0.0.1:8888/callback';

let spotifyTokens = {};

exports.getLoginUrl = () => {
  const state = randomUtils.generateRandomString();
  const scope = 'user-read-private user-read-email user-read-recently-played';

  return (
    'https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id,
      scope,
      redirect_uri,
      state,
    })
  );
};

exports.getAccessToken = async (code) => {
  const tokenResponse = await axios.post(
    'https://accounts.spotify.com/api/token',
    querystring.stringify({
      grant_type: 'authorization_code',
      code,
      redirect_uri,
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization:
          'Basic ' +
          Buffer.from(client_id + ':' + client_secret).toString('base64'),
      },
    }
  );

  spotifyTokens = {
    access_token: tokenResponse.data.access_token,
    refresh_token: tokenResponse.data.refresh_token,
    expires_at: Date.now() + tokenResponse.data.expires_in * 1000,
  };

  return spotifyTokens;
};

exports.refreshAccessToken = async () => {
  if (!spotifyTokens.refresh_token)
    throw new Error('No refresh token available');

  const tokenResponse = await axios.post(
    'https://accounts.spotify.com/api/token',
    querystring.stringify({
      grant_type: 'refresh_token',
      refresh_token: spotifyTokens.refresh_token,
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization:
          'Basic ' +
          Buffer.from(client_id + ':' + client_secret).toString('base64'),
      },
    }
  );

  spotifyTokens.access_token = tokenResponse.data.access_token;
  spotifyTokens.expires_at = Date.now() + tokenResponse.data.expires_in * 1000;

  return spotifyTokens;
};

exports.getAccessTokenSafe = async () => {
  if (!spotifyTokens.access_token || Date.now() > spotifyTokens.expires_at) {
    await exports.refreshAccessToken();
  }
  return spotifyTokens.access_token;
};

exports.getProfile = async (access_token) => {
  const response = await axios.get('https://api.spotify.com/v1/me', {
    headers: { Authorization: 'Bearer ' + access_token },
  });
  return response.data;
};

exports.getPlaylists = async (access_token) => {
  const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
    headers: { Authorization: 'Bearer ' + access_token },
  });
  return response.data;
};

exports.getRecentlyPlayed = async (access_token) => {
  const response = await axios.get(
    'https://api.spotify.com/v1/me/player/recently-played',
    {
      headers: { Authorization: 'Bearer ' + access_token },
    }
  );
  return response.data;
};
