import { Component, OnInit,ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


/*Services */
import { SearchService } from '@services';

import { CONFIG } from '@config';


@Component({
	selector: 'search-app',
	templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit {
	
	@ViewChild('gmap') gmap: any;
	numberDecimalSpaceMaskOptions = CONFIG.numberDecimalSpaceMaskOptions;
	numberSpaceMaskOptions = CONFIG.numberSpaceMaskOptions
	analogsCountList:Array<number> = [1,2,3,5,10,20,50,100];

	searchForm: FormGroup;
	currentPlaceObject;

	isSubmitting:boolean = false;
	currentObject;
	currentAnalogsList;
	filteredAnalogsList;
	historyParams;
	btnText = {
		default:'Получить стоимость',
		load:'Загрузка..',
		text:'Получить стоимость'
	}

	includedepr:boolean = true;
	includenondepr:boolean = true;
	ifMapInit:boolean = false;
	ifInitHistory:boolean = false;
	constructor(
		private formBuilder: FormBuilder,
		private searchService:SearchService
	){
		console.log();
		this.historyParams =this.searchService.storage
	
	}
	ngOnInit(){
		this.initForm();
		if(this.ifMapInit && this.historyParams && !this.ifInitHistory){
			this.initHistory()
		}
	}
	onInitMap(){
		this.ifMapInit = true;
		if(this.historyParams && !this.ifInitHistory){
			this.ifInitHistory = true;
			this.initHistory()
		}
	}
	initHistory(){
		console.log(this.historyParams)
			this.searchForm.controls['analogscount'].setValue(this.historyParams.analogs);
	
			this.searchForm.controls['approach'].setValue(this.historyParams.approach.toString());
			this.searchForm.controls['assignment'].setValue(this.historyParams.object);
			this.searchForm.controls['hasshopwindows'].setValue(this.historyParams.shopwindows.toString());
		
			this.searchForm.controls['houseline'].setValue(this.historyParams.houseline.toString());
			this.searchForm.controls['isbuildingliving'].setValue(this.historyParams.buildingtype.toString());

			this.searchForm.controls['isentrance'].setValue(this.historyParams.entrance.toString());
			
			this.searchForm.controls['lat'].setValue(this.historyParams.lat);
			this.searchForm.controls['lon'].setValue(this.historyParams.lon);
			this.searchForm.controls['repair'].setValue(this.historyParams.conditiontype);
			this.searchForm.controls['storey'].setValue(this.historyParams.storey);
			this.searchForm.controls['totalsquare'].setValue(this.historyParams.totalarea);
			this.selectAddress({
				address: this.historyParams.address.length ? this.historyParams.address: `${this.historyParams.lat}, ${this.historyParams.lon}`,
				lat: this.historyParams.lat,
				lon: this.historyParams.lon,
			})
			this.submit()

		
	}
	initForm(){
        this.searchForm = this.formBuilder.group({
			address:'',
			analogscount: 5,	  //Количество аналогов
			approach: "0",    	  //Подход к оценке
			assignment: "псн",   	  //Тип объекта
			hasshopwindows: 'true', //Наличие витринных окон
			houseline: 'true',	  //Линия застройки, True первая, False внутриквартальная
			isbuildingliving: 'true',//Тип здания True Жилой False Нежилой
			isentrance: 'true',      //Тип входа, True отдельный, False общий
			lat: [null,  Validators.required],
			lon: [null, Validators.required],
			repair: "Стандарт",     //Состояние ремонта
			storey: [1, Validators.required],              //Этаж расположения объекта
			totalsquare: [40, Validators.required]   //Общая площадь объекта


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
		this.currentObject = null;
		this.searchService.estimate(this.searchForm.value)
			.subscribe(
				response => {
					this.btnText.text = this.btnText.default;
					this.isSubmitting = false;
					this.currentObject = response;
					this.currentAnalogsList = response.analogs;
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
	changeDepr(){
		if(!this.includedepr){
			this.filteredAnalogsList = this.currentAnalogsList.filter(analog=>analog.isdepr!=1)
		}else{
			this.filteredAnalogsList =this.currentAnalogsList;
		}
		if(!this.includenondepr){
			this.filteredAnalogsList = this.filteredAnalogsList.filter(analog=>analog.isdepr!=0)
		}
		this.gmap.removeMarker()
		this.gmap.addAanalogsMarker(this.filteredAnalogsList)

	}
	selectAnalogsCount(analog){
		this.searchForm.controls['analogscount'].setValue(analog);
	}
	selectAddress(value){
		//console.log(value)
		this.searchForm.controls['address'].setValue(value.address)
		this.searchForm.controls['lat'].setValue(value.lat)
		this.searchForm.controls['lon'].setValue(value.lon)
		this.currentPlaceObject = value;
		this.gmap.addMainMarker(this.currentPlaceObject);
		console.log(this.currentPlaceObject)
		this.gmap.setCenter(this.currentPlaceObject.lat,this.currentPlaceObject.lon);
	}
	onChangeActiveAnalogs(analogs){
		this.currentAnalogsList = analogs;
		this.gmap.removeMarker()
		this.gmap.addAanalogsMarker(analogs)
	}
}
