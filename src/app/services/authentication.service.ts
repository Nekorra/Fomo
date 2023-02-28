import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { first } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { arrayUnion } from 'firebase/firestore';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private afAuth: AngularFireAuth,
    private af: AngularFirestore
  ) { }

  async register(email: string, password: string, firstname: string, lastname: string, number: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password).then((user) => {
      this.af.collection('users').doc(`${user.user.uid}`).set({
        email: email,
        firstname: firstname,
        lastname: lastname,
        number: number,
        userId: user.user.uid,
        events: arrayUnion()
      })
    });
  }


  login(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this.afAuth.signOut();
  }
  
  getUser() {
    return this.afAuth.authState.pipe(first()).toPromise();
  }

  async getUserData(userId: string) {
    return this.af.collection('users').doc(`${userId}`).valueChanges().pipe(first()).toPromise();
  }


}
