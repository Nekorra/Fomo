import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})  
export class RegisterPage implements OnInit {

  loginEmail: string;
  loginPassword: string;

  registerEmail: string;
  registerPassword: string;
  registerPassword2: string;
  firstname: string;
  lastname: string;
  number: string;

  @ViewChild('flipcontainer', { static: false }) flipcontainer: ElementRef;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private loadingController: LoadingController,
		private alertController: AlertController,
    private toastController: ToastController,
    private platform: Platform
  ) { }

  async ngOnInit() {
    this.platform.ready().then(async (data) => {
      const { value } = await Preferences.get({ key: 'loggedIn' });
      if(value == 'true') {
        const loading = await this.loadingController.create();
        await loading.present();
        this.router.navigate(["/tabs"])
        loading.dismiss()
    }
    });
    
  }

  next(slides) {
    slides.slideNext()
  }

  toggleRegister() {
    this.flipcontainer.nativeElement.classList.toggle('flip');
  }


  async register() {
    const loading = await this.loadingController.create();
    await loading.present();
    console.log(this.registerEmail, this.firstname, this.lastname, this.number)
    if (this.registerPassword == this.registerPassword2) {
      await this.authService.register(this.registerEmail, this.registerPassword, this.firstname, this.lastname, this.number).then(async (data:any) => {
        await Preferences.set({
          key: 'loggedIn',
          value: 'true',
        });
        loading.dismiss()
        this.router.navigate(["/tabs"])
      }).catch(async (err) => {
        loading.dismiss();
        let toast = await this.toastController.create({
          message: `Cannot sign-up an account. ${err.message}`,
          duration: 3000,
          position: 'bottom'
        });
        toast.present();

      });

    } else {
      loading.dismiss()
      alert('Passwords do not match');
    }
    
  }

  async login() {
    const loading = await this.loadingController.create();
    await loading.present();
    this.authService.login(this.loginEmail, this.loginPassword).then(async (data) => {
      console.log(data);
      await Preferences.set({
        key: 'loggedIn',
        value: 'true',
      });
      loading.dismiss();
      this.router.navigate(["/tabs"])
    }).catch(async (err) => {
      loading.dismiss();
      let toast = await this.toastController.create({
        message: `Cannot sign-up an account. ${err.message}`,
        duration: 3000,
        position: 'bottom'
      });
      toast.present();

    });
  }


}
