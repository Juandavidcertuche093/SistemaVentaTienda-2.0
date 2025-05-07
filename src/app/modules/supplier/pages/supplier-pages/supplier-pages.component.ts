import { AfterViewInit, Component, OnInit, ViewChild, effect } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';

//angular Material
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
import { MatChipsModule } from '@angular/material/chips';


//compoenente modal
import { ModalProveedorComponent } from '../../components/modal-proveedor/modal-proveedor.component';

//interface
import { Proveedor } from '../../../../core/interfaces/proveedor.interface';

//servicios
import { UtilidadService } from '../../../../core/services/utilidad.service';
import { ProveedorService } from '../../services/proveedor.service';
import Swal from 'sweetalert2';

//PrimeNG
import { TableModule } from 'primeng/table';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext'; //
import { IconFieldModule } from 'primeng/iconfield'; // <-- Añadir este
import { InputIconModule } from 'primeng/inputicon'; // <-- Añadir este
import { FloatLabelModule } from 'primeng/floatlabel'; // <-- Añadir este

@Component({
  selector: 'app-supplier-pages',
  imports: [
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatFormFieldModule,
    TableModule,
    BadgeModule,
    ButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    CommonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    FloatLabelModule
  ],
  templateUrl: './supplier-pages.component.html',
  styleUrl: './supplier-pages.component.scss'
})
export class SupplierPagesComponent implements OnInit {

  columnaTabla: string[] = ['nombre', 'direccion', 'contacto', 'estado', 'acciones']
  dataInicio: Proveedor[] = []
  listaProveedores: Proveedor[] = []; // Usar un array simple para p-table
  loading: boolean = false; // para el spinner de p-table
  // dataListaProveedor = new MatTableDataSource(this.dataInicio)

  constructor(
      private dialog: MatDialog,
      private proveedorServicio: ProveedorService,
      private utilidadServicio: UtilidadService
    ){}

  obtenerProveedores(){
    this.loading = true// inicia la carga parta p-Table
    this.proveedorServicio.lista()
    .subscribe({
      next: (data) => {
        if(data.status){
          //asigna los datos al array para p-table
          this.listaProveedores = data.value
        } else {
          this.listaProveedores = []//limpia la lista si no hay datos
          this.utilidadServicio.mostrarAlerta('Error al obtener proveedores', 'error');
        }
        this.loading = false; // Termina carga
      },
      error: (e) => {
        this.loading = false; // Termina carga en caso de error
        // this.utilidadServicio.mostrarAlerta('Error al obtener productos', 'error');
      }
    })
  }

  ngOnInit(): void {
    this.obtenerProveedores();
  }

  //metodo para filtrar
  aplicarFiltroTabla(event: Event, dt: any) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    dt.filterGlobal(filterValue, 'contains');
  }

  nuevoProveedor(){
      this.dialog.open(ModalProveedorComponent,{
        disableClose:true
      }).afterClosed().subscribe(resultado => {
        if(resultado === 'true')this.obtenerProveedores();
      })
    }

  editarProveedor(proveedor:Proveedor){
      this.dialog.open(ModalProveedorComponent,{
        disableClose:true,
        data: proveedor
      }).afterClosed().subscribe(resultado => {
        if(resultado === 'true')this.obtenerProveedores();
      });
  }


//metodo para elimainar un producto
  eliminarProveedor(proveedor:Proveedor){
    //libreria de alertas personalizadas
    Swal.fire({
      title:'¿Desea eliminar el Proveedor',
      // text: producto.nombre,
      html: `<p style="font-size: 1.5rem; font-weight: bold;">${proveedor.nombre}</p>`,
      icon:'warning',
      confirmButtonColor:'#3085d6',
      confirmButtonText:'Si, eliminar',
      showCancelButton:true,
      cancelButtonColor: '#d33',
      cancelButtonText:'No, volver'
    }).then((resultado) => {

      if(resultado.isConfirmed){
        this.proveedorServicio.eliminar(proveedor.idProveedor)
        .subscribe({
          next:(data) => {
            if(data.status){
              this.utilidadServicio.mostrarAlerta("El proveedor fue eliminado","success");
              this.obtenerProveedores();
            }else
            this.utilidadServicio.mostrarAlerta("No se pudo eliminar el proveedor","error");
          },
          error:(e) => {}
        })
      }
    })
  }

}
