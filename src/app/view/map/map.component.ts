import { Component, OnInit,ViewChild,Output,EventEmitter } from '@angular/core';
import {} from '@types/googlemaps';

@Component({
  selector: 'map',
  templateUrl: './map.component.html',
  styleUrls:['./map.component.scss']
})
export class MapComponent implements OnInit {
    @ViewChild('gmap') gmapElement: any;
	map: google.maps.Map;
    markers: google.maps.Marker[] = [];
    mainMarker: google.maps.Marker[] = [];
    public currentMarker;
    @Output() onInitMap = new EventEmitter<any>();
   
    ngOnInit(){
        this.initMap(this.gmapElement.nativeElement);
    }
    initMap(element) {
    
		const mapProp:any = {
            zoom: 13,
            center: new google.maps.LatLng(55.7404042,37.5967961),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            styles: [
                {
                    "featureType":"water",
                    "elementType":"geometry",
                    "stylers":[{"color":"#e9e9e9"},{"lightness":17}]
                },
                {"featureType":"landscape.man_made","elementType":"geometry.stroke","stylers":[{"color":"#A9A9A9"},{"lightness":20}]},                           
                {"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},
                {"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},
                {"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},
                {"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},
                {"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},
                {"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},
                {"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},
                {"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},
                {"featureType":"transit","elementType":"geometry","stylers":[{"color":"#606060"},{"lightness":19}]},
                {"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},
                {"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]}
            ]           
        };
        
        this.map = new google.maps.Map(element, mapProp);
        this.onInitMap.emit()
    }
    // this.setMarker(this.state.coordinate.latitude, this.state.coordinate.longitude, content);

	setCenter(latitude: number, longitude: number) {
		const coordinate = new google.maps.LatLng(latitude, longitude);
		this.map.panTo(coordinate);
		this.map.setZoom(12)
    }

    removeMarker(){
        while (this.markers.length) {
			const marker = this.markers.pop();
			google.maps.event.clearInstanceListeners(marker);
			marker.setMap(null);
		}
    }
    removeMainMarker(){
        while (this.mainMarker.length) {
			const marker = this.mainMarker.pop();
			google.maps.event.clearInstanceListeners(marker);
			marker.setMap(null);
		}
    }
    addMainMarker(currentMarker) {
        this.removeMainMarker()


        this.currentMarker = currentMarker;

        let content = `<b>Адрес:</b>  ${this.currentMarker.address}`;

		let coordinate = new google.maps.LatLng(this.currentMarker.lat, this.currentMarker.lon);
        let marker = new google.maps.Marker({ 
            position: coordinate
        });
  
        let infowindow = new google.maps.InfoWindow({
            content: content
        });

        marker.addListener('mouseover', () => {
            infowindow.open(this.map, marker);
        });
        marker.addListener('mouseout', ()=> {
            infowindow.close();
        })
       
        marker.setValues({type: "mainMarker"});
		marker.setMap(this.map);
        this.mainMarker.push(marker);
      
    }
    addAanalogsMarker(analogs){
        this.removeMarker()
        if(!analogs.length){
            return;
        }

        let bounds  = new google.maps.LatLngBounds();
        
        analogs.map(analog=>{
            const coordinate = new google.maps.LatLng(analog.latitude, analog.longitude);
            let color;
            if(analog.isdepr){
                color = 'red';
            }else{
                color = 'yellow';
            }

            let icon = {
                url: `/assets/img/${color}_point.ico`, // url
                scaledSize: new google.maps.Size(48, 48), // scaled size
                origin: new google.maps.Point(0,0), // origin
                anchor: new google.maps.Point(25, 48) // anchor
            };

            const marker = new google.maps.Marker({ 
                position: coordinate,
                icon: icon,
                animation: google.maps.Animation.DROP,
                
            });
   
            const infowindow = new google.maps.InfoWindow({
                content: `
                <div style="margin-top: 5px;">Адрес: ${analog.address ? analog.address:'Н/Д'}</div>
                <div style="margin-top: 5px;">Тип ремонта: ${analog.repair ? analog.repair:'Н/Д'}</div>
                <div style="margin-top: 5px;">Вход: ${analog.entrance ? analog.entrance:'Н/Д'}</div>
                <div style="margin-top: 5px;">Линия застройки: ${analog.houselinetype ? analog.entrance:'Н/Д'}</div>
                <div style="margin-top: 5px;">Площадь: ${analog.totalsquare ? analog.totalsquare.toLocaleString('ru-RU') :'Н/Д' } м²</div>
                <div style="margin-top: 5px;">Наличие витринных окон: ${analog.hasshopwindows=='true' ? 'есть':'нет'}</div>
                <div style="margin-top: 5px;">Тип здания: ${analog.isbuildingliving=='true' ? 'жилой':'нежилой'}</div>
                <div style="margin-top: 5px;">Этаж: ${analog.floor ? analog.floor:'Н/Д'}</div>
                <div style="text-align:center;margin-top: 5px;">Цена: ${analog.price.toLocaleString('ru-RU')} р.</div>
                `
            });
            marker.addListener('click', () => {
                infowindow.open(this.map, marker);
            });
            marker.setMap(this.map);
            this.markers.push(marker);

            let loc = new google.maps.LatLng(analog.latitude, analog.longitude);
            bounds.extend(loc);

            /*add current marker */
            let currentMarkercoordinate = new google.maps.LatLng(this.currentMarker.lat, this.currentMarker.lon);
            bounds.extend(currentMarkercoordinate);
        })
        this.map.fitBounds(bounds); 
        this.map.panToBounds(bounds); 
		
    }
    
}
