import { Component, OnInit,ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


/*Services */
import { SearchService } from '@services';

import { CONFIG } from '@config';
import { Search } from '@core';

/*Plugins */
import { Options } from 'ng5-slider';

@Component({
	selector: 'search-app',
	templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit {
	value: number = 0.59;
	options: Options = {
		floor: 0.5,
		ceil: 0.68,
		step: 0.01,
		precision: 2
	};
	specialCorrection:boolean = false;

	@ViewChild('gmap') gmap: any;
	numberDecimalSpaceMaskOptions = CONFIG.numberDecimalSpaceMaskOptions;
	numberSpaceMaskOptions = CONFIG.numberSpaceMaskOptions
	analogsCountList:Array<number> = [1,2,3,5,10,20,50,100];
    search: Search = {} as Search;
	searchForm: FormGroup;
	currentPlaceObject;

	isSubmitting:boolean = false;
	currentObject;
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
	ifNoOneSelectAnalogs:boolean = false;
	constructor(
		private formBuilder: FormBuilder,
		private searchService:SearchService
	){
	
		this.historyParams =this.searchService.storage
	
	}
	
	ngOnInit(){
		this.initForm();
		if(this.ifMapInit && this.historyParams && !this.ifInitHistory){
			this.initHistory()
		}
                if(this.searchService.storage != undefined && this.searchService.storage.analogs.length > 0){
                   this.on_get_response(this.searchService.storage);
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
		this.searchForm.controls['fulladdress'].setValue(this.historyParams.fulladdress);
	
		this.searchForm.controls['countOfAnalogs'].setValue(this.historyParams.countofanalogs);

		this.searchForm.controls['approach'].setValue(this.historyParams.approach);
		this.searchForm.controls['specialitytype'].setValue(this.historyParams.specialitytype);
                this.searchForm.controls['objecttype'].setValue(this.historyParams.objecttype);
		this.searchForm.controls['hasshopwindows'].setValue(this.historyParams.hasshopwindows.toString());
	
		this.searchForm.controls['houselinetype'].setValue(this.historyParams.houselinetype);
		this.searchForm.controls['isbuildingliving'].setValue(this.historyParams.isbuildingliving.toString());

		this.searchForm.controls['entrance'].setValue(this.historyParams.entrance);
		
		this.searchForm.controls['latitude'].setValue(this.historyParams.latitude);
		this.searchForm.controls['longitude'].setValue(this.historyParams.longitude);
		this.searchForm.controls['conditiontype'].setValue(this.historyParams.conditiontype);
		this.searchForm.controls['floornumber'].setValue(this.historyParams.floornumber);
		this.searchForm.controls['totalarea'].setValue(this.historyParams.totalarea);
		this.searchForm.controls['isObjectSpecial'].setValue(this.historyParams.isObjectSpecial ? 'yes':'no' );
		this.searchForm.controls['specialCorrectionKoef'].setValue(this.historyParams.specialCorrectionKoef ? this.historyParams.specialCorrectionKoef: 0.59);
	


		setTimeout(()=>{
			if(this.historyParams.isObjectSpecial=='yes'){
				this.specialCorrection = true;
			}
		})
		
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
			specialitytype: "псн",   	  //Назначение объекта
                        objecttype: "здание",            //Тип объекта
			hasshopwindows: 'true', //Наличие витринных окон
			houselinetype : 'первая главной',	  //Линия застройки, True первая, False внутриквартальная
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
			userId:1,
			analogIds:null,
			tocken:null,
			taskVersionId:null,
			clientType:'sasfrontend',
			specialCorrectionKoef:0.59,
			isObjectSpecial:'no'

        })
		this.onChanges();
		
	}

	onChanges(): void {
		this.searchForm.get('fulladdress').valueChanges.subscribe(() => {this.ifTuchAnotherField = true}); 
		this.searchForm.get('countOfAnalogs').valueChanges.subscribe(() => {this.ifTuchAnotherField = true}); 
		this.searchForm.get('specialitytype').valueChanges.subscribe(() => {this.ifTuchAnotherField = true}); 
                this.searchForm.get('objecttype').valueChanges.subscribe(() => {this.ifTuchAnotherField = true});
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

        on_get_response(response) : void{
            let analogsId = '';
            response.analogs.map(analog=>{
                analogsId += analog.id+',';
            })
           this.searchForm.controls['analogIds'].setValue(analogsId.slice(0, -1));
           this.updateSearchFilter(this.searchForm.value);
           let body = this.serialize(this.search);
           this.searchForm.controls['approach'].setValue(response.approach);
           if(response.approach=="profitable" || response.approach=="comparative"){
               if(!this.currentTypeSearch){
                  this.currentTypeSearch = response.approach;
                  this.calcFirstPrice(response)
               }
               else if(this.currentTypeSearch && this.currentTypeSearch== response.approach){
                   this.currentTypeSearch = response.approach;
                   this.calcFirstPrice(response)
               }else if(this.currentTypeSearch && this.currentTypeSearch!= response.approach){
                   this.calcSecondPrice(response)
               }
            }else{
               this.currentTypeSearch = null;
               this.totalPrice = null;
               this.totalPrice2 = null;
               this.averagePrice = null;
            }
            this.ifTuchAnotherField = false;
            this.btnText.text = this.btnText.default;
            this.isSubmitting = false;
            response.analogs.map(analog=>{
                                                analog['active'] = true;
            })
            this.currentObject = response;
            if(response.analogs && response.analogs.length){
                this.gmap.addAanalogsMarker(response.analogs)
            }
            if(!this.includedepr || !this.includenondepr){
               this.changeDepr()
            }
            this.ifInitHistory = true;
            var that = this;
            setTimeout(function(){
                that.selectAddress({
                    address: response.fulladdress,
                    lat: response.latitude,
                    lon: response.longitude,
                });
            }, 1000);
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
	

	
        this.updateSearchFilter(this.searchForm.value);
		let body = this.serialize(this.search);

		if(this.ifTuchAnotherField){
			this.currentTypeSearch = null;
			this.totalPrice = null;
			this.totalPrice2 = null;
			this.averagePrice = null;
		}
		


		this.currentObject = null;
		
		this.searchService.estimate(this.searchForm.controls['approach'].value,body)
			.subscribe(
				response => {

				
				

						let analogsId = '';
					
						response.analogs.map(analog=>{
							analogsId += analog.id+',';
						
						})
					
						this.searchForm.controls['analogIds'].setValue(analogsId.slice(0, -1));

						this.updateSearchFilter(this.searchForm.value);
						let body = this.serialize(this.search);


						this.searchService.writeHistory(body)
							.subscribe(
								response => {
									console.log(response)
								},
								errors => {
									console.log(errors)
								}
							);
					


					if(this.searchForm.controls['approach'].value=="profitable" || this.searchForm.controls['approach'].value=="comparative"){
						if(!this.currentTypeSearch){
					
							this.currentTypeSearch = this.searchForm.controls['approach'].value;
							this.calcFirstPrice(response)
						}else if(this.currentTypeSearch && this.currentTypeSearch== this.searchForm.controls['approach'].value){
					
							this.currentTypeSearch = this.searchForm.controls['approach'].value;
							this.calcFirstPrice(response)
						}else if(this.currentTypeSearch && this.currentTypeSearch!= this.searchForm.controls['approach'].value){
							this.calcSecondPrice(response)
						

						}
				
					}else{
					
						this.currentTypeSearch = null;
						this.totalPrice = null;
						this.totalPrice2 = null;
						this.averagePrice = null;
					}
					
					
					
		
					
					
				
				
					this.ifTuchAnotherField = false;
					this.btnText.text = this.btnText.default;
					this.isSubmitting = false;

					response.analogs.map(analog=>{
						analog['active'] = true;
					})



					this.currentObject = response;
                                        //if( this.currentObject['cadastr_price'] < 1){
                                        //    this.currentObject['cadastr_price'] = this.totalPrice * 0.9;
                                        //    this.currentObject['cadastr_diverge'] = 10;
                                        //}
					if(response.analogs && response.analogs.length){
						this.gmap.addAanalogsMarker(response.analogs)
					}


					if(!this.includedepr || !this.includenondepr){
						this.changeDepr()
					}  

				},
				errors => {
				this.isSubmitting = false;
				this.btnText.text = this.btnText.default;
				alert('Ошибка, попробуйте позже')
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

		
			this.averagePrice = this.totalPrice*0.5+this.totalPrice2*0.5;
		
	}
	changeDepr(){
		if(!this.includedepr){
			this.filteredAnalogsList = this.currentObject.analogs.filter(analog=>analog.isDepr!=1)
		}else{
			this.filteredAnalogsList =this.currentObject.analogs
		}
		if(!this.includenondepr){
			this.filteredAnalogsList = this.filteredAnalogsList.filter(analog=>analog.isDepr!=0)
		}
		this.currentObject.analogs.map(analog=>{
			if(analog.isDepr==1){
				analog.active = this.includedepr;
			}
			if(analog.isDepr==0){
				analog.active = this.includenondepr;
			}
		})
		this.onChangeActiveAnalogs(this.currentObject.analogs);
	
		this.gmap.removeMarker()
		this.gmap.addAanalogsMarker(this.filteredAnalogsList);

	

	}
	selectAnalogsCount(analog){
		this.searchForm.controls['countOfAnalogs'].setValue(analog);
	}
	selectAddress(value){
	
		this.searchForm.controls['fulladdress'].setValue(value.address)
		this.searchForm.controls['latitude'].setValue(value.lat)
		this.searchForm.controls['longitude'].setValue(value.lon)
		this.currentPlaceObject = value;

		this.gmap.addMainMarker(this.currentPlaceObject);

		this.gmap.setCenter(this.currentPlaceObject.lat,this.currentPlaceObject.lon);
	}
	onChangeActiveAnalogs(analogs){
		this.gmap.removeMarker()
		this.gmap.addAanalogsMarker(analogs);
		this.currentObject.analogs = analogs



		let idArray = '';
		let isDeprArray = '';
	
		this.currentObject.analogs.filter(analog=>analog.active).map(analog=>{
			isDeprArray += analog.isDepr+',';
			idArray += analog.id+',';
		
		})
	
		this.searchForm.controls['idArray'].setValue(idArray.slice(0, -1));
		this.searchForm.controls['isDeprArray'].setValue(isDeprArray.slice(0, -1));
		
		if(!idArray && !isDeprArray){
			this.ifNoOneSelectAnalogs = true;
			return;
		}else{
			this.ifNoOneSelectAnalogs = false;
			
		}

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
						
							this.calcSecondPrice(response);
						}else{
						
							this.calcFirstPrice(response)
						}


					},
					errors => {

						console.log(errors)
					}
				);




	}
	changeValueKoef(event){
		this.searchForm.controls['specialCorrectionKoef'].setValue(event)

	}
	changeSpecialCorrection(){
		this.specialCorrection = !this.specialCorrection;
		this.searchForm.controls['isObjectSpecial'].setValue(this.specialCorrection? 'yes':'no');
		
	}
	addFloor(){
		this.floorCount.push({
			data:null
		})
	}
	removeFloor(i){
	
		this.floorCount.splice(i,1);
		setTimeout(()=>{
		
			console.log('trigger resize')
			window.dispatchEvent(new Event('resize'));
		},1300)

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
