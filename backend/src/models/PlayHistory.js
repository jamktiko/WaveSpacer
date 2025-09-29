const pool = require('../database/index');

exports.createPlayHistory = async (req, res) => {
  try {
    const query =
      "INSERT INTO Play_history ('played_at','Song_id','User_id','track_id') VALUES (?,?,?,?)";
    const [results] = await pool.query(query);
    res.json({ success: true, results });
  } catch (err) {
    console.error('DB connection error:', err);
    res.status(500).json({ success: false, message: 'DB connection failed' });
  }
};

module.exports = class PlayHistory {
  constructor(played_at, Song_id, User_id, track_id) {
    this.played_at = played_at;
    this.Song_id = Song_id;
    this.User_id = User_id;
    this.track_id = track_id;
  }

  async save(entries) {
    if (!entries || entries.length === 0) return;

    const values = entries.map((e) => [
      e.played_at,
      e.Song_id,
      e.User_id,
      e.track_id,
    ]);

    const query = `INSERT INTO Play_history (played_at, Song_id, User_id, track_id) VALUES ?`;

    await pool.query(query, [values]);
  }
};
