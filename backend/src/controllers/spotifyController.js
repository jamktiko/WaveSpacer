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
    let userID = await user.getUserID();

    if (!userID) {
      userID = await user.save();
    }

    const userTokens = new UserTokens(
      'spotify_refresh_token',
      tokens.refresh_token,
      null,
      userID
    );

    await userTokens.save();

    // const expiresAt = Date.now() + (tokens.expires_in - 60) * 1000;
    const expiresAt = Math.floor(Date.now() / 1000) + (tokens.expires_in - 60);

    const userTokens2 = new UserTokens(
      'spotify_access_token',
      tokens.access_token,
      expiresAt,
      userID
    );

    await userTokens2.save();

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
    for (let song of recents.items) {
      spotifyIds.push(song.track.id);
      songs.push({
        spotify_track_id: song.track.id,
        name: song.track.name,
        User_id: userId,
        played_at: song.played_at,
        track_image: song.track.album.images?.[0]?.url,
        artists: song.track.artists,
      });
    }
    const dbSongs = await Song.getSongsBySpotifyIds(userId, spotifyIds);

    const amountMap = new Map(
      dbSongs.map((s) => [s.spotify_track_id, s.amount])
    );

    songs = songs.map((song) => ({
      ...song,
      amount: amountMap.get(song.spotify_track_id) || 0,
    }));

    res.json(songs);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching recently played tracks');
  }
};

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
    result.genres = genres.join(', ');
    res.json(result);
  } catch (err) {
    console.error('Error in lastMonthFavInfo:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//stayLoggedIn

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

      // const lastTime = lastFetchedAt.get(userId);
      const lastTime = await PlayHistory.getLastPlayedAt(userId);

      const after = !lastTime ? null : lastTime + 1000;

      console.log('after aika:', after);

      let recents = await spotifyService.getRecentlyPlayed(accessToken, after);

      console.log('recents palautus:', recents.items);

      console.log('raw lastTime:', lastTime);
      console.log('lastTime type:', typeof lastTime);
      if (lastTime !== null)
        console.log('lastTime human:', new Date(lastTime).toISOString());

      if (recents.items.length > 0) {
        const playedMs = new Date(recents.items[0].played_at).getTime();
        console.log('playedMs:', playedMs);
        console.log('playedMs human:', new Date(playedMs).toISOString());
        console.log('comparison result:', playedMs > lastTime);
      }

      recents.items = recents.items.filter((item) => {
        const playedMs = new Date(item.played_at).getTime();
        return lastTime === null || playedMs > lastTime;
      });

      console.log('uusi recents palautus:', recents.items);

      if (!recents?.items?.length) {
        console.log(`Ei uusia kappaleita käyttäjälle ${userId}`);
        continue;
      }

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
          let artistData = await spotifyService.getArtist(
            artist.id,
            accessToken
          );

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

      console.log('newSongs:', newSongs);

      await Song.save(newSongs);
      await Genre.save(genres);
      await Artist.save(artists);

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

      const newestPlayedAt = new Date(recents.items[0].played_at).getTime();

      // lastFetchedAt.set(userId, newestPlayedAt);

      allMerged.push({ userId, count: playHistoryRecords.length });
    } catch (err) {
      console.error(`Virhe käyttäjältä ${user.id}:`, err.message);
      continue;
    }
  }
  return allMerged;
};

exports.getTracksFromFrontend = async (req, res) => {
  try {
    const userId = req.user_id;
    let accessToken = await tokenStore.getAccessTokenOrRefresh(
      userId,
      'spotify_access_token'
    );
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

    const combinedTracks = [...SongsFromDb, ...newTracks];

    return res.json(combinedTracks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error getting songs' });
  }
};

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

//delete

// res.json({
//   jwt: jwtToken,
//   access_token: spotifyTokens.access_token,
//   refresh_token: spotifyTokens.refresh_token,
//   expires_at: spotifyTokens.expires_at,
//   spotifyId: me.id,
// });
