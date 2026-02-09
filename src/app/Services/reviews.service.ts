import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface ReviewPayload {
  productId: number;
  name: string;
  rating: number;
  comment: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {
  // Update baseUrl if your API root differs (e.g. environment.apiUrl)
  constructor(private http: HttpClient) { }
  private api = `${environment.apiUrl}/reviews`;

  getByProductId(productId: number): Observable<any[]> {
    // expected endpoint: GET /api/products/{id}/reviews
    return this.http.get<any[]>(`${this.api}/get-reviews?productId=${productId}`);
  }

  create(payload: ReviewPayload): Observable<any> {
    // expected endpoint: POST /api/reviews
    // server should return the created review object (with createdAt)
    return this.http.post<any>(`${this.api}/add-review`, payload);
  }
}
