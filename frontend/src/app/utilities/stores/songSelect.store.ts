import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { selectedSongs } from '../interfaces/songselectstate';
import { songStore } from './songs.store';
import { inject } from '@angular/core';

export const songSelectStore = signalStore(
  {
    providedIn: 'root',
  },
  withState<selectedSongs>({
    selectedIds: [],
  }),
  withMethods((store) => {
    const _songStore = inject(songStore);
    return {
      toggle(songid: number | null) {
        if (songid !== null) {
          const isSelected = store.selectedIds().includes(songid);
          if (isSelected) {
            const filteredIds = store
              .selectedIds()
              .filter((id) => songid !== id);
            patchState(store, { selectedIds: filteredIds });
            console.log(store.selectedIds());
          } else {
            patchState(store, {
              selectedIds: [...store.selectedIds(), songid],
            });
            console.log(store.selectedIds());
          }
        }
      },
      selectAll() {
        const idArray: number[] = [];
        if (
          store.selectedIds().length === 0 ||
          (store.selectedIds().length > 0 &&
            store.selectedIds().length < _songStore.songs().length)
        ) {
          _songStore.songs().forEach((song) => {
            if (song.id !== null) {
              idArray.push(song.id);
            }
          });
          patchState(store, { selectedIds: [...idArray] });
          console.log(store.selectedIds());
        } else {
          patchState(store, { selectedIds: [] });
          console.log(store.selectedIds());
        }
      },
      clear() {
        patchState(store, { selectedIds: [] });
      },
    };
  })
);
