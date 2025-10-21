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

    const after = !lastTime ? null : lastTime - 1000 * 60 - 5000;

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
    let artists = [];
    let genres = [];

    for (let song of recents.items) {
      // const song = new Song(
      //   song.track.id,
      //   song.track.name,
      //   userId,
      //   song.track.album.images[0].url
      // );
      newSongs.push({
        spotify_track_id: song.track.id,
        name: song.track.name,
        User_id: userId,
        track_image: song.track.album.images?.[0]?.url,
      });
      songHistory.push({
        spotify_track_id: song.track.id,
        played_at: song.played_at,
        User_id: userId,
      });
      for (let artist of song.track.artists) {
        let artistData = spotifyService.getArtist(artist.id);
        for (let genre of artistData.genres) {
          genres.push(genre);
        }
        artists.push({ name: artist.name, genres: genres });
      }

      // for (let artist of song.track.artists) {
      //   const artistData = await spotifyService.getArtist(
      //     accessToken,
      //     artist.id
      //   );
      //   artists.push(artist.name);
      //   for (let genre of artist.genres) {
      //     genres.push(genre);
      //   }
      // }
    }

    artists = [...new Set(artists)];
    genres = [...new Set(genres)];
    newSongs = [...new Set(newSongs)];

    if (newSongs.length > 0) {
      await Song.save(newSongs);
    }
    let spotifyIds = songHistory.map((song) => song.spotify_track_id);

    await Genre.save(genres);
    await Artist.save(artists);

    let allGenres = await Genre.getGenres(genres);

    let existingSongs = await Song.getSongsBySpotifyIds(userId, spotifyIds);
    let playHistory = new Map(
      songHistory.map((h) => [
        h.spotify_track_id,
        { played_at: h.played_at, User_id: h.User_id },
      ])
    );

    let merged = existingSongs.map((song) => {
      let history = playHistory.get(song.spotify_track_id);
      return {
        Song_id: song.id,
        played_at: history.played_at,
        User_id: history.User_id,
      };
    });

    if (merged.length > 0) {
      await PlayHistory.save(merged);
    }

    // const playHistory = new PlayHistory(song.played_at, songId, userId);

    lastFetchedAt.set(userId, Date.now());

    allMerged.push({ userId, count: merged.length });
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
