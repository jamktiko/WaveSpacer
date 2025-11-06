const pool = require("../database/index");

exports.getTracks = async (userId, spotifyIds) => {
  const placeholders = spotifyIds.map(() => "?").join(",");
  const query = `SELECT s.id,s.spotify_track_id ,s.name AS song_name, s.amount, s.track_image,GROUP_CONCAT(a.name SEPARATOR ', ') AS artist_names FROM Song s INNER JOIN Artist_Song ars ON s.id = ars.Song_id INNER JOIN Artist a ON ars.Artist_id = a.id WHERE s.User_id = ? AND spotify_track_id IN (${placeholders}) GROUP BY s.id;`;
  const [result] = await pool.query(query, [userId, ...spotifyIds]);

  return result;
};

exports.getTrackIds = async (userId, spotifyIds) => {
  const placeholders = spotifyIds.map(() => "?").join(",");
  const query = `SELECT s.spotify_track_id FROM Song s INNER JOIN Artist_Song ars ON s.id = ars.Song_id INNER JOIN Artist a ON ars.Artist_id = a.id WHERE s.User_id = ? AND spotify_track_id IN (${placeholders});`;
  const [result] = await pool.query(query, [userId, ...spotifyIds]);

  return result.map((row) => row.spotify_track_id);
};

exports.getTracksModified = async (userId, spotifyIds) => {
  const placeholders = spotifyIds.map(() => "?").join(",");
  const query = `SELECT s.id,s.spotify_track_id ,s.name AS song_name, s.amount, s.track_image,GROUP_CONCAT(a.name SEPARATOR ', ') AS artist_names FROM Song s INNER JOIN Artist_Song ars ON s.id = ars.Song_id INNER JOIN Artist a ON ars.Artist_id = a.id WHERE s.User_id = ? AND spotify_track_id IN (${placeholders}) GROUP BY s.id;`;
  const [result] = await pool.query(query, [userId, ...spotifyIds]);

  return result;
};
