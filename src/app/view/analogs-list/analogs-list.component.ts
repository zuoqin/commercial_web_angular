import { Component, Input, OnInit, Output,EventEmitter,ViewChild } from '@angular/core';

@Component({
  selector: 'analogs-list',
  templateUrl: './analogs-list.component.html'
})
export class AnalogsListComponent implements OnInit {

	@ViewChild('gallery') gallery: any;
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
    
    currentObject;
    ifShowCoeff:boolean = true;
    columnsArray = [
        {
            name:"Учитывать в расчете",
            active:true,
            id:1
        },
        {
            name:"Адрес",
            active:true,
            id:2
        },
        {
            name:"Тип ремонта",
            active:true,
            id:3
        },
        {
            name:"Площадь, кв. м.",
            active:true,
            id:4
        },
        {
            name:"Цена предложения",
            active:true,
            id:5
        },
        {
            name:"Цена предложения&nbsp;/<br> скорректированная цена за кв. м.",
            active:true,
            id:6
        },
        {
            name:"Поправка на торг",
            icon:"price",
            active:true,
            id:7
        },
        {
            name:"Местоположение",
            icon:"place",
            active:true,
            id:8
        },
        {
            name:"Расстояние до метро",
            icon:"subway",
            active:true,
            id:9
        },
        {
            name:"Общая площадь",
            icon:"area",
            active:true,
            id:10
        },
        {
            name:"Этаж",
            icon:"stage",
            active:true,
            id:11
        },
        {
            name:"Вход",
            icon:"enter",
            active:true,
            id:12
        },
        {
            name:"Линия застройки",
            icon:"map",
            active:true,
            id:13
        },
        {
            name:"Тип ремонта",
            icon:"repair",
            active:true,
            id:14
        },
        {
            name:"Наличие витрины",
            icon:"facade",
            active:true,
            id:15
        },
        {
            name:"Тип здания",
            icon:"category",
            active:true,
            id:16
        },
        {
            name:"Финальный коэффициент",
            icon:"finalcoef",
            active:true,
            id:17
        }

        
    ]
    toggleShowCoeff(){
        console.log(this.ifShowCoeff)
        this.ifShowCoeff = !this.ifShowCoeff;
        this.columnsArray.map(column=>{
            if(column.icon){
                column.active = this.ifShowCoeff;
            }
        })
     
    }
    ngOnInit(){
     
      
    }
    onSelectedColumns(columns){
        this.columnsArray = columns;
        this.columnsArray.map(column=>{
            if(column.icon && column.active){
                this.ifShowCoeff = true;
                return;
            }
        })
    }
    isColumnActive(id){
        return this.columnsArray.filter(item=>item.id==id)[0].active
    }
    changeActiveAnalog(analog){
        console.log('change')
      
        analog.active = !analog.active;
        this.onChangeActiveAnalogs.emit(this.currentObject.analogs.filter(analog=>analog.active))
    }
    showImage(url){
        this.gallery.open(url)
    }
}
