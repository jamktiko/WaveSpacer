const pool = require('../database/index');

exports.test = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT NOW() as now');
    res.json({ success: true, server_time: rows[0].now });
  } catch (err) {
    console.error('DB connection error:', err);
    res.status(500).json({ success: false, message: 'DB connection failed' });
  }
};
