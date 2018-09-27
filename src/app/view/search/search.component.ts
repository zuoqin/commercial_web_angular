import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


import { CONFIG } from '@config';


@Component({
	selector: 'search-app',
	templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit {
	currentAnalogCount;
	numberDecimalSpaceMaskOptions = CONFIG.numberDecimalSpaceMaskOptions;
	numberSpaceMaskOptions = CONFIG.numberSpaceMaskOptions
	analogsCountList:Array<string> = ["1","2","3","5","10","20","50","100"];
    public searchForm: FormGroup;


	constructor(
		private formBuilder: FormBuilder
	){

	}
	ngOnInit(){
		this.initForm();
		this.currentAnalogCount = this.searchForm.controls['analogscount'].value;
	}
	initForm(){
        this.searchForm = this.formBuilder.group({
			analogscount: "5",	  //Количество аналогов
			approach: "0",    	  //Подход к оценке
			assignment: "псн",   	  //Тип объекта
			hasshopwindows: 'true', //Наличие витринных окон
			houseline: 'true',	  //Линия застройки, True первая, False внутриквартальная
			isbuildingliving: 'true',//Тип здания True Жилой False Нежилой
			isentrance: 'true',      //Тип входа, True отдельный, False общий
			lat: ['', Validators.required],
			lon: ['', Validators.required],
			repair: "Стандарт",     //Состояние ремонта
			storey: [1, Validators.required],              //Этаж расположения объекта
			totalsquare: [100, Validators.required]   //Общая площадь объекта
        })
        
	}
	submit(){
		console.log(this.searchForm)
		if (this.searchForm.invalid) {
			const controls = this.searchForm.controls;
			Object.keys(controls)
				.forEach(controlName => controls[controlName].markAsTouched());
				return;
		}
	}
	selectAnalog(analog){
		this.currentAnalogCount = analog;
	}
	selectAddress(value){
		console.log()

		console.log()
		this.searchForm.controls['lat'].setValue(value.lat)
		this.searchForm.controls['lon'].setValue(value.lon)
		// this.searchForm.controls['lat'].setValue(value.lat)
		// this.searchForm.controls['lng'].setValue(value.lng)
	}
}
