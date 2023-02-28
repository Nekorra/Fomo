import { Component, OnInit } from '@angular/core';
import { EventService } from '../services/event.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AlertController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  userId: string;
  userData: any;
  userEvents: string[] = [];
  events: any[] = [];
  firstname: string;

  constructor(
    private eventService: EventService,
    private auth: AuthenticationService,
		private alertController: AlertController,
    private router: Router,
    private toastController: ToastController,

  ) { }

  async ngOnInit() {
   
  } 

  async ionViewWillEnter() {
    await this.getUserEventData();
  }

  logout() {
    this.auth.logout().then(async (data) => {
      await Preferences.set({
        key: 'loggedIn',
        value: 'false',
      });
      this.router.navigate(["/register"])
      let toast = await this.toastController.create({
        message: 'successfully Logged Out!',
        duration: 2000,
        position: 'bottom'
      });
      toast.present();
    });
  }

  async getUserData() {
    await this.auth.getUser().then((data: any) => {
      console.log(data);
      this.userId = data.uid;
    })
    this.userData = await this.auth.getUserData(this.userId);
    console.log(this.userData); 
    this.firstname = this.userData.firstname;
  }

  async getUserEventData() {
    this.events = [];
    this.userEvents = [];
    await this.getUserData();    
    await this.getUserEvents();
    for (let i = 0; i < this.userEvents.length; i++) {
      const x = await this.eventService.getUserEvents(this.userEvents[i])
      this.events.push(x);
    }
    console.log("events", this.userEvents);
  }

  async getUserEvents() {
    for (let i = 0; i < Object.keys(this.userData.events).length; i++) {
      this.userEvents.push(this.userData.events[i]);
    }
    return this.userEvents;
  }

  async removeEvent(index: number) {
    let alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: 'Do you want to delete this event?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Delete',
          handler: () => {
            this.handler(index);   
           
          }
        }
      ]
    });
    await alert.present();

  }

  async handler(index: number) {
    const eventToRemove = this.userEvents[index];
    await this.eventService.removeUserEvents(eventToRemove, this.userId);
    this.getUserEventData();
  }

}
