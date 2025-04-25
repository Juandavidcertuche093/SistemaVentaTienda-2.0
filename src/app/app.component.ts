import { Component, computed, effect, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

//--Service--//
import { AuthUsuarioService } from './modules/authentication/services/auth-usuario.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'StoreInventoryControl_04';

  /**
   * finishedAuthCheck: Una propiedad computada que devuelve true si la verificación de autenticación ha terminado.
   * authStatusChangedEffect: Un efecto que redirige al usuario basado en el estado de autenticación.
   */

 private usuarioService = inject(AuthUsuarioService)
 private router = inject(Router)

 // Propiedad computada para verificar si el usuario está autenticado
 public isAuthenticated = computed<boolean>(() => {
   return !!this.usuarioService.currentUser(); // Devuelve true si hay un usuario autenticado
 });

 // Efecto para redirigir al usuario basado en su autenticación
 public authStatusChangedEffect = effect(() => {
   const usuario = this.usuarioService.currentUser();
   if (!usuario) {
     this.router.navigateByUrl('inicio'); // Redirige al inicio si no hay usuario
     return;
   }

   this.usuarioService.redirectBasedOnRole(); // Redirige según el rol del usuario
 })
}
