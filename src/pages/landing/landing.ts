import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';

/**
 * Generated class for the LandingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-landing',
  templateUrl: 'landing.html',
})
export class LandingPage {

  loading: any;

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public authService: AuthProvider) {
  }

  sendToLogin(){
    this.navCtrl.push("LoginPage");
  }
  
  sendToRegister(){
    this.navCtrl.push("RegisterPage");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LandingPage');

    this.showLoader();
           //Check if already authenticated
      this.authService.checkAuthentication().then((res) => {
          console.log("Already authorized");
          this.loading.dismiss();
          
            this.authService.role === "admin" ? this.navCtrl.setRoot('HomePage') : this.navCtrl.setRoot('DriverHomePage'); 
      }, (err) => {
          console.log("Not already authorized");
          this.loading.dismiss();
      });
  }

  showLoader(){
    
    this.loading = this.loadingCtrl.create({
        content: 'Loading...'
    });

    this.loading.present();
  }

}
