import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environments';
import { ResponseApi } from '../../../core/interfaces/response-api';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private urlApi:string = environment.API_URL + "DashBoard/";

  private http = inject(HttpClient)

  constructor() { }

  resumen():Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlApi}Resumen`)
  }
}
