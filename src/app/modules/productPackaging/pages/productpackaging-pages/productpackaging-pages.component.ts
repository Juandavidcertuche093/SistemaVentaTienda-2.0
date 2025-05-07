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

//compoenente modal
import { ModalProductoempaqueComponent } from '../../components/modal-productoempaque/modal-productoempaque.component';

//interface
import { ProductoEmpaque } from '../../../../core/interfaces/productoEmpaque.interface';

//servicios
import { UtilidadService } from '../../../../core/services/utilidad.service';
import { PresentacionService } from '../../services/presentacion.service';
import { ProductoEnpaqueService } from '../../services/producto-enpaque.service';
import { ProductoService } from '../../services/producto.service';
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
  selector: 'app-productpackaging-pages',
  imports: [
    MatCardModule,
    MatIconModule,
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
  templateUrl: './productpackaging-pages.component.html',
  styleUrl: './productpackaging-pages.component.scss'
})
export class ProductpackagingPagesComponent implements OnInit {

  columnaTabla: string[] = ['producto', 'presentacion', 'cantidad','precioVenta', 'precioComora', 'acciones']
  dataInicio: ProductoEmpaque[] = []
  listaProductoEmpaque: ProductoEmpaque[] = []
  loading: boolean = false; // Opcional: para el spinner de p-table
  // dataListaProductoEnpaque = new MatTableDataSource(this.dataInicio)

  constructor(
    private dialog: MatDialog,
    private productoEnpaqueService: ProductoEnpaqueService,
    private utilidadServicio: UtilidadService,
  ){}


  obtenerProductoEnpaque(){
    this.productoEnpaqueService.lista()
    .subscribe({
      next: (data) => {
        if(data.status){
          // Asigna los datos al array para p-table
          this.listaProductoEmpaque = data.value
        } else {
          this.listaProductoEmpaque = []; // Limpia la lista si no hay datos
          this.utilidadServicio.mostrarAlerta('Error al obtener los empaques', 'error');
        }
        this.loading = false; // Termina carga
      },
      error: (e) => {
        this.loading = false; // Termina carga en caso de error
        // this.utilidadServicio.mostrarAlerta('Error al obtener productos', 'error');
      },
    })
  }

  ngOnInit(): void {
    this.obtenerProductoEnpaque();
  }

  aplicarFiltroTabla(event: Event, dt: any) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    dt.filterGlobal(filterValue, 'contains');
  }

  //metodo para el modal de crear productoEmpaque
    nuevoProductoEmpaque(){
      this.dialog.open(ModalProductoempaqueComponent,{
        disableClose: true
      }).afterClosed().subscribe(resultado => {
        if(resultado === 'true')this.obtenerProductoEnpaque();
      });
    }

    //metodo para el modal de actualizar productoEmpaque
    editarProductoEmpaque(productoEmpaque:ProductoEmpaque){
      this.dialog.open(ModalProductoempaqueComponent,{
        disableClose:true,
        data: productoEmpaque
      }).afterClosed().subscribe(resultado => {
        if(resultado === 'true')this.obtenerProductoEnpaque();
      });
    }

    //metodo para elimainar un producto
      eliminarProductoEmpaque(productoEmpaque:ProductoEmpaque){
        //libreria de alertas personalizadas
        Swal.fire({
          title:'¿Desea eliminar el Producto',
          // text: producto.nombre,
          html: `<p style="font-size: 1.5rem; font-weight: bold;">${productoEmpaque.descripcionProducto}</p>`,
          icon:'warning',
          confirmButtonColor:'#3085d6',
          confirmButtonText:'Si, eliminar',
          showCancelButton:true,
          cancelButtonColor: '#d33',
          cancelButtonText:'No, volver'
        }).then((resultado) => {

          if(resultado.isConfirmed){
            this.productoEnpaqueService.eliminar(productoEmpaque.idProductoEmpaque)
            .subscribe({
              next:(data) => {
                if(data.status){
                  this.utilidadServicio.mostrarAlerta("El productoEmpaque fue eliminado","success");
                  this.obtenerProductoEnpaque();
                }else
                this.utilidadServicio.mostrarAlerta("No se pudo eliminar el productoEmpaque","error");
              },
              error:(e) => {}
            })
          }
        })
      }
}
