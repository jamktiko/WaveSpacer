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
      async getSongs() {
        patchState(store, { loading: true });
        try {
          const res = await apiService.getSongs();
          const mapped: Songdata[] = res.data.map((song: any) => ({
            id: song.id,
            name: song.name,
            amount: song.amount,
            track_image: song.track_image,
            artists_name: song.artists_name.map((song: any) => song),
          }));
          patchState(store, { songs: mapped, loading: false });
        } catch (err) {
          console.error('Failed to fetch playlists', err);
          patchState(store, { songs: [], loading: false });
        }
      },
    };
  })
);
