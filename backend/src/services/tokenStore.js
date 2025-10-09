tokenCache = new Map();

function setAccessToken(userId, accessToken, type, expiresIn) {
  const existing = tokenCache.get(userId);

  if (existing === accessToken) {
    return;
  }
  const expiresAt = Date.now() + (expiresIn - 60) * 1000;
  tokenCache.set(userId, { type, accessToken, expiresAt });
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
