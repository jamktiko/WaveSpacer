const pool = require('../database/index');

module.exports = class Genre {
  constructor(name) {
    this.name = name;
  }

  static async save(entries) {
    if (!entries || entries.length === 0) return;

    const values = entries.map((name) => [name]);

    const query = `INSERT IGNORE INTO Genre (name) VALUES ?;`;

    await pool.query(query, [values]);
  }

  static async getGenreId() {
    const query = `SELECT id FROM Genre WHERE name = ?`;
    const [result] = await pool.query(query, this.name);
    return result.length > 0 ? result.id : null;
  }

  static async getGenres(names) {
    const query = `Select * FROM Genre WHERE name IN ${names}`;
    const [result] = await pool.query(query);
    return result;
  }
};
