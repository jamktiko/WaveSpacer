import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { selectedSongs } from '../interfaces/songselectstate';
import { songStore } from './songs.store';
import { inject } from '@angular/core';
import { ApiService } from '../services/api.service';

export const songSelectStore = signalStore(
  {
    providedIn: 'root',
  },
  withState<selectedSongs>({
    selectedIds: [],
    loading: false,
  }),
  withMethods((store) => {
    const apiService = inject(ApiService);
    const _songStore = inject(songStore);
    return {
      toggle(songid: string | null) {
        if (songid !== null) {
          const uri = `spotify:track:${songid}`;
          const isSelected = store
            .selectedIds()
            .includes(`spotify:track:${songid}`);
          if (isSelected) {
            const filteredIds = store.selectedIds().filter((id) => uri !== id);
            patchState(store, { selectedIds: filteredIds });
            console.log(store.selectedIds());
          } else {
            patchState(store, {
              selectedIds: [...store.selectedIds(), uri],
            });
            console.log(store.selectedIds());
          }
        }
      },
      selectAll() {
        const idArray: string[] = [];
        if (
          store.selectedIds().length === 0 ||
          (store.selectedIds().length > 0 &&
            store.selectedIds().length < _songStore.songs().length)
        ) {
          _songStore.songs().forEach((song) => {
            if (song.id !== null) {
              idArray.push(`spotify:track:${song.id}`);
            }
          });
          patchState(store, { selectedIds: [...idArray] });
          console.log(store.selectedIds());
        } else {
          patchState(store, { selectedIds: [] });
          console.log(store.selectedIds());
        }
      },
      deleteSongs(id: string | null, uris: string[]) {
        patchState(store, { loading: true });
        if (id) {
          try {
            apiService.deleteSongs(id, uris).then((res) => console.log(res));
            patchState(store, { selectedIds: [] });
          } catch (err) {
            console.log(err);
          }
        } else {
          console.log('id was null');
        }
      },
      clear() {
        patchState(store, { selectedIds: [] });
      },
    };
  })
);
