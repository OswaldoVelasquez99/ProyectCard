import { Injectable } from '@angular/core';
import firebase from "firebase"
import { User } from "src/app/interfaces/User"

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  storage : firebase.storage.Storage;
  ref: firebase.storage.Reference;

  constructor() { 
    this.storage = firebase.storage();
    this.ref = this.storage.ref("user_image")
  }

  saveUserImage(user: User, base64Image: string) {
    return this.ref.child(`${user.uid}/${user.uid}.jpeg`).putString(base64Image,"data_url")
  }
}
