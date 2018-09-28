import { Component, OnInit,ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

/*Services */
import { SearchService } from '@services';

import { CONFIG } from '@config';


@Component({
	selector: 'search-app',
	templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit {
	
	@ViewChild('gmap') gmap: any;

	currentAnalogCount;
	numberDecimalSpaceMaskOptions = CONFIG.numberDecimalSpaceMaskOptions;
	numberSpaceMaskOptions = CONFIG.numberSpaceMaskOptions
	analogsCountList:Array<number> = [1,2,3,5,10,20,50,100];
	public searchForm: FormGroup;
	currentPlaceObject;
	sub;
	isSubmitting:boolean = false;
	currentObject;
	btnText = {
		default:'Получить стоимость',
		load:'Загрузка..',
		text:'Получить стоимость'
	}
	constructor(
		private route: ActivatedRoute,
    	private router: Router,
		private formBuilder: FormBuilder,
		private searchService:SearchService
	){

	}
	ngOnInit(){
		this.initForm();
		this.sub = this.route
			.queryParams
			.subscribe(params => {
				// Defaults to 0 if no query param provided.
				console.log(params)
			});
	}
	ngOnDestroy() {
		this.sub.unsubscribe();
	  }
	initForm(){
        this.searchForm = this.formBuilder.group({
			analogscount: 5,	  //Количество аналогов
			approach: "0",    	  //Подход к оценке
			assignment: "псн",   	  //Тип объекта
			hasshopwindows: 'true', //Наличие витринных окон
			houseline: 'true',	  //Линия застройки, True первая, False внутриквартальная
			isbuildingliving: 'true',//Тип здания True Жилой False Нежилой
			isentrance: 'true',      //Тип входа, True отдельный, False общий
			lat: [null, Validators.required],
			lon: [null, Validators.required],
			repair: "Стандарт",     //Состояние ремонта
			storey: [1, Validators.required],              //Этаж расположения объекта
			totalsquare: [100, Validators.required],   //Общая площадь объекта
			includedepr:true,
			includenondepr:true

        })
        
	}
	submit(){

		if(this.isSubmitting){
			return;
		}
		
		if (this.searchForm.invalid) {
			const controls = this.searchForm.controls;
			Object.keys(controls)
				.forEach(controlName => controls[controlName].markAsTouched());
				return;
		}
		this.isSubmitting = true;
		this.btnText.text = this.btnText.load;

		this.searchService.estimate(this.searchForm.value)
			.subscribe(
				response => {
					this.btnText.text = this.btnText.default;
					this.isSubmitting = false;
					this.currentObject = response;
					if(response.analogs && response.analogs.length){
						this.gmap.addAanalogsMarker(response.analogs)
					}
				},
				errors => {
				this.isSubmitting = false;
					console.log(errors)
				}
			);
	}
	selectAnalog(analog){
		this.searchForm.controls['analogscount'].setValue(analog);
	}
	selectAddress(value){
		this.searchForm.controls['lat'].setValue(value.lat)
		this.searchForm.controls['lon'].setValue(value.lon)
		this.currentPlaceObject = value;
		this.gmap.addMainMarker(this.currentPlaceObject);
		this.gmap.setCenter(this.currentPlaceObject.lat,this.currentPlaceObject.lon);
	}
	onChangeActiveAnalogs(analogs){
		this.gmap.removeMarker()
		console.log(analogs)
		this.gmap.addAanalogsMarker(analogs)
	}
}
