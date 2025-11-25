import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { playlistStore } from '../stores/playlist.store';

// If user has not selected a playlist, send to playlists-view. Otherwise let through
export const selectionGuard: CanActivateFn = () => {
  const playlistStore1 = inject(playlistStore);
  const router = inject(Router);
  const playlist = playlistStore1.selected();
  if (playlist) {
    return true;
  } else {
    router.navigate(['/playlists']);
    return false;
  }
};
