import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';

//Angular Material
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';

//Mostrar gráficos.
import { Chart, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts'; // ✅ Importación correcta
import { CommonModule } from '@angular/common';
Chart.register(...registerables);

//--- Servicios ---
import { DashboardService } from '../../services/dashboard.service';
import { NotificacionesService } from '../../../../shared/services/notificaciones.service'

// --- PrimeNG Modules ---
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart'; // Importa p-chart
import { TableModule } from 'primeng/table'; // Importa p-table

@Component({
  selector: 'app-dashboard-pages',
  imports: [
    BaseChartDirective,
    MatCardModule,
    MatIconModule,
    CommonModule,
    CardModule,
    ChartModule,
    TableModule,
  ],
  templateUrl: './dashboard-pages.component.html',
  styleUrl: './dashboard-pages.component.scss'
})
export class DashboardPagesComponent {

   //variables
   totalIngresos:string='0';
   totalVentas:string='0';
   totalProductos:string='0';
   totalUsuarios:string='0'

   productosMasVendidos: { idProducto: number, nombre: string, cantidadVendida: number }[] = [];

   productosStockBajo: any[] = [];


   constructor(
     private dashboardServicio: DashboardService,
     private notificacionesService: NotificacionesService
   ){}


    // Datos dinámicos para el gráfico de barras
    barChartData: ChartData<'bar'> = {
     labels: [],
     datasets: [
       {
         label: 'Ingresos',
         data: [],
         backgroundColor: '#f84525'
       },
       {
         label: 'Ganancias',
         data: [],
         backgroundColor: '#f84525'
       }
     ]
   };

   barChartOptions: ChartOptions = {
     responsive: true,
     plugins: {
       legend: {
         position: 'bottom'
       }
     },
     scales: {
       y: {
         beginAtZero: true
       }
     }
   };

   ngOnInit(): void {
     this.dashboardServicio.resumen().subscribe({
       next: (data) => {
         if (data.status) {
           this.totalIngresos = data.value.totalIngresos.replace(',', '').slice(0, -2);
           this.totalVentas = data.value.totalVentas;
           this.totalProductos = data.value.totalProductos;
           this.totalUsuarios = data.value.totalUsuarios;
           this.productosMasVendidos = data.value.productosMasVendidos;

           const arrayData: any[] = data.value.ventasUltimaSemana;
           const labelTemp = arrayData.map((value) => value.fecha);
           const ingresosTemp = arrayData.map((value) => value.total); // Datos de ingresos
           const gananciasTemp = arrayData.map((value) => value.ganancia); // Suponiendo que la API también devuelve ganancias

           // Actualizar los datos del gráfico de barras
           this.barChartData = {
             labels: labelTemp,
             datasets: [
               {
                 label: 'Ingresos',
                 data: ingresosTemp,
                 backgroundColor: '#0F172A'
               },
               {
                 label: 'Ganancias',
                 data: gananciasTemp,
                 backgroundColor: '#0F172A'
               }
             ]
           };
         }
       },
       error: (e) => {
         console.error('Error al cargar datos:', e);
       }
     });

     this.obtenerNotificacionesStock();
   }

   obtenerNotificacionesStock() {
     this.notificacionesService.obtenerProductosConStockBajo().subscribe({
       next: (data) => {
         this.productosStockBajo = data;
       },
       error: (err) => {
         console.error('Error obteniendo productos con stock bajo', err);
         alert('Error obteniendo producto con stock bajo')
       }
     });
   }

}
