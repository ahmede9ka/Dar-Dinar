import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  // Register a new user
  register(user: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
    return this.http.post<any>(`${this.baseUrl}/register`, user, { headers });
  }
  // Log in the user
  Login(user: any): Observable<any> {
    
    const headers = new HttpHeaders({
      'Content-Type': '',
    });
    return this.http.post<any>(
      `${this.baseUrl}/login`,
      user,
      { withCredentials: true }
    );
  }

  // Log out the user
  logout(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/logout`);
  }

  // Get the current authenticated user
  current(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/current`, { withCredentials: true });
  }
}
