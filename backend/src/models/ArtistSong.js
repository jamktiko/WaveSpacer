const pool = require('../database/index');

module.exports = class ArtistSong {
  constructor(Song_id, Artist_id) {
    this.Song_id = Song_id;
    this.Artist_id = Artist_id;
  }

  static async save(entries) {
    if (!entries || entries.length === 0) return;
    const values = entries.map((e) => [e.Artist_id, e.Song_id]);

    const query =
      'INSERT IGNORE INTO Artist_Song (Artist_id, Song_id) VALUES ?';

    await pool.query(query, [values]);
  }

  static async getIds() {
    const query =
      'SELECT * FROM Artist_Song WHERE Song_id = ? AND Artist_id = ?;';
    const [result] = await pool.query(query, [this.Song_id, this.Artist_id]);
    return result;
  }
};
