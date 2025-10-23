const pool = require('../database/index');

module.exports = class Song {
  constructor(spotify_track_id, name, User_id, track_image) {
    this.spotify_track_id = spotify_track_id;
    this.name = name;
    this.User_id = User_id;
    this.track_image = track_image;
  }

  // static async save(entries) {
  //   const values = entries.map((e) => [
  //     e.spotify_track_id,
  //     e.name,
  //     e.User_id,
  //     e.track_image,
  //   ]);
  //   const query = `INSERT INTO Song (spotify_track_id, name, amount, User_id, track_image) VALUES ?;`;
  //   await pool.query(query, [values]);
  // }

  static async save(entries) {
    if (!entries || entries.length === 0) return;

    const values = entries
      .map(
        (e) =>
          `('${e.spotify_track_id}', ${pool.escape(e.name)}, ${pool.escape(
            e.User_id
          )}, ${pool.escape(e.track_image)})`
      )
      .join(',');

    const query = `
    INSERT INTO Song (spotify_track_id, name, User_id, track_image)
    VALUES ${values}
    ON DUPLICATE KEY UPDATE amount = amount + 1;
  `;

    await pool.query(query);
  }

  static async getUsersSongs(userId) {
    const query = `SELECT * FROM Song WHERE User_id = ?`;
    const [result] = await pool.query(query, userId);
    return result;
  }

  static async getSongsBySpotifyIds(userId, spotifyIds) {
    if (!spotifyIds.length) return [];

    const placeholders = spotifyIds.map(() => '?').join(',');
    const query = `
    SELECT id, spotify_track_id
    FROM Song
    WHERE User_id = ? AND spotify_track_id IN (${placeholders})
  `;
    const [rows] = await pool.query(query, [userId, ...spotifyIds]);
    return rows;
  }

  static async updateAmount(id) {
    const query = 'UPDATE Song SET amount = + 1 WHERE id = ?';
    await pool.query(query, id);
  }
};
