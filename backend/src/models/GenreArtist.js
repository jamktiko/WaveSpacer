const pool = require('../database/index');

module.exports = class GenreArtist {
  constructor(Genre_id, Artist_id) {
    this.Genre_id = Genre_id;
    this.Artist_id = Artist_id;
  }

  static async save(entries) {
    if (!entries || entries.length === 0) return;
    const values = entries.map((e) => [e.Genre_id, e.Artist_id]);

    const query =
      'INSERT IGNORE INTO Genre_Artist (Genre_id, Artist_id) VALUES ?';

    await pool.query(query, [values]);
  }

  static async getIds() {
    const query =
      'SELECT * FROM Genre_Artist WHERE Genre_id = ? AND Artist_id = ?;';
    const [result] = await pool.query(query, [this.Genre_id, this.Artist_id]);
    return result;
  }
};
