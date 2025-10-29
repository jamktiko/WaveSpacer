const axios = require('axios');
const querystring = require('querystring');
const randomUtils = require('../utils/randomUtils');
const UserTokens = require('../models/UserTokens');
const User = require('../models/User');

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = `${process.env.FRONTEND_URL}/spotifycb`;

console.log('Spotify service envs:');
console.log(
  'Spotify client id?',
  process.env.SPOTIFY_CLIENT_ID ? '✅ found' : '❌ missing'
);
console.log('redirect URL: ' + redirect_uri);

exports.getLoginUrl = () => {
  const state = randomUtils.generateRandomString();
  const scope = 'user-read-private user-read-email user-read-recently-played';
  console.log('Redirect URI käytössä:', redirect_uri);
  const spotify =
    'https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id,
      scope,
      redirect_uri,
      state,
    });
  return spotify;
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

  return {
    access_token: tokenResponse.data.access_token,
    refresh_token: tokenResponse.data.refresh_token,
    expires_in: Date.now() + tokenResponse.data.expires_in,
  };
};

exports.refreshAccessToken = async (userId) => {
  const refresh_token = await UserTokens.getToken(userId, 'spotify');

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
    const userTokens = new UserTokens('spotify', new_refresh_token, userID);
    await userTokens.save();
  }
  return access_token;
};

// exports.getAccessTokenSafe = async () => {
//   if (!spotifyTokens.access_token || Date.now() > spotifyTokens.expires_at) {
//     await exports.refreshAccessToken();
//   }
//   return spotifyTokens.access_token;
// };

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

exports.getPlaylistTracks = async (access_token, playlistId) => {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        headers: { Authorization: 'Bearer ' + access_token },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      'Spotify API error:',
      error.response?.status,
      error.response?.data || error.message
    );
    throw new Error('Spotify API request failed');
  }
};

exports.getRecentlyPlayed = async (access_token, after) => {
  let url = 'https://api.spotify.com/v1/me/player/recently-played?limit=50';
  if (after) {
    url += `&after=${after}`;
  }
  const response = await axios.get(url, {
    headers: { Authorization: 'Bearer ' + access_token },
  });
  return response.data;
};

exports.getArtist = async (artistId, access_token) => {
  const response = await axios.get(
    `https://api.spotify.com/v1/artists/${artistId}`,
    {
      headers: { Authorization: 'Bearer ' + access_token },
    }
  );
  return response.data;
};

exports.getTracks = async (track_ids, access_token) => {
  const response = await axios.get(
    `https://api.spotify.com/v1/tracks?ids=${track_ids.join()}`,
    {
      headers: { Authorization: 'Bearer ' + access_token },
    }
  );
  return response.data;
};
