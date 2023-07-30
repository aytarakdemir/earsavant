import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export class BaseService {
  constructor(protected http: HttpClient) { }

  protected get<T>(url: string, options?: any): Observable<T> {
    const option: {headers: HttpHeaders} = {...options, headers: this.getHeaders()} 
    return this.http.get<T>(url, option);
  }

  protected post<T>(url: string, body: any , options?: any): Observable<T> {
    const option: {headers: HttpHeaders} = {...options, headers: this.getHeaders()} 
    return this.http.post<T>(url, body, option);
  }


  private getHeaders(): HttpHeaders {
    const jwtToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY5MDcxNjY3MiwiZXhwIjoxNjkwNzIwMjcyfQ.KNao1i_Mlit9d4jobzzb0hLbkoA0gEU38LQv0n05qfE";

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      ...(jwtToken && {Authorization: `Bearer ${jwtToken}`}) // Don't send token if not authorized.
    })

    return headers;
  }

}
