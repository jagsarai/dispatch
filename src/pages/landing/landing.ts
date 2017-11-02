import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { CallNumber } from '@ionic-native/call-number';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-landing',
  templateUrl: 'landing.html',
})
export class LandingPage {

  loading: any;
  user: any;

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public authService: AuthProvider, private callNumber:CallNumber, public storage:Storage) {
  }

  ionViewWillLoad() {
    this.showLoader();
      //Check if already authenticated
      this.authService.checkAuthentication().then((res) => {
          this.loading.dismiss();
          this.storage.get('user').then((user) => {
            this.user = user;
            if(this.user.firstLogin === true){
              this.navCtrl.setRoot('ChangePasswordPage', {user: this.user})
            }
            else if(this.user.role === "admin" && this.user.role !== null){
              this.navCtrl.setRoot('HomePage');
            }
            else{
              this.navCtrl.setRoot('DriverHomePage');
            }
          }).catch((err) => {
            this.loading.dismiss();
          })
      }).catch((err) => {
        this.loading.dismiss();
      });
  }

  sendToLogin(){
    this.navCtrl.push("LoginPage");
  }
  
  sendToRegister(){
    this.navCtrl.push("RegisterPage");
  }

  showLoader(){
    
    this.loading = this.loadingCtrl.create({
        content: 'Loading...'
    });

    this.loading.present();
  }

}
