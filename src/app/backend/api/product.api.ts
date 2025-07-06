import { Injectable } from '@angular/core';
import { HttpServices } from './http.services';

// export interface Product {
//   id?: number;
//   sku: string;
//   name: string;
//   price: number;
//   images: string[];
// }

@Injectable({
  providedIn: 'root', // <== this ensures Angular can inject it
})
export class ProductApi {
  constructor(private api: HttpServices) {}

  private readonly accessController: string = 'productRoutes';

  getProductsData = () => {    
    return this.api.get(`${this.accessController}/getAllProducts`);
  };


  removeProduct = (id: number) => {
    console.log("id ---->>",id);
    
  return this.api.delete(`${this.accessController}/deleteProduct/${id}`);
};

  createProduct = (product: any) => {
  return this.api.post(`${this.accessController}/createProduct`, product);
};

updateProduct = (id: number, product: any) => {
  return this.api.put(`${this.accessController}/updateProduct/${id}`, product);
};
}
