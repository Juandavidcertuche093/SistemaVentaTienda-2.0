import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import {TokenService} from '../../modules/authentication/services/token.service';
import {AuthUsuarioService} from '../../modules/authentication/services/auth-usuario.service'


export const redirectGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const usuarioService = inject(AuthUsuarioService);
  const router = inject(Router);

  const token = tokenService.getToken();

  if (token && usuarioService.currentUser()) {
    usuarioService.redirectBasedOnRole(); // Redirige según el rol del usuario
    return false; // No permite el acceso a la ruta pública
  }

  return true; // Permite el acceso si no está autenticado
};
