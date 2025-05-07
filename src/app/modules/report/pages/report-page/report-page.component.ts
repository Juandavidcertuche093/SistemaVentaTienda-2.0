import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

//angular/material
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import {MatDialogModule} from '@angular/material/dialog';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import { CdkTableModule } from '@angular/cdk/table';
import { MatTableModule } from '@angular/material/table';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatPaginatorModule} from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';

import moment from 'moment';
// import * as XLSX from 'xlsx';

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';


//interface
import { Reporte } from '../../../../core/interfaces/reporte.interface';

//servicio
import {VentaReporteService} from '../../services/venta-reporte.service';
import {UtilidadService} from '../../../../core/services/utilidad.service';

//PrimeNG
import { TableModule } from 'primeng/table';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';



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
  selector: 'app-report-page',
  imports: [
    CommonModule,
    MatDialogModule,
    MatGridListModule,
    MatFormFieldModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatDividerModule,
    CdkTableModule,
    MatTableModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatPaginatorModule,
    TableModule,
    BadgeModule,
    ButtonModule,
    TagModule,
    CardModule
  ],
  templateUrl: './report-page.component.html',
  styleUrl: './report-page.component.scss'
})
export class ReportPageComponent {

  formularioFiltro:FormGroup
  listaVentasReporte:Reporte[]=[];
  columnasTabla: string[] = ['fechaRegistro','numeroVenta','tipoPago','total','producto','presentacion','cantidad','precio','totalProducto', 'usuario'];
  dataVentaReporte= new MatTableDataSource(this.listaVentasReporte);
  @ViewChild(MatPaginator)paginacionTabla!:MatPaginator




  getSeverity(tipoPago: string): 'success' | 'warn' | 'info' {
    switch(tipoPago) {
      case 'Efectivo': return 'success';
      case 'Tarjeta': return 'warn';
      default: return 'info';
    }
  }

  getTotalVentas(): number {
    return this.listaVentasReporte.reduce((acc, venta) => acc + parseFloat(venta.total || '0'), 0);
  }

  getTotalPorTipoPago(tipo: string): number {
    return this.listaVentasReporte
      .filter(venta => venta.tipoPago === tipo)
      .reduce((acc, venta) => acc + parseFloat(venta.total || '0'), 0);
  }

  constructor(
    private fb: FormBuilder,
    private ventaServicio: VentaReporteService,
    private utilidadService: UtilidadService
  ){
    this.formularioFiltro = this.fb.group({
      fechaInicio:['',[Validators.required]],
      fechaFin:['',[Validators.required]]
    })
  }

  //en esta parte crearemos la paginacion con este evento (AfterViewInit)
  ngAfterViewInit(): void {
    this.dataVentaReporte.paginator = this.paginacionTabla
  }

  //metodo para buscar por rango de fecha
  buscarVentas(){
    const _fechaInicio = moment(this.formularioFiltro.value.fechaInicio).format('DD/MM/YYYY');
    const _fechaFin = moment(this.formularioFiltro.value.fechaFin).format('DD/MM/YYYY');

    if(_fechaInicio === 'Invalid date' || _fechaFin === 'Invalid date'){
      this.utilidadService.mostrarAlerta('Debe de ingresar ambas fechas','warning')
      return;
    }

    this.ventaServicio.reporte(
      _fechaInicio,
      _fechaFin
    )
    .subscribe({
      next:(data) => {
        if (data.status) {
          this.listaVentasReporte = data.value;
          this.dataVentaReporte.data = data.value;
        } else {
          this.listaVentasReporte = [];
          this.dataVentaReporte.data = []
          this.utilidadService.mostrarAlerta('No se encontraron datos','warning')
        }
      },
      error:(e)=>{}
    })
  }

  //metodo para exportar al excel
  // exportarExcel(){
  //   const wb = XLSX.utils.book_new(); //nuevo libro
  //   const ws = XLSX.utils.json_to_sheet(this.listaVentasReporte);

  //   XLSX.utils.book_append_sheet(wb,ws,"Reporte");
  //   XLSX.writeFile(wb,"Reporte Ventas.xlsx")
  // }

  exportarPDF() {
    const doc = new jsPDF('p', 'pt', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 40;

    // Calcular el total de ventas
    const total = this.listaVentasReporte.reduce((acc, venta) => acc + parseFloat(venta.total || '0'), 0);

    // Logo (opcional - puedes comentar esto si no tienes logo)
    // const logo = new Image();
    // logo.src = 'assets/logo.png';
    // doc.addImage(logo, 'PNG', margin, 15, 50, 50);

    // Título de la droguería
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(13, 71, 161); // Azul oscuro
    doc.text('TIENDA VIEJA', pageWidth / 2, 50, { align: 'center' });

    // Configuración del encabezado
    doc.setFontSize(18);
    doc.setTextColor(21, 101, 192); // Azul medio
    doc.text('REPORTE DE VENTAS', pageWidth / 2, 80, { align: 'center' });

    // Línea decorativa
    doc.setDrawColor(21, 101, 192);
    doc.setLineWidth(1.5);
    doc.line(margin, 90, pageWidth - margin, 90);

    // Información de la empresa
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(75, 85, 99); // Gris oscuro
    doc.text(`Dirección: Parque principal - Silvia (Cauca)`, margin, 120);
    doc.text(`Teléfono: (123) 456-7890`, margin, 140);
    doc.text(`NIT: 123.456.789-0`, margin, 160);

    // Información del reporte
    doc.setFont("helvetica", "bold");
    doc.text(`Fecha de generación: ${new Date().toLocaleDateString('es-CO')}`, pageWidth - margin, 120, { align: 'right' });
    doc.text(`Hora: ${new Date().toLocaleTimeString('es-CO')}`, pageWidth - margin, 140, { align: 'right' });
    doc.text(`Total ventas: $${total.toLocaleString('es-CO', {minimumFractionDigits: 2})}`, pageWidth - margin, 160, { align: 'right' });

    // Espacio antes de la tabla
    doc.setFontSize(14);
    doc.setTextColor(13, 71, 161);
    doc.text('Detalle de Ventas', margin, 190);

    // Tabla de ventas con estilos mejorados
    autoTable(doc, {
      startY: 200,
      head: [['No. Venta', 'Fecha', 'Tipo Pago', 'Producto', 'Cantidad', 'Precio Unitario', 'Total', 'Vendedor']],
      body: this.listaVentasReporte.map(venta => [
        venta.numeroVenta,
        new Date(venta.fechaRegistro).toLocaleDateString('es-CO'),
        venta.tipoPago,
        venta.nombreProducto,
        venta.cantidad,
        `$${parseFloat(venta.precio).toLocaleString('es-CO', {minimumFractionDigits: 2})}`,
        `$${parseFloat(venta.total).toLocaleString('es-CO', {minimumFractionDigits: 2})}`,
        venta.usuario
      ]),
      margin: { left: margin, right: margin },
      styles: {
        fontSize: 10,
        cellPadding: 6,
        halign: 'center',
        valign: 'middle'
      },
      headStyles: {
        fillColor: [13, 71, 161], // Azul oscuro
        textColor: 255, // Blanco
        fontStyle: 'bold',
        fontSize: 11
      },
      bodyStyles: {
        textColor: 50,
        fontSize: 9
      },
      alternateRowStyles: {
        fillColor: [241, 245, 249] // Gris muy claro para filas alternas
      },
      columnStyles: {
        0: { cellWidth: 'auto', halign: 'center' }, // No. Venta
        1: { cellWidth: 'auto', halign: 'center' }, // Fecha
        2: { cellWidth: 'auto', halign: 'center' }, // Tipo Pago
        3: { cellWidth: 'auto', halign: 'left' },  // Producto
        4: { cellWidth: 'auto', halign: 'right' }, // Cantidad
        5: { cellWidth: 'auto', halign: 'right' }, // Precio
        6: { cellWidth: 'auto', halign: 'right', fontStyle: 'bold' }, // Total
        7: { cellWidth: 'auto', halign: 'left' }  // Vendedor
      },
      didDrawPage: function(data) {
        // Pie de página
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text('© 2023 Tienda Vieja - Todos los derechos reservados',
                pageWidth / 2, doc.internal.pageSize.height - 20,
                { align: 'center' });

        // Número de página
        doc.text(`Página ${doc.getNumberOfPages()}`,
                pageWidth - margin, doc.internal.pageSize.height - 20,
                { align: 'right' });
      }
    });

    // Guardar el PDF
    doc.save(`Reporte_Ventas_${new Date().toISOString().slice(0,10)}.pdf`);
  }


}
