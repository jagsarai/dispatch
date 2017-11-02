import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormControl } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { AuthProvider } from '../../providers/auth/auth';
import 'rxjs/add/operator/debounceTime';

@IonicPage()
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {
  user: any;
  userPassword: any;
  userConfPassword: string = '';
  passwordConfrimControl: FormControl;
  passwordControl: FormControl;
  passwordMissMatch: any = false;
  userConfPasswordMissMatch: any = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthProvider, public alertCtrl:AlertController) {
    this.passwordConfrimControl = new FormControl();
    this.passwordControl = new FormControl();
  }

  ionViewWillLoad() {
    this.user = this.navParams.get('user');
    if(this.user === undefined){
      this.navCtrl.setRoot('LandingPage');
    }
    console.log(this.user);
  }
  ionViewDidLoad(){
    this.passwordConfrimControl.valueChanges.debounceTime(700).subscribe(search => {
      this.checkPasswordMatch(this.userConfPassword);
    });
    this.passwordControl.valueChanges.debounceTime(700).subscribe(search => {
      this.checkPasswordMatch(this.userPassword);
    })
  }

  checkPasswordMatch(password){
    if(password !== this.userConfPassword){
      this.passwordMissMatch = true;
    }
    else if(password !== this.userPassword){
      this.userConfPasswordMissMatch = true;
    }
    else{
      this.passwordMissMatch = false;
      this.userConfPasswordMissMatch = false;
    }
  }

  changePassword(){
    this.user.password = this.userPassword;
    this.authService.changePassword(this.user).then((user) => {
      let prompt = this.alertCtrl.create({
        title: "Password Changed!",
        message: "Your password has been successfully changed.",
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
          title: "Change Password Error",
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
