import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoalService {

  constructor(private http: HttpClient) { }
  getAllgoals(): Observable<any> {
      return this.http.get<any>("http://localhost:8000/api/goals");
  }
  getGoalById(id:any): Observable<any> {
    return this.http.get<any>(`http://localhost:8000/api/goals/${id}`);
  }
  createGoal(data:any): Observable<any> {
    return this.http.post<any>(`http://localhost:8000/api/goals`,data);
  }
  updateGoal(id:any,data:any): Observable<any> {
    return this.http.put<any>(`http://localhost:8000/api/goals/${id}`,data);
  }
  deleteGoal(id:any): Observable<any> {
    return this.http.delete<any>(`http://localhost:8000/api/goals/${id}`);
  }
  zidFlousLelgoal(id:any,data:any): Observable<any> {
    return this.http.get<any>(`http://localhost:8000/api/zidflouslelgoal/${id}`,data);
  }

}
