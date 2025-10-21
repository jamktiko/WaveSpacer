const pool = require('../database/index');

module.exports = class Artist {
  constructor(name) {
    this.name = name;
  }

  static async save(entries) {
    if (!entries || entries.length === 0) return;

    const values = entries.map((name) => [name]);

    const query = `INSERT IGNORE INTO Artist (name) VALUES ?;`;

    await pool.query(query, [values]);
  }

  static async getArtistId() {
    const query = `SELECT * FROM Artist WHERE name = ?`;
    const [result] = await pool.query(query, this.name);
    return result;
  }

  async getArtists() {
    const query = 'Select * FROM Artist';
    const [result] = await pool.query(query);
    return result;
  }
};
