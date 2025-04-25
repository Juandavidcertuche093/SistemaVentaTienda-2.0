import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatDialog } from '@angular/material/dialog';

import { ModalLoginComponent } from '../modal-login/modal-login.component';

@Component({
  selector: 'auth-inicio',
  imports: [
    RouterModule,
    CommonModule
  ],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent {

  private dialog = inject(MatDialog)

  public currentYear: number = new Date().getFullYear();

  //metodo para abrir el modal
  loginUsuario(){
    this.dialog.open(ModalLoginComponent, {
      disableClose: false
    }).afterClosed()
    .subscribe( result => {
      // console.log('el modal se cerro con resultado:',result);
    })
  }

}
