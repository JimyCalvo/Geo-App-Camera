// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import { initializeApp } from "firebase/app";

export const environment = {
  firebase: {
    projectId: 'ionic-camera-gps',
    appId: '1:427641220878:web:f6320a06c55b831c3f715f',
    databaseURL: 'https://ionic-camera-gps-default-rtdb.firebaseio.com',
    storageBucket: 'ionic-camera-gps.appspot.com',
    locationId: 'us-central',
    apiKey: 'AIzaSyC9KuB2MbVqv2jaktuv-Yevcmi7Fz457Gw',
    authDomain: 'ionic-camera-gps.firebaseapp.com',
    messagingSenderId: '427641220878',
    measurementId: 'G-7P6F9H11XM',
  },
  production: false
};
const app = initializeApp(environment.firebase);
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
