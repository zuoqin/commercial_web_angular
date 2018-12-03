import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
/*Services */
import { SearchService } from '@services';
@Component({
  selector: 'history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
  encapsulation: ViewEncapsulation.None
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
  approach = {
    comparative:"Сравнительный",
    profitable:"Доходный",
    arenda:"Аренда"
  }
  columns = [
    "ID запроса",
    "Дата запроса",
    "Адрес",
    "Подход",
    "Тип ремонта",
    "Вход",
    "Линия застройки",
    "Наличие витринных окон",
    "Тип здания",
    "Этаж",
    "Общая площадь",
    "Количество аналогов"
  ]

  navigateToFoo(arrayParams){
    this.searchService.getHistoryById('request_id=' + arrayParams['id'] + "&usersid=4")
    .subscribe(
        response => {
            for(var k in response) arrayParams[k]=response[k];
            this.searchService.storage = arrayParams;
            this._router.navigate(['/search?id=' + arrayParams['id']]);
        }
    )
  }

  getParameterValue(name){
      name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
      var regexS = "[\\?&]"+name+"=([^&#]*)";
      var regex = new RegExp( regexS );
      var results = regex.exec( window.location.href );
      if( results == null ) return "";
      else return results[1];
  }
  ngOnInit(){
    this.searchService.getHistory()
      .subscribe(
        response => {
          this.historyArray = JSON.parse(response).data;
          var id = this.getParameterValue('id');
          if(id != ''){
              var res = this.historyArray.filter(x=>x.id == parseInt(id));
              if(res.length > 0){
                  this.navigateToFoo(res[0]);
              }
              //console.log(this.historyArray);
          }
        },
        errors => {

          alert('Ошибка, попробуйте позже')
        }
      );
  }
}
