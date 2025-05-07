import {DetalleCompra} from './detallecompra.interface'

export interface Compra {
  idCompra?:number,
  numCompra?:string
  idProveedor:string | number
  nombreProveedor: string
  fechaCompra:string,
  tipoPago:string,
  totalTexto:string,
  detalleCompras: DetalleCompra[]
}
