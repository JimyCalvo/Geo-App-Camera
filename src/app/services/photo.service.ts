import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { Platform } from '@ionic/angular';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { readFile } from 'fs';
import {
  AngularFireDatabase,
  AngularFireList,
  AngularFireObject,
} from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  public photos: UserPhoto[] = [];
  private PHOTO_STORAGE: string = 'photos';
  private platform: Platform;

  constructor(
    platform: Platform,

  ) {
    this.platform = platform;

  }
  //  -------------------------------------------------------------------------------
  public async addNewToGallery() {


    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,

    });

    var imageUrl = capturedPhoto.webPath;
    Preferences.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos),
    });



    const savedImageFile = await this.savePicture(capturedPhoto);
    this.photos.unshift(savedImageFile);


  }
  //  -------------------------------------------------------------------------------
  private async savePicture(photo: Photo) {
    const position = await Geolocation.getCurrentPosition();
    const metadata = {
      customMetadata: {
      'contentType': 'image/jpeg',
      'location': position.coords.latitude + "," + position.coords.longitude,
      'latitude': position.coords.latitude + " ",
      'longitude': position.coords.longitude+ " ",
      'altitude': position.coords.altitude+ " ",
      'heading': position.coords.heading+ " ",
      'speed': position.coords.speed+ " ",
      }
    };
    


    const base64Data = await this.readAsBase64(photo);
    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data

    });


    const storage = getStorage();
    const storageRef = ref(storage, fileName);
    console.log(savedFile);

    
//-------------------------------------------------------------


    const file = await (await fetch(photo.webPath!)).blob();
    const uploadTask = uploadBytes(storageRef, file, metadata);
    
    const urlPhoto=(await uploadTask).ref.parent;
    console.log(urlPhoto);
    
   


    if (this.platform.is('hybrid')) {




      return {
        filepath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri),
      };
    }
    else {

      return {
        filepath: fileName,
        webviewPath: photo.webPath
      };
    }
  }
  //  -------------------------------------------------------------------------------
  private async readAsBase64(photo: Photo) {
    if (this.platform.is('hybrid')) {
      const file = await Filesystem.readFile({
        path: photo.path!
      });

      return file.data;
    }
    else {
      const response = await fetch(photo.webPath!);
      const blob = await response.blob();
      return await this.convertBlobToBase64(blob) as string;
    }
  }
  //  -------------------------------------------------------------------------------
  private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  //  -------------------------------------------------------------------------------
  public async loadSaved() {
    // Retrieve cached photo array data
    const { value } = await Preferences.get({ key: this.PHOTO_STORAGE });
    this.photos = (value ? JSON.parse(value) : []) as UserPhoto[];
    if (!this.platform.is('hybrid')) {
      for (let photo of this.photos) {

        const readFile = await Filesystem.readFile({
          path: photo.filepath,
          directory: Directory.Data
        });

        photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
      }
    }
  }


}

export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}

