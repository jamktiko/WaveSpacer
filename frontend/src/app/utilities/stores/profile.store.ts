import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Userdata } from '../interfaces/userdata';
import axios from 'axios';
import { inject } from '@angular/core';
import { ApiService } from '../services/api.service';

export const profileStore = signalStore(
  {
    providedIn: 'root',
  },
  withState<Userdata>({
    display_name: null,
    email: null,
    country: null,
    profilepic: null,
    product: null,
    followers: null,
    id: null,
    loading: false,
  }),
  withMethods((store) => {
    const apiService = inject(ApiService);
    return {
      async getProfile() {
        patchState(store, { loading: true });
        try {
          const res = await apiService.getProfile();
          patchState(store, {
            display_name: res.data.display_name,
            email: res.data.email,
            country: res.data.country,
            profilepic: res.data.images[0]?.url || 'images/placeholderpp.png',
            product: res.data.product,
            followers: res.data.followers.total,
            id: res.data.id,
            loading: false,
          });
        } catch (error) {
          patchState(store, { loading: false });
          console.error('Failed to fetch profile', error);
          patchState(store, {
            display_name: null,
            email: null,
            country: null,
            profilepic: null,
            product: null,
            followers: null,
            id: null,
            loading: false,
          });
        }
      },
    };
  })
);
