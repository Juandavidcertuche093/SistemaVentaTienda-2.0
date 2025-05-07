import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

//interfaces
import { ResponseApi } from '../../../core/interfaces/response-api';
import { Venta } from '../../../core/interfaces/venta.interface';

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  private urlApi: string = environment.API_URL + "Venta/"

  private http = inject(HttpClient)

  constructor() { }

  registrar(request: Venta):Observable<ResponseApi>{
    return this.http.post<ResponseApi>(`${this.urlApi}Registrar`, request)
  }
}
