import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

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
import { MatSelectModule } from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import moment from 'moment';

//compoenete modal
import { ModalDetalleVentaComponent } from '../../components/modal-detalle-venta/modal-detalle-venta.component';

//interfce
import { Venta } from '../../../../core/interfaces/venta.interface';

//servicios
import {VentaHistorialService} from '../../services/venta-historial.service'
import {UtilidadService} from '../../../../core/services/utilidad.service';

//PrimeNG
import { TableModule } from 'primeng/table';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-saleshistory-pages',
  imports: [
    ReactiveFormsModule,
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
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    TableModule,
    BadgeModule,
    ButtonModule,
    ProgressSpinnerModule
  ],
  templateUrl: './saleshistory-pages.component.html',
  styleUrl: './saleshistory-pages.component.scss'
})
export class SaleshistoryPagesComponent implements OnInit {

  formularioBusqueda: FormGroup;
  opcionesBusqueda:any[]= [
    {value: 'fecha', descripcion: 'Por fecha'},
    {value: 'numero', descripcion: 'Nuemero Venta'}
  ]

  getSeverity(tipoPago: string): "success" | "info" | "warn" | "danger" | "secondary" | "contrast" {
    switch(tipoPago) {
      case 'Efectivo': return 'success';
      case 'Tarjeta': return 'warn';
      case 'Transferencia': return 'info';
      default: return 'secondary';
    }
  }

  columnasTabla:String[]=['fechaRegistro','numeroDocumento','tipoPago','total','vendedor','accion']
  dataInicio: Venta[]=[]
  dataListaVenta = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator)paginacionTabla!:MatPaginator


  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private ventaHistorialService: VentaHistorialService,
    private utilidadService: UtilidadService
  ){
    this.formularioBusqueda = this.fb.group({//cada ves que cambia se van a ocultar algunaos campos ya sea por fecha o por numero
      buscarPor:['fecha'],//valor por defecto
      numero:[''],
      fechaInicio:[''],
      fechaFin:['']
    })

    //logica para cada ves que cambie la busqueda por fecha o numero este vacio
    this.formularioBusqueda.get('buscarPor')?.valueChanges
    .subscribe(value => {
      this.formularioBusqueda.patchValue({
        numero:'',
        fechaInicio:'',
        fechaFin:''
      })
    })
  }


  ngOnInit(): void {
  }

  //en esta parte crearemos la paginacion con este evento (AfterViewInit)
  ngAfterViewInit(): void {
    this.dataListaVenta.paginator = this.paginacionTabla
  }

  //metodo para filtrar
  aplicarFiltroTabla(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaVenta.filter = filterValue.trim().toLocaleLowerCase();
  }

  //metodo para realizar una busqueda por fecha
  buscarVentas(){
    let _fechaInicio: string = '';
    let _fechaFin: string = '';

    if (this.formularioBusqueda.value.buscarPor === 'fecha') {
      _fechaInicio = moment(this.formularioBusqueda.value.fechaInicio).format('DD/MM/YYYY');
      _fechaFin = moment(this.formularioBusqueda.value.fechaFin).format('DD/MM/YYYY');

      if(_fechaInicio === 'invalid date' || _fechaFin === 'invalid date'){
        this.utilidadService.mostrarAlerta('Debe de ingresar ambas fechas','warning')
        return;
      }
    }

    this.ventaHistorialService.historial(
      this.formularioBusqueda.value.buscarPor,
      this.formularioBusqueda.value.numero,
      _fechaInicio,
      _fechaFin
    )
    .subscribe({
      next:(data) => {
        if (data.status)
          this.dataListaVenta.data = data.value;
        else
          this.utilidadService.mostrarAlerta('No se encontraron datos','warning')
      },
      error:(e)=>{}
    })
  }

  //metodo para visualizar el detalle de una venta con el modal
  verDetalleVenta(_venta:Venta){
    this.dialog.open(ModalDetalleVentaComponent,{
      data: _venta,
      disableClose: true,
      width: '1900px',  // Aumenta este valor
      height: 'auto',   // Mejor usar 'auto' para que se ajuste al contenido
      maxHeight: '90vh' // Limita la altura máximao' si prefieres que crezca con el contenido
    })
  }


}
