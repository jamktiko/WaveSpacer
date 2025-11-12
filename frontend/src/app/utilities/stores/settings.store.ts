import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { settings } from '../interfaces/settings';

export const settingStore = signalStore(
  {
    providedIn: 'root',
  },
  withState<settings>({
    language: 'English',
    dropdownvisible: false,
    lightmode: false,
  }),
  withMethods((store) => {
    return {
      changeLanguage(language: string) {
        patchState(store, { language: language });
        localStorage.setItem('language', language);
      },
      toggleDropdownVisibility() {
        patchState(store, { dropdownvisible: !store.dropdownvisible() });
      },
      closeDropdown() {
        patchState(store, { dropdownvisible: false });
      },
      toggleLightMode() {
        patchState(store, { lightmode: !store.lightmode() });
        localStorage.setItem('lightmode', JSON.stringify(store.lightmode()));
      },
    };
  })
);
