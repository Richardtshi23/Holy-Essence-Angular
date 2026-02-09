import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  constructor(private client: HttpClient) { }
  private apiUrl = `${environment.apiUrl}`;

  getAllProducts(param: string): Observable<any> {
    return this.client.get(`${this.apiUrl}/Products/GetAllProducts?param=` + param + '');
  }

  getProductById(id: string) : Observable<any> {
    return this.client.get(`${this.apiUrl}/Products/GetProducts?id=` + id + '');
  }

  getProductByCategory(category: string): Observable<any> {
    return this.client.get(`${this.apiUrl}/Products/GetProductsByCategory?category=` + category + '');
  }

  searchProducts(searchTerm: string): Observable<any[]> {
    return this.client.get<any[]>(`${this.apiUrl}/Products/search?term=${searchTerm}`);
  }
}
