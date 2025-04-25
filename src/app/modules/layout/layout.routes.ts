import { Routes } from "@angular/router";
import { LayoutComponent } from "./components/layout/layout.component";

export const layoutRoute: Routes = [
  {
    path:'',
    component:LayoutComponent,
    children: [
      {
        path:'dashboard',
        loadChildren: () => import('./../dashboard/dashboard.routes').then((m) => m.DashboardRoutes),
      },
      {
        path:'usuarios',
        loadChildren: () => import('./../users/users.routes').then((m) => m.usersRoutes),
      },
      {
        path:'producto',
        children: [
          {
            path:'',
            redirectTo: 'lista',
            pathMatch: 'full'
          },
          {
            path: 'lista',
            loadChildren: () => import('./../listProduct/listProduct.routes').then((m) => m.listProductRoutes)
          },
          {
            path: 'categoria',
            loadChildren: () => import('./../category/categori.routes').then((m) => m.categoryRoutes)
          },
          {
            path: 'proveedor',
            loadChildren: () => import('./../supplier/supplier.routes').then((m) => m.supplierRoutes)
          },
          {
            path: 'imagen',
            loadChildren: () => import('./../images/images.routes').then((m) => m.imagesRoutes)
          },
          {
            path: 'productoEnpaque',
            loadChildren: () => import('./../productPackaging/productPackaging.routes').then((m) => m.productosPackaningRoutes)
          }
        ]
      },
      {
        path:'venta',
        loadChildren: () => import('./../sales/sales.routes').then((m) => m.salesRoutes),
      },
      {
        path:'historialVenta',
        loadChildren: () => import('./../salesHistory/salesHistory.routes').then((m) => m.salesHistoryRoutes),
      },
      {
        path:'reportes',
        loadChildren: () => import('./../report/report.routes').then((m) => m.reportRoutes),
      },
      {
        path:'Compra',
        loadChildren: () => import('./../buys/buys.routes').then((m) => m.BuysRoutes),
      },
      {
        path:'historialCompra',
        loadChildren: () => import('./../historyPurchase/historialPurchase.routes').then((m) => m.HistoryPurchaseRoutes),
      }
    ]
  }
]
