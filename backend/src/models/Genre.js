const pool = require('../database/index');

module.exports = class Genre {
  constructor(name) {
    this.name = name;
  }

  static async save(entries) {
    if (!entries || entries.length === 0) return;

    const values = entries.map((g) => [g.name]);

    const query = `INSERT IGNORE INTO Genre (name) VALUES ?;`;

    await pool.query(query, [values]);
  }

  static async getGenreId() {
    const query = `SELECT id FROM Genre WHERE name = ?`;
    const [result] = await pool.query(query, this.name);
    return result.length > 0 ? result.id : null;
  }

  static async getGenres(names) {
    if (!names || names.length === 0) return [];

    const placeholders = names.map(() => '?').join(', ');
    const query = `SELECT * FROM Genre WHERE name IN (${placeholders})`;
    const [result] = await pool.query(query, names);

    return result;
  }
};
