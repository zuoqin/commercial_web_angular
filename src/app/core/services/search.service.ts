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
    estimate(body): Observable<any> {
        return this.apiService.post('/estimate',body)
          .pipe(map(data => data));
      }
}