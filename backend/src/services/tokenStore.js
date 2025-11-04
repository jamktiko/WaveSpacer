const tokenCache = new Map();
const UserTokens = require("../models/UserTokens");

const spotifyService = require("./spotifyService");

async function setAccessToken(userId, access_token, type, expiresIn) {
  // const testExpiresIn = 30; // sekuntia
  // const expiresAt = Date.now() + testExpiresIn * 1000;

  const expiresAt = Date.now() + (expiresIn - 60) * 1000;

  const userTokens2 = new UserTokens(type, access_token, expiresAt, userId);

  await userTokens2.save();
}

async function getAccessToken(userId, type) {
  const entry = await UserTokens.getToken(userId, "spotify_access_token");
  if (!entry) return null;

  if (Date.now() > entry.expiresAt) {
    const userTokens2 = new UserTokens(type, null, null, userId);
    userTokens2.save();
    return null;
  }

  return entry.token;
}

async function getAccessTokenOrRefresh(userId, type) {
  let accessToken = getAccessToken(userId, type);
  if (accessToken) return accessToken;

  const newAccessToken = await spotifyService.refreshAccessToken(userId);
  return newAccessToken;
}

module.exports = { setAccessToken, getAccessToken, getAccessTokenOrRefresh };
