import { Component, OnInit,ViewChild,Output,EventEmitter } from '@angular/core';
import {} from '@types/googlemaps';
declare var MarkerClusterer:any;
@Component({
  selector: 'map',
  templateUrl: './map.component.html',
  styleUrls:['./map.component.scss']
})
export class MapComponent implements OnInit {
    @ViewChild('gmap') gmapElement: any;
    isDublicate = false;
	map: google.maps.Map;
    markers: google.maps.Marker[] = [];
    mainMarker: google.maps.Marker[] = [];
    public currentMarker;
    markerCluster;
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
        if(this.markerCluster){
             this.markerCluster.clearMarkers();
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

//         latitude: 55.793045
// longitude: 37.563646
        //console.log(analogs)
      
     
       if(this.isDublicate){
        analogs = analogs.concat(analogs)
       }
      
        console.log(analogs)
        analogs.map(analog=>{


            //get array of markers currently in cluster
            let allMarkers = this.markers;

            //final position for marker, could be updated if another marker already exists in same position
            let finalLatLng = new google.maps.LatLng(analog.latitude, analog.longitude);

            //check to see if any of the existing markers match the latlng of the new marker
            if (allMarkers.length != 0) {
                for (let i=0; i < allMarkers.length; i++) {
                    var existingMarker = allMarkers[i];
                    var pos = existingMarker.getPosition();

                    //if a marker already exists in the same position as this marker
                    if (finalLatLng.equals(pos)) {
                        //update the position of the coincident marker by applying a small multipler to its coordinates
                        var newLat = finalLatLng.lat() + (Math.random() -.5) / 1200;// * (Math.random() * (max - min) + min);
                        var newLng = finalLatLng.lng() + (Math.random() -.5) / 1200;// * (Math.random() * (max - min) + min);
                        finalLatLng = new google.maps.LatLng(newLat,newLng);
                    }
                }
            }

           // const coordinate = new google.maps.LatLng(analog.latitude, analog.longitude);
            let color;
            if(analog.isDepr){
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
                position: finalLatLng,
                icon: icon,
                animation: google.maps.Animation.DROP,
                
            });
   
            const infowindow = new google.maps.InfoWindow({
                content: `
                <div style="margin-top: 5px;">Адрес: ${analog.fulladdress ? analog.fulladdress:'Н/Д'}</div>
                <div style="margin-top: 5px;">Тип ремонта: ${analog.conditiontype ? analog.conditiontype:'Н/Д'}</div>
                <div style="margin-top: 5px;">Вход: ${analog.entrance ? analog.entrance:'Н/Д'}</div>
                <div style="margin-top: 5px;">Линия застройки: ${analog.houselinetype ? analog.entrance:'Н/Д'}</div>
                <div style="margin-top: 5px;">Площадь: ${analog.totalarea ? analog.totalarea.toLocaleString('ru-RU') :'Н/Д' } м²</div>
                <div style="margin-top: 5px;">Наличие витринных окон: ${analog.hasshopwindows=='true' ? 'есть':'нет'}</div>
                <div style="margin-top: 5px;">Тип здания: ${analog.isbuildingliving=='true' ? 'жилой':'нежилой'}</div>
                <div style="margin-top: 5px;">Этаж: ${analog.floornumber ? analog.floornumber:'Н/Д'}</div>
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
        let mcOptions = {
            gridSize: 15, 
            maxZoom: 15,
            imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
        };
        //this.markerCluster = new MarkerClusterer(this.map, this.markers,mcOptions);
      
        // var markerCluster = new markerCluster(this.map, this.markers,
        //     {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
        this.map.fitBounds(bounds); 
        this.map.panToBounds(bounds); 
		
    }
    
}
