import { Routes } from '@angular/router';

import { redirectGuard } from './core/guards/redirect.guard';

export const routes: Routes = [
  {
    path:'',//!ruta principal o ruta publica
    loadChildren: () => import('./modules/authentication/auth.routes').then((m) => m.authRoutes),
    canActivate: [redirectGuard] // Aplica el redirectGuard a las rutas públicas
  },
];
