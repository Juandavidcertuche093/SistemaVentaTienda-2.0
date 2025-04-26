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
import { CategoriaService } from '../../services/categoria.service';
import { UtilidadService } from '../../../../core/services/utilidad.service';

//interfaces
import { Categoria } from '../../../../core/interfaces/categoria.interface';

@Component({
  selector: 'app-modal-categoria',
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
  templateUrl: './modal-categoria.component.html',
  styleUrl: './modal-categoria.component.scss'
})
export class ModalCategoriaComponent implements OnInit {

  //PROPIEDADES
  formularioCategoria: FormGroup
  tituloAccion: string = 'Agregar'
  botonAccion: string = 'Guardar'

  constructor(
    private modalActual: MatDialogRef<ModalCategoriaComponent>,
    @Inject(MAT_DIALOG_DATA) public datosCategoria: Categoria,
    private fb: FormBuilder,
    private categoriaServicio: CategoriaService,
    private utilidadesServicio: UtilidadService
  ){
    this.formularioCategoria = this.fb.nonNullable.group({
      nombre:['', [Validators.required]],
      esActivo:['1', [Validators.required]],
    })
    if(this.datosCategoria != null && this.datosCategoria != undefined){
      this.tituloAccion = 'Editar'
      this.botonAccion = 'Actualizar'
    }

  }

  //cargamos los valores actuales de la categoria (modo Edicion)
  ngOnInit(): void {
    if(this.datosCategoria !== null && this.datosCategoria !== undefined)

      this.formularioCategoria.patchValue({
        nombre:   this.datosCategoria.nombre,
        esActivo: this.datosCategoria.esActivo
      })
  }

  guardarEditar_Categoria(){
    const _categoria: Categoria = {
      idCategoria: this.datosCategoria == null ? 0: this.datosCategoria.idCategoria,
      nombre: this.formularioCategoria.value.nombre,
      esActivo: parseInt(this.formularioCategoria.value.esActivo)
    };
    if(this.datosCategoria == null){
      this.categoriaServicio.guardar(_categoria)
      .subscribe({
        next: (data) => {
          if(data.status){
            this.utilidadesServicio.mostrarAlerta('La categoria se registro','success')
            this.modalActual.close('true')
          } else
            this.utilidadesServicio.mostrarAlerta(data.msg, 'error')
        },
        error: () => {
          this.utilidadesServicio.mostrarAlerta('No se puedo registrar la categoria','error')
        }
      })
    } else
      this.categoriaServicio.editar(_categoria)
      .subscribe({
        next: (data) => {
          if(data.status){
            this.utilidadesServicio.mostrarAlerta("La categoria se actualizo", "success")
            this.modalActual.close('true')
          } else
            this.utilidadesServicio.mostrarAlerta("No se puede actualizar la categoria","error")
        },
        error: (e) => {}
      })
  }

}
