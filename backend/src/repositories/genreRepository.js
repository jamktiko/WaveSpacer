const pool = require('../database/index');

exports.getTopGenres = async (userId) => {
  const query =
    'SELECT g.name AS genre,COUNT(*) AS count FROM Song s JOIN Artist_Song ars ON s.id = ars.Song_id JOIN Genre_Artist ga ON ars.Artist_id = ga.Artist_id JOIN Genre g ON ga.Genre_id = g.id WHERE s.User_id = 5 GROUP BY g.id, g.name;';
  const result = await pool.query(query, [userId]);
};
