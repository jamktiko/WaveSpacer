const tokenCache = new Map();
const UserTokens = require('../models/UserTokens');
const { decrypt } = require('../utils/encryption');

const spotifyService = require('./spotifyService');

async function getAccessToken(userId, type) {
  const entry = await UserTokens.getToken(userId, type);

  if (!entry) return null;

  if (Math.floor(Date.now() / 1000) > entry.expires_at) {
    return null;
  }

  const decryptedTkn = await decrypt(entry.token);

  return decryptedTkn;
}

async function getAccessTokenOrRefresh(userId, type) {
  let accessToken = await getAccessToken(userId, type);
  if (accessToken) return accessToken;

  const newAccessToken = await spotifyService.refreshAccessToken(userId);
  return newAccessToken;
}

module.exports = { getAccessToken, getAccessTokenOrRefresh };
