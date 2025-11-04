const pool = require("../database/index");

// static async save(entries) {
//   const values = entries.map((e) => [
//     e.spotify_track_id,
//     e.name,
//     e.User_id,
//     e.track_image,
//   ]);
//   const query = `INSERT INTO Song (spotify_track_id, name, amount, User_id, track_image) VALUES ?;`;
//   await pool.query(query, [values]);
// }

exports.save = async (entries) => {
  if (!entries || entries.length === 0) return;

  const values = entries
    .map(
      (e) =>
        `('${e.spotify_track_id}', ${pool.escape(e.name)}, 1, ${pool.escape(
          e.User_id
        )}, ${pool.escape(e.track_image)})`
    )
    .join(",");

  console.log("Values: " + values);
  const query = `
    INSERT INTO Song (spotify_track_id, name, amount, User_id, track_image)
    VALUES ${values}
    ON DUPLICATE KEY UPDATE amount = amount + 1;
  `;

  await pool.query(query);
};

exports.getUsersSongs = async (userId) => {
  const query = `SELECT * FROM Song WHERE User_id = ?`;
  const [result] = await pool.query(query, userId);
  return result;
};

exports.getSongsBySpotifyIds = async (userId, spotifyIds) => {
  if (!spotifyIds.length) return [];

  const placeholders = spotifyIds.map(() => "?").join(",");
  const query = `
    SELECT id, spotify_track_id
    FROM Song
    WHERE User_id = ? AND spotify_track_id IN (${placeholders})
  `;
  const [rows] = await pool.query(query, [userId, ...spotifyIds]);
  return rows;
};

exports.updateAmount = async (id) => {
  const query = "UPDATE Song SET amount = + 1 WHERE id = ?";
  await pool.query(query, id);
};
