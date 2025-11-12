const pool = require('../database/index');

exports.getTopGenres = async (userId) => {
  const query =
    'SELECT g.name AS genre,COUNT(*) AS count FROM Song s JOIN Artist_Song ars ON s.id = ars.Song_id JOIN Genre_Artist ga ON ars.Artist_id = ga.Artist_id JOIN Genre g ON ga.Genre_id = g.id WHERE s.User_id = ? GROUP BY g.id, g.name ORDER BY count DESC;';
  const [result] = await pool.query(query, [userId]);
  return result;
};

exports.getGenresOfSong = async (trackId, userId) => {
  const query = `SELECT g.name FROM Genre g INNER JOIN Genre_Artist ga ON g.id = ga.Genre_id INNER JOIN Artist_Song ars ON ga.Artist_id = ars.Artist_id INNER JOIN Song s ON ars.Song_id = s.id WHERE s.User_id = ? AND s.spotify_track_id = ? `;
  const result = await pool.query(query, [userId, trackId]);
  return result.length > 0 ? result.map((r) => r.name) : [];
};
