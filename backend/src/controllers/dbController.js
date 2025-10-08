const pool = require('../database/index');

exports.test = async (req, res) => {
  try {
    const query = 'SELECT * FROM User';
    const [results] = await pool.query(query);
    res.json({ success: true, results });
  } catch (err) {
    console.error('DB connection error:', err);
    res.status(500).json({ success: false, message: 'DB connection failed' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const query = 'DELETE FROM User WHERE spotify_user_id = "spotid222-8167"';
    const [results] = await pool.query(query);
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    console.error('DB connection error:', err);
    res.status(500).json({ success: false, message: 'DB connection failed' });
  }
};
