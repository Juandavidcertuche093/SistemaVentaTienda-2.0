import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; // Asegúrate de importar esto

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
import {MatAutocompleteModule} from '@angular/material/autocomplete';

//interfacaces
import { Rol } from '../../../../core/interfaces/rol.interface';
import { Usuario } from '../../../../core/interfaces/usuario.interface';

//rervicios
import { UsuarioService } from '../../services/usuario.service';
import { UtilidadService } from '../../../../core/services/utilidad.service';
import { RolService } from '../../services/rol.service';

// PrimeNG Modules (Import these where your component is declared or if standalone)
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';

// Interfaz para las opciones del dropdown de estado
interface EstadoUsuario {
  label: string;
  value: string; // O number si tu backend espera un número
}

@Component({
  selector: 'app-modal-registro',
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
    MatAutocompleteModule,
    // --- PrimeNG Modules ---
    ButtonModule,
    InputTextModule,
    DropdownModule,
    PasswordModule,
    SelectModule
  ],
  templateUrl: './modal-registro.component.html',
  styleUrl: './modal-registro.component.scss'
})
export class ModalRegistroComponent {

  formularioUsuario: FormGroup;
  ocultarPassword: boolean = true;
  tituloAccion: string = 'Agregar';
  botonAccion: string = 'Guardar';
  listaRoles: Rol[] = [];
  estadosUsuario: EstadoUsuario[] = [ // Definir opciones para el dropdown de estado
    { label: 'Activo', value: '1' },
    { label: 'No activo', value: '0' }
];

  constructor(
    private modalActual: MatDialogRef<ModalRegistroComponent>,
    @Inject(MAT_DIALOG_DATA) public datosUsuario: Usuario,
    private fb: FormBuilder,
    private rolServie: RolService,
    private usuarioService: UsuarioService,
    private utilidadService: UtilidadService
  ){
    this.formularioUsuario = this.fb.nonNullable.group({
      nombreCompleto:['', [Validators.required]],
      idRol:['', [Validators.required]],
      // clave:['', [Validators.minLength(5), Validators.required]],
      clave: ['',[Validators.minLength(7)]],
      esActivo:['1', [Validators.required]],
    });
    if (this.datosUsuario !== null && this.datosUsuario !== undefined) {
      this.tituloAccion = 'Editar';
      this.botonAccion = 'Actualizar'
    }

    //traemos la lista de los roles
    this.rolServie.lista()
    .subscribe({
      next: (data) => {
       if(data.status) this.listaRoles = data.value
      },
      error:(e)=>{}
    })
  }

  //si hay un usuario en datosUsuario(modo edicion), se carga los valores actuales del usuario
  ngOnInit(): void {
    if (this.datosUsuario !== null && this.datosUsuario !== undefined)
      this.formularioUsuario.patchValue({
        nombreCompleto: this.datosUsuario.nombreCompleto,
        idRol: this.datosUsuario.idRol,
        clave: '',
        esActivo: this.datosUsuario.esActivo
    })
  }

  //Guardar y editar usuario
  guardarEditar_usuario(){
    const _usuario: Usuario = {
      idUsuario: this.datosUsuario == null ? 0: this.datosUsuario.idUsuario,
      nombreCompleto: this.formularioUsuario.value.nombreCompleto,
      idRol: this.formularioUsuario.value.idRol,
      rolDescripcion: '',
      clave: this.formularioUsuario.value.clave ? this.formularioUsuario.value.clave: undefined,
      esActivo: parseInt(this.formularioUsuario.value.esActivo)
    }

    //verificamos en la consola que los datos se envien correctamente
    // console.log('Datos del usuario a enviar:', _usuario);

    //CREAR USAURIO
    if (this.datosUsuario == null) {
      this.usuarioService.guardar(_usuario)
      .subscribe({
        next: (data) => {
          if (data.status) {
            this.utilidadService.mostrarAlerta("El usuario fue registrado","success")
            this.modalActual.close(true)
          } else {
            this.utilidadService.mostrarAlerta("No se pudo registrar el usuario","error")
          }
        },
        error:(e) => {}
      })
    } else {
    //EDITAR uSUARIO
      this.usuarioService.editar(_usuario)
      .subscribe({
        next:(data) => {
          if (data.status) {
            this.utilidadService.mostrarAlerta("El usuario fue actualizado","success")
            this.modalActual.close(true)
          } else
            this.utilidadService.mostrarAlerta("No se pudo actualizar el usuario","error")
        },
        error:(e) => {}
      })
    }
  }

}
