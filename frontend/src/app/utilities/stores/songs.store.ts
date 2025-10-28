import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { songState } from '../interfaces/songstate';
import { Songdata } from '../interfaces/songdata';
import { inject } from '@angular/core';
import { ApiService } from '../services/api.service';

export const songStore = signalStore(
  {
    providedIn: 'root',
  },
  withState<songState>({
    songs: [] as Songdata[],
    loading: false,
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
            artist_names: song.artist_names.map((artist: any) => artist),
          }));
          const filtered: Songdata[] = mapped.filter(
            (song) => song.amount !== null && song.amount <= 5
          );
          patchState(store, { songs: filtered, loading: false });
        } catch (err) {
          console.error('Failed to fetch playlists', err);
          patchState(store, { songs: [], loading: false });
        }
      },
    };
  })
);
