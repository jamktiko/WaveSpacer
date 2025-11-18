import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { settings } from '../interfaces/settings';
import { computed } from '@angular/core';

export const settingStore = signalStore(
  {
    providedIn: 'root',
  },
  withState<settings>({
    language: 'English',
    dropdownvisible: false,
    lightmode: false,
  }),
  withComputed((store) => ({
    background: computed(() =>
      store.lightmode()
        ? 'bg-[url(/images/lightbackground2.png)]'
        : 'bg-[url(/images/background2.png)]'
    ),
  })),
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
      turnOnLightMode() {
        patchState(store, { lightmode: true });
        localStorage.setItem('lightmode', JSON.stringify(store.lightmode()));
      },
    };
  })
);
