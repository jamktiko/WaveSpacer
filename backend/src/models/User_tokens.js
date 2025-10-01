const pool = require('../database/index');

module.exports = class User_tokens {
  constructor(type, token, User_id) {
    this.type = type;
    this.token = token;
    this.User_id = User_id;
  }

  async save() {
    const query = `INSERT INTO User_tokens (type, token, User_id) VALUES (?, ?, ?) 
    ON DUPLICATE KEY UPDATE token = VALUES(token)`;

    const [result] = await pool.query(query, [
      this.type,
      this.token,
      this.User_id,
    ]);

    return result;
  }

  async getToken() {
    const query = `SELECT token FROM User_tokens WHERE User_id = ?`;

    const [result] = await pool.query(query, [this.User_id]);

    return result;
  }
};
