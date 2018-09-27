import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SearchComponent } from './view/search/search.component';
import { HeaderComponent } from './view/header/header.component';
import { MenuComponent } from './view/menu/menu.component';
import { HistoryComponent } from './view/history/history.component';

/*Moduls */
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
/*Plugins */
import { AngularSvgIconModule } from 'angular-svg-icon';
@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    HeaderComponent,
    MenuComponent,
    HistoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularSvgIconModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
