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
const trackRepository = require('../repositories/trackRepository');
const genreRepository = require('../repositories/genreRepository');

const e = require('cors');
const { encrypt } = require('../utils/encryption');

// this is called in a login route, gets login url from spotify
exports.login = (req, res) => {
  const url = spotifyService.getLoginUrl();
  res.redirect(url);
};

// used when login has been done
// gets code from the spotify url and we get users tokens with that code
exports.callback = async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send('No code returned');

  try {
    const tokens = await spotifyService.getAccessToken(code);
    const me = await spotifyService.getProfile(tokens.access_token);
    const user = new User(me.id);
    let userID = await user.getUserID();

    if (!userID) {
      userID = await user.save();
    }

    const encryptedRefTkn = await encrypt(tokens.refresh_token);

    const userTokens = new UserTokens(
      'spotify_refresh_token',
      encryptedRefTkn,
      null,
      userID
    );

    await userTokens.save();

    const expiresAt = Math.floor(Date.now() / 1000) + (tokens.expires_in - 60);

    const encryptedAccTkn = await encrypt(tokens.access_token);

    const userTokens2 = new UserTokens(
      'spotify_access_token',
      encryptedAccTkn,
      expiresAt,
      userID
    );

    await userTokens2.save();

    return authController.loginWithSpotify(userID, res);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ success: false, message: 'Spotify login failed' });
  }
};

// gets users spotify profile information
exports.profile = async (req, res) => {
  try {
    const userId = req.user_id;
    const access_token = await tokenStore.getAccessTokenOrRefresh(
      userId,
      'spotify_access_token'
    );
    const profile = await spotifyService.getProfile(access_token);

    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching profile');
  }
};

// gets users playlists from spotify
exports.playlists = async (req, res) => {
  try {
    const userId = req.user_id;
    let access_token = await tokenStore.getAccessTokenOrRefresh(
      userId,
      'spotify_access_token'
    );

    const playlists = await spotifyService.getPlaylists(access_token);
    res.json(playlists);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching playlists');
  }
};

// get users recently played tracks and send them to frontend as JSON
exports.recents = async (req, res) => {
  try {
    const userId = req.user_id;
    let access_token = await tokenStore.getAccessTokenOrRefresh(
      userId,
      'spotify_access_token'
    );

    const recents = await spotifyService.getRecentlyPlayed(access_token);
    let spotifyIds = [];
    let songs = [];

    // loop through users recently listened songs
    for (let song of recents.items) {
      // put track ids in a list
      spotifyIds.push(song.track.id);

      // put needed information from a song to a list
      songs.push({
        spotify_track_id: song.track.id,
        name: song.track.name,
        User_id: userId,
        played_at: song.played_at,
        track_image: song.track.album.images?.[0]?.url,
        artists: song.track.artists,
      });
    }

    // get all songs from the user, that we have in the database
    const dbSongs = await Song.getSongsBySpotifyIds(userId, spotifyIds);

    // creates an list that lets us see what song has which amount of plays
    const amountMap = new Map(
      dbSongs.map((s) => [s.spotify_track_id, s.amount])
    );

    // gets all keys from song and sets an amount key.
    songs = songs.map((song) => ({
      ...song,

      // search the right amount from amountMap by songs spotify track id
      amount: amountMap.get(song.spotify_track_id) || 0,
    }));

    res.json(songs);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching recently played tracks');
  }
};

// get infomation from last month favorite song
exports.lastMonthFavInfo = async (req, res) => {
  try {
    const userId = req.user_id;
    let access_token = await tokenStore.getAccessTokenOrRefresh(
      userId,
      'spotify_access_token'
    );
    const result = await trackRepository.favoriteFromLastMonth(userId);
    const info = await spotifyService.getTrack(
      result.spotify_track_id,
      access_token
    );
    const genres = await genreRepository.getGenresOfSong(
      result.spotify_track_id,
      userId
    );
    result.duration_ms = info.duration_ms;

    if (result.genres) {
      result.genres = genres.join(', ');
    } else {
      result.genres = null;
    }
    res.json(result);
  } catch (err) {
    console.error('Error in lastMonthFavInfo:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Cron job: Fetch recently played Spotify tracks for all users.
// This runs every X minutes/hours
exports.fetchRecentsForAllUsers = async () => {
  const users = await User.getAllUsers();
  let allMerged = [];

  for (let user of users) {
    try {
      let userId = user.id;
      let accessToken = await tokenStore.getAccessTokenOrRefresh(
        userId,
        'spotify_access_token'
      );

      // when was the last time an user listened a song
      const lastTime = await PlayHistory.getLastPlayedAt(userId);

      const after = !lastTime ? null : lastTime + 1000;

      // Fetch recently played tracks from Spotify API
      let recents = await spotifyService.getRecentlyPlayed(accessToken, after);

      recents.items = recents.items.filter((item) => {
        const playedMs = new Date(item.played_at).getTime();
        return lastTime === null || playedMs > lastTime;
      });

      if (!recents?.items?.length) {
        console.log(`Ei uusia kappaleita käyttäjälle ${userId}`);
        continue;
      }

      // Structures to collect all new data before saving
      let newSongs = [];
      let songHistory = [];
      let artistNames = new Set();
      let genreNames = new Set();
      let artistSongLinks = [];
      let genreArtistLinks = [];

      // Extract song, artist and genre information from every recent track
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

        // loop through artists of a song and put them in a list
        for (let artist of song.track.artists) {
          let artistData = await spotifyService.getArtist(
            artist.id,
            accessToken
          );

          artistNames.add(artist.name);

          artistSongLinks.push({
            artist_name: artist.name,
            spotify_track_id: song.track.id,
          });

          // loop through genres of an artist and put them in a list
          for (let genre of artistData.genres) {
            genreNames.add(genre);

            genreArtistLinks.push({
              artist_name: artist.name,
              genre_name: genre,
            });
          }
        }
      }

      // Prepare artists and genres for bulk insert
      const artists = [...artistNames].map((name) => ({ name }));
      const genres = [...genreNames].map((name) => ({ name }));

      await Song.save(newSongs);
      await Genre.save(genres);
      await Artist.save(artists);

      // get artists, genres and songs from database
      const allArtists = await Artist.getArtists(artists.map((a) => a.name));
      const allGenres = await Genre.getGenres(genres.map((g) => g.name));
      const allSongs = await Song.getSongsBySpotifyIds(
        userId,
        newSongs.map((s) => s.spotify_track_id)
      );

      // Artist_Song
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

      allMerged.push({ userId, count: playHistoryRecords.length });
    } catch (err) {
      console.error(`Virhe käyttäjältä ${user.id}:`, err.message);
      continue;
    }
  }
  return allMerged;
};

// gets selected playlists tracks from frontend
// send every tracks data to frontend
exports.getTracksFromFrontend = async (req, res) => {
  try {
    const userId = req.user_id;
    let accessToken = await tokenStore.getAccessTokenOrRefresh(
      userId,
      'spotify_access_token'
    );

    // selected playlists id from frontend
    const playlistId = req.body.playlist_id;

    const playlistTracks = await spotifyService.getPlaylistTracks(
      accessToken,
      playlistId
    );
    if (!playlistTracks?.items?.length) {
      return res.json({ message: 'Playlist is empty.' });
    }

    const allPlTrackIds = playlistTracks.items.map((item) => item.track.id);

    const allTracks = await trackRepository.getTrackIds(userId, allPlTrackIds);

    // makes a list that filters songs that we have to get from spotify api (the songs we do not have in the database)
    const SongsFromApi = allPlTrackIds.filter((id) => !allTracks.includes(id));

    const SongsFromDb = await trackRepository.getTracks(userId, allPlTrackIds);

    const apiTracksData = await spotifyService.getTracks(
      SongsFromApi,
      accessToken
    );

    const newTracks = apiTracksData.tracks.map((track) => ({
      spotify_track_id: track.id,
      song_name: track.name,
      artist_names: track.artists.map((a) => a.name).join(),
      amount: 0,
      track_image: track.album.images?.[0]?.url,
    }));

    // list of the songs we got from database and from the spotify api
    const combinedTracks = [...SongsFromDb, ...newTracks];

    return res.json(combinedTracks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error getting songs' });
  }
};

// delete the tracks from playlist that were selected in frontend
exports.deleteTracksFromPlaylist = async (req, res) => {
  try {
    const userId = req.user_id;
    let accessToken = await tokenStore.getAccessTokenOrRefresh(
      userId,
      'spotify_access_token'
    );
    const { playlist_id, track_uris } = req.body;

    await spotifyService.deletePlaylistTracks(
      track_uris,
      playlist_id,
      accessToken
    );
  } catch (error) {
    console.error('Error deleting tracks:', error.response?.data || error);
  }
};
