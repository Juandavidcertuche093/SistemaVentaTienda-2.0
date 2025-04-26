import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2'

//angular material
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {DialogModule} from '@angular/cdk/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatPaginatorModule} from '@angular/material/paginator';
import { CdkTableModule } from '@angular/cdk/table';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

//interfaces
import { Usuario } from '../../../../core/interfaces/usuario.interface';
import { UsuarioService } from '../../services/usuario.service';
import { UtilidadService } from '../../../../core/services/utilidad.service';

//componete modoal
import { ModalRegistroComponent } from '../../components/modal-registro/modal-registro.component';

//PrimeNG
import { TableModule } from 'primeng/table';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext'; //
import { IconFieldModule } from 'primeng/iconfield'; // <-- Añadir este
import { InputIconModule } from 'primeng/inputicon'; // <-- Añadir este
import { FloatLabelModule } from 'primeng/floatlabel'; // <-- Añadir este

@Component({
  selector: 'app-users-pages',
  imports: [
    MatTableModule,
    CdkTableModule,
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    DialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSlideToggleModule,
    TableModule,
    BadgeModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    FloatLabelModule
  ],
  templateUrl: './users-pages.component.html',
  styleUrl: './users-pages.component.scss'
})
export class UsersPagesComponent implements OnInit {

  columnasTabla: string[] = ['nombreCompleto', 'rolDescription', 'estado', 'acciones'];
  dataInicio: Usuario[] = []
  listaUsuarios: Usuario[] = []
  loading: boolean = false; // Opcional: para el spinner de p-table
  // datalistaUsuario = new MatTableDataSource(this.dataInicio)
  // @ViewChild(MatPaginator) paginacionTabla!: MatPaginator

  private dialog = inject(MatDialog)
  private usuarioService = inject(UsuarioService)
  private utilidadServicio = inject(UtilidadService)

  obtenerUsuarios(){
    this.usuarioService.lista()
    .subscribe({
      next: (data) => {
        if(data.status){
          // Asigna los datos al array para p-table
          this.listaUsuarios = data.value
        } else {
          this.listaUsuarios = []; // Limpia la lista si no hay datos
          this.utilidadServicio.mostrarAlerta('No se encontraron datos', 'warning');
        }
        this.loading = false; // Termina carga
      },
      error: (e) => {
        this.loading = false; // Termina carga en caso de error
        this.utilidadServicio.mostrarAlerta('Error al obtener usuarios', 'error');
      }
    })
  }


  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  //CREAMOS LA PAGINACION CON ESTE EVENTO (ngAfterViewInit)
  // ngAfterViewInit(): void {
  //   this.datalistaUsuario.paginator = this.paginacionTabla
  // }

  //METODO PARA FILTRAR
  aplicarFiltroTabla(event: Event, dt: any) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    dt.filterGlobal(filterValue, 'contains');
  }

  //METODO PARA EL MODAL DE CREAR USUARIO
  nuevoUsuario(){
    this.dialog.open( ModalRegistroComponent,{
      disableClose:true,
      width: '400px', // aquí defines el tamaño
      height: '550px', // opcional si quieres controlar también el alto
    }).afterClosed()
    .subscribe({
      next: (resultado) => {
        if(resultado === 'true')this.obtenerUsuarios()
      }
    })
  }

  //METODO PARA EL MODAL DE ACTUALIZAR USUARIO
  editarUsuario(usuario: Usuario){
    this.dialog.open( ModalRegistroComponent,{
      disableClose:true,
      data: usuario,
      width: '400px', // aquí defines el tamaño
      height: '550px', // opcional si quieres controlar también el alto
    }).afterClosed()
    .subscribe({
      next:(resultado) => {
        if(resultado === 'true')this.obtenerUsuarios();
      },
    })
  }

  //METODO PARA CAMBIAR EL ESTADO DEL USURIO
  cambiarEstado(usuario: Usuario) {
    const nuevoEstado = usuario.esActivo === 1 ? 0 : 1;
    this.usuarioService.actualizarEstado(usuario.idUsuario, nuevoEstado)
      .subscribe({
        next: (data) => {
          if (data.status) {
            this.utilidadServicio.mostrarAlerta("Estado actualizado", "success");
            this.obtenerUsuarios();
          } else {
            this.utilidadServicio.mostrarAlerta("No se pudo actualizar el estado", "error");
          }
        },
        error: (e) => {
          this.utilidadServicio.mostrarAlerta("Error al actualizar el estado", "error");
        }
      });
  }

  //METODO PARA ELIMINAR USUARIO
  eliminarUsuario(usuario: Usuario){
     //libreria de alertas personalizadas
     Swal.fire({
      title:'¿Desea eliminar el usuario',
      text: usuario.nombreCompleto,
      icon:'warning',
      confirmButtonColor:'#3085d6',
      confirmButtonText:'Si, eliminar',
      showCancelButton:true,
      cancelButtonColor: '#d33',
      cancelButtonText:'No, volver'
    }).then((resultado) => {

      if (resultado.isConfirmed) {
        this.usuarioService.eliminar(usuario.idUsuario)
        .subscribe({
          next: (data) => {
            if (data.status) {
              this.utilidadServicio.mostrarAlerta("El usuario fue eliminado","success")
              this.obtenerUsuarios();
            } else
              this.utilidadServicio.mostrarAlerta("No se pudo eliminar el usuario","error")
          },
          error:(e) => {}
        })
      }
    })
  }

}
