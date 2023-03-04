import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map,first } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Photo } from '@capacitor/camera';
import { arrayUnion } from '@angular/fire/firestore'
import { arrayRemove } from '@angular/fire/firestore'

@Injectable({
  providedIn: 'root'
})
export class EventService {
  storageRef: any;

  constructor(
    private af: AngularFirestore, private storage: AngularFireStorage) { }

  async addEvent(title: string, des: string, userId: string, cameraFile: string, firstname: string, lastname: string, date: string, address: string, genre: any) {
    
    try {
      console.log(cameraFile);
      const id = this.af.collection('events').ref.doc().id;
      const path = `eventImages/${id}.png`;
      console.log(path);
      this.storageRef = this.storage.ref(path);
      console.log("storage", this.storageRef);
			await this.storageRef.putString(cameraFile, 'data_url');
			const imageUrl = await this.storageRef.getDownloadURL().toPromise();
			console.log("imageUrl", imageUrl);
      
      this.af.collection('events').doc(id).set({
        title: title,
        description: des,
        image: imageUrl,
        firstname: firstname,
        lastname:  lastname,
        date: date,
        address: address,
        genre: genre
      })
      this.af.collection('users').doc(userId).update({
        events: arrayUnion(id)
      })
			return true;
		} catch (e) {
      console.log(e);
			return null;
		}
  }

  async getEvents() {
    const snapchot = await this.af.collection('events').ref.get();
        return new Promise <Event[]> (resolve => {
            const v = snapchot.docs.map((x:any) => {
                const obj = x.data();
                obj.id = x.id;
                return obj as Event;
            });
            resolve(v);
        });
  }

  async getUserEvents(docId: string) {
    return this.af.collection('events').doc(docId).valueChanges().pipe(first()).toPromise();
  }

  async removeUserEvents(docId: string, userId: string) {
    await this.af.collection('events').doc(docId).delete(); 
    const path = `eventImages/${docId}.png`;
    this.storageRef = this.storage.ref(path);
    await this.storageRef.delete();
    return this.af.collection('users').doc(userId).update({
      events: arrayRemove(docId)
    })
  }

  async updateUserEventList(events: string[]=[], userId: string) {
    this.af.collection('users').doc(userId).set({
      events: arrayRemove()
    })

  }
  
  //return this.af.collection('users').doc(`${userId}`).valueChanges().pipe(first()).toPromise();







}
