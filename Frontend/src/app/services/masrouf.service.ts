import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MasroufService {

  constructor(private http: HttpClient) { }
    getAllRevenues(): Observable<any> {
          return this.http.get<any>("http://localhost:8000/api/masrouf");
      }
      getRevenueById(id:any): Observable<any> {
        return this.http.get<any>(`http://localhost:8000/api/masrouf/${id}`);
      }
      createGoal(data:any): Observable<any> {
        return this.http.post<any>(`http://localhost:8000/api/masrouf`,data);
      }
      updateGoal(id:any,data:any): Observable<any> {
        return this.http.put<any>(`http://localhost:8000/api/masrouf/${id}`,data);
      }
      deleteGoal(id:any): Observable<any> {
        return this.http.delete<any>(`http://localhost:8000/api/masrouf/${id}`);
      }
    getMonthMasroufOfAllTypes(): Observable<any> {
      return this.http.get<any>(`http://localhost:8000/api/getmonthmasroufbytype`);
    }

    getAllMasroufMonth(): Observable<any> {
      return this.http.get<any>(`http://localhost:8000/api/getallmasroufmonth`);
    }
    getAllMasroufYear(): Observable<any> {
      return this.http.get<any>(`http://localhost:8000/api/getallmasroufyear`);
    }
    getAllMasrouf(): Observable<any> {
      return this.http.get<any>(`http://localhost:8000/api/getallmasrouf`);
    }
    getMasroufOfAllMonth(): Observable<any> {
      return this.http.get<any>(`http://localhost:8000/api/getmasroufmonth`);
    }
}
