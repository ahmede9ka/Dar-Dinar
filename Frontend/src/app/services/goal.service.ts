import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoalService {

  private baseUrl = "http://localhost:8000/api";

  constructor(private http: HttpClient) { }

  getAllgoals(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/goals`, { withCredentials: true });
  }

  getGoalById(id: any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/goals/${id}`, { withCredentials: true });
  }

  createGoal(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/goals`, data, { withCredentials: true });
  }

  updateGoal(id: any, data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/goals/${id}`, data, { withCredentials: true });
  }

  deleteGoal(id: any): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/goals/${id}`, { withCredentials: true });
  }

  zidFlousLelgoal(id: any, data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/zidflouslelgoal/${id}`, data, { withCredentials: true });
  }
}
