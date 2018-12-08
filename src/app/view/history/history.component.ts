import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
  total_historyArray;
  searchForm: FormGroup;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private searchService:SearchService,
    private formBuilder: FormBuilder,
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
    "Крупная улица",
    "Наличие витринных окон",
    "Тип здания",
    "Этаж",
    "Общая площадь",
    "Количество аналогов"
  ]

  navigateToFoo(arrayParams){
    this.searchService.getHistoryById('request_id=' + arrayParams['id'] + "&userid=2")
    .subscribe(
        response => {
            for(var k in response) arrayParams[k]=response[k];
            if(arrayParams['isbigstreet'] == null || arrayParams['isbigstreet'] == undefined){
                arrayParams['isbigstreet'] = 'no'
            }
            this.searchService.storage = arrayParams;
            this._router.navigate(['/history/' + arrayParams['id']]);
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

    initForm(){
        this.searchForm = this.formBuilder.group({
            search_data: [null],
        });
    }


  filter_history(){
     var data = this.searchForm.get('search_data').value
     this.historyArray = this.total_historyArray.filter(x => x.fulladdress.toLowerCase().indexOf(data.toLowerCase()) !== -1);
  }


  ngOnInit(){
    this.initForm();
    this.searchService.getHistory()
      .subscribe(
        response => {
          this.historyArray = JSON.parse(response).data;
          this.total_historyArray = JSON.parse(response).data;
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
