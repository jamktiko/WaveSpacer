const spotifyService = require('../services/spotifyService');
const authController = require('./authController');
const createToken = require('../../createtoken');
const tokenStore = require('../services/tokenStore');
const UserTokens = require('../models/UserTokens');
const User = require('../models/User');
const PlayHistory = require('../models/PlayHistory');
const Song = require('../models/Song');
const Genre = require('../models/Genre');
const Artist = require('../models/Artist');
const ArtistSong = require('../models/ArtistSong');
const GenreArtist = require('../models/GenreArtist');

const lastFetchedAt = new Map();

exports.login = (req, res) => {
  const url = spotifyService.getLoginUrl();
  res.redirect(url);
};

exports.callback = async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send('No code returned');

  try {
    const tokens = await spotifyService.getAccessToken(code);
    const me = await spotifyService.getProfile(tokens.access_token);
    const user = new User(me.id);
    const userID = await user.getUserID();

    if (!userID) {
      userID = await user.save();
    }

    const userTokens = new UserTokens('spotify', tokens.refresh_token, userID);
    tokenStore.setAccessToken(
      userID,
      tokens.access_token,
      'spotify',
      tokens.expires_in
    );
    await userTokens.save();

    return authController.loginWithSpotify(userID, tokens, res);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ success: false, message: 'Spotify login failed' });
  }
};

exports.profile = async (req, res) => {
  try {
    // const access_token = await spotifyService.getAccessTokenSafe();
    const userId = req.user_id;
    const access_token = tokenStore.getAccessToken(userId);
    if (!access_token) {
      access_token = spotifyService.refreshAccessToken(userId);
    }
    const profile = await spotifyService.getProfile(access_token);
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching profile');
  }
};

exports.playlists = async (req, res) => {
  try {
    const userId = req.user_id;
    const access_token = tokenStore.getAccessToken(userId);
    if (!access_token) {
      access_token = spotifyService.refreshAccessToken(userId);
    }
    const playlists = await spotifyService.getPlaylists(access_token);
    res.json(playlists);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching playlists');
  }
};

exports.recents = async (req, res) => {
  try {
    const userId = req.user_id;
    const access_token = tokenStore.getAccessToken(userId);
    if (!access_token) {
      access_token = spotifyService.refreshAccessToken(userId);
    }
    const recents = await spotifyService.getRecentlyPlayed(access_token);
    res.json(recents);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching recently played tracks');
  }
};

exports.fetchRecentsForAllUsers = async () => {
  const users = await User.getAllUsers();
  let allMerged = [];

  for (let user of users) {
    let userId = user.id;
    let accessToken = await tokenStore.getAccessToken(userId);
    if (!accessToken) {
      console.warn(`Käyttäjältä ${userId} puuttuu access token`);
      continue;
    }

    const lastTime = lastFetchedAt.get(userId);

    const after = !lastTime ? null : lastTime;
    console.log('Unix aika' + after);

    let recents = await spotifyService.getRecentlyPlayed(accessToken, after);
    if (!recents?.items?.length) {
      console.log(`Ei uusia kappaleita käyttäjälle ${userId}`);
      continue;
    }
    // let existingTracks = await Song.getUsersSongs(userId);
    // let existingIds = new Set(
    //   existingTracks.map((song) => song.spotify_track_id)
    // );
    let newSongs = [];
    let songHistory = [];
    let artistNames = new Set();
    let genreNames = new Set();
    let artistSongLinks = [];
    let genreArtistLinks = [];

    for (let song of recents.items) {
      songHistory.push({
        spotify_track_id: song.track.id,
        played_at: song.played_at,
        User_id: userId,
      });

      newSongs.push({
        spotify_track_id: song.track.id,
        name: song.track.name,
        User_id: userId,
        track_image: song.track.album.images?.[0]?.url,
      });

      for (let artist of song.track.artists) {
        let artistData = await spotifyService.getArtist(artist.id, accessToken);

        artistNames.add(artist.name);

        artistSongLinks.push({
          artist_name: artist.name,
          spotify_track_id: song.track.id,
        });

        for (let genre of artistData.genres) {
          genreNames.add(genre);

          genreArtistLinks.push({
            artist_name: artist.name,
            genre_name: genre,
          });
        }
      }
    }

    const artists = [...artistNames].map((name) => ({ name }));
    const genres = [...genreNames].map((name) => ({ name }));

    await Song.save(newSongs);
    await Genre.save(genres);
    await Artist.save(artists);

    const allArtists = await Artist.getArtists(artists.map((a) => a.name));
    const allGenres = await Genre.getGenres(genres.map((g) => g.name));
    const allSongs = await Song.getSongsBySpotifyIds(
      userId,
      newSongs.map((s) => s.spotify_track_id)
    );

    const artistSongRecords = artistSongLinks
      .map((link) => {
        const artist = allArtists.find((a) => a.name === link.artist_name);
        const song = allSongs.find(
          (s) => s.spotify_track_id === link.spotify_track_id
        );
        return artist && song
          ? { Artist_id: artist.id, Song_id: song.id }
          : null;
      })
      .filter(Boolean);

    await ArtistSong.save(artistSongRecords);

    // Genre_Artist
    const genreArtistRecords = genreArtistLinks
      .map((link) => {
        const artist = allArtists.find((a) => a.name === link.artist_name);
        const genre = allGenres.find((g) => g.name === link.genre_name);
        return artist && genre
          ? { Artist_id: artist.id, Genre_id: genre.id }
          : null;
      })
      .filter(Boolean);

    await GenreArtist.save(genreArtistRecords);

    // Play_history
    const playHistoryRecords = songHistory
      .map((entry) => {
        const song = allSongs.find(
          (s) => s.spotify_track_id === entry.spotify_track_id
        );
        return song
          ? {
              Song_id: song.id,
              User_id: entry.User_id,
              played_at: entry.played_at,
            }
          : null;
      })
      .filter(Boolean);

    await PlayHistory.save(playHistoryRecords);

    const newestPlayedAt = new Date(recents.items[0].played_at).getTime();

    lastFetchedAt.set(userId, newestPlayedAt);

    allMerged.push({ userId, count: playHistoryRecords.length });
    console.log(playHistoryRecords);
  }
  return allMerged;
};

// res.json({
//   jwt: jwtToken,
//   access_token: spotifyTokens.access_token,
//   refresh_token: spotifyTokens.refresh_token,
//   expires_at: spotifyTokens.expires_at,
//   spotifyId: me.id,
// });
