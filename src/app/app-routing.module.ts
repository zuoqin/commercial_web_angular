import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchComponent } from './view/search/search.component';
import { HistoryComponent } from './view/history/history.component';
const routes: Routes = [
	{ 
		path: '', 
		redirectTo: 'search', 
		pathMatch: 'full'
	},
	{
		path: 'search', 
		component:SearchComponent
	},
	{
		path: 'history',
                children: [
                   {
                       path: ':reqid',
                       component:SearchComponent
                   },
                   {
                       path: '',
                       component:HistoryComponent
                   }
                ]
	}
	//{ path: '**',  redirectTo: 'search' }
];

@NgModule({
	imports: [RouterModule.forRoot(routes,{useHash: true})],
	exports: [
		RouterModule
	],
})
export class AppRoutingModule { }
