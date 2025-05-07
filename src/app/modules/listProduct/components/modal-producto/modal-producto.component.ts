import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

//angular/material
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import {MatDialogModule} from '@angular/material/dialog';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_FORMATS, DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';

//interfaces
import {Categoria} from '../../../../core/interfaces/categoria.interface';
import { Producto } from '../../../../core/interfaces/producto.interface';
import {Proveedor} from '../../../../core/interfaces/proveedor.interface';
import { ImagenProdubcto } from '../../../../core/interfaces/imagenProducto.interface'

//servicios
import { ProductoService } from '../../services/producto.service';
import { CategoriaService } from '../../../category/services/categoria.service';
import { ProveedorService } from '../../../supplier/services/proveedor.service';
import { ImagenesproductoService } from '../../../images/services/imagenesproducto.service';
import { UtilidadService } from '../../../../core/services/utilidad.service';


import { numeroPositivo } from '../../../../core/utils/numeroPositivo';

@Component({
  selector: 'app-modal-producto',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatDialogModule,
    MatGridListModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './modal-producto.component.html',
  styleUrl: './modal-producto.component.scss'
})
export class ModalProductoComponent implements OnInit {

  //PROPIEDADES
  formularioProduncto: FormGroup;
  tituloAccion: string = 'Agregar';
  botonAccion: string = 'Guardar';
  listaCategoria: Categoria[] = []//nos muestra las lista de las catgorias que se obtinen desde la base de datos
  listaProveedor: Proveedor[] = []//nos muestra las lista de las proveedores que se obtinen desde la base de datos
  listaImagenProducto: ImagenProdubcto[] = []//nos muestra la lista de imagenes y nombre que se obtienen desde la base de datos


  constructor(
    private modalActual: MatDialogRef<ModalProductoComponent>,
    @Inject(MAT_DIALOG_DATA) public datosProducto: Producto,
    private fb: FormBuilder,
    private categoriaServicio: CategoriaService,
    private produnctoServicio: ProductoService,
    private utilidadServicio: UtilidadService,
    private proveedorServicio: ProveedorService,
    private imagenProductoServicio: ImagenesproductoService

  ){
    this.formularioProduncto = this.fb.nonNullable.group({
      nombre:       ['', [Validators.required]],
      idCategoria:  ['', [Validators.required]],
      idProveedor:  ['', [Validators.required]],
      idImagen:     ['', [Validators.required]],
      stock:        [{ value: 0, disabled: true }, [Validators.required]], // Bloqueado y con valor predete
      // precioCompra: ['', [Validators.required, Validators.min(1), numeroPositivo]],
      esActivo:     ['1', [Validators.required]],
    });
    if (this.datosProducto != null && this.datosProducto != undefined){
      this.tituloAccion = 'Editar'
      this.botonAccion = 'Actualizar'
    }
    //traemos la lista de categorias
    this.categoriaServicio.lista()
    .subscribe({
      next: (data) => {
        if (data.status) {
          const lista = data.value as Categoria[];
          this.listaCategoria = lista.filter(c => c.esActivo == 1)
        }
      },
      error: (e) => {}
    })

    //traemos la lista de proveedores
    this.proveedorServicio.lista()
    .subscribe({
      next: (data) => {
        if (data.status) {
          const lista = data.value as Proveedor[];
          this.listaProveedor = lista.filter(p => p.esActivo == 1)
        }
      },
      error: (e) => {}
    })

    //traemos la lista de imagenes del producto
    this.imagenProductoServicio.lista()
    .subscribe({
      next: (data) => {
        if(data.status)
          this.listaImagenProducto = data.value
      }
    })
  }

  ngOnInit(): void {
    if(this.datosProducto !== null && this.datosProducto !== undefined)

      this.formularioProduncto.patchValue({
        nombre:       this.datosProducto.nombre,
        idCategoria:  this.datosProducto.idCategoria,
        idProveedor:  this.datosProducto.idProveedor,
        idImagen:     this.datosProducto.idImagen,
        stock:        this.datosProducto.stock,
        // precioCompra: this.datosProducto.precioCompra,
        // precioCompra:    this.convertirPrecio(this.datosProducto.precioCompra),
        esActivo:     this.datosProducto.esActivo
      })
  }

  private convertirPrecio(valor: string): number {
    // Reemplaza coma por punto y convierte a número
    return parseFloat(valor.replace(',', '.'));
  }

  GuardarEditar_Producto(){
    //LOGICA PARA CREEAR Y ACTUALIAR EL PRODUCTO
    const _productos: Producto = {
      idProducto: this.datosProducto == null ? 0: this.datosProducto.idProducto,
      nombre: this.formularioProduncto.value.nombre,
      idCategoria: this.formularioProduncto.value.idCategoria,
      descripcionCategoria: "",//lo puedes dejar bacio si no se requiere
      idProveedor: this.formularioProduncto.value.idProveedor,
      nombreProveedor:"",
      idImagen: this.formularioProduncto.value.idImagen,
      nombreImagen:"",
      rutaImagen: "",
      stock: this.datosProducto ? this.datosProducto.stock : 0,
      // precioCompra: this.formularioProduncto.value.precioCompra,
      // precioCompra: parseFloat(this.formularioProduncto.value.precioVenta ?? '0').toString(),
      esActivo: parseInt(this.formularioProduncto.value.esActivo)
    }
    if (this.datosProducto == null){
      //LOGICA PARA CREEAR EL PRODUCTO
      this.produnctoServicio.guardar(_productos)
      .subscribe({
        next: (data) => {
          if(data.status) {
            this.utilidadServicio.mostrarAlerta('El producto se registro con exito','success')
            this.modalActual.close('true')
          } else
            this.utilidadServicio.mostrarAlerta(data.msg,'error')
        },
        error: (e) => {
          this.utilidadServicio.mostrarAlerta("Ocurrio un error al guardar el producto", "error")
        }
      })
    } else
      //LOGICA PARA ACTUALIZAR EL PRODUCTO
      this.produnctoServicio.editar(_productos)
      .subscribe({
        next: (data) => {
          if(data.status) {
            this.utilidadServicio.mostrarAlerta("EL producto se actualizo", "success")
            this.modalActual.close('true')
          } else
            this.utilidadServicio.mostrarAlerta("No se puede actualizar el producto","error")
        },
        error:(e) => {}
      })

  }

}
