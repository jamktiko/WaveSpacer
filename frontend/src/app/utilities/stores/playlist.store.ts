import { inject } from '@angular/core';
import { ApiService } from '../services/api.service';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Playlistdata } from '../interfaces/playlistdata';
import { PlaylistsState } from '../interfaces/playlistsstate';

export const playlistStore = signalStore(
  {
    providedIn: 'root',
  },
  withState<PlaylistsState>({
    playlists: [],
    loading: false,
  }),
  withMethods((store) => {
    const apiService = inject(ApiService);
    return {
      async getPlaylists() {
        patchState(store, { loading: true });
        try {
          const res = await apiService.getPlaylists();
          const mapped: Playlistdata[] = res.data.items.map(
            (playlist: any) => ({
              name: playlist.name,
              img: playlist.images[0]?.url || 'images/placeholderpp.png',
              totalTracks: playlist.tracks.total,
              id: playlist.id,
            })
          );
          patchState(store, { playlists: mapped, loading: false });
        } catch (err) {
          console.error('Failed to fetch playlists', err);
          patchState(store, { playlists: [], loading: false });
        }
      },
    };
  })
);
