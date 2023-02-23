import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

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
  ) { }

  ngOnInit() {

  }

  toggleRegister() {
    this.flipcontainer.nativeElement.classList.toggle('flip');
  }


  async register() {
    const loading = await this.loadingController.create();
    await loading.present();
    console.log(this.registerEmail, this.firstname, this.lastname, this.number)
    if (this.registerPassword == this.registerPassword2) {
      await this.authService.register(this.registerEmail, this.registerPassword, this.firstname, this.lastname, this.number).then((data:any) => {
        loading.dismiss()
        this.router.navigate(["/tabs"])
      }).catch((err) => {
        alert(err);  
      });
    } else {
      loading.dismiss()
      alert('Passwords do not match');
    }
    
  }

  async login() {
    const loading = await this.loadingController.create();
    await loading.present();
    this.authService.login(this.loginEmail, this.loginPassword).then((data) => {
      console.log(data);
      loading.dismiss();
      this.router.navigate(["/tabs"])
    }).catch((err) => {
      loading.dismiss();
      alert(err);
    });
  }


}
