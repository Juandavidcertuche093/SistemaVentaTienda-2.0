import {Sesion} from './sesion.interface';

export interface ResponseApiSesion {
  status:boolean,
  msg:string,
  value: Sesion,
}
