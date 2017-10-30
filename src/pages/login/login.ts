import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, AlertController} from 'ionic-angular';
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

  constructor(public navCtrl: NavController, public authService: AuthProvider, public loadingCtrl: LoadingController, public alertCtrl:AlertController) {
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

      this.authService.login(credentials).then((result) => {
          this.loading.dismiss();
    
          this.authService.role === "admin" ? this.navCtrl.setRoot('HomePage') : this.navCtrl.setRoot('DriverHomePage');  
      }).catch((err) => {
            this.loading.dismiss();
            if(err.status === 401){
                let prompt = this.alertCtrl.create({
                    title: 'Login Failed',
                    message: err.json().error,
                    buttons:[
                        {
                        text: 'Ok'
                        }
                    ]
                })
                prompt.present();
            }
            else{
                let prompt = this.alertCtrl.create({
                    title: 'Something Went Wrong',
                    message: 'Something went wrong while logging you in, please try again later.',
                    buttons:[
                        {
                        text: 'Ok'
                        }
                    ]
                })
                prompt.present();
            }
      });

    }
    
    showLoader(){

      this.loading = this.loadingCtrl.create({
          content: 'Loading...'
      });

      this.loading.present();
  }

}
