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
  
    this.searchService.storage = arrayParams;
    this._router.navigate(['/search']);

  }


  ngOnInit(){
    this.searchService.getHistory()
      .subscribe(
        response => {
          this.historyArray = JSON.parse(response).data;
          console.log(this.historyArray)
        },
        errors => {

          alert('Ошибка, попробуйте позже')
        }
      );
  }
}
