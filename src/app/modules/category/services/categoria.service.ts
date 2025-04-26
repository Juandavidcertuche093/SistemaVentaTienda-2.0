import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';

//interfaces
import { ResponseApi } from '../../../core/interfaces/response-api';
import { Categoria } from '../../../core/interfaces/categoria.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private urlApi: string = environment.API_URL + "Categoria/"

  private http = inject(HttpClient)

  constructor() { }

  lista():Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlApi}Lista`)
    .pipe(
      catchError((error) => {
        console.error('Error al obtener la lista de las categorias')
        return of({ status:false, msg: 'Error al obtenr la lista', value: null})
      })
    )
  }

  guardar(request: Categoria):Observable<ResponseApi>{
    return this.http.post<ResponseApi>(`${this.urlApi}Guardar`,request)
    .pipe(
      catchError((error) => {
        console.error('Error al guardar categoria')
        return of({ status: false, msg:'Error al guardar categoria', value: null})
      })
    )
  }

  editar(resquest: Categoria): Observable<ResponseApi> {
    return this.http.put<ResponseApi>(`${this.urlApi}Editar`, resquest)
    .pipe(
      catchError((error) => {
        console.error('Error al editar el producto', error);
        return of({ status: false, msg: 'Error al editar el producto', value: null})
      })
    )
  }

  eliminar(id: number): Observable<ResponseApi>{
    return this.http.delete<ResponseApi>(`${this.urlApi}Eliminar/${id}`)
    .pipe(
      catchError((error) => {
        console.error('Error al eliminar la categoria', error)
        return of({ status: false, msg: 'Error al elimianr la categoria', value: null})
      })
    )
  }
}
