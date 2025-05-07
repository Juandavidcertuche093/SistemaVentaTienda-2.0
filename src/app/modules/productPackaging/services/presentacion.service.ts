import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';

//interfaces
import { ResponseApi } from '../../../core/interfaces/response-api';

@Injectable({
  providedIn: 'root'
})
export class PresentacionService {

  private urlApi: string = environment.API_URL + "Presentacion/"

  private http = inject(HttpClient)

  constructor() { }

  lista(): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.urlApi}Lista`).pipe(
      catchError((error) => {
        console.error('Error al obtener la lista de las presentaciones:', error);
        return of({ status: false, msg: 'Error al obtener la lista', value: null });
      })
    );
  }
}
