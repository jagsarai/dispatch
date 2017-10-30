import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { CallNumber } from '@ionic-native/call-number';

@IonicPage()
@Component({
  selector: 'page-landing',
  templateUrl: 'landing.html',
})
export class LandingPage {

  loading: any;

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public authService: AuthProvider, private callNumber:CallNumber) {
  }

  sendToLogin(){
    this.navCtrl.push("LoginPage");
  }
  
  sendToRegister(){
    this.navCtrl.push("RegisterPage");
  }

  ionViewDidLoad() {
    this.showLoader();
      //Check if already authenticated
      this.authService.checkAuthentication().then((res) => {
          this.loading.dismiss();
          this.authService.role === "admin" && this.authService.role !== null ? this.navCtrl.setRoot('HomePage') : this.navCtrl.setRoot('DriverHomePage'); 
      }).catch((err) => {
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
