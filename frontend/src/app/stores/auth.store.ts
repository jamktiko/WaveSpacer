import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Loginstate } from '../interfaces/loginstate';
import axios from 'axios';

export const authStore = signalStore(
  {
    providedIn: 'root',
  },
  withState<Loginstate>({
    isLoggedIn: false,
    loading: false,
  }),
  withMethods((store) => ({
    async checkLogin() {
      patchState(store, { loading: true });
      try {
        const res = await axios.get('http://127.0.0.1:8888/verify-token', {
          withCredentials: true,
        });

        patchState(store, { isLoggedIn: res.data.success });
      } catch {
        patchState(store, { isLoggedIn: false });
      } finally {
        patchState(store, { loading: false });
      }
      return store.isLoggedIn();
    },
  }))
);
