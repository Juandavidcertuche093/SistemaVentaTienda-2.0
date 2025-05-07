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

//servicios
import { ImagenesproductoService } from '../../services/imagenesproducto.service';
import { UtilidadService } from '../../../../core/services/utilidad.service';

//interfaces
import { ImagenProdubcto } from '../../../../core/interfaces/imagenProducto.interface';


@Component({
  selector: 'app-modal-imagenproducto',
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
    MatDatepickerModule
  ],
  templateUrl: './modal-imagenproducto.component.html',
  styleUrl: './modal-imagenproducto.component.scss'
})
export class ModalImagenproductoComponent implements OnInit {

  //PROPIEDADES
  formularioImagenProducto: FormGroup
  tituloAccion: string = 'Agregar'
  botonAccion: string = 'Guardar'

  constructor(
    private modalActual: MatDialogRef<ModalImagenproductoComponent>,
    @Inject(MAT_DIALOG_DATA) public datosimagenes: ImagenProdubcto,
    private fb: FormBuilder,
    private imagenProductoServicio: ImagenesproductoService,
    private utilidadesServicio: UtilidadService
  ){
    this.formularioImagenProducto = this.fb.nonNullable.group({
      nombreArchivo:['', [Validators.required]],
      ruta:['', [Validators.required]]
    })
    if(this.datosimagenes != null && this.datosimagenes !== undefined){
      this.tituloAccion = 'Editar'
      this.botonAccion = 'Actualizar'
    }
  }

  ngOnInit(): void {
    if(this.datosimagenes !== null && this.datosimagenes !== undefined)

      this.formularioImagenProducto.patchValue({
        nombreArchivo:  this.datosimagenes.nombreArchivo,
        ruta:           this.datosimagenes.ruta,
      })
  }

  guardarEditar_imagenProducto(){
    const _imagenProducto: ImagenProdubcto = {
      idImagen: this.datosimagenes == null ? 0: this.datosimagenes.idImagen,
      nombreArchivo: this.formularioImagenProducto.value.nombreArchivo,
      ruta: this.formularioImagenProducto.value.ruta
    }
    if(this.datosimagenes == null){
      this.imagenProductoServicio.guardar(_imagenProducto)
      .subscribe({
        next: (data) => {
          if(data.status){
            this.utilidadesServicio.mostrarAlerta('La imagen se registro','success')
            this.modalActual.close('true')
          } else
            this.utilidadesServicio.mostrarAlerta(data.msg, 'error')
        },
        error: () => {
          this.utilidadesServicio.mostrarAlerta('No se puedo registrar la imagen','error')
        }
      })
    } else
     this.imagenProductoServicio.editar(_imagenProducto)
     .subscribe({
      next: (data) => {
        if(data.status){
          this.utilidadesServicio.mostrarAlerta('La imagen se actualizo','success')
          this.modalActual.close('true')
        } else
          this.utilidadesServicio.mostrarAlerta('No se puede actualizar la imagen','error')
      },
      error: (e) => {}
     })
  }


}
