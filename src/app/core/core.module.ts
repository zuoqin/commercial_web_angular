import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import {
  ApiService,
  SearchService
} from './services';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [

    ApiService,
    SearchService
  ],
  declarations: []
})
export class CoreModule { }