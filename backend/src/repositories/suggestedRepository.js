const pool = require('../database/index');

exports.suggestByPlayDate = async (userId, spotifyIds, amount, unit) => {
  if (!['DAY', 'MONTH', 'YEAR'].includes(unit)) throw Error('Invalid unit');

  const interval = `${amount} ${unit}`;
  const placeholders = spotifyIds.map(() => '?').join(',');

  const query = `SELECT s.id,s.spotify_track_id ,s.name AS song_name, s.amount, s.track_image,GROUP_CONCAT(a.name SEPARATOR ', ') AS artist_names FROM Song s INNER JOIN Artist_Song ars ON s.id = ars.Song_id INNER JOIN Artist a ON ars.Artist_id = a.id INNER JOIN Play_history ph ON s.id = ph.Song_id WHERE ph.played_at < DATE_SUB(CURDATE(), INTERVAL ${interval}) AND ph.User_id = ? AND spotify_track_id IN (${placeholders}) GROUP BY s.id`;
  const [result] = await pool.query(query, [userId, ...spotifyIds]);
  return result;
};
