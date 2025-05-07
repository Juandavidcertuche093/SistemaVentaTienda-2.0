import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';

//interfaces
import { ResponseApi } from '../../../core/interfaces/response-api';
import { Producto } from '../../../core/interfaces/producto.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private urlApi: string = environment.API_URL + "Producto/"

  private http = inject(HttpClient)

  constructor() { }

  lista(): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.urlApi}Lista`).pipe(
      catchError((error) => {
        console.error('Error al obtener la lista de los productos:', error);
        return of({ status: false, msg: 'Error al obtener la lista', value: null });
      })
    );
  }

  guardar(request: Producto): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(`${this.urlApi}Guardar`, request).pipe(
      catchError((error) => {
        console.error('Error al guardar el producto:', error);
        return of({ status: false, msg: 'Error al guardar el producto', value: null });
      })
    );
  }

  editar(request: Producto): Observable<ResponseApi> {
    return this.http.put<ResponseApi>(`${this.urlApi}Editar`, request).pipe(
      catchError((error) => {
        console.error('Error al editar el producnto:', error);
        return of({ status: false, msg: 'Error al editar el producto', value: null });
      })
    );
  }

  eliminar(id: number): Observable<ResponseApi> {
    return this.http.delete<ResponseApi>(`${this.urlApi}Eliminar/${id}`).pipe(
      catchError((error) => {
        console.error('Error al eliminar el producto:', error);
        return of({ status: false, msg: 'Error al eliminar el producto', value: null });
      })
    );
  }
}
