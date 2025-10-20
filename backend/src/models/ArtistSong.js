const pool = require('../database/index');

module.exports = class ArtistSong {
  constructor(Song_id, Artist_id) {
    this.Song_id = Song_id;
    this.Artist_id = Artist_id;
  }

  async save(entries) {
    if (!entries || entries.length === 0) return;
    const values = entries.map((e) => [e.Song_id, e.Artist_id]);

    const query = 'INSERT INTO ArtistSong VALUES ?';

    await pool.query(query, [values]);
  }
};
