tokenCache = new Map();

function setAccessToken(userId, accessToken, expiresIn) {
  const expiresAt = Date.now() + (expiresIn - 60) * 1000;
  tokenCache.set(userId, { accessToken, expiresAt });
}

function getAccessToken(userId) {
  const entry = tokenCache.get(userId);
  if (!entry) return null;

  // Is expired?
  if (Date.now() > entry.expiresAt) {
    tokenCache.delete(userId);
    return null;
  }

  return entry.accessToken;
}

module.exports = { setAccessToken, getAccessToken };
