import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }
  Register(user:any): Observable<any> {
    return this.http.post<any>("http://localhost:8000/register", user);
  }
  Login(user: any): Observable<any> {
    return this.http.post<any>("http://localhost:8000/login", user);
  }
  logout(): Observable<any> {
    return this.http.get<any>("http://localhost:3000/logout");
  }
}
