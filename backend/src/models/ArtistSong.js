const pool = require("../database/index");

exports.save = async (entries) => {
  if (!entries || entries.length === 0) return;
  const values = entries.map((e) => [e.Artist_id, e.Song_id]);

  const query = "INSERT IGNORE INTO Artist_Song (Artist_id, Song_id) VALUES ?";

  await pool.query(query, [values]);
};
