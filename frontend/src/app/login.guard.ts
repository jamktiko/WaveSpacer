import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from './login.service';
import { inject } from '@angular/core';
import { authStore } from './stores/auth.store';

export const loginGuard: CanActivateFn = () => {
  const login = inject(authStore);
  const router = inject(Router);
  return login.checkLogin().then((isLoggedIn) => {
    return isLoggedIn ? true : router.createUrlTree(['/']);
  });
};
