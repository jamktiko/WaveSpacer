const pool = require("../database/index");

module.exports = class User_tokens {
  constructor(type, token, User_id) {
    this.type = type;
    this.token = token;
    this.User_id = User_id;
  }

  async save() {
    const query = `INSERT INTO User_tokens (type, token, User_id) VALUES (?, ?, ?) 
    ON DUPLICATE KEY UPDATE token = VALUES(token), expires_at = VALUES(expires_at);`;

    const [result] = await pool.query(query, [
      this.type,
      this.token,
      this.User_id,
    ]);

    return result;
  }

  static async getToken(User_id, type) {
    const query = `SELECT token, expires_at FROM User_tokens WHERE User_id = ? AND type = ?`;

    const [result] = await pool.query(query, [User_id, type]);

    if (result.expires_at)
      return { token: result[0].token, expires_at: result.expires_at };
    else return result.length ? result[0].token : null;
  }
};
