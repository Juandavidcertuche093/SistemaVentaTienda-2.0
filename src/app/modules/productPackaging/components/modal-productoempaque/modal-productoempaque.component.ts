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
import { Producto } from '../../../../core/interfaces/producto.interface';
import { ProductoEmpaque } from '../../../../core/interfaces/productoEmpaque.interface';
import {Presentacion} from '../../../../core/interfaces/presentacion.interface';

//servicios
import { ProductoService } from '../../services/producto.service';
import { PresentacionService } from '../../services/presentacion.service';
import { UtilidadService } from '../../../../core/services/utilidad.service';
import { ProductoEnpaqueService } from '../../services/producto-enpaque.service';

import { numeroPositivo } from '../../../../core/utils/numeroPositivo';

@Component({
  selector: 'app-modal-productoempaque',
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
  templateUrl: './modal-productoempaque.component.html',
  styleUrl: './modal-productoempaque.component.scss'
})
export class ModalProductoempaqueComponent implements OnInit {

  formularioProductoEnpaque: FormGroup;
  tituloAccion: string = 'Agregar';
  botonAccion: string = 'Guardar';
  listaPresentacion: Presentacion[] = [];
  listaProductos: Producto[] = []

  constructor(
    private modalActual: MatDialogRef<ModalProductoempaqueComponent>,
    @Inject(MAT_DIALOG_DATA) public datosProductoEmpaque: ProductoEmpaque,
    private fb: FormBuilder,
    private utilidadServicio: UtilidadService,
    private presentacionServicio: PresentacionService,
    private productoEnpaqueServicio: ProductoEnpaqueService,
    private productoServicio: ProductoService
  ){
    this.formularioProductoEnpaque = this.fb.nonNullable.group({
      idProducto:       ['', [Validators.required]],
      idPresentacion:   ['', [Validators.required]],
      cantidad:         ['', [Validators.required,]],
      precioVenta:      ['', [Validators.required, Validators.min(1), numeroPositivo]],
      precioCompra:     ['', [Validators.required, Validators.min(1), numeroPositivo]],
      esActivo:         ['1', [Validators.required]],
    });
    if(this.datosProductoEmpaque != null && this.datosProductoEmpaque != undefined){
      this.tituloAccion = 'Editar'
      this.botonAccion = 'Actualizar'
    }
    this.productoServicio.lista()
    .subscribe({
      next: (data) => {
        if (data.status) {
          const lista = data.value as Producto[];
          this.listaProductos = lista.filter(p => p.esActivo == 1)
        }
      },
      error: (e) => {}
    })

    this.presentacionServicio.lista()
    .subscribe({
      next: (data) => {
        if(data.status) {
          this.listaPresentacion = data.value
        }
      },
      error: (e) => {}
    })
  }

  ngOnInit(): void {
    if(this.datosProductoEmpaque !== null && this.datosProductoEmpaque !== undefined)

      this.formularioProductoEnpaque.patchValue({
        idProducto:     this.datosProductoEmpaque.idProducto,
        idPresentacion: this.datosProductoEmpaque.idPresentacion,
        cantidad:       this.datosProductoEmpaque.cantidad,
        // precioVenta:    this.datosProductoEmpaque.precioVenta,
        precioVenta:    this.convertirPrecio(this.datosProductoEmpaque.precioVenta),
        precioCompra:    this.convertirPrecio(this.datosProductoEmpaque.precioCompra)
      })
  }

  private convertirPrecio(valor: string): number {
    // Reemplaza coma por punto y convierte a número
    return parseFloat(valor.replace(',', '.'));
  }

  guardarEditar_ProductoEnpaque(){
    const _productoEnpaque: ProductoEmpaque = {
      idProductoEmpaque: this.datosProductoEmpaque == null ? 0: this.datosProductoEmpaque.idProductoEmpaque,
      idProducto: this.formularioProductoEnpaque.value.idProducto,
      descripcionProducto: "",
      idPresentacion: this.formularioProductoEnpaque.value.idPresentacion,
      descripcionPresentacion: "",
      cantidad: this.formularioProductoEnpaque.value.cantidad,
      // precioVenta: this.formularioProductoEnpaque.value.precioVenta,
      precioVenta: parseFloat(this.formularioProductoEnpaque.value.precioVenta ?? '0').toString(),
      precioCompra: parseFloat(this.formularioProductoEnpaque.value.precioCompra ?? '0').toString(),
      esActivo: parseInt(this.formularioProductoEnpaque.value.esActivo)
    }
    if(this.datosProductoEmpaque == null){
      this.productoEnpaqueServicio.guardar(_productoEnpaque)
      .subscribe({
        next: (data) => {
          if(data.status){
            this.utilidadServicio.mostrarAlerta('El productoEnpaque se registro con Exito', 'success')
            this.modalActual.close('true')
          } else
            this.utilidadServicio.mostrarAlerta(data.msg, 'error')
        },
        error: (e) => {
          this.utilidadServicio.mostrarAlerta("Ocurrio un error al guardar el productoEnpaque", "error")
        }
      })
    } else
      this.productoEnpaqueServicio.editar(_productoEnpaque)
      .subscribe({
        next: (data) => {
          if(data.status){
            this.utilidadServicio.mostrarAlerta('El productoEmpaque se actualizo', 'success')
            this.modalActual.close(true)
          } else
            this.utilidadServicio.mostrarAlerta('No se puede actualizar el producto', 'error')
        },
        error:(e) => {}
      })
  }

}
