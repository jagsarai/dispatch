import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';

/**
 * Generated class for the DriverHomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-driver-home',
  templateUrl: 'driver-home.html',
})
export class DriverHomePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthProvider) {
  }

  ionViewDidLoad() {
    this.authService.role !== "driver" && this.authService.role !== null ? this.navCtrl.setRoot("LandingPage") : console.log("User is driver");
    console.log('ionViewDidLoad DriverHomePage');
  }

  logout(){
    this.authService.logout();
    this.navCtrl.setRoot("LandingPage");
  }


}
