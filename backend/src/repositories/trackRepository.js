const pool = require('../database/index');

exports.getTracks = async (userId, spotifyIds) => {
  const placeholders = spotifyIds.map(() => '?').join(',');
  const query = `SELECT s.id,s.spotify_track_id ,s.name AS song_name, s.amount, s.track_image,GROUP_CONCAT(a.name SEPARATOR ', ') AS artist_names, MAX(ph.played_at) AS last_played FROM Song s INNER JOIN Play_history ph ON s.id = ph.Song_id INNER JOIN Artist_Song ars ON s.id = ars.Song_id INNER JOIN Artist a ON ars.Artist_id = a.id WHERE s.User_id = ? AND spotify_track_id IN (${placeholders}) GROUP BY s.id, s.spotify_track_id, s.name, s.amount, s.track_image;`;
  const [result] = await pool.query(query, [userId, ...spotifyIds]);

  return result;
};

exports.getTrackIds = async (userId, spotifyIds) => {
  const placeholders = spotifyIds.map(() => '?').join(',');
  const query = `SELECT s.spotify_track_id FROM Song s INNER JOIN Artist_Song ars ON s.id = ars.Song_id INNER JOIN Artist a ON ars.Artist_id = a.id WHERE s.User_id = ? AND spotify_track_id IN (${placeholders});`;
  const [result] = await pool.query(query, [userId, ...spotifyIds]);

  return result.map((row) => row.spotify_track_id);
};

exports.getTracksModified = async (userId, spotifyIds) => {
  const placeholders = spotifyIds.map(() => '?').join(',');
  const query = `SELECT s.id,s.spotify_track_id ,s.name AS song_name, s.amount, s.track_image,GROUP_CONCAT(a.name SEPARATOR ', ') AS artist_names FROM Song s INNER JOIN Artist_Song ars ON s.id = ars.Song_id INNER JOIN Artist a ON ars.Artist_id = a.id WHERE s.User_id = ? AND spotify_track_id IN (${placeholders}) GROUP BY s.id;`;
  const [result] = await pool.query(query, [userId, ...spotifyIds]);

  return result;
};

exports.favoriteFromLastMonth = async (userId) => {
  const query = `SELECT 
  s.id,
  s.spotify_track_id,
  s.name AS song_name,
  s.track_image,
  GROUP_CONCAT(a.name SEPARATOR ', ') AS artist_names,
  COUNT(ph.Song_id) AS plays,
  MAX(ph.played_at) AS last_played
  FROM Song s
  INNER JOIN Play_history ph ON s.id = ph.Song_id
  INNER JOIN Artist_Song ars ON s.id = ars.Song_id
  INNER JOIN Artist a ON ars.Artist_id = a.id
  WHERE ph.played_at >= DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01')
  AND ph.played_at < DATE_FORMAT(CURDATE(), '%Y-%m-01')
  AND s.User_id = ?
  GROUP BY 
  s.id,
  s.spotify_track_id,
  s.name,
  s.track_image
  ORDER BY 
  plays DESC,
  last_played DESC
  LIMIT 1;`;

  const [result] = await pool.query(query, [userId]);
  return result[0] || null;
};
