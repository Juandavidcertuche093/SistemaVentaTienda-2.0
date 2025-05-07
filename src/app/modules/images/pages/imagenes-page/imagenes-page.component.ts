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
import { ModalImagenproductoComponent } from '../../components/modal-imagenproducto/modal-imagenproducto.component';

//interface
import { ImagenProdubcto } from '../../../../core/interfaces/imagenProducto.interface';

//servicios
import { UtilidadService } from '../../../../core/services/utilidad.service';
import { ImagenesproductoService } from '../../services/imagenesproducto.service';
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
  selector: 'app-imagenes-page',
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
  templateUrl: './imagenes-page.component.html',
  styleUrl: './imagenes-page.component.scss'
})
export class ImagenesPageComponent implements OnInit  {

  columnaTabla: string[] = ['nombre', 'ruta', 'acciones']
  dataInicio: ImagenProdubcto [] = []
  listaImagenProducto: ImagenProdubcto[] = []; // Usar un array simple para p-table
  loading: boolean = false; // Opcional: para el spinner de p-table
  // dataListaImagenProducto = new MatTableDataSource(this.dataInicio)

  constructor(
    private dialog: MatDialog,
    private imagenProductoServicio: ImagenesproductoService,
    private utilidadServicio: UtilidadService
  ){}

  obteneriamgenesProducto(){
    this.imagenProductoServicio.lista()
    .subscribe({
      next: (data) => {
        if(data.status){
          //Asigna los datos al array para p-table
          this.listaImagenProducto = data.value
        }else {
          this.listaImagenProducto = []; // Limpia la lista si no hay datos
          this.utilidadServicio.mostrarAlerta('Error al obtener imagenes', 'error');
        }
        this.loading = false; // Termina carga
      },
      error: (e) => {
        this.loading = false; // Termina carga en caso de error
        // this.utilidadServicio.mostrarAlerta('Error al obtener imagenes', 'error');
      }
    })
  }

  ngOnInit(): void {
    this.obteneriamgenesProducto();
  }


  //metodo para filtrar
  aplicarFiltroTabla(event: Event, dt: any) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    dt.filterGlobal(filterValue, 'contains');
  }

 nuevaImagen(){
      this.dialog.open(ModalImagenproductoComponent,{
        disableClose:true
      }).afterClosed().subscribe(resultado => {
        if(resultado === 'true')this.obteneriamgenesProducto();
      })
    }

  editarImagenProducto(imagenProducto:ImagenProdubcto){
      this.dialog.open(ModalImagenproductoComponent,{
        disableClose:true,
        data: imagenProducto
      }).afterClosed().subscribe(resultado => {
        if(resultado === 'true')this.obteneriamgenesProducto();
      });
  }


//metodo para elimainar un producto
  eliminarImagenProducto(imagenProducto:ImagenProdubcto){
    //libreria de alertas personalizadas
    Swal.fire({
      title:'¿Desea eliminar la imagen',
      // text: producto.nombre,
      html: `<p style="font-size: 1.5rem; font-weight: bold;">${imagenProducto.nombreArchivo}</p>`,
      icon:'warning',
      confirmButtonColor:'#3085d6',
      confirmButtonText:'Si, eliminar',
      showCancelButton:true,
      cancelButtonColor: '#d33',
      cancelButtonText:'No, volver'
    }).then((resultado) => {

      if(resultado.isConfirmed){
        this.imagenProductoServicio.eliminar(imagenProducto.idImagen)
        .subscribe({
          next:(data) => {
            if(data.status){
              this.utilidadServicio.mostrarAlerta("la imagen fue eliminada","success");
              this.obteneriamgenesProducto();
            }else
            this.utilidadServicio.mostrarAlerta("No se pudo eliminar la imagen","error");
          },
          error:(e) => {}
        })
      }
    })
  }


}
