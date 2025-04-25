import { Component } from '@angular/core';

import { FooterComponent } from '../../components/footer/footer.component';
import { InicioComponent } from '../../components/inicio/inicio.component';

@Component({
  selector: 'app-incio-pages',
  imports: [
    InicioComponent,
    FooterComponent
  ],
  templateUrl: './incio-pages.component.html',
  styleUrl: './incio-pages.component.scss'
})
export class IncioPagesComponent {

}
