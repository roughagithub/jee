import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { AuthApiService } from './auth-api.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthApiService);
  const token = authService.getToken();

  // Ne pas ajouter le token pour les appels d'authentification
  const isAuthRequest = req.url.includes('/auth/');

  if (!token || isAuthRequest) {
    return next(req);
  }

  const cloned = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(cloned);
};
