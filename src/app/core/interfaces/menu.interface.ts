export interface Menu {
    idMenu: number;
    nombre: string;
    icono: string;
    url: string;
    submenus: Menu[];
    expanded?: boolean; // Nueva propiedad para controlar la expansión del menú
  }
