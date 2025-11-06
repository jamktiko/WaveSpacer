const tokenCache = new Map();
const UserTokens = require('../models/UserTokens');

const spotifyService = require('./spotifyService');

async function setAccessToken(userId, access_token, type, expiresIn) {
  const testExpiresIn = 30; // sekuntia
  const expiresAt = Date.now() + testExpiresIn * 1000;

  // const expiresAt = Date.now() + (expiresIn - 60) * 1000;

  const userTokens2 = new UserTokens(type, access_token, expiresAt, userId);

  await userTokens2.save();
}

async function getAccessToken(userId, type) {
  const entry = await UserTokens.getToken(userId, type);
  if (!entry) return null;

  // const expiresAt = Number(entry.expires_at);

  if (Math.floor(Date.now() / 1000) > entry.expires_at) {
    return null;
  }

  return entry.token;
}

async function getAccessTokenOrRefresh(userId, type) {
  let accessToken = await getAccessToken(userId, type);
  if (accessToken) return accessToken;

  const newAccessToken = await spotifyService.refreshAccessToken(userId);
  return newAccessToken;
}

module.exports = { setAccessToken, getAccessToken, getAccessTokenOrRefresh };
