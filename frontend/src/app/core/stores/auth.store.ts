import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Loginstate } from '../interfaces/loginstate';
import { ApiService } from '../services/api.service';
import { inject } from '@angular/core';

export const authStore = signalStore(
  {
    providedIn: 'root',
  },
  withState<Loginstate>({
    isLoggedIn: false,
    loading: false,
  }),
  withMethods((store) => {
    const apiService = inject(ApiService);
    return {
      async checkLogin() {
        patchState(store, { loading: true });
        try {
          const res = await apiService.verifyToken();
          patchState(store, { isLoggedIn: res.data.success });
        } catch {
          patchState(store, { isLoggedIn: false });
        } finally {
          patchState(store, { loading: false });
        }
        return store.isLoggedIn();
      },
    };
  })
);
