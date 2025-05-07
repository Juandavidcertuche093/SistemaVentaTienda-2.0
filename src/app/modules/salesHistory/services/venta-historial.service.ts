import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environments';
import { Observable } from 'rxjs';

//interface
import { ResponseApi } from '../../../core/interfaces/response-api';

@Injectable({
  providedIn: 'root'
})
export class VentaHistorialService {

  private urlApi:string = environment.API_URL + "Venta/";

  private http = inject(HttpClient)

  constructor() { }

  historial(buscarPor:string,numeroVenta:string,fechaInicio:string,fechaFin:string):Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlApi}Historial?buscarPor=${buscarPor}&numeroVenta=${numeroVenta}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
    )
  }
}
