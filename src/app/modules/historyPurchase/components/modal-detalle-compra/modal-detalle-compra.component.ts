import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

//angular/material
import { MAT_DIALOG_DATA} from '@angular/material/dialog';
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

//interfaces
import { Compra } from '../../../../core/interfaces/compra.interface';
import { DetalleCompra } from '../../../../core/interfaces/detallecompra.interface';

@Component({
  selector: 'app-modal-detalle-compra',
  imports: [
    FormsModule,
    CommonModule,
    MatDialogModule,
    MatGridListModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatTableModule,
    CdkTableModule,
    MatDividerModule,
    MatCardModule
  ],
  templateUrl: './modal-detalle-compra.component.html',
  styleUrl: './modal-detalle-compra.component.scss'
})
export class ModalDetalleCompraComponent {

  //VARIABLES
  fechaCompra:string = "";
  numCompra:string = "";
  tipoPago:String = '';
  total:String= '';
  detalleCompra:DetalleCompra[]=[];
  columnasTabla:String[] = ["producto","cantidad","precio","total"]

  constructor(
    @Inject(MAT_DIALOG_DATA) public _compra: Compra
  ){
    // console.log(_compra); // Verifica que _compra contiene los datos esperados
    this.fechaCompra = _compra.fechaCompra!;
    this.numCompra = _compra.numCompra!;
    this.tipoPago = _compra.tipoPago;
    this.total = _compra.totalTexto;
    this.detalleCompra = _compra.detalleCompras;
    // console.log(this.detalleCompra); // Verifica que detalleCompra no está vacío
  }

}
