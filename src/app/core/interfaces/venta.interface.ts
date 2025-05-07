import { DetalleVenta } from "./detalleventa.interface";

export interface Venta {
    idVenta?:number,
    numVenta?:string,
    tipoPago:string,
    fechaRegistro?:string,
    totalTexto:string,
    IdUsuario:string | number
    usuarioDescripcion:string
    detalleventa: DetalleVenta[]
}
