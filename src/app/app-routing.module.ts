import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ProductListComponent}  from './admin/product-list/product-list.component'


const routes: Routes = [
  // {
  //   path: 'register',
  //   loadChildren: () =>
  //     import('./admin/product-list/product-list.component').then((m) => m.ProductListComponent)
  // },

  { path: 'product', component: ProductListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule { }
