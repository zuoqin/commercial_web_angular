import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SearchComponent } from './view/search/search.component';
import { HeaderComponent } from './view/header/header.component';
import { MenuComponent } from './view/menu/menu.component';
import { HistoryComponent } from './view/history/history.component';
import { AutocompletePlacesComponent } from './view/autocomplete-places/autocomplete-places.component'
import { MapComponent } from './view/map/map.component';
import { AnalogsListComponent } from './view/analogs-list/analogs-list.component'
/*Moduls */
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from './core/core.module';
/*Plugins */
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgSelectModule } from '@ng-select/ng-select';
import { TextMaskModule } from 'angular2-text-mask';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
/*Pipes */
import { ThousandsSpacePipe } from './pipes/thousands.pipe';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    HeaderComponent,
    MenuComponent,
    HistoryComponent,
    AutocompletePlacesComponent,
    MapComponent,
    AnalogsListComponent,
    ThousandsSpacePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularSvgIconModule,
    HttpClientModule,
    NgSelectModule, 
    FormsModule,
    ReactiveFormsModule,
    TextMaskModule,
    GooglePlaceModule,
    CoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
