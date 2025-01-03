import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdviceService {
  private baseUrl = 'http://localhost:8000/api';
  constructor(private http: HttpClient) { }

  getadvice(): Observable<any> {
      return this.http.get<any>(`${this.baseUrl}/random`, { withCredentials: true });
  }
}
