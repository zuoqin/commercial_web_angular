import { Component, OnInit,ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


/*Services */
import { SearchService } from '@services';

import { CONFIG } from '@config';
import { Search } from '@core';


@Component({
	selector: 'search-app',
	templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit {
	
	@ViewChild('gmap') gmap: any;
	numberDecimalSpaceMaskOptions = CONFIG.numberDecimalSpaceMaskOptions;
	numberSpaceMaskOptions = CONFIG.numberSpaceMaskOptions
	analogsCountList:Array<number> = [1,2,3,5,10,20,50,100];
    search: Search = {} as Search;
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
	floorCount = [{
		data:null
	}];
	ifTuchAnotherField:boolean = false;
	totalPrice;
	totalPriceType;
	totalPrice2;
	averagePrice;
	currentTypeSearch;
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
		this.searchForm.controls['fulladdress'].setValue(this.historyParams.fulladdress);
		
			this.searchForm.controls['countOfAnalogs'].setValue(this.historyParams.countofanalogs);
	
			this.searchForm.controls['approach'].setValue(this.historyParams.approach);
			this.searchForm.controls['specialitytype'].setValue(this.historyParams.specialitytype);
			this.searchForm.controls['hasshopwindows'].setValue(this.historyParams.hasshopwindows.toString());
		
			this.searchForm.controls['houselinetype'].setValue(this.historyParams.houselinetype);
			this.searchForm.controls['isbuildingliving'].setValue(this.historyParams.isbuildingliving.toString());

			this.searchForm.controls['entrance'].setValue(this.historyParams.entrance);
			
			this.searchForm.controls['latitude'].setValue(this.historyParams.latitude);
			this.searchForm.controls['longitude'].setValue(this.historyParams.longitude);
			this.searchForm.controls['conditiontype'].setValue(this.historyParams.conditiontype);
			this.searchForm.controls['floornumber'].setValue(this.historyParams.floornumber);
			this.searchForm.controls['totalarea'].setValue(this.historyParams.totalarea);
			this.selectAddress({
				address: this.historyParams.fulladdress.length ? this.historyParams.fulladdress: `${this.historyParams.latitude}, ${this.historyParams.longitude}`,
				lat: this.historyParams.latitude,
				lon: this.historyParams.longitude,
			})
			this.submit()

		
	}
	initForm(){
        this.searchForm = this.formBuilder.group({
			approach: "comparative",    	  //Подход к оценке
			fulladdress:'',
			countOfAnalogs: 5,	  //Количество аналогов
			specialitytype: "псн",   	  //Тип объекта
			hasshopwindows: 'true', //Наличие витринных окон
			houselinetype : 'первая',	  //Линия застройки, True первая, False внутриквартальная
			isbuildingliving: 'true',//Тип здания True Жилой False Нежилой
			entrance : 'общий',      //Тип входа, True отдельный, False общий
			latitude: [null,   Validators.required],
			longitude: [null, Validators.required],
			conditiontype: "стандарт",     //Состояние ремонта
			floornumber: [1, Validators.required],              //Этаж расположения объекта
			totalarea: [40.7, Validators.required],   //Общая площадь объекта
			isDeprAnalogsShow:"yes",
			isFincaseAnalogsShow: 'yes',
			city:"Москва",
			idArray:null,
			isDeprArray:null,

        })
        this.onChanges();
	}

	onChanges(): void {
		this.searchForm.get('fulladdress').valueChanges.subscribe(() => {this.ifTuchAnotherField = true}); 
		this.searchForm.get('countOfAnalogs').valueChanges.subscribe(() => {this.ifTuchAnotherField = true}); 
		this.searchForm.get('specialitytype').valueChanges.subscribe(() => {this.ifTuchAnotherField = true}); 
		this.searchForm.get('hasshopwindows').valueChanges.subscribe(() => {this.ifTuchAnotherField = true}); 
		this.searchForm.get('isbuildingliving').valueChanges.subscribe(() => {this.ifTuchAnotherField = true}); 
		this.searchForm.get('entrance').valueChanges.subscribe(() => {this.ifTuchAnotherField = true}); 
		this.searchForm.get('latitude').valueChanges.subscribe(() => {this.ifTuchAnotherField = true}); 
		this.searchForm.get('longitude').valueChanges.subscribe(() => {this.ifTuchAnotherField = true}); 
		this.searchForm.get('conditiontype').valueChanges.subscribe(() => {this.ifTuchAnotherField = true}); 
		this.searchForm.get('floornumber').valueChanges.subscribe(() => {this.ifTuchAnotherField = true}); 
		this.searchForm.get('totalarea').valueChanges.subscribe(() => {this.ifTuchAnotherField = true}); 



		this.searchForm.get('approach').valueChanges.subscribe(() => {this.currentObject = null;}); 
		// this.searchForm.valueChanges.subscribe(val => {
		
		
		// });
		if(this.ifTuchAnotherField){
			this.currentObject = null;
		}
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

	
        this.updateSearchFilter(this.searchForm.value);
		let body = this.serialize(this.search);
		console.log(this.ifTuchAnotherField)
		if(this.ifTuchAnotherField){
			this.currentTypeSearch = null;
			this.totalPrice = null;
			this.totalPrice2 = null;
			this.averagePrice = null;
		}
	
		this.searchService.writeHistory(body)
			.subscribe(
				response => {
					console.log(response)
				},
				errors => {
					console.log(errors)
				}
			);
			this.searchService.estimate(this.searchForm.controls['approach'].value,body)
				.subscribe(
					response => {
						if(this.searchForm.controls['approach'].value=="profitable" || this.searchForm.controls['approach'].value=="comparative"){
							if(!this.currentTypeSearch){
								console.log('считаем первую цену')
								this.currentTypeSearch = this.searchForm.controls['approach'].value;
								this.calcFirstPrice(response)
							}else if(this.currentTypeSearch && this.currentTypeSearch== this.searchForm.controls['approach'].value){
								console.log('обновляем первую цену')
								this.currentTypeSearch = this.searchForm.controls['approach'].value;
								this.calcFirstPrice(response)
							}else if(this.currentTypeSearch && this.currentTypeSearch!= this.searchForm.controls['approach'].value){
								this.calcSecondPrice(response)
								console.log('считаем вторую и выводим среднее')

							}
					
						}else{
							console.log('аренда, обнуляем среднюю цену')
							this.currentTypeSearch = null;
							this.totalPrice = null;
							this.totalPrice2 = null;
							this.averagePrice = null;
						}
						
						
						
					
						// if(!this.ifTuchAnotherField){
						// 	//this.calcAveragePrice(this.currentTypeSearch,response);
						// 	console.log(this.searchForm.controls['longitude'].value)
						// 	console.log(this.totalPrice.id)
						// 	if(!this.totalPrice2.price){
								
						// 	}
						// 		this.calcFirstPrice(response);
							
					
						// }
					
						
						
					
					
						this.ifTuchAnotherField = false;
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
					this.btnText.text = this.btnText.default;
						console.log(errors)
					}
				);

		
	}
	
	calcFirstPrice(response){
	
		
			if(this.searchForm.controls['approach'].value=="profitable"){
				this.totalPrice = response['Стоимость объекта оценки доходный подход, руб.']
				
			}else if(this.searchForm.controls['approach'].value=="comparative"){
				this.totalPrice = response['Стоимость объекта оценки сравнительный подход, руб.']
			}
	
		
	}
	calcSecondPrice(response){

			if(this.searchForm.controls['approach'].value=="profitable"){

				this.totalPrice2 = response['Стоимость объекта оценки доходный подход, руб.']
				
			}else if(this.searchForm.controls['approach'].value=="comparative"){
				this.totalPrice2 = response['Стоимость объекта оценки сравнительный подход, руб.']
			}

			console.log(this.totalPrice2)
			this.averagePrice = this.totalPrice*0.5+this.totalPrice2*0.5;
		
	}
	changeDepr(){
		if(!this.includedepr){
			this.filteredAnalogsList = this.currentAnalogsList.filter(analog=>analog.isDepr!=1)
		}else{
			this.filteredAnalogsList =this.currentAnalogsList;
		}
		if(!this.includenondepr){
			this.filteredAnalogsList = this.filteredAnalogsList.filter(analog=>analog.isDepr!=0)
		}
		this.gmap.removeMarker()
		this.gmap.addAanalogsMarker(this.filteredAnalogsList)

	}
	selectAnalogsCount(analog){
		this.searchForm.controls['countOfAnalogs'].setValue(analog);
	}
	selectAddress(value){
		//console.log(value)
		this.searchForm.controls['fulladdress'].setValue(value.address)
		this.searchForm.controls['latitude'].setValue(value.lat)
		this.searchForm.controls['longitude'].setValue(value.lon)
		this.currentPlaceObject = value;

		this.gmap.addMainMarker(this.currentPlaceObject);

		this.gmap.setCenter(this.currentPlaceObject.lat,this.currentPlaceObject.lon);
	}
	onChangeActiveAnalogs(analogs){
		this.gmap.removeMarker()
		this.gmap.addAanalogsMarker(analogs)
		this.currentAnalogsList = analogs;



		let idArray;
		let isDeprArray;
	
		this.currentAnalogsList.map(analog=>{
			if(idArray){
				idArray += ','+analog.id;
			}else{
				idArray = analog.id;
			}
			if(isDeprArray){
				isDeprArray += ','+analog.isDepr;
			}else{
				isDeprArray = analog.isDepr;
			}
		})
	
		this.searchForm.controls['idArray'].setValue(idArray);
		this.searchForm.controls['isDeprArray'].setValue(isDeprArray);
		


		this.updateSearchFilter(this.searchForm.value);
		let body = this.serialize(this.search);

	
		let type = this.searchForm.controls['approach'].value;
		
		
			this.searchService.customAnalogs('galochky',body)
				.subscribe(
					response => {
					

						if(type=="profitable"){
							this.currentObject['Стоимость объекта оценки доходный подход, руб.'] = response['Стоимость объекта оценки доходный подход, руб.'];
							this.currentObject['Стоимость объекта оценки за метр, руб.'] = response['Стоимость объекта оценки за метр, руб.']
							
						}else if(type=="comparative"){
							this.currentObject['Стоимость объекта оценки сравнительный подход, руб.'] = response['Стоимость объекта оценки сравнительный подход, руб.']
							this.currentObject['Стоимость объекта оценки за метр, руб.'] = response['Стоимость объекта оценки за метр, руб.']
						}else if(type=="arenda"){
							this.currentObject['арендная ставка объекта оценки (руб. кв.м в год)'] = response['арендная ставка объекта оценки (руб. кв.м в год)']
						}
					
						if(this.totalPrice2){
							console.log('есть вторая цена, обновляем ее')
							this.calcSecondPrice(response);
						}else{
							console.log('обновляем первую')
							this.calcFirstPrice(response)
						}


					},
					errors => {

						console.log(errors)
					}
				);




	}
	addFloor(){
		this.floorCount.push({
			data:null
		})
	}
	removeFloor(i){
		console.log(this.floorCount)
		this.floorCount.splice(i,1)
	}
	serialize(obj) {
        var str = [];
        for (var p in obj)
          if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          }
        return str.join("&");
	  }
	  updateSearchFilter(values: Object){
        Object.assign(this.search, values);
    }
}
