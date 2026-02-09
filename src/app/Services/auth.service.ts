import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'; 
import { BehaviorSubject, Observable, tap } from 'rxjs';
interface AuthResponse {
  accessToken: string;
  expiresAt: string;
  email: string;
}
export interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = `${environment.apiUrl}/auth`;
  // access token stored in memory
  private accessToken: string | null = null;
  private auth$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
  }

  isAuthenticated$() { return this.auth$.asObservable(); }

  getAccessToken() {
    return this.accessToken;
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponse>(`${this.api}/login`, { email, password }, { withCredentials: true })
      .pipe(
        tap(r => {
          localStorage.setItem("accessToken", r.accessToken);
          this.accessToken = r.accessToken;
          this.auth$.next(true);
        }) 
    );
  }

  register(formvalue:any) {
    return this.http.post(`${this.api}/register`, formvalue);
  }

  getUser() {
    return this.http.get<User>(`${this.api}/me`, { withCredentials: true });
  }

  logout() {
    // call backend to revoke refresh token and clear cookie
    return this.http.post(`${this.api}/logout`, {}, { withCredentials: false }).pipe(
      tap(() => {
        this.accessToken = null;
        this.auth$.next(false);
      })
    );
  }

  refreshAccessToken() {
    // Uses cookie auto-sent; backend returns new access token
    return this.http.post<AuthResponse>(`${this.api}/refresh`, {}, { withCredentials: true }).pipe(
      tap(r => {
        this.accessToken = r.accessToken;
        this.auth$.next(true);
      })
    );
  }
}
