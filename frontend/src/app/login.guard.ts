import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from './login.service';
import { inject } from '@angular/core';

export const loginGuard: CanActivateFn = (route, state) => {
  const login = inject(LoginService);
  const router = inject(Router);
  return login.checkLogin().then((isLoggedIn) => {
    return isLoggedIn ? true : router.createUrlTree(['/']);
  });
};
