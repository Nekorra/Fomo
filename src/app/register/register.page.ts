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


  register() {
    if (this.registerPassword === this.registerPassword2) {
      this.authService.register(this.registerEmail, this.registerPassword).then((data) => {
        console.log(data);
        this.router.navigate(['home']);
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
      this.router.navigate(['home']);
    }).catch((err) => {
      alert(err);
    });
  }


}
