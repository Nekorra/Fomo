import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LaunchNavigator, LaunchNavigatorOptions } from '@awesome-cordova-plugins/launch-navigator/ngx';

@Component({
  selector: 'app-event-info',
  templateUrl: './event-info.component.html',
  styleUrls: ['./event-info.component.scss'],
})
export class EventInfoComponent implements OnInit {

  myList = [];
  index: number;
  indexInside: number;
  key: any;


  constructor(
    private modalCtrl: ModalController,
    private launchNavigator: LaunchNavigator
  ) { }

  


  async ngOnInit() {
    console.log(this.myList, this.index, this.key, this.indexInside);
  }

  async dismissModal() {
    
    this.modalCtrl.dismiss();
    
  }

  navigate() {

    this.launchNavigator.navigate(this.myList[this.index][this.key][this.indexInside].address)
    .then(
    success => console.log('Launched navigator'),
    error => console.log('Error launching navigator', error)
  );
  }

}
