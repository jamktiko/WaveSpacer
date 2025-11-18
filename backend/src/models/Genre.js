const pool = require("../database/index");

exports.save = async (entries) => {
  if (!entries || entries.length === 0) return;

  const values = entries.map((g) => [g.name]);

  const query = `INSERT IGNORE INTO Genre (name) VALUES ?;`;

  await pool.query(query, [values]);
};

exports.getGenres = async (names) => {
  if (!names || names.length === 0) return [];

  const placeholders = names.map(() => "?").join(", ");
  const query = `SELECT * FROM Genre WHERE name IN (${placeholders})`;
  const [result] = await pool.query(query, names);

  return result;
};
