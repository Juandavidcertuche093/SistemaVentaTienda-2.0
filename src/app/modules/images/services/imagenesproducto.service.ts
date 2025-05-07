import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';

import { ResponseApi } from '../../../core/interfaces/response-api';
import { ImagenProdubcto } from '../../../core/interfaces/imagenProducto.interface';

@Injectable({
  providedIn: 'root'
})
export class ImagenesproductoService {

  private urlApi: string = environment.API_URL + "ImagenProducto/"

  private http = inject(HttpClient)

  constructor() { }

  lista():Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlApi}Lista`)
    .pipe(
      catchError((error) => {
        console.error('Error al optener la lista de las imagenes')
        return of({ status:false, msg: 'error al optener la lista', value: null})
      })
    )
  }

  guardar(request: ImagenProdubcto):Observable<ResponseApi>{
    return this.http.post<ResponseApi>(`${this.urlApi}Guardar`, request)
    .pipe(
      catchError((error) => {
        console.error('Error al guardar la imagen')
        return of({ status: false, msg:'Error al guardar la imagen', value: null})
      })
    )
  }

  editar(resquest: ImagenProdubcto): Observable<ResponseApi> {
      return this.http.put<ResponseApi>(`${this.urlApi}Editar`, resquest)
      .pipe(
        catchError((error) => {
          console.error('Error al editar la imagen', error);
          return of({ status: false, msg: 'Error al editar la imagen', value: null})
        })
      )
    }

    eliminar(id: number): Observable<ResponseApi>{
      return this.http.delete<ResponseApi>(`${this.urlApi}Eliminar/${id}`)
      .pipe(
        catchError((error) => {
          console.error('Error al eliminar la imagen', error)
          return of({ status: false, msg: 'Error al elimianr la imagen', value: null})
        })
      )
    }
}
