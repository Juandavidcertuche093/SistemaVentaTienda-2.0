import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environments';

import { ResponseApi } from '../../../core/interfaces/response-api';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  private urlApi:string = environment.API_URL + "Rol/"

  private http = inject(HttpClient)

  constructor() { }

  lista():Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlApi}Lista`)
  }
}
