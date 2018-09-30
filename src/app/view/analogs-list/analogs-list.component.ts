import { Component, Input, OnInit, Output,EventEmitter,ViewChild } from '@angular/core';

@Component({
  selector: 'analogs-list',
  templateUrl: './analogs-list.component.html'
})
export class AnalogsListComponent implements OnInit {
    @ViewChild('gallery') gallery: any;
    @Input('averagePrice') set average(averagePrice){

        this.averagePriceValue = averagePrice;
    }
    @Input('type')  set tpe(type) {
  
        // if(this.currentType && (this.currentType=="comparative" || this.currentType=="profitable") && (type=="comparative" || type =="profitable")){
        //     console.log('высчитать среднее значение', this.averageValue)
        // }
     

        this.currentType = type;

        let columnName1 = 'Арендная ставка предложения, руб./кв.м в год с НДС без КП';
        let columnName2 = 'Скорректированная арендная ставка предложения, руб./кв.м в год с НДС без КП';
        if(this.currentType=="comparative"){
            columnName1="Цена предложения"
            columnName2="Цена предложения&nbsp;/<br> скорректированная цена за кв. м.";

        }
        this.columnsArray.filter(column=>column.id==5)[0].name = columnName1
        this.columnsArray.filter(column=>column.id==6)[0].name = columnName2
    }
    @Input('currentObject') 
    set object(object) {
     
        if(!this.currentObject){
            object.analogs.map(analog=>{
                analog['active'] = true;
                // analog['price_per_meter'] = analog.price/analog.totalsquare;
                // analog['price_per_meter_correction'] = analog.price_correction/analog.totalsquare;
            })
        }
    


        this.currentObject = object;

    
    }
    @Output() onChangeActiveAnalogs = new EventEmitter<any>();
    averagePriceValue;
    currentType;
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
            name:"Вход",
            active:true,
            id:18
        },
        {
            name:"Линия застройки",
            active:true,
            id:19
        },
        {
            name:"Наличие витринных окон",
            active:true,
            id:20
        },
        {
            name:"Тип здания",
            active:true,
            id:21
        },
        
        {
            name:"Этаж",
            active:true,
            id:22
        },
        {
            name:"Площадь, кв. м.",
            active:true,
            id:4
        },
        {
            name:"",
            active:true,
            id:5
        },
        {
            name:"",
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
    changeActiveAnalog(analog,event){
        console.log('change')
        analog.active = !analog.active;
        if(this.currentObject.analogs.filter(analog=>analog.active).length==0){
            analog.active = true;
            event.target.checked = true;
            return false;
        }
       
        console.log()
        this.onChangeActiveAnalogs.emit(this.currentObject.analogs.filter(analog=>analog.active))
    }
    showImage(url){
        this.gallery.open(url)
    }
}
