import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environments';

import { ResponseApiSesion } from '../../core/interfaces/response-api-sesion';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  private urlApi:string = environment.API_URL + "Producto/";

  private http = inject(HttpClient)

  constructor() { }

  // Llama al backend para obtener medicamentos con stock bajo
  obtenerProductosConStockBajo(stockMinimo: number = 10): Observable<ResponseApiSesion[]> {
    return this.http.get<ResponseApiSesion[]>(`${this.urlApi}ProductosStockBajo`, {
      params: { stockMinimo: stockMinimo }
    });
  }
}
