import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddEventComponent } from '../modals/add-event/add-event.component';
import { EventService } from '../services/event.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  myList = [];

  constructor(
    private modalCtrl: ModalController,
    private eventService: EventService
  ) {}


  ngOnInit() {
    
  }

  async ionViewWillEnter() {
    this.getEvents();
  }

  
  async openModal() {
    console.log("test")
    const modal = await this.modalCtrl.create({
      component: AddEventComponent,
      componentProps: { 
        
      }
    });
    modal.onDidDismiss().then((data) => {
      this.getEvents();
    })
    await modal.present();
  }

  async getEvents() {
    this.myList = await this.eventService.getEvents();
    console.log(this.myList);
  };


}
