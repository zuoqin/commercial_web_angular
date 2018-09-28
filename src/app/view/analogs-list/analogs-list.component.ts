import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'analogs-list',
  templateUrl: './analogs-list.component.html'
})
export class AnalogsListComponent implements OnInit {
    currentObject;

    @Input('currentObject') 
    set object(object) {
        object.analogs.map(analog=>{
            analog['active'] = true;
            analog['price_per_meter'] = analog.price/analog.totalsquare;
            analog['price_per_meter_correction'] = analog.price_correction/analog.totalsquare;
        })


        this.currentObject = object;
    
    }


    @Output() onChangeActiveAnalogs = new EventEmitter<any>();
    ifShowCoeff:boolean = true;
    columnsArray = [
        {
            name:"Учитывать в расчете",
            active:true
        },
        {
            name:"Адрес",
            active:true
        },
        {
            name:"Тип ремонта",
            active:true
        },
        {
            name:"Площадь, кв. м.",
            active:true
        },
        {
            name:"Цена предложения",
            active:true
        },
        {
            name:"Цена предложения&nbsp;/<br> скорректированная цена за кв. м.",
            active:true
        },
        {
            name:"Поправка на торг",
            icon:"price",
            active:true
        },
        {
            name:"Местоположение",
            icon:"place",
            active:true
        },
        {
            name:"Расстояние до метро",
            icon:"subway",
            active:true
        },
        {
            name:"Общая площадь",
            icon:"area",
            active:true
        },
        {
            name:"Этаж",
            icon:"stage",
            active:true
        },
        {
            name:"Вход",
            icon:"enter",
            active:true
        },
        {
            name:"Линия застройки",
            icon:"map",
            active:true
        },
        {
            name:"Тип ремонта",
            icon:"repair",
            active:true
        },
        {
            name:"Наличие витрины",
            icon:"facade",
            active:true
        },
        {
            name:"Тип здания",
            icon:"category",
            active:true
        },
        {
            name:"Финальный коэффициент",
            icon:"finalcoef",
            active:true
        }

        
    ]
    toggleShowCoeff(){
        console.log(this.ifShowCoeff)
        this.ifShowCoeff = !this.ifShowCoeff;
    }
    ngOnInit(){
     
      
    }

    changeActiveAnalog(analog){
        console.log('change')
      
        analog.active = !analog.active;
        this.onChangeActiveAnalogs.emit(this.currentObject.analogs.filter(analog=>analog.active))
    }

}
