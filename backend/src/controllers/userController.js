const User = require('../models/User');

exports.getUserInfo = async (req, res) => {
  try {
    const userId = req.user_id;
    userInfo = await User.getUserById(userId);
    return userInfo;
  } catch {
    console.error('Error getting user info:', error.response?.data || error);
  }
};
