import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
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
    private router: Router
  ) { }

  ngOnInit() {

  }

  toggleRegister() {
    this.flipcontainer.nativeElement.classList.toggle('flip');
  }


  async register() {
    console.log(this.registerEmail, this.firstname, this.lastname, this.number)
    if (this.registerPassword == this.registerPassword2) {
      await this.authService.register(this.registerEmail, this.registerPassword, this.firstname, this.lastname, this.number).then((data:any) => {
        this.router.navigate(["/tabs"])
      }).catch((err) => {
        alert(err);  
      });
    } else {
      alert('Passwords do not match');
    }
    
  }

  login() {
    this.authService.login(this.loginEmail, this.loginPassword).then((data) => {
      console.log(data);
      this.router.navigate(["/tabs"])
    }).catch((err) => {
      alert(err);
    });
  }


}
