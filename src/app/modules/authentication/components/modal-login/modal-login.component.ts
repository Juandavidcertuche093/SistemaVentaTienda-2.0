import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule } from '@angular/forms';
import { faPen, faEye, faEyeSlash, faUser, faUserCircle, faUserMd } from '@fortawesome/free-solid-svg-icons';

// --Servicos--
import { AuthUsuarioService } from '../../services/auth-usuario.service';
import { UtilidadService } from '../../../../core/services/utilidad.service';

// --- Angular Material Modules ---
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { MatDialogRef } from '@angular/material/dialog';
import {MatDialogModule} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field'; // Añadido
import { MatInputModule } from '@angular/material/input';// Añadido
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // Añadido si usas el spinner en botón


// --- PrimeNG Modules ---
import { DialogModule } from 'primeng/dialog'; // Necesario si NO usas DialogService y usas <p-dialog>
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ProgressSpinnerModule } from 'primeng/progressspinner'; // Para el spin


import { Router } from '@angular/router';

import Swal from 'sweetalert2'

@Component({
  selector: 'app-modal-login',
  imports: [
    CommonModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatProgressBarModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
     // PrimeNG Modules
     DialogModule, // Necesario si NO usas DialogService
     InputTextModule,
     PasswordModule,
     ButtonModule,
     ProgressBarModule,
     FloatLabelModule,
     ProgressSpinnerModule
  ],
  templateUrl: './modal-login.component.html',
  styleUrl: './modal-login.component.scss'
})
export class ModalLoginComponent {

  formulariLogin: FormGroup;
  showPassword = false;
  mostrarLoading:boolean=false;

  public currentYear = new Date().getFullYear(); // Añadido para el copyright


  faPen = faPen;
  faEye = faEye;
  faUser = faUser
  faEyeSlash = faEyeSlash;
  faUserCircle = faUserCircle;
  faUserMd = faUserMd

  constructor(
    private modalActual: MatDialogRef<ModalLoginComponent>,
    private fb: FormBuilder,
    private authusuarioService: AuthUsuarioService,
    private utilidadServicio: UtilidadService,
    private router: Router
  ){
    this.formulariLogin = this.fb.nonNullable.group({
      name: ['', [Validators.required] ],
      password: ['', [ Validators.required, Validators.minLength(6)] ]
    })
  }

  login() {
    if (this.formulariLogin.invalid) {
      return;
    }

    this.mostrarLoading = true;
    const { name, password } = this.formulariLogin.value;

    this.authusuarioService.login(name, password)
      .subscribe((result) => {
        this.mostrarLoading = false;

        switch (result) {
          case 'invalid-credentials':
            this.utilidadServicio.mostrarAlerta(
              "contraseña incorrecta. Por favor, verifique sus credenciales e inténtelo nuevamente.",
              "error"
            );
            break;

          case 'user-not-found':
            this.utilidadServicio.mostrarAlerta(
              "El usuario no existe. Verifique el nombre ingresado.",
              "error"
            );
            break;

          case 'user-inactive':
            Swal.fire({
              title: "Cuenta Inactiva",
              text: "Su cuenta está desactivada. Por favor, contacte al administrador.",
              icon: "info"
            });
            break;

          case 'server-error':
            this.modalActual.close(); // Cierra el modal si hay error de servidor
            break;

          case 'success':
            this.authusuarioService.redirectBasedOnRole(); // Redirige según el rol
            this.modalActual.close('success'); // Cierra el modal con éxito
            break;
        }
      });
  }

}
