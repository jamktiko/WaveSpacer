const pool = require('../database/index');

module.exports = class User_tokens {
  constructor(type, token, expires_at, User_id, data, iv, tag) {
    this.type = type;
    this.token = token;
    this.expires_at = expires_at;
    this.User_id = User_id;
    this.data = data;
    this.iv = iv;
    this.tag = tag;
  }

  async save() {
    const query = `INSERT INTO User_tokens (type, token, expires_at, User_id) VALUES (?, ?, ?, ?, ?, ?, ?) 
    ON DUPLICATE KEY UPDATE token = VALUES(token), expires_at = VALUES(expires_at), data=VALUES(data), iv=VALUES(iv), tag=VALUES(tag);`;

    const [result] = await pool.query(query, [
      this.type,
      this.token,
      this.expires_at,
      this.User_id,
      this.data,
      this.iv,
      this.tag,
    ]);

    return result;
  }

  static async getToken(User_id, type) {
    const query = `
      SELECT token, expires_at
      FROM User_tokens
      WHERE User_id = ? AND type = ?
    `;

    const [rows] = await pool.query(query, [User_id, type]);
    if (!rows.length) return null;

    const { token, expires_at } = rows[0];
    return { token, expires_at };
  }
};
