import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RevenueService {

  constructor(private http: HttpClient) { }
  getAllRevenues(): Observable<any> {
        return this.http.get<any>("http://localhost:8000/api/revenues");
    }
    getRevenueById(id:any): Observable<any> {
      return this.http.get<any>(`http://localhost:8000/api/revenues/${id}`);
    }
    createRevenue(data:any): Observable<any> {
      return this.http.post<any>(`http://localhost:8000/api/revenues`,data);
    }
    updateRevenue(id:any,data:any): Observable<any> {
      return this.http.put<any>(`http://localhost:8000/api/revenues/${id}`,data);
    }
    deleteRevenue(id:any): Observable<any> {
      return this.http.delete<any>(`http://localhost:8000/api/revenues/${id}`);
    }
  getMonthlyRevenue(): Observable<any> {
    return this.http.get<any>(`http://localhost:8000/api/getmonthlyrevenue`);
  }
  getYearlyRevenue(): Observable<any> {
    return this.http.get<any>(`http://localhost:8000/api/getyearlyyrevenue`);
  }
  getAllRevenue(): Observable<any> {
    return this.http.get<any>(`http://localhost:8000/api/getallrevenue`);
  }
  getRevenueOfAllMonths(): Observable<any> {
    return this.http.get<any>(`http://localhost:8000/api/getrevenuemonth`);
  }
  
}
