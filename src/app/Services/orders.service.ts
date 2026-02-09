// in src/app/services/orders.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  // CORRECTED: Your controller route is `api/[controller]`, so the base URL is /api/Orders
  private apiUrl = `${environment.apiUrl}/Orders`;

  constructor(private http: HttpClient) { }

  // --- CUSTOMER-FACING METHOD ---

  // Fetches orders for a specific logged-in user
  getOrdersForUser(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getOrders?userId=${userId}`);
  }

  // --- ADMIN-FACING METHODS ---

  // CORRECTED: Renamed to reflect that it gets ALL orders
  getAllOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAllOrders`);
  }

  // CORRECTED: Simplified single-item update
  markOrderAsFulfilled(orderId: number, isFulfilled: boolean): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateOrder/${orderId}`, { isFulfilled });
  }

  // NEW: Service method for the "smart" bulk-action button
  bulkMarkAsFulfilled(orderIds: number[]): Observable<any> {
    return this.http.put(`${this.apiUrl}/bulkMarkAsFulfilled`, orderIds);
  }

  // CORRECTED: Uses the correct route parameter
  deleteOrder(orderId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteOrders/${orderId}`);
  }
}
