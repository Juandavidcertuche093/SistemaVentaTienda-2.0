import { Routes } from '@angular/router';

import { redirectGuard } from './core/guards/redirect.guard';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path:'',//!ruta principal o ruta publica
    loadChildren: () => import('./modules/authentication/auth.routes').then((m) => m.authRoutes),
    canActivate: [redirectGuard] // Aplica el redirectGuard a las rutas públicas
  },
  {
    path:'',//!ruta protegida solo se puede acceder con un toekn de acceso
    loadChildren: () => import('./modules/layout/layout.routes').then((m) => m.layoutRoute),
    canActivate: [authGuard] // Aplica el authGuard a las rutas protegidas
  }
];
