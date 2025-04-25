import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { TokenService } from '../../modules/authentication/services/token.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const injectSessionInterceptor: HttpInterceptorFn = (request: HttpRequest<unknown>, next: HttpHandlerFn):
Observable<HttpEvent<unknown>> => {
  const tokenService = inject(TokenService);
  const router = inject(Router);
  const token = tokenService.getToken();

  let newRequest = request;
  if (token) {
    newRequest = request.clone({
      setHeaders: {
        authorization: `Bearer ${token}`,
      }
    });
  }

  return next(newRequest).pipe(
    catchError(err => {
      if (err.status === 401) {
        // Token inválido o expirado, redirigir a la página de login
        router.navigate(['/login']);
      }
      return throwError(() => err);
    })
  );
};

//Este interceptor es útil para manejar la autenticación en una aplicación Angular mediante el uso de tokens JWT
