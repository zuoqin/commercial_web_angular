import { Component,ViewChild,Output,EventEmitter } from '@angular/core';

import { GooglePlaceDirective } from "ngx-google-places-autocomplete";

@Component({
	selector: 'autocomplete-places',
	templateUrl: './autocomplete-places.component.html'
})
export class AutocompletePlacesComponent {
		@ViewChild("placesRef") placesRef : GooglePlaceDirective;
		@Output() onSelectAddress = new EventEmitter<any>();


	optionsGooglePlaces = {
		types: [],
		componentRestrictions: { country: 'RU' }
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
