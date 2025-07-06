import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductApi } from 'src/app/backend/api/product.api';

@Component({
  selector: 'app-product-add-update',
  templateUrl: './product-add-update.component.html',
  styleUrls: ['./product-add-update.component.scss']
})
export class ProductAddUpdateComponent implements OnInit {

  productForm: FormGroup;
  imagePreviews: string[] = [];
  isEditMode: boolean = false;
  selectedFiles: File[] = [];  // to store files before upload

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProductAddUpdateComponent>,
    private productsApi: ProductApi,
    @Inject(MAT_DIALOG_DATA) public data: { product?: any }
  ) {
    this.isEditMode = !!data.product;

    this.productForm = this.fb.group({
      sku: [data.product?.sku || '', Validators.required],
      name: [data.product?.name || '', Validators.required],
      price: [data.product?.price || 0, [Validators.required, Validators.min(0)]],
      images: [''] // We'll handle images separately, so no need to bind here
    });
  }

  ngOnInit(): void {
    if (this.isEditMode && this.data.product.images && Array.isArray(this.data.product.images)) {
      this.imagePreviews = [...this.data.product.images];
    }
  }

  get dialogTitle() {
    return this.isEditMode ? 'Edit Product' : 'Add Product';
  }

  save() {
    if (this.productForm.invalid) return;

    const formValues = this.productForm.value;

    // Prepare FormData to send files + fields together
    const formData = new FormData();
    formData.append('sku', formValues.sku);
    formData.append('name', formValues.name);
    formData.append('price', formValues.price.toString());

    // Append selected files to FormData
    this.selectedFiles.forEach(file => {
      formData.append('images', file);
    });

    if (this.isEditMode && this.data.product.id) {
      console.log(this.data.product.id);
      console.log(formData);
      
      
      // If editing, call update API with id and FormData
      this.productsApi.updateProduct(this.data.product.id, formData).subscribe({
        next: (res) => {
          console.log('Product updated:', res);
          this.dialogRef.close(res);
        },
        error: (err) => {
          console.error('Update failed:', err);
        }
      });
    } else {
      // If creating, call create API
      this.productsApi.createProduct(formData).subscribe({
        next: (res) => {
          console.log('Product created:', res);
          this.dialogRef.close(res);
        },
        error: (err) => {
          console.error('Creation failed:', err);
        }
      });
    }
  }

  cancel() {
    this.dialogRef.close(null);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    this.selectedFiles = Array.from(input.files);
    this.imagePreviews = [];

    // Preview selected images
    this.selectedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviews.push(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  }
}
