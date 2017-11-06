import { Component } from '@angular/core';
import { IonicPage, ViewController, AlertController, LoadingController } from 'ionic-angular';
import {  TruckProvider } from '../../providers/truck/truck';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';


@IonicPage()
@Component({
  selector: 'page-truck-modal',
  templateUrl: 'truck-modal.html',
})
export class TruckModalPage {

  trucksData:any;
  // truckMapData:any;
  trucks:any;
  searchTerm:string = '';
  searchControl: FormControl;
  truckConfirmControl: FormControl;
  searching: any = false;
  searchingTruckNumbers: any = false;
  createToggle: any = true;
  truckNumberMatch: any = false;
  loading: any;
  truckYear:string;
  truckMake:string;
  truckModel:string;
  truckNumber:string = '';

  constructor(public viewCtrl: ViewController, public truckService: TruckProvider, public alertCtrl: AlertController, public loadingCtrl:LoadingController) {
    this.searchControl = new FormControl();
    this.truckConfirmControl = new FormControl();
  }

  ionViewDidLoad() {
    //get the truck data
    this.truckService.getTrucks().then((data) => {
      //set the data to local var.
      this.trucksData = data;
      //filter all the truck numbers
      this.filterTruckNumbers();
      //create obseravle on the search field. 
      this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
        this.searching = false;
        this.filterTruckNumbers();
      })
    }).catch((err) => {
      let prompt = this.alertCtrl.create({
        title: 'Error',
        message: 'There was an error getting the truck data, please try again',
        buttons:[
          {
            text:'Ok',
            handler: () => {
              this.viewCtrl.dismiss();
            }
          }
        ]
      });
      prompt.present();
    });
    //create obserable on the truck confirm input 
    this.truckConfirmControl.valueChanges.debounceTime(700).subscribe(search => {
      this.checkTruckNumberCreateInput();
    })

  }

  //check if truck number is already located in our local object.
  checkTruckNumberCreateInput(){
    for(let truck of this.trucks){
      if(truck.number.toString() === this.truckNumber){
        return this.truckNumberMatch = true;
      }
      
    }
    return this.truckNumberMatch = false;
  }

  onSearchInput(){
    this.searching = true;
  }

  filterTruckNumbers(){
    this.trucks = this.trucksData.filter((truck) => {
      return truck.number.toString().indexOf(this.searchTerm) > -1;
    })
  }

  closeTruckModal(){
    this.viewCtrl.dismiss();
  }

  addNewTruck(){
   let truck = {
      make: this.truckMake,
      model: this.truckModel,
      year: this.truckYear,
      number: parseInt(this.truckNumber),
    }

    let prompt = this.alertCtrl.create({
      title: 'Add Truck# ' + truck.number,
      message: 'Are you sure you want to create and add truck# ' + truck.number + "?",
      buttons:[
        {
          text: 'Cancel',
        },
        {
          text: 'Yes',
          handler:() => {
            console.log("Truck inside of handlder", truck);
            this.showLoader();
                //Remove from database
            this.truckService.createTruck(truck).then((result) => {
        
              this.loading.dismiss();
              //Pass back to create load page
              console.log("truck created: ", result);
              this.viewCtrl.dismiss(result); 
        
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

  addExistingTruck(truck){
    let prompt = this.alertCtrl.create({
      title: 'Add Truck# ' + truck.number,
      message: 'Are you sure you want to add truck# ' + truck.number + "?",
      buttons:[
        {
          text: 'Cancel',
        },
        {
          text: 'Yes',
          handler:() => {
            console.log("Truck inside of handlder", truck);
            //Pass back to create load page
            this.viewCtrl.dismiss(truck); 
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
