import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { storage, initializeApp} from 'firebase';
import { FIREBASE_CONFIG } from '../app/firebase.config';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  // rootPage:string = "UploadModalPage";
  rootPage:string = "LandingPage";

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      initializeApp(FIREBASE_CONFIG);
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

