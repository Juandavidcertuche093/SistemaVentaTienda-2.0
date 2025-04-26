import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';

import {MatBadgeModule} from '@angular/material/badge';
import {MatMenuModule, MatMenuTrigger} from '@angular/material/menu';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatListModule } from '@angular/material/list';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';

//interfaces
import { Menu } from '../../core/interfaces/menu.interface';

//Servicios
import { TokenService } from '../../modules/authentication/services/token.service';
import { AuthUsuarioService } from '../../modules/authentication/services/auth-usuario.service';
import { UtilidadService } from '../../core/services/utilidad.service';
import { MenuService } from '../services/menu.service';
import { NotificacionesService } from '../services/notificaciones.service';


//PrimeNG
import { SidebarModule } from 'primeng/sidebar';
import { BadgeModule } from 'primeng/badge';
import { MenuModule } from 'primeng/menu';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { PanelMenuModule } from 'primeng/panelmenu';
import { AvatarModule } from 'primeng/avatar';
import { TieredMenuModule } from 'primeng/tieredmenu';


@Component({
  selector: 'app-sidebar',
  imports: [
    RouterModule,
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    OverlayModule,
    MatListModule,
    MatBadgeModule,
    MatMenuModule,
    //primeNG
    SidebarModule,
    BadgeModule,
    MenuModule,
    ToolbarModule,
    ButtonModule,
    PanelMenuModule,
    AvatarModule,
    TieredMenuModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  @ViewChild(MatMenuTrigger) notificationMenuTrigger!: MatMenuTrigger;

  listaMenus:Menu[] = [];
  rolUsuario:string='';
  sidebarCollapsed = false; // Controla el estado del sidebar
  productosStockBajo: any[] = [];
  items: any[] = []; // Para el menú de usuario


  private tokenService = inject(TokenService)
  private menuServicio = inject(MenuService)
  private authusuarioService = inject(AuthUsuarioService)
  private notificacionesServicio = inject(NotificacionesService)
  private utilidadService = inject(UtilidadService)
  private router = inject(Router)


  public user = computed(() => this.authusuarioService.currentUser() )


  ngOnInit(): void {
    this.obtenerNotificacionesStock();

    const usuario = this.authusuarioService.currentUser();

    if (usuario) {
      this.menuServicio.lista(usuario.idUsuario).subscribe({
        next: (data) => {
          if (data && data.status) {
            const allMenus = data.value.map(menu => ({ ...menu, expanded: false }));

            // Filtrar solo menús principales (que no sean submenús)
            const subMenuIds = new Set(allMenus.flatMap(menu => menu.submenus.map(sub => sub.idMenu)));
            this.listaMenus = allMenus.filter(menu => !subMenuIds.has(menu.idMenu));
          }
        },
        error: (e) => console.error("Error cargando menús:", e)
      });
    }
  }

  // Método para alternar submenús
  toggleSubMenu(menu: Menu): void {
    if (menu.submenus.length > 0) {
      menu.expanded = !menu.expanded;
    }
  }

  // Método para cambiar el estado del sidebar (si quieres un botón para colapsarlo)
  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  obtenerNotificacionesStock() {
    this.notificacionesServicio.obtenerProductosConStockBajo().subscribe({
      next: (data) => {
        this.productosStockBajo = data;
      },
      error: (err) => {
        console.error('Error obteniendo productos con stock bajo', err);
        this.utilidadService.mostrarAlerta('Error obteniendo productos con stock bajo', 'error');
      }
    });
  }

  logout() {
    this.tokenService.removeToken();  // Elimina el token
    this.router.navigate(['/inicio']); // Redirige al usuario a la página de login
  }


}
