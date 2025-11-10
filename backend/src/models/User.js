const pool = require('../database/index');

module.exports = class User {
  constructor(spotify_user_id) {
    this.spotify_user_id = spotify_user_id;
  }

  async save() {
    const query = `INSERT INTO User (spotify_user_id) VALUES (?)`;

    const [result] = await pool.query(query, [this.spotify_user_id]);

    return result.insertId;
  }

  async getUserID() {
    const query = `SELECT id FROM User WHERE spotify_user_id = ?`;
    const [result] = await pool.query(query, [this.spotify_user_id]);

    return result.length > 0 ? result[0].id : null;
  }

  static async getAllUsers() {
    const query = `SELECT * FROM User`;
    const [result] = await pool.query(query);
    return result;
  }

  static async getUserById(user_id) {
    const query = `SELECT * FROM User where id = ?`;
    const result = await pool.query(query, [user_id]);
    return result[0];
  }
};
