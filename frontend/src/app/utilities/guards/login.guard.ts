import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { authStore } from '../stores/auth.store';

// If user is not logged in, send to main screen. Otherwise let through
export const loginGuard: CanActivateFn = () => {
  const login = inject(authStore);
  const router = inject(Router);
  return login.checkLogin().then((isLoggedIn) => {
    return isLoggedIn ? true : router.createUrlTree(['/']);
  });
};
