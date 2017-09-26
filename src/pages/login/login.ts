import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';


/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  userEmail: string;
  userPassword: string;
  loading: any;

  constructor(public navCtrl: NavController, public authService: AuthProvider, public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
    
    login(){

      this.showLoader();

      let credentials = {
          email: this.userEmail,
          password: this.userPassword
      };

      console.log("Email inside login function " + this.userEmail);
      console.log("password inside login function " + this.userPassword);
      
      this.authService.login(credentials).then((result) => {
          this.loading.dismiss();
          console.log(result);
          this.navCtrl.setRoot('HomePage');
      }, (err) => {
          this.loading.dismiss();
          console.log(err);
      });

    }
    
    launchSignup(){
        this.navCtrl.push("RegisterPage");
    }
    
    showLoader(){

      this.loading = this.loadingCtrl.create({
          content: 'Loading...'
      });

      this.loading.present();
  }

}
