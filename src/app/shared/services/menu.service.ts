import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environments';

import { ResponseApiMenu } from '../../core/interfaces/response-api-menu';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private urlApi:string = environment.API_URL + "Menu/";

  private http = inject(HttpClient)

  constructor() { }

  lista(idUsuario: number):Observable<ResponseApiMenu>{
    return this.http.get<ResponseApiMenu>(`${this.urlApi}Lista?idUsuario=${idUsuario}`)
  }
}
