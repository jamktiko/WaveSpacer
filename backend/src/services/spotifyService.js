const axios = require('axios');
const querystring = require('querystring');
const randomUtils = require('../utils/randomUtils');
const User_tokens = require('../models/User_tokens');
const User = require('../models/User');

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri =
  process.env.SPOTIFY_REDIRECT_URI || 'http://127.0.0.1:4200/spotifycb';

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

  // spotifyTokens = {
  //   access_token: tokenResponse.data.access_token,
  //   refresh_token: tokenResponse.data.refresh_token,
  //   expires_in: Date.now() + tokenResponse.data.expires_in * 1000,
  // };

  return {
    access_token: tokenResponse.data.access_token,
    refresh_token: tokenResponse.data.refresh_token,
    expires_in: Date.now() + tokenResponse.data.expires_in,
  };

  // return spotifyToken;
};

exports.refreshAccessToken = async (userId) => {
  const refresh_token = await User_tokens.getToken(userId, 'spotify');

  const authHeader = Buffer.from(client_id + ':' + client_secret).toString(
    'base64'
  );

  const params = new URLSearchParams();
  params.append('grant_type', 'refresh_token');
  params.append('refresh_token', refresh_token);

  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    params,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + authHeader,
      },
    }
  );

  const access_token = response.data.access_token;
  const new_refresh_token = response.data.refresh_token || refresh_token;
  if (new_refresh_token !== refresh_token) {
    const me = await spotifyService.getProfile(access_token);
    const user = new User(me.id);
    const userID = await user.getUserID();
    const userTokens = new User_tokens('spotify', new_refresh_token, userID);
    await userTokens.save();
  }
  return access_token;
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
