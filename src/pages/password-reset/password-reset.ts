import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'page-password-reset',
  templateUrl: 'password-reset.html',
})
export class PasswordResetPage {
  userEmail:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public authService:AuthProvider, public alertCtrl:AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PasswordResetPage');
  }

  resetPassword(){
    let email = {
      email: this.userEmail
    }
    this.authService.resetPassword(email).then((result)=>{
      console.log(result);
      let prompt = this.alertCtrl.create({
        title: "Reset Password",
        message: "Your password has been reset, please check your email for further instructions",
        buttons:[
          {
            text: 'Ok',
            handler: () => {
              this.navCtrl.setRoot("LandingPage");
            }
          }
        ]
      });
      prompt.present()
    }).catch((err) => {
      console.log(err);
      let prompt = this.alertCtrl.create({
        title: "Reset Password Error",
        message: err._body,
        buttons:[
          {
            text: 'Ok'
          }
        ]
      });
      prompt.present()
    })
  }

}
