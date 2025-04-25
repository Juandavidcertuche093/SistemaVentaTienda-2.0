import { CanActivateFn, Router } from '@angular/router';
import {TokenService} from '../../modules/authentication/services/token.service';
import {AuthUsuarioService} from '../../modules/authentication/services/auth-usuario.service'
import { inject } from '@angular/core'

export const authGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const usuarioService = inject(AuthUsuarioService);
  const router = inject(Router);

  const token = tokenService.getToken();

  if (!token) {
    router.navigate(['/inicio']); // Redirige al login si no hay token
    return false;
  }

  // Verifica si el usuario está autenticado
  if (!usuarioService.currentUser()) {
    router.navigate(['/inicio']); // Redirige al login si no hay usuario autenticado
    return false;
  }

  return true; // Permite el acceso si el usuario está autenticado
};
