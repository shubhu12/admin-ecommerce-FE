import { Component, OnInit } from '@angular/core';
import { ProductApi } from '../../backend/api/product.api';
import { MatDialog } from '@angular/material/dialog';
import { ProductAddUpdateComponent } from '../product-add-update/product-add-update.component';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';

interface Product {
  id: number;
  sku: string;
  name: string;
  price: string;  // or number if you convert it
  images: string[];
}

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  data: Product[] = [];

  // products: Product[] = [
  //     {
  //       id: 1,
  //       sku: 'SKU001',
  //       name: 'Product One',
  //       price: 29.99, 
  //     images: ['https://www.google.com/imgres?q=image%20url&imgurl=https%3A%2F%2Fwww.wikihow.com%2Fimages%2Fthumb%2F4%2F41%2FGet-the-URL-for-Pictures-Draft-Step-1.jpg%2Fv4-460px-Get-the-URL-for-Pictures-Draft-Step-1.jpg&imgrefurl=https%3A%2F%2Fwww.wikihow.com%2FGet-the-URL-for-Pictures&docid=VCxJJCKhpGWazM&tbnid=sjkm4AzSKBGxGM&vet=12ahUKEwiZxO_zuaOOAxU3Y_UHHX0pDeYQM3oECB4QAA..i&w=460&h=345&hcb=2&ved=2ahUKEwiZxO_zuaOOAxU3Y_UHHX0pDeYQM3oECB4QAA'],
  //     },
  //     {
  //       id: 2,
  //       sku: 'SKU002',
  //       name: 'Product Two',
  //       price: 49.99,
  //       images: ['https://via.placeholder.com/60'],
  //     },
  //   ];
  constructor(private dialog: MatDialog, private productsApi: ProductApi) { }

  ngOnInit(): void {
    this.refresh();

  }

 openViewDialog(value: string, product: any) {
  const dialogRef = this.dialog.open(ProductAddUpdateComponent, {
    width: '500px',
    data: {
      value: value,
      product: product
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      // The dialog was closed with data (saved or updated)
      this.refresh();
    }
    // else dialog was cancelled or closed without saving, no refresh needed
  });
}


  delete(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Delete Product',
        message: 'Are you sure you want to delete this product?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.productsApi.removeProduct(id).subscribe({
          next: (response) => {
            console.log('API response:', response);
            this.data = Array.isArray(response) ? response : response.data;
            this.refresh();
          },
          error: (error) => {
            console.error('❌ Error fetching products:', error);
          }
        });
      }
    });
  }


  refresh(){
    this.productsApi.getProductsData().subscribe({
      next: (response) => {
        const rawData = Array.isArray(response) ? response : response.data;
        const baseUrl = 'http://localhost:3000'; // from environment if needed

        this.data = rawData.map(product => ({
          ...product,
          images: product.images.map((imgPath: string) =>
            `${baseUrl}/uploads/${imgPath.replace(/\\/g, '/')}`
          )
        }));
      },
      error: (error) => {
        console.error('❌ Error fetching products:', error);
      }
    });
  }
    
  
}
