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
    console.log('ionViewDidLoad LandingPage');

    this.showLoader();
           //Check if already authenticated
      this.authService.checkAuthentication().then((res) => {
          console.log("Already authorized");
          this.loading.dismiss();
          
            this.authService.role === "admin" && this.authService.role !== null ? this.navCtrl.setRoot('HomePage') : this.navCtrl.setRoot('DriverHomePage'); 
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

  // call(){
  //   this.callNumber.callNumber('1234567890', true).then(() => {
  //     console.log("dailer fired")
  //   }).catch(() => {
  //     console.log("dailer failed")
  //   })
  // }

}
