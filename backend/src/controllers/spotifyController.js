const axios = require('axios');
const querystring = require('querystring');

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = 'http://127.0.0.1:8888/callback';

function generateRandomString(length = 16) {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// LOGIN: ohjaa käyttäjän Spotify-kirjautumiseen
exports.login = (req, res) => {
  const state = generateRandomString();
  const scope = 'user-read-private user-read-email user-read-recently-played';

  res.redirect(
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
  return tokenResponse.data;
};

exports.getRefreshToken = async (refresh_token) => {
  try {
    const tokenResponse = await axios.post(
      'https://accounts.spotify.com/api/token',
      querystring.stringify({
        grant_type: 'refresh_token',
        refresh_token: refresh_token,
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

    return {
      access_token: tokenResponse.data.access_token,
      refresh_token: tokenResponse.data.refresh_token || refresh_token,
      expires_in: tokenResponse.data.expires_in,
    };
  } catch (err) {
    console.error(
      'Error refreshing Spotify token:',
      err.response?.data || err.message
    );
    throw err;
  }
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
