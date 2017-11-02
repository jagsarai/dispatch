import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, AlertController} from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';



@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  user: any;
  userEmail: string;
  userPassword: string;
  loading: any;

  constructor(public navCtrl: NavController, public authService: AuthProvider, public loadingCtrl: LoadingController, public alertCtrl:AlertController) {
  }

  ionViewWillLoad(){
      this.authService.checkAuthentication().then(() => {
         this.navCtrl.setRoot("LandingPage");
      }).catch((err) => {
      });
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
          this.user = result['user'];
          this.loading.dismiss();

          if(this.user.firstLogin === true){
            this.navCtrl.setRoot('ChangePasswordPage', {user: this.user});
          }
          else if(this.user.firstLogin === false && this.user.role === 'admin'){
              this.navCtrl.setRoot('HomePage');
          }
          else{
              this.navCtrl.setRoot('DriverHomePage');
          }
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

    showPasswordResetPage(){
        this.navCtrl.setRoot('PasswordResetPage');
    }

}
