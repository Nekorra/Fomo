import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EventService } from 'src/app/services/event.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { MapboxServiceService, Feature } from 'src/app/services/mapbox-service.service';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss'],
})
export class AddEventComponent implements OnInit {
  
  title: string;
  description: string;
  userId: string;
  image: any;
  firstname: string;
  lastname: string;
  userData: any;
  addresses: string[] = [];
  selectedAddress = null;
  public myDate;
  constructor(
    private modalCtrl: ModalController,
    private eventService: EventService,
    private auth: AuthenticationService,
    private loadingController: LoadingController,
		private alertController: AlertController,
    private toastController: ToastController,
    private mapboxService: MapboxServiceService
  ) { }

  ngOnInit() {
    this.getUserData();
  }

  async getUserData() {
    await this.auth.getUser().then((data: any) => {
      console.log(data);
      this.userId = data.uid;
    })
    this.userData = await this.auth.getUserData(this.userId);
    console.log(this.userData); 
    this.firstname = this.userData.firstname;
    this.lastname = this.userData.lastname;
    this.userId = this.userData.userId;
  }



  async dismissModal() {
    
    this.modalCtrl.dismiss();
    
  }



  showdate(){
    console.log(this.myDate);
  }

  search(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    if (searchTerm && searchTerm.length > 0) {
      this.mapboxService
        .search_word(searchTerm)
        .subscribe((features: Feature[]) => {
          this.addresses = features.map(feat => feat.place_name);
        });
      } else {
        this.addresses = [];
      }
  }

  onSelect(address: string) {
    this.selectedAddress = address;
    this.addresses = [];
  }

  async uploadImage() {
    
    this.image =  await Camera.getPhoto({
			quality: 90,
			allowEditing: false,
			resultType: CameraResultType.Base64,
			source: CameraSource.Photos // Camera, Photos or Prompt!
		});
    console.log(this.image);
   
  }

  async addEvent() {
    if (this.image) {
      if (this.description && this.title) {
        const loading = await this.loadingController.create();
        await loading.present();
  
        const result = await this.eventService.addEvent(this.title, this.description, this.userId, this.image, this.firstname, this.lastname, this.myDate);
        loading.dismiss();
        
        if (!result) {
          const alert = await this.alertController.create({
            header: 'Post failed',
            message: 'There was a problem posting your event',
            buttons: ['OK']
          });
          await alert.present();
        }
        if (result) {
          const toast = await this.toastController.create({
            message: 'Post Successfully posted!',
            duration: 2000,
          });
          toast.present();
          this.dismissModal();
        }
      } else {
        const alert = await this.alertController.create({
          header: 'Post Failed',
          message: 'Not all blanks were filled'
        })
        await alert.present();
      }

		} else {
      const alert = await this.alertController.create({
        header: 'Post Failed',
        message: 'Please upload an image'
      })
      await alert.present();
    }

  } 

}
