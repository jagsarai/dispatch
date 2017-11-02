import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormControl } from '@angular/forms';
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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.passwordConfrimControl = new FormControl();
    this.passwordControl = new FormControl();
  }

  ionViewWillLoad() {
    this.user = this.navParams.get('user');
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
}
