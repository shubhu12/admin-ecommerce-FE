import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
@Injectable()
export class HttpServices {
  get apiUrl(): string {
    return environment.apiUrl;
  }

  constructor(private http: HttpClient) { }
  get(endpoint: string, options?: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/${endpoint}`, options);
  }

  post(endpoint: string, data: any, options?: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${endpoint}`, data, options);
  }

  put(endpoint: string, data: any, options?: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${endpoint}`, data, options);
  }

  delete(endpoint: string, options?: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${endpoint}`, options);
  }
}