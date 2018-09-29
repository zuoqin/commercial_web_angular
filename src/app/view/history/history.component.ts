import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
/*Services */
import { SearchService } from '@services';
@Component({
  selector: 'history',
  templateUrl: './history.component.html'
})
export class HistoryComponent implements OnInit {
  historyArray;
  
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private searchService:SearchService
  ){
    this.searchService.storage = null;
  }

  navigateToFoo(arrayParams){
  
    this.searchService.storage = arrayParams;
    this._router.navigate(['/search']);

  }


  ngOnInit(){
    this.searchService.getHistiry()
      .subscribe(
        response => {
          this.historyArray = response.data;
         console.log(response)
        },
        errors => {

          console.log(errors)
        }
      );
  }
}
