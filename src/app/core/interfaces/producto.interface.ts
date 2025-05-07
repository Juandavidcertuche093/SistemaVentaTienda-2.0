export interface Producto {
  idProducto:           number;
  nombre:               string;
  idCategoria:          number;
  descripcionCategoria: string;
  idProveedor:          number;
  nombreProveedor:      string;
  idImagen:             number;
  nombreImagen:         string;
  rutaImagen:           string;
  stock:                number;
  esActivo:             number;
}
