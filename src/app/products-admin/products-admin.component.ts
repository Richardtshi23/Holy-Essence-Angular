import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductAdminService } from '../Services/product-admin.service';
import { environment } from '../../environments/environment';
interface Product {
  id?: number;
  name: string;
  title: string;
  price: number;
  oldPrice?: number;
  image?: string; // url
  category?: string;
  description?: string;
  inStock: boolean;
  onSale: boolean;
  qty: number;
}

@Component({
  standalone: false,
  selector: 'app-products-admin',
  templateUrl: './products-admin.component.html',
  styleUrls: ['./products-admin.component.css']
})
export class ProductsAdminComponent implements OnInit {
  products: Product[] = [];
  orders: any[] = [];
  loading = false;
  productForm: FormGroup;
  editing: boolean = false;
  editId?: number;
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile?: File;
    public imageBaseUrl = environment.apiImageUrl; 

  // UI state
  showForm = false;
  constructor(private ProductAdminService: ProductAdminService, private fb: FormBuilder) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      title: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      oldPrice: [0],
      category: [''],
      description: [''],
      inStock: [true],
      onSale: [false],
      qty: [0, [Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadOrders();
  }

  async loadProducts() {
    this.loading = true;
    try {
      this.products = await this.ProductAdminService.getAll();
    } finally {
      this.loading = false;
    }
  }

  async loadOrders() {
    try {
      this.orders = await this.ProductAdminService.getOrders();
    } catch (err) {
      console.error(err);
    }
  }

  startAdd() {
    this.showForm = true;
    this.editing = false;
    this.editId = undefined;
    this.productForm.reset({ inStock: true, onSale: false, price: 0, oldPrice: 0, qty: 0 });
    this.imagePreview = null;
    this.selectedFile = undefined;
  }

  startEdit(p: Product) {
    this.showForm = true;
    this.editing = true;
    this.editId = p.id;
    this.productForm.patchValue({
      name: p.name,
      title: p.title,
      price: p.price,
      oldPrice: p.oldPrice ?? 0,
      category: p.category,
      description: p.description,
      inStock: p.inStock,
      onSale: p.onSale,
      qty: p.qty
    });
    this.imagePreview = p.image || null;
  }

  cancelForm() {
    this.showForm = false;
  }

  onFileChange(ev: Event) {
    const input = ev.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const f = input.files[0];
    this.selectedFile = f;


    const reader = new FileReader();
    reader.onload = () => this.imagePreview = reader.result;
    reader.readAsDataURL(f);
  }

  async save() {
    if (this.productForm.invalid) return;
    const model = this.productForm.value as Product;
    try {
      let saved: Product;
      if (this.selectedFile) {
        // use FormData
        const fd = new FormData();
        fd.append('image', this.selectedFile);
        fd.append('name', model.name);
        fd.append('title', model.title);
        fd.append('price', String(model.price));
        fd.append('oldPrice', String(model.oldPrice ?? 0));
        fd.append('category', model.category || '');
        fd.append('description', model.description || '');
        fd.append('inStock', String(model.inStock));
        fd.append('onSale', String(model.onSale));
        fd.append('qty', String(model.qty));


        if (this.editing && this.editId) {
          saved = await this.ProductAdminService.updateWithImage(this.editId, fd);
        } else {
          saved = await this.ProductAdminService.createWithImage(fd);
        }
      } 
   
      // refresh
      await this.loadProducts();
      this.showForm = false;
    } catch (err) {
      console.error("The error", err);
      alert('Error saving product');
    }
  }

  async deleteProduct(id?: number) {
    if (!id) return;
    if (!confirm('Delete product?')) return;
    await this.ProductAdminService.delete(id);
    await this.loadProducts();
  }
}
