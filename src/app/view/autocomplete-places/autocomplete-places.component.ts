import { Component, ViewChild, Output, EventEmitter, Input, OnInit } from '@angular/core';

import { GooglePlaceDirective } from "ngx-google-places-autocomplete";

@Component({
	selector: 'autocomplete-places',
	templateUrl: './autocomplete-places.component.html'
})
export class AutocompletePlacesComponent implements OnInit {
		@ViewChild("placesRef") placesRef:GooglePlaceDirective ;
		@ViewChild("autocomplete") autocomplete;
		@Input('defaultValue') defaultValue;
		@Output() onSelectAddress = new EventEmitter<any>();
		searchBox;

	optionsGooglePlaces = {
		types: ['geocode'],
		componentRestrictions: { country: 'RU' }
	}
	ngOnInit(){
		this.searchBox = new google.maps.places.SearchBox(this.autocomplete.nativeElement);
	}
	keypress(event){
		if(!this.searchBox.getPlaces()){
			return;
		}
		let address = this.searchBox.getPlaces()[0];
		if(address){
			this.addressSelect(address)
			this.defaultValue = address.formatted_address;
		}

	}
	addressSelect(address) {

		
		this.onSelectAddress.emit(
			{
				"lat":address.geometry.location.lat(),
				"lon":address.geometry.location.lng(),
				"address":address.formatted_address
			})
	}
}
