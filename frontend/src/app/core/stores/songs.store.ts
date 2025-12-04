import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { songState } from '../interfaces/songstate';
import { Songdata } from '../interfaces/songdata';
import { inject } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Genre } from '../interfaces/genre';

export const songStore = signalStore(
  {
    providedIn: 'root',
  },
  withState<songState>({
    songs: [] as Songdata[],
    loading: false,
    genres: [] as Genre[],
  }),
  withMethods((store) => {
    const apiService = inject(ApiService);
    return {
      async getSongs(id: string) {
        patchState(store, { loading: true });
        try {
          const res = await apiService.getSongs(id);
          console.log(res);
          const mapped: Songdata[] = res.data.map((song: any) => ({
            id: song.spotify_track_id,
            name: song.song_name,
            amount: song.amount,
            track_image: song.track_image,
            artist_names: song.artist_names.split(','),
            last_played: song.last_played || '-',
          }));
          console.log(mapped);
          const filtered: Songdata[] = mapped.filter(
            (song) => song.amount !== null && song.amount <= 5
          );
          const sorted: Songdata[] = filtered.sort(
            (a, b) => (a.amount ?? 0) - (b.amount ?? 0)
          );
          patchState(store, { songs: sorted, loading: false });
        } catch (err) {
          console.error('Failed to fetch playlists', err);
          patchState(store, { songs: [], loading: false });
        }
      },
      async deleteSongs(id: string | null, uris: string[]) {
        patchState(store, { loading: true });
        if (id) {
          try {
            await apiService.deleteSongs(id, uris);
            const updatedSongs = store
              .songs()
              .filter((song) => !uris.includes(`spotify:track:${song.id}`));
            patchState(store, {
              songs: updatedSongs,
              loading: false,
            });
          } catch (err) {
            console.log(err);
          }
        } else {
          console.log('id was null');
        }
      },
      async getGenres() {
        patchState(store, { loading: true });
        try {
          const res = await apiService.getGenres();
          const genres: Genre[] = res.data.map((genre: any) => ({
            genre: genre.genre,
            amount: genre.count,
          }));
          const sorted: Genre[] = [...genres].sort(
            (a, b) => b.amount - a.amount
          );
          patchState(store, { genres: sorted });
        } catch (err) {
          console.log('error getting genres', err);
        }
      },
    };
  })
);
