import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';

import { environment } from '../../../../environments/environments';

import { ResponseApi } from '../../../core/interfaces/response-api';
import { ProductoEmpaque } from '../../../core/interfaces/productoEmpaque.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductoEnpaqueService {

  private urlApi:string = environment.API_URL + "ProductoEmpaque/"

  private http = inject(HttpClient)

  constructor() { }

  lista(): Observable<ResponseApi> {
      return this.http.get<ResponseApi>(`${this.urlApi}Lista`).pipe(
        catchError((error) => {
          console.error('Error al obtener la lista de productoEnpaque:', error);
          return of({ status: false, msg: 'Error al obtener la lista', value: null });
        })
      );
    }

    guardar(request: ProductoEmpaque): Observable<ResponseApi> {
      return this.http.post<ResponseApi>(`${this.urlApi}Guardar`, request).pipe(
        catchError((error) => {
          console.error('Error al guardar el productoEnpaque:', error);
          return of({ status: false, msg: 'Error al guardar el productoEmpaque', value: null });
        })
      );
    }

    editar(request: ProductoEmpaque): Observable<ResponseApi> {
      return this.http.put<ResponseApi>(`${this.urlApi}Editar`, request).pipe(
        catchError((error) => {
          console.error('Error al editar el producntoEmpaque:', error);
          return of({ status: false, msg: 'Error al editar el productoEmpaque', value: null });
        })
      );
    }

    eliminar(id: number): Observable<ResponseApi> {
      return this.http.delete<ResponseApi>(`${this.urlApi}Eliminar/${id}`).pipe(
        catchError((error) => {
          console.error('Error al eliminar el productoEmpaque:', error);
          return of({ status: false, msg: 'Error al eliminar el productoEmpaque', value: null });
        })
      );
    }


}
