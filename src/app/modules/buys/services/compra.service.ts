import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ResponseApi } from '../../../core/interfaces/response-api';
import { Compra } from '../../../core/interfaces/compra.interface';

@Injectable({
  providedIn: 'root'
})
export class CompraService {

  private urlApi: string = environment.API_URL + "Compra/"

  private http = inject(HttpClient)

  constructor() { }

  registrar(request: Compra):Observable<ResponseApi>{
    return this.http.post<ResponseApi>(`${this.urlApi}Registrar`, request)
  }
}
