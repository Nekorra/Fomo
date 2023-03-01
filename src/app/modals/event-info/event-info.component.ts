import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-event-info',
  templateUrl: './event-info.component.html',
  styleUrls: ['./event-info.component.scss'],
})
export class EventInfoComponent implements OnInit {

  myList = [];
  index: number;

  constructor(
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
    console.log(this.myList);
  }

  async dismissModal() {
    
    this.modalCtrl.dismiss();
    
  }

}
