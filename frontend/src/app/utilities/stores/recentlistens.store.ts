import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { recentListens } from '../interfaces/recentlistens';
import { Recentsongs } from '../interfaces/recentsongs';
import { ApiService } from '../services/api.service';
import { inject } from '@angular/core';
import { Lastmonthfavorite } from '../interfaces/lastmonthfavorite';

export const recentListensStore = signalStore(
  {
    providedIn: 'root',
  },
  withState<recentListens>({
    recents: [] as Recentsongs[],
    lastMonthFav: {} as Lastmonthfavorite,
    loading: false,
  }),
  withMethods((store) => {
    const apiService = inject(ApiService);
    return {
      async getLastMonthFav() {
        patchState(store, { loading: true });
        try {
          const res = await apiService.getLastMonthFavorite();
          console.log(res);
          patchState(store, {
            lastMonthFav: {
              name: res.data[0].name,
              artist_names: res.data[0].artist_names,
              plays: res.data[0].plays,
              last_played: res.data[0].last_played,
              track_img: res.data[0].track_image,
            },
            loading: false,
          });
        } catch (err) {
          console.error('Error fetching last month favorite', err);
          patchState(store, { loading: false });
        }
      },
      async getRecentListens() {
        patchState(store, { loading: true });
        try {
          const res = await apiService.getRecents();
          console.log(res);
          const mapped: Recentsongs[] = res.data.map((song: any) => ({
            id: song.spotify_track_id,
            name: song.name,
            amount: song.amount,
            track_image: song.track_image,
            artist_names: song.artists
              .map((artist: any) => artist.name)
              .join(', '),
            listenedAt: song.played_at,
          }));
          patchState(store, { recents: mapped, loading: false });
        } catch (err) {
          console.error('Error getting recently listened songs', err);
          patchState(store, { loading: false });
        }
      },
    };
  })
);
