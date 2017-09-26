import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';


@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  loading: any;

  userEmail: string;
  userPassword: string;
  userRole: string;
  userName: string;
  userPhone: string;
  userConfPassword: string;

  constructor(public navCtrl: NavController, public authService: AuthProvider, public loadingCtrl: LoadingController) {
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

    this.authService.createAccount(details).then((result) => {
      this.loading.dismiss();
      console.log(result);
      this.navCtrl.setRoot('HomePage');
    }, (err) => {
        this.loading.dismiss();
        alert("There was an error with the form request, Please try again");
    });

  }
    
  showLoader(){

    this.loading = this.loadingCtrl.create({
      content: 'Authenticating...'
    });

    this.loading.present();
  }
    
}
