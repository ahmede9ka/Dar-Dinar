import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RevenueService {
  private baseUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getAllRevenues(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/revenues`, { withCredentials: true });
  }

  getRevenueById(id: any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/revenues/${id}`, { withCredentials: true });
  }

  createRevenue(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/revenues`, data, { withCredentials: true });
  }

  updateRevenue(id: any, data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/revenues/${id}`, data, { withCredentials: true });
  }

  deleteRevenue(id: any): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/revenues/${id}`, { withCredentials: true });
  }

  getMonthlyRevenue(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/getmonthlyrevenue`, { withCredentials: true });
  }

  getYearlyRevenue(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/getyearlyyrevenue`, { withCredentials: true });
  }

  getAllRevenue(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/getallrevenue`, { withCredentials: true });
  }

  getRevenueOfAllMonths(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/getrevenuemonth`, { withCredentials: true });
  }
}
