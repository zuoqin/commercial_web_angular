import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
const httpOptions = {
  headers: new HttpHeaders({ 
    "Access-Control-Allow-Credentials":"true",
    "Access-Control-Allow-Methods": "POST,GET,OPTION",
    "Access-Control-Allow-Origin":"*"
  })
};
const needHttpOptions = {
	headers: new HttpHeaders({
		'Content-Type':  'application/x-www-form-urlencoded'
	})
};
@Injectable()
export class ApiService {
  constructor(
    private http: HttpClient
  ) {}

  private formatErrors(error: any) {
    return  throwError(error.error);
  }

  get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.http.get(`${environment.api_url}${path}`, { params })
      .pipe(catchError(this.formatErrors));
  }

  put(path: string, body: Object = {}): Observable<any> {
    return this.http.put(
      `${environment.api_url}${path}`,
      JSON.stringify(body)
    ).pipe(catchError(this.formatErrors));
  }

  post(path: string, body: Object = {},needptions?): Observable<any> {
    if(needptions){
      return this.http.post(
        `${environment.api_url}${path}`,
        body,
          needHttpOptions
      ).pipe(catchError(this.formatErrors));
    }else{

      return this.http.post(
        `${environment.api_url}${path}`,
        JSON.stringify(body)
      ).pipe(catchError(this.formatErrors));
    }

  }



  delete(path): Observable<any> {
    return this.http.delete(
      `${environment.api_url}${path}`
    ).pipe(catchError(this.formatErrors));
  }
}