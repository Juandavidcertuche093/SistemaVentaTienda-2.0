import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';

import { environment } from '../../../../environments/environments';

import { TokenService } from '../services/token.service';

import { Sesion } from '../../../core/interfaces/sesion.interface';
import { ResponseApiSesion } from '../../../core/interfaces/response-api-sesion';

@Injectable({
  providedIn: 'root'
})
export class AuthUsuarioService {

  private readonly baseUrl: string = environment.API_URL + "usuario/"
  private http = inject(HttpClient)
  private router = inject(Router)
  private tokenService = inject(TokenService)

  private _currentUser = signal<Sesion|null>(null)//señal que almacena el usuario actual


  // Propiedad computada que expone el usuario actual al mundo exterior
  public currentUser = computed(() => this._currentUser())

  constructor() {
    this.checkAuthStatus().subscribe();
  }

  //Metodo para redirigir el usuario segun su Rol
  public redirectBasedOnRole(): void {
    const usuario = this._currentUser();
    if (!usuario) {
      this.router.navigate(['/inicio'])//si no hay usuario, redirige al inicio
      return;
    }

    if (usuario.rolDescripcion === 'Administrador') {
      this.router.navigate(['/dashboard']);
    } else if (usuario.rolDescripcion === 'Empleado') {
      this.router.navigate(['/venta'])
    } else {
      this.router.navigate(['401'])//rol no reconocido
    }
  }

  //metodo para establecer el usuario actual, guarda el token en el tokenService (Cookies)
  private setAuthentication(user: Sesion, token: string): boolean{
    this._currentUser.set(user)
    this.tokenService.saveToken(token)
    return true
  }

  login(nombre: string, clave: string): Observable<'invalid-credentials' | 'server-error' | 'user-inactive' | 'user-not-found' | 'success'> {
    const url = `${this.baseUrl}IniciarSesion`;
    const body = { nombre, clave };

    return this.http.post<ResponseApiSesion>(url, body)
      .pipe(
        map(response => {
          if (response.status && response.value) {
            const { value: user } = response;
            const { token } = user;
            this.setAuthentication(user, token); // Establece la autenticación
            return 'success' as const;
          } else {
            return 'invalid-credentials' as const;
          }
        }),
        catchError((error: HttpErrorResponse) => {
          console.error("Error en la autenticación:", error);

          if (error.status === 400) {
            const errorMessage = error.error?.msg;

            if (errorMessage === "Credenciales incorrectas") {
              return of('invalid-credentials' as const);
            }

            if (errorMessage === "El usuario no existe") {
              return of('user-not-found' as const);
            }
          }

          if (error.status === 403 && error.error?.msg === "Usuario inactivo, no puede iniciar sesión") {
            return of('user-inactive' as const);
          }

          this.router.navigate(['/error500']);
          return of('server-error' as const);
        })
      );
  }



  // Método para verificar el estado de autenticación
  checkAuthStatus(): Observable<boolean> {

    const url = `${this.baseUrl}VerificarSesion`
    const token = this.tokenService.getToken();

    if (!token) {
      this.logout();//cierra la sesion si no hay token
      return of(false)
    }

    const headers = new HttpHeaders()
    .set( 'Authorization', `Bearer ${token}` )

    return this.http.get<ResponseApiSesion>(url, { headers })//establece la autenticacion
      .pipe(
        map( response => {
          if ( response.status && response.value ) {
            const { value: user } = response
            const { token } = user
            return this.setAuthentication(user, token)//establece la autenticacion
          }
          return false
        }),
        catchError( () => {
          this.logout()//cierra la sesion
          return of(false)
        })
      )
    }

    logout(){
      this.tokenService.removeToken()//elimina el token
      this._currentUser.set(null)//limpia el usuari actaul
    }
}
