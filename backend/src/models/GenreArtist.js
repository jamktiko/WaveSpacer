const pool = require("../database/index");

exports.save = async (entries) => {
  if (!entries || entries.length === 0) return;
  const values = entries.map((e) => [e.Genre_id, e.Artist_id]);

  const query =
    "INSERT IGNORE INTO Genre_Artist (Genre_id, Artist_id) VALUES ?";

  await pool.query(query, [values]);
};
