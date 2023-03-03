import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EventService } from 'src/app/services/event.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';


declare var google;
import * as nsfwjs from 'nsfwjs'

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss'],
})
export class AddEventComponent implements OnInit {
  
  @ViewChild("selectedImage") selectedImage: any ;

  title: string;
  description: string;
  userId: string;
  image: any;
  firstname: string;
  lastname: string;
  userData: any;
  public myDate;

  map: any;
  address:string;
  lat: string;
  long: string;  
  autocomplete: { input: string; };
  autocompleteItems: any[];
  location: any;
  placeid: any;
  GoogleAutocomplete: any;

  constructor(
    private modalCtrl: ModalController,
    private eventService: EventService,
    private auth: AuthenticationService,
    private loadingController: LoadingController,
		private alertController: AlertController,
    private toastController: ToastController,
    public zone: NgZone,
  ) {
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
   }

  ngOnInit() {
    this.getUserData();
  }


  UpdateSearchResults(){
    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
    (predictions, status) => {
      this.autocompleteItems = [];
      this.zone.run(() => {
        predictions.forEach((prediction) => {
          this.autocompleteItems.push(prediction);
        }); 
      });
    });
  }
  
  //wE CALL THIS FROM EACH ITEM.
  SelectSearchResult(item) {
    ///WE CAN CONFIGURE MORE COMPLEX FUNCTIONS SUCH AS UPLOAD DATA TO FIRESTORE OR LINK IT TO SOMETHING
    //alert(JSON.stringify(item))   
    this.address = item.description 
    this.autocompleteItems = []
  }
  
  
  //lET'S BE CLEAN! THIS WILL JUST CLEAN THE LIST WHEN WE CLOSE THE SEARCH BAR.
  ClearAutocomplete(){
    this.autocompleteItems = []
    this.autocomplete.input = ''
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

  async uploadImage() {
    const loading = await this.loadingController.create({message: "Checking for inappropriate content..."});
    this.image = await Camera.getPhoto({
			quality: 90,
			allowEditing: true,
			resultType: CameraResultType.Uri,
			source: CameraSource.Photos // Camera, Photos or Prompt!
		});
    await loading.present();
    console.log(this.image);
    var img = new Image();
    img.src = this.image.webPath;
    nsfwjs.load().then(async (model) => {
      // Classify the image.
      model.classify(img).then((predictions) => {
        console.log("Predictions", predictions);
        if ((predictions[0].className === "Neutral" && predictions[1].className === "Drawing") || (predictions[0].className === "Drawing" && predictions[1].className === "Neutral") || (predictions[0].className === "Drawing" && predictions[0].probability > 0.9) || (predictions[0].className === "Neutral" && predictions[0].probability > 0.75)) {
          loading.dismiss();
          this.getBase64ImageFromUrl(this.image.webPath).then((data) => {
            this.image = data;
          });
            
        } else {
          loading.dismiss();
          this.image = undefined;
          alert("Please select another Image, inappropriate content found!");
        }
        
      });
    });
    

    
  }

  async getBase64ImageFromUrl(imageUrl) {
    var res = await fetch(imageUrl);
    var blob = await res.blob();
  
    return new Promise((resolve, reject) => {
      var reader  = new FileReader();
      reader.addEventListener("load", function () {
          resolve(reader.result);
      }, false);
  
      reader.onerror = () => {
        return reject(this);
      };
      reader.readAsDataURL(blob);
    })
  }

  async addEvent() {
    if (this.image) {
      if (this.description && this.title) {
        const loading = await this.loadingController.create();
        await loading.present();


        const result = await this.eventService.addEvent(this.title, this.description, this.userId, this.image, this.firstname, this.lastname, this.myDate, this.address);
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
