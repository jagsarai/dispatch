import { Component } from '@angular/core';
import { IonicPage, ViewController, AlertController, LoadingController } from 'ionic-angular';
import { FormControl } from '@angular/forms';
import { DriverProvider } from '../../providers/driver/driver';
import 'rxjs/add/operator/debounceTime';
import {mailGun} from 'mailgun-js'; 

@IonicPage()
@Component({
  selector: 'page-driver-modal',
  templateUrl: 'driver-modal.html',
})


export class DriverModalPage {

  driverData:any;
  drivers:any;
  searchTerm:string = '';
  searchControl: FormControl;
  driverEmailConfirmControl: FormControl;
  driverPhoneConfirmControl: FormControl;
  searching: any = false;
  searchingDriverName: any = false;
  createToggle: any = true;
  driverEmailMatch: any = false;
  driverPhoneMatch: any = false;
  loading: any;
  driverName:string;
  driverPhone:string = '';
  driverEmail:string = '';
  
  constructor(public viewCtrl: ViewController, public driverService:DriverProvider, public alertCtrl: AlertController, public loadingCtrl:LoadingController) {
    this.searchControl = new FormControl();
    this.driverEmailConfirmControl = new FormControl();
    this.driverPhoneConfirmControl = new FormControl();
  }

  ionViewDidLoad() {
    // Get the list of the drivers
    this.driverService.getDrivers().then((data) => {
      this.driverData = data;
      this.filterDriverNames();
      this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
        this.searching = false;
        this.filterDriverNames();
      })
    }).catch((err) => {
      let prompt = this.alertCtrl.create({
        title: 'Error',
        message:'There was an error fetching the list of drivers, please try again.',
        buttons:[
          {
            text: 'Ok'
          }
        ]
      });
      prompt.present();
    });
    this.driverEmailConfirmControl.valueChanges.debounceTime(700).subscribe(search => {
      this.checkDriverEmailCreateInput();
    });
    this.driverPhoneConfirmControl.valueChanges.debounceTime(700)
    .subscribe(search =>{
      this.checkDriverPhoneCreateInput();
    });
  }

  closeDriverModal(){
    this.viewCtrl.dismiss();
  }

  filterDriverNames(){
    this.drivers = this.driverData.filter((driver) => {
      return driver.name.indexOf(this.searchTerm) > -1;
    })
  }

  checkDriverEmailCreateInput(){
    for(let driver of this.drivers){
      if(driver.email.toLowerCase() === this.driverEmail.toLowerCase()){
        return this.driverEmailMatch = true;
      }
    }
    return this.driverEmailMatch = false;
  }

  checkDriverPhoneCreateInput(){
    for(let driver of this.drivers){
      if(driver.phone.toString() === this.driverPhone){
        return this.driverPhoneMatch = true;
      }
      
    }
    return this.driverPhoneMatch = false;
  }

  onSearchInput(){
    this.searching = true;
  }

  addNewDriver(){
    let driver = {
       name: this.driverName.toString(),
       email: this.driverEmail.toString(),
       password: Math.random().toString(36).slice(-8),
       phone: this.driverPhone.toString(),
       firstLogin: 'true'
     }
 
     let prompt = this.alertCtrl.create({
       title: 'Add Driver ' + driver.name,
       message: 'Are you sure you want to create and add ' + driver.name + "?",
       buttons:[
         {
           text: 'Cancel',
         },
         {
           text: 'Yes',
           handler:() => {
             this.showLoader();
             this.driverService.createDriver(driver).then((driver) => {
         
               this.loading.dismiss();
               //Pass back to create load page
               this.viewCtrl.dismiss(driver); 
         
             }).catch((err) => {
               this.loading.dismiss();
               this.alertCtrl.create({
                 title: 'Driver Create Error',
                 message: 'There was an error creating the driver, please try again.',
                 buttons: [
                   {
                     text: 'Ok'
                   }
                 ]
               });
               prompt.present();
             });
           }
         }
       ]
     });
     prompt.present();
   }

   addExistingDriver(driver){
    let prompt = this.alertCtrl.create({
      title: 'Add Driver ' + driver.name,
      message: 'Are you sure you want to add ' + driver.name + "?",
      buttons:[
        {
          text: 'Cancel',
        },
        {
          text: 'Yes',
          handler:() => {
            //Pass back to create load page
            this.viewCtrl.dismiss(driver); 
          }
        }
      ]
    });
    prompt.present();
  }

   showLoader(){
    this.loading = this.loadingCtrl.create({
      content: 'Loading...'
    });
    this.loading.present();
  }

}
