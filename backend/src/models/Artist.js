const pool = require('../database/index');

module.exports = class Artist {
  constructor(name) {
    this.name = name;
  }

  static async save(entries) {
    if (!entries || entries.length === 0) return;

    const values = entries.map((a) => [a.name || a]);

    const query = `INSERT IGNORE INTO Artist (name) VALUES ?;`;
    await pool.query(query, [values]);
  }

  static async getArtistId() {
    const query = `SELECT * FROM Artist WHERE name = ?`;
    const [result] = await pool.query(query, this.name);
    return result;
  }

  static async getArtists(names) {
    if (!names || names.length === 0) return [];

    const placeholders = names.map(() => '?').join(', ');
    const query = `SELECT * FROM Artist WHERE name IN (${placeholders})`;
    const [result] = await pool.query(query, names);

    return result;
  }
};
