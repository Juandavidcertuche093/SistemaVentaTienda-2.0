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
import { ProveedorService } from '../../services/proveedor.service';
import { UtilidadService } from '../../../../core/services/utilidad.service';

//interfaces
import { Proveedor } from '../../../../core/interfaces/proveedor.interface';

@Component({
  selector: 'app-modal-proveedor',
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
    MatDatepickerModule],
  templateUrl: './modal-proveedor.component.html',
  styleUrl: './modal-proveedor.component.scss'
})
export class ModalProveedorComponent implements OnInit {

  formularioProveedor: FormGroup
  tituloAccion: string = 'Agregar'
  botonAccion: string = 'Guardar'

  constructor(
    private modalActual: MatDialogRef<ModalProveedorComponent>,
    @Inject(MAT_DIALOG_DATA) public datosProveedor: Proveedor,
    private fb: FormBuilder,
    private proveedorServicio: ProveedorService,
    private utilidadesServicio: UtilidadService
  ){
    this.formularioProveedor = this.fb.nonNullable.group({
      nombre:['', [Validators.required]],
      direccion:['', [Validators.required]],
      contacto:['', [Validators.required]],
      esActivo:['1', [Validators.required]],
    })
    if(this.datosProveedor != null && this.datosProveedor !== undefined){
      this.tituloAccion = 'Editar'
      this.botonAccion = 'Actualizar'
    }
  }

  ngOnInit(): void {
    if(this.datosProveedor !== null && this.datosProveedor !== undefined)

      this.formularioProveedor.patchValue({
        nombre:     this.datosProveedor.nombre,
        direccion:  this.datosProveedor.direccion,
        contacto:   this.datosProveedor.contacto,
        esActivo:   this.datosProveedor.esActivo
      })
  }

  guardarEditar_Proveedor(){
    const _Proveedor: Proveedor = {
      idProveedor: this.datosProveedor == null ? 0: this.datosProveedor.idProveedor,
      nombre: this.formularioProveedor.value.nombre,
      direccion: this.formularioProveedor.value.direccion,
      contacto: this.formularioProveedor.value.contacto,
      esActivo: parseInt(this.formularioProveedor.value.esActivo)
    }
    if(this.datosProveedor == null){
      this.proveedorServicio.guardar(_Proveedor)
      .subscribe({
        next: (data) => {
          if(data.status){
            this.utilidadesServicio.mostrarAlerta('El proveedor se registro','success')
            this.modalActual.close('true')
          } else
            this.utilidadesServicio.mostrarAlerta(data.msg, 'error')
        },
        error: () => {
          this.utilidadesServicio.mostrarAlerta('No se puedo registrar el proveedor','error')
        }
      })
    } else
     this.proveedorServicio.editar(_Proveedor)
     .subscribe({
      next: (data) => {
        if(data.status){
          this.utilidadesServicio.mostrarAlerta('El proveedor se actualizo','success')
          this.modalActual.close('true')
        } else
          this.utilidadesServicio.mostrarAlerta('No se puede actualizar el proveedor','error')
      },
      error: (e) => {}
     })
  }

}
