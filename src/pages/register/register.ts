import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, AlertController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';


@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  loading: any;
  // user: any;
  userEmail: string;
  userPassword: string = '';
  userRole: string;
  userName: string;
  userPhone: string;
  userConfPassword: string = '';
  passwordConfrimControl: FormControl;
  passwordControl: FormControl;
  passwordMissMatch: any = false;
  userConfPasswordMissMatch: any = false;

  constructor(public navCtrl: NavController, public authService: AuthProvider, public loadingCtrl: LoadingController, public alertCtrl:AlertController) {
    this.passwordConfrimControl = new FormControl();
    this.passwordControl = new FormControl();
  }

  ionViewDidLoad(){
    //create obseravle on the confirm password form input.
    this.passwordConfrimControl.valueChanges.debounceTime(700).subscribe(search => {
      //check upon each value change if the confirm password input matches the password input.
      this.checkPasswordMatch(this.userConfPassword);
    });
    //create obseravle on the password form input.
    this.passwordControl.valueChanges.debounceTime(700).subscribe(search => {
      //check upon each value change if the password input matches the confrim password input.
      this.checkPasswordMatch(this.userPassword);
    })
  }

  register(){
    this.showLoader();

    let details = {
        email: this.userEmail,
        password: this.userPassword,
        role: this.userRole,
        name: this.userName,
        phone: this.userPhone
    };
    //create the user
    this.authService.createAccount(details).then((result) => {
        this.loading.dismiss();
        //check user role and send them to appropritate page. 
        this.authService.user.role === "admin" ? this.navCtrl.setRoot('HomePage') : this.navCtrl.setRoot("DriverHomePage");     
    }).catch((err) => {
        this.loading.dismiss();
        let prompt = this.alertCtrl.create({
          title: 'Registration Failed!',
          message: err,
          buttons:[
              {
              text: 'Ok'
              }
          ]
        })
        prompt.present();
    });

  }
    
  showLoader(){
    this.loading = this.loadingCtrl.create({
      content: 'Authenticating...'
    });
    this.loading.present();
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
    
}
