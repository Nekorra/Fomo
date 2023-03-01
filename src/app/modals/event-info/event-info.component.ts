import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LaunchNavigator, LaunchNavigatorOptions } from '@awesome-cordova-plugins/launch-navigator/ngx';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-event-info',
  templateUrl: './event-info.component.html',
  styleUrls: ['./event-info.component.scss'],
})
export class EventInfoComponent implements OnInit {

  myList = [];
  index: number;
  lat: any;
  long: any;

  constructor(
    private modalCtrl: ModalController,
    private launchNavigator: LaunchNavigator
  ) { }

  


  async ngOnInit() {
    console.log(this.myList);
    const coordinates = await Geolocation.getCurrentPosition({enableHighAccuracy: true});
    this.lat = coordinates.coords.latitude;
    this.long = coordinates.coords.longitude; 
  }

  async dismissModal() {
    
    this.modalCtrl.dismiss();
    
  }

  navigate() {
    const options: LaunchNavigatorOptions = {
      start: [this.lat, this.long],
      launchModeGoogleMaps: 'turn-by-turn',
    }
    this.launchNavigator.navigate(this.myList[this.index].address, options)
    .then(
    success => console.log('Launched navigator'),
    error => console.log('Error launching navigator', error)
  );
  }

}
