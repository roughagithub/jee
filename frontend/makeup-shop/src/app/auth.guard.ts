import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthApiService } from './services/auth-api.service';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthApiService);
  const router = inject(Router);

  const token = auth.getToken();
  if (token) {
    return true;
  }

  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
