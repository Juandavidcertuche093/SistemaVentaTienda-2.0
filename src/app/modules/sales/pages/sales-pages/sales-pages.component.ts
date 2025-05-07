import { Component, computed, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2'

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
import {MatAutocompleteModule, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';

//interfaces
import { DetalleVenta } from '../../../../core/interfaces/detalleventa.interface';
import { Venta } from '../../../../core/interfaces/venta.interface';
import {ProductoEmpaque} from '../../../../core/interfaces/productoEmpaque.interface'

//servicios
import { VentaService } from '../../services/venta.service';
// import { ProductoVentaService } from '../../services/producto-venta.service';
import { UtilidadService } from '../../../../core/services/utilidad.service';
import { AuthUsuarioService } from '../../../authentication/services/auth-usuario.service';
import { ProductoEmpaqueService } from '../../services/producto-empaque.service';

//PrimeNG
import { AutoCompleteModule, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms'; // <-- Añade este import
import { SelectModule } from 'primeng/select'; // Para p-select

@Component({
  selector: 'app-sales-pages',
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
    TableModule,
    ButtonModule,
    CardModule,
    AutoCompleteModule,
    ProgressSpinnerModule,
    InputTextModule,
    InputNumberModule,
    DropdownModule,
    FormsModule,
    SelectModule
  ],
  templateUrl: './sales-pages.component.html',
  styleUrl: './sales-pages.component.scss'
})
export class SalesPagesComponent implements OnInit {

   // PROPIEDADES Y VARIABLES
   listaProducto: ProductoEmpaque[] = []; // Lista de productos activos y con stock mayor a 0
   listaProductosFiltro: ProductoEmpaque[] = []; // Lista de productos filtrados por búsqueda
   listaProductosParaVenta: DetalleVenta[] = []; // Productos seleccionados para venta
   bloquearBotonRegistro: boolean = false;
   productoSeleccionado!: ProductoEmpaque; // Producto seleccionado para agregar a la venta
   tipoPagoDefecto: string = 'Efectivo';
   totalApagar: number = 0;

   formularioProductosVenta: FormGroup;
   columnasTabla: string[] = ["producto", "cantidad", "precioVenta", "total", "accion"];
   datosDetalleVenta = new MatTableDataSource(this.listaProductosParaVenta);

   // Agrega esta propiedad para los métodos de pago
   metodosPago = [
     { label: 'Efectivo', value: 'Efectivo' },
     { label: 'Tarjeta', value: 'Tarjeta' },
     { label: 'Transferencia', value: 'Transferencia' }
   ];

   constructor(
     private fb: FormBuilder,
     private productosVentaService: ProductoEmpaqueService,
     private authusuarioService: AuthUsuarioService,
     private ventaService: VentaService,
     private utilidadService: UtilidadService
   ) {
     this.formularioProductosVenta = this.fb.nonNullable.group({
       producto: [null, [Validators.required]],
       cantidad: ["", [Validators.required, Validators.min(1)]],
       presentacion: [{ value: '', disabled: true }],
       metodosPago: [this.tipoPagoDefecto] // Nombre consistente y valor por defecto
     });

     // Cargar lista de productos activos y con stock mayor a 0
     this.productosVentaService.lista()
       .subscribe({
         next: (data) => {
           if (data.status) {
             const lista = data.value as ProductoEmpaque[];
             this.listaProducto = lista.filter(p => p.cantidad > 0);
             // console.log('Productos cargados:', this.listaProducto); // Debug
           }
         },
         error: (e) => {
           console.error('Error al cargar productos:', e);
           this.utilidadService.mostrarAlerta('Error al cargar productos', 'error');
         }
       });

     // Filtrar productos por nombre en el formulario
     this.formularioProductosVenta.get('producto')?.valueChanges
       .subscribe(value => {
         this.listaProductosFiltro = this.retornaProductosPorFiltro(value);
       });
   }

   ngOnInit(): void { }

   // BUSCAR PRODUCTO POR FILTRO
   retornaProductosPorFiltro(search: string | ProductoEmpaque): ProductoEmpaque[] {
     const valorBuscado = typeof search === 'string' ? search.toLocaleLowerCase() : search.descripcionProducto.toLocaleLowerCase();
     return this.listaProducto.filter(item => item.descripcionProducto.toLocaleLowerCase().includes(valorBuscado));
   }



   // MOSTRAR NOMBRE DEL PRODUCTO EN AUTOCOMPLETE
   mostrarProducto = (producto: ProductoEmpaque): string => {
     return producto ? producto.descripcionProducto : '';
   };

   // ASIGNAR PRODUCTO SELECCIONADO
   productoParaVenta(event: MatAutocompleteSelectedEvent) {
     const producto = event.option.value as ProductoEmpaque;
     this.productoSeleccionado = { ...producto };
     this.formularioProductosVenta.get('presentacion')?.setValue(producto.descripcionPresentacion);
   }


   // AGREGAR PRODUCTO A LA LISTA DE VENTA
   agregarProductoParaVenta() {
     const _cantidad: number = this.formularioProductosVenta.value.cantidad;
     const _precio: number = parseFloat(this.productoSeleccionado.precioVenta);
     const _total: number = _cantidad * _precio;

     if (_cantidad <= 0 || isNaN(_cantidad)) {
       this.utilidadService.mostrarAlerta('La cantidad debe ser mayor a 0', 'error');
       return;
     }


     // if (this.productoSeleccionado.cantidad < _cantidad) {
     //   this.utilidadService.mostrarAlerta('No hay suficiente stock para este producto', 'warning');
     //   return;
     // }

     this.totalApagar += _total;

     this.listaProductosParaVenta.push({
       idProductoEmpaque: this.productoSeleccionado.idProductoEmpaque,
       descripcionProductoEmpaque: this.productoSeleccionado.descripcionProducto,
       cantidad: _cantidad,
       precioTexto: String(_precio),
       totalTexto: String(_total)
     });

     this.datosDetalleVenta = new MatTableDataSource(this.listaProductosParaVenta);

     this.formularioProductosVenta.patchValue({
       producto: "",
       cantidad: ""
     });
   }


   // ELIMINAR PRODUCTO DE LA LISTA DE VENTA
   eliminarProducto(detalle: DetalleVenta) {
     this.totalApagar -= parseFloat(detalle.totalTexto);
     this.listaProductosParaVenta = this.listaProductosParaVenta.filter(p => p.idProductoEmpaque !== detalle.idProductoEmpaque);
     this.datosDetalleVenta = new MatTableDataSource(this.listaProductosParaVenta);
   }

   registrarVenta() {
     if (this.listaProductosParaVenta.length === 0) {
       this.utilidadService.mostrarAlerta('No hay productos en la venta', 'info');
       return;
     }

     this.bloquearBotonRegistro = true;

     const usuarioSesion = this.authusuarioService.currentUser();
     const idUsuario = usuarioSesion ? usuarioSesion.idUsuario : '';
     const usuarioDescripcion = usuarioSesion ? usuarioSesion.rolDescripcion : '';

     const request: Venta = {
       tipoPago: this.tipoPagoDefecto,
       totalTexto: String(this.totalApagar.toFixed()),
       IdUsuario: idUsuario,
       usuarioDescripcion: usuarioDescripcion,
       detalleventa: this.listaProductosParaVenta
     };

     this.ventaService.registrar(request).subscribe({
       next: (response) => {
         if (response?.status) {
           this.totalApagar = 0.00;
           this.listaProductosParaVenta = [];
           this.datosDetalleVenta = new MatTableDataSource(this.listaProductosParaVenta);

           Swal.fire({
             icon: 'success',
             title: "Venta Registrada",
             text: `Número de venta: ${response.value.numVenta}`
           });
         } else {
           const mensaje = response?.msg || 'No se pudo registrar la venta';
           this.utilidadService.mostrarAlerta(mensaje, 'warning');
         }
       },
       error: (e) => {
         let mensaje = 'Error al registrar la venta';

         if (e.error) {
           if (e.error.msg) {
             mensaje = e.error.msg;
           } else if (typeof e.error === 'string') {
             mensaje = e.error;
           }
         }

         this.utilidadService.mostrarAlerta(mensaje, 'error');
       },
       complete: () => {
         this.bloquearBotonRegistro = false;
       }
     });
   }



}
