const pool = require('../database/index');

exports.save = async (entries) => {
  if (!entries || entries.length === 0) return;

  const values = entries.map((e) => [e.played_at, e.Song_id, e.User_id]);

  const query = `INSERT IGNORE INTO Play_history (played_at, Song_id, User_id) VALUES ?;`;

  await pool.query(query, [values]);
};

exports.getLastPlayedAt = async (userId) => {
  const query = `
    SELECT played_at 
    FROM Play_history 
    WHERE User_id = ? 
    ORDER BY played_at DESC 
    LIMIT 1
  `;
  const [rows] = await pool.query(query, [userId]);
  return rows.length ? new Date(rows[0].played_at + 'Z').getTime() : null;
};
