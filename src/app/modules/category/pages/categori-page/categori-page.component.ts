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
import { ModalCategoriaComponent } from '../../components/modal-categoria/modal-categoria.component';

//interface
import { Categoria } from '../../../../core/interfaces/categoria.interface';

//servicios
import { UtilidadService } from '../../../../core/services/utilidad.service';
import { CategoriaService } from '../../services/categoria.service';
import Swal from 'sweetalert2';

//PrimeNG
import { TableModule } from 'primeng/table';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext'; // <-- añadir este
import { IconFieldModule } from 'primeng/iconfield'; // <-- Añadir este
import { InputIconModule } from 'primeng/inputicon'; // <-- Añadir este
import { FloatLabelModule } from 'primeng/floatlabel'; // <-- Añadir este

@Component({
  selector: 'app-categori-page',
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
    FloatLabelModule,
  ],
  templateUrl: './categori-page.component.html',
  styleUrl: './categori-page.component.scss'
})
export class CategoriPageComponent {

  columnaTabla: string[] = ['nombre', 'Id', 'estado', 'acciones']
  dataInicio: Categoria[] = []
  listaCategoria: Categoria[] = []
  loading: boolean = false; // Opcional: para el spinner de p-table
  // dataListaCategoria = new MatTableDataSource(this.dataInicio)

  constructor(
    private dialog: MatDialog,
    private categoriaServicio: CategoriaService,
    private utilidadServicio: UtilidadService
  ){}


  obtenerCategorias(){
    this.loading = true
    this.categoriaServicio.lista()
    .subscribe({
      next: (data) => {
        if(data.status) {
          // Asigna los datos al array para p-table
          this.listaCategoria = data.value
        } else {
          this.listaCategoria = [] //limpia la lista de los datos
          this.utilidadServicio.mostrarAlerta('No se encontraron datos', 'warning');
        }
        this.loading = false //termina la carga
      },
      error: (e) => {
        this.loading = false; // Termina carga en caso de error
        this.utilidadServicio.mostrarAlerta('Error al obtener categorias', 'error');
      }
    })
  }

  ngOnInit(): void {
    this.obtenerCategorias();
  }

  //metodo para filtrar
  aplicarFiltroTabla(event: Event, dt: any) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    dt.filterGlobal(filterValue, 'contains');
  }


  nuevaCategoria(){
    this.dialog.open(ModalCategoriaComponent,{
      disableClose:true
    }).afterClosed()
    .subscribe(resultado => {
      if(resultado === 'true')this.obtenerCategorias();
    })
  }

  editarCategoria(categoria:Categoria){
    this.dialog.open(ModalCategoriaComponent,{
      disableClose:true,
      data: categoria
    }).afterClosed().subscribe(resultado => {
      if(resultado === 'true')this.obtenerCategorias();
    });
  }

  //metodo para elimainar un producto
  eliminarCategoria(categoria:Categoria){
    //libreria de alertas personalizadas
    Swal.fire({
      title:'¿Desea eliminar la Categoria',
      // text: producto.nombre,
      html: `<p style="font-size: 1.5rem; font-weight: bold;">${categoria.nombre}</p>`,
      icon:'warning',
      confirmButtonColor:'#3085d6',
      confirmButtonText:'Si, eliminar',
      showCancelButton:true,
      cancelButtonColor: '#d33',
      cancelButtonText:'No, volver'
    }).then((resultado) => {

      if(resultado.isConfirmed){
        this.categoriaServicio.eliminar(categoria.idCategoria)
        .subscribe({
          next:(data) => {
            if(data.status){
              this.utilidadServicio.mostrarAlerta("La categoria fue eliminado","success");
              this.obtenerCategorias();
            }else
            this.utilidadServicio.mostrarAlerta("No se pudo eliminar la categoria","error");
          },
          error:(e) => {}
        })
      }
    })
  }

}
