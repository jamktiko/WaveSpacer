const randomUtils = require('../utils/randomUtils');

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
