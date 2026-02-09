import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Product {
  id?: number;
  name: string;
  title: string;
  price: number;
  oldPrice?: number;
  image?: string;
  category?: string;
  description?: string;
  inStock: boolean;
  onSale: boolean;
  qty: number;
}

export interface Order {
  id: number;
  customerName: string;
  email: string;
  total: number;
  items: { productId: number; name: string; qty: number; price: number }[];
  orderDate: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ProductAdminService {
    private apiUrl = `${environment.apiUrl}`;; // ⚙️ update for your backend

  constructor(private http: HttpClient) { }

  // 🔹 PRODUCTS

  /** Get all products */
  async getAll(): Promise<Product[]> {
    return await firstValueFrom(this.http.get<Product[]>(`${this.apiUrl}/productsAdmin/get-All-Products`));
  }

  /** Get a product by id */
  async getById(id: number): Promise<Product> {
    return await firstValueFrom(this.http.get<Product>(`${this.apiUrl}/productsAdmin/getProductById/${id}`));
  }

  /** Create a new product with image */
  async createWithImage(formData: FormData): Promise<Product> {
    return await firstValueFrom(this.http.post<Product>(`${this.apiUrl}/productsAdmin/addProduct-With-Image`, formData));
  }

  /** Update an existing product with image */
  async updateWithImage(id: number, formData: FormData): Promise<Product> {
    return await firstValueFrom(this.http.put<Product>(`${this.apiUrl}/productsAdmin/${id}/updateProduct-with-image`, formData));
  }

  /** Delete a product */
  async delete(id: number): Promise<void> {
    await firstValueFrom(this.http.delete<void>(`${this.apiUrl}/productsAdmin/delete-product${id}`));
  }

  // 🔹 ORDERS

  /** Get all orders */
  async getOrders(): Promise<Order[]> {
    return await firstValueFrom(this.http.get<Order[]>(`${this.apiUrl}/productsAdmin/orders`));
  }

  /** Get a specific order */
  async getOrderById(id: number): Promise<Order> {
    return await firstValueFrom(this.http.get<Order>(`${this.apiUrl}/productsAdmin/orders/${id}`));
  }
}
