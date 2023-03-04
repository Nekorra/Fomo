import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddEventComponent } from '../modals/add-event/add-event.component';
import { EventInfoComponent } from '../modals/event-info/event-info.component';
import { EventService } from '../services/event.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  myList = [];
  genres = [];
  events = [];
  option = {
    slidesPerView: 1.2,
		spaceBetween: 10,
		freeMode: true
  }

  

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

  async openEventInfo(index: any, key: any, indexInside) {
    console.log("test")
    const modal = await this.modalCtrl.create({
      component: EventInfoComponent,
      componentProps: { 
        myList: this.events,
        index: index,
        indexInside: indexInside,
        key: key,
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
    this.genres = [];
    this.getGenres();
    this.sort();
  };

  async getGenres() {
    for (let i = 0; i < this.myList.length; i++) {
      if(!this.genres.includes(this.myList[i].genre))
      this.genres.push(this.myList[i].genre);
    }
    console.log(this.genres);
  }

  async sort() {
    this.events = [];
    for (let i = 0; i < this.genres.length; i++) {
      let z = []
      for (let x = 0; x < this.myList.length; x++) {
        if (this.myList[x].genre == this.genres[i]) {
          z.push(this.myList[x])
        }
      }
      console.log("z", z);
      this.events.push({[this.genres[i]]: z})
    }
    console.log(this.events);
    console.log(this.events[0].hasOwnProperty('food'))
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      this.getEvents();
      event.target.complete();
    }, 2000);
  };


}
