import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SearchComponent } from './view/search/search.component';
import { HeaderComponent } from './view/header/header.component';
import { MenuComponent } from './view/menu/menu.component';
import { HistoryComponent } from './view/history/history.component';
import { AutocompletePlacesComponent } from './view/autocomplete-places/autocomplete-places.component'
import { MapComponent } from './view/map/map.component';
import { AnalogsListComponent } from './view/analogs-list/analogs-list.component';
import { ColumnsFilterComponent } from './view/columns-filter/columns-filter.component';
import { GalleryModalComponent } from './view/modals';

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
import { BsModalModule } from 'ng2-bs3-modal';
import {TooltipModule} from 'ng2-tooltip-directive';
import {DataTableModule} from "angular-6-datatable";

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
    ThousandsSpacePipe,
    ColumnsFilterComponent,
    GalleryModalComponent
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
    CoreModule,
    BsModalModule,
    TooltipModule,
    DataTableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
