import { Component, Input, OnInit,ViewChild } from '@angular/core';

/*Plugins*/
import {BsModalComponent } from 'ng2-bs3-modal';
@Component({
	selector: 'gallery-modal',
	templateUrl: './gallery-modal.component.html'
})
export class GalleryModalComponent implements OnInit {
	@Input('url') urlImage;

	@ViewChild('galleryModal')  galleryModal: BsModalComponent;
	imageUrl;
	ngOnInit(){
		console.log(this.urlImage)
	}
	open(url){
		this.imageUrl = 	url
		this.galleryModal.open();
	}
	close(){
			this.galleryModal.close();
	}
	onClose(){
		
	}
}
