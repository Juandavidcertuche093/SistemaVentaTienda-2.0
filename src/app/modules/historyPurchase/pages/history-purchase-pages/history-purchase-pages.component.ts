import { AfterViewInit, Component, OnInit, viewChild, ViewChild } from '@angular/core';
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
import { ModalDetalleCompraComponent} from '../../components/modal-detalle-compra/modal-detalle-compra.component';

//interfce
import { Compra } from '../../../../core/interfaces/compra.interface';

//servicios
import { CompraHistorialService } from '../../services/compra-historial.service'
import {UtilidadService} from '../../../../core/services/utilidad.service';

//PrimeNG
import { TableModule } from 'primeng/table';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';

//Formato de fecha
export const MY_DATA_FORMATS={
  parse:{
    dateInput: 'DD/MM/YYYY'
  },
  display:{
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY'
  }
}

@Component({
  selector: 'app-history-purchase-pages',
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
    ButtonModule
  ],
  templateUrl: './history-purchase-pages.component.html',
  styleUrl: './history-purchase-pages.component.scss'
})
export class HistoryPurchasePagesComponent {

  formularioBusqueda: FormGroup;
  opcionesBusqueda:any[]= [
    {value: 'fecha', descripcion: 'Por fecha'},
    {value: 'numero', descripcion: 'Nuemero Venta'}
  ]
  columnasTabla:String[]=['fechaRegistro','numeroDocumento','tipoPago','total','proveedor','accion']
  detaInicio: Compra[]=[]
  detaListaCompra = new MatTableDataSource(this.detaInicio);

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private compraHistorialService: CompraHistorialService,
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
  }

  //metodo para filtrar
  aplicarFiltroTabla(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.detaListaCompra.filter = filterValue.trim().toLocaleLowerCase();
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

    this.compraHistorialService.historial(
      this.formularioBusqueda.value.buscarPor,
      this.formularioBusqueda.value.numero,
      _fechaInicio,
      _fechaFin
    )
    .subscribe({
      next:(data) => {
        if (data.status)
          this. detaListaCompra.data = data.value;
        else
          this.utilidadService.mostrarAlerta('No se encontraron datos','warning')
      },
      error:(e)=>{}
    })
  }

  //metodo para visualizar el detalle de una venta con el modal
  verDetalleVenta(_compra:Compra){
    this.dialog.open(ModalDetalleCompraComponent,{
      data: _compra,
      disableClose: true,
      width: '1900px',  // Aumenta este valor
      height: 'auto',   // Mejor usar 'auto' para que se ajuste al contenido
      maxHeight: '90vh' // Limita la altura máximao' si prefieres que crezca con el contenido
    })
  }


}
