import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { selectedSongs } from '../interfaces/songselectstate';

export const songSelect = signalStore(
  {
    providedIn: 'root',
  },
  withState<selectedSongs>({
    selectedIds: [],
  }),
  withMethods((store) => {
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
    };
  })
);
