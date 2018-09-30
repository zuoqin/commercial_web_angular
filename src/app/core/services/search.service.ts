import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { map } from 'rxjs/operators';
@Injectable()
export class SearchService {

    constructor (
        private apiService: ApiService
      ) {}

      public storage: any;
      
    estimate(url,body): Observable<any> {
        return this.apiService.post('/'+url,body,true)
          .pipe(map(data => data));
    }
    customAnalogs(url,body): Observable<any> {
        return this.apiService.post('/'+url,body,true)
          .pipe(map(data => data));
    }


    
    // comparative(body): Observable<any> {
    //     return this.apiService.post('/comparative',body)
    //       .pipe(map(data => data));
    // }
    // arenda(body): Observable<any> {
    //     return this.apiService.post('/arenda',body)
    //       .pipe(map(data => data));
    // }
    
    getHistory(): Observable<any> {
        return this.apiService.get('/gethistory')
          .pipe(map(data => data));
    }
    writeHistory(body): Observable<any> {
        return this.apiService.post('/writehistory',body,true)
          .pipe(map(data => data));
    }
    
}