import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { UIstate } from '../interfaces/uistate';

export const uiStore = signalStore(
  {
    providedIn: 'root',
  },
  withState<UIstate>({
    title: 'WaveSpacer',
    dropdownvisible: false,
  }),
  withMethods((store) => {
    return {
      toggleDropdownVisibility() {
        patchState(store, { dropdownvisible: !store.dropdownvisible() });
      },
      closeDropdown() {
        patchState(store, { dropdownvisible: false });
      },
    };
  })
);
