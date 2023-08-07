import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export class BaseService {
  protected jwtToken: string = '';
  constructor(protected http: HttpClient) { }

  protected get<T>(url: string, options?: any): Observable<T> {
    const option: {headers: HttpHeaders} = {...options, headers: this.getHeaders()} 
    return this.http.get<T>(url, option);
  }

  protected post<T>(url: string, body: any , options?: any): Observable<T> {
    const option: {headers: HttpHeaders} = {...options, headers: this.getHeaders(), withCredentials: true,} 
    return this.http.post<T>(url, body, option);
  }


  private getHeaders(): HttpHeaders {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.jwtToken}`
    })

    return headers;
  }

}
