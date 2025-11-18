const pool = require("../database/index");

exports.save = async (entries) => {
  if (!entries || entries.length === 0) return;

  const values = entries.map((a) => [a.name || a]);

  const query = `INSERT IGNORE INTO Artist (name) VALUES ?;`;
  await pool.query(query, [values]);
};

exports.getArtistId = async () => {
  const query = `SELECT * FROM Artist WHERE name = ?`;
  const [result] = await pool.query(query, this.name);
  return result;
};

exports.getArtists = async (names) => {
  if (!names || names.length === 0) return [];

  const placeholders = names.map(() => "?").join(", ");
  const query = `SELECT * FROM Artist WHERE name IN (${placeholders})`;
  const [result] = await pool.query(query, names);

  return result;
};
