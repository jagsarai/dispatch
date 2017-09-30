import { Component } from '@angular/core';
import { IonicPage, ViewController, AlertController, LoadingController } from 'ionic-angular';
import { FormControl } from '@angular/forms';
import { DriverProvider } from '../../providers/driver/driver';
import 'rxjs/add/operator/debounceTime';

/**
 * Generated class for the DriverModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-driver-modal',
  templateUrl: 'driver-modal.html',
})


export class DriverModalPage {

  driverData:any;
  driverMapData:any;
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
  driverPhone:string;
  driverEmail:string;
  driverTempPassword:string = '';

  constructor(public viewCtrl: ViewController, public driverService:DriverProvider, public alertCtrl: AlertController, public loadingCtrl:LoadingController) {
    this.searchControl = new FormControl();
    this.driverEmailConfirmControl = new FormControl();
    this.driverPhoneConfirmControl = new FormControl();
  }

  ionViewDidLoad() {
    this.driverService.getDrivers().then((data) => {
      this.driverData = data;
      console.log("Driver data", this.driverData);
      this.filterDriverNames();
      this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
        this.searching = false;
        this.filterDriverNames();
      })
    }, (err) => {
      console.log("There was an error with the request");
    });
    this.driverEmailConfirmControl.valueChanges.debounceTime(700).subscribe(search => {
      this.checkDriverEmailCreateInput();
    });
    this.driverPhoneConfirmControl.valueChanges.debounceTime(700)
    .subscribe(search =>{
      this.checkDriverPhoneCreateInput();
    })
  }

  closeDriverModal(){
    // const driver = {
    //   name: ""
    // }
    this.viewCtrl.dismiss();
  }

  filterDriverNames(){
    this.drivers = this.driverData.filter((driver) => {
      return driver.name.indexOf(this.searchTerm) > -1;
    })
  }

  checkDriverEmailCreateInput(){
    console.log("checkDriverEmail function fired");
    for(let driver of this.drivers){
      if(driver.email === this.driverEmail){
        return this.driverEmailMatch = true;
      }
      
    }
    return this.driverEmailMatch = false;
  }

  checkDriverPhoneCreateInput(){
    console.log("checkDriverPhone function fired");
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
       password: this.driverTempPassword.toString(),
       phone: this.driverPhone.toString()
     }
     console.log("name", driver.name);
     console.log("email", driver.email);
     console.log("password", driver.password);
     console.log("phone", driver.phone);
 
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
             console.log("Driver inside of handlder", driver);
             this.showLoader();
                 //Remove from database
             this.driverService.createDriver(driver).then((result) => {
         
               this.loading.dismiss();
               //Pass back to create load page
               this.viewCtrl.dismiss(driver); 
         
             }, (err) => {
               this.loading.dismiss();
                 console.log(err, "not allowed");
             });
           }
         }
       ]
     });
     prompt.present();
   }

   addExistingDriver(driver){
    // this.truck = truck
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
            console.log("Driver inside of handlder", driver);
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
