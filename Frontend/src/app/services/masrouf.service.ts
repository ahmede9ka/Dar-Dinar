import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MasroufService {
  private baseUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  // Get all Masroufs
  getAllMasroufs(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/masrouf`, { withCredentials: true });
  }

  // Get Masrouf by ID
  getMasroufById(id: any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/masrouf/${id}`, { withCredentials: true });
  }

  // Create a new Masrouf
  createMasrouf(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/masrouf`, data, { withCredentials: true });
  }

  // Update a Masrouf
  updateMasrouf(id: any, data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/masrouf/${id}`, data, { withCredentials: true });
  }

  // Delete a Masrouf
  deleteMasrouf(id: any): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/masrouf/${id}`, { withCredentials: true });
  }

  // Get monthly Masrouf of all types
  getMonthMasroufOfAllTypes(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/getmonthmasroufbytype`, { withCredentials: true });
  }

  // Get all Masrouf months
  getAllMasroufMonth(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/getallmasroufmonth`, { withCredentials: true });
  }

  // Get all Masrouf years
  getAllMasroufYear(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/getallmasroufyear`, { withCredentials: true });
  }

  // Get all Masroufs
  getAllMasrouf(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/getallmasrouf`, { withCredentials: true });
  }

  // Get Masrouf of all months
  getMasroufOfAllMonth(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/getmasroufmonth`, { withCredentials: true });
  }
}
