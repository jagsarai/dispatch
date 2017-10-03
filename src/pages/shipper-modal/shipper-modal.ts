import { Component } from '@angular/core';
import { IonicPage, ViewController, AlertController, LoadingController } from 'ionic-angular';
import { FormControl } from '@angular/forms';
import { ShipperProvider } from '../../providers/shipper/shipper';
import 'rxjs/add/operator/debounceTime';

@IonicPage()
@Component({
  selector: 'page-shipper-modal',
  templateUrl: 'shipper-modal.html',
})
export class ShipperModalPage {

  shipperData:any;
  shippers:any;
  searchTerm:string = '';
  searchControl: FormControl;
  shipperAddressConfirmControl: FormControl;
  shipperNameConfirmControl: FormControl;
  searching: any = false;
  createToggle: any = true;
  shipperAddressMatch: any = false;
  shipperNameMatch: any = false;
  loading: any;
  shipperName:string = '';
  shipperAddress:string = '';
  shipperCity:string;
  shipperState:string;
  shipperZipCode:string;

  constructor(public viewCtrl: ViewController, public alertCtrl: AlertController, public loadingCtrl:LoadingController, public shipperService:ShipperProvider) {
    this.searchControl = new FormControl();
    this.shipperAddressConfirmControl = new FormControl();
    this.shipperNameConfirmControl = new FormControl();
  }

  ionViewDidLoad() {
    this.shipperService.getShippers().then((data) => {
      this.shipperData = data;
      console.log("Shipper Data", this.shipperData);
      this.filterShipperName();
      this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
        this.searching = false;
        this.filterShipperName();
      })
    }, (err) => {
      console.log("There was an error with the request");
    });
    this.shipperAddressConfirmControl.valueChanges.debounceTime(700).subscribe(search => {
      this.checkShipperAddressCreateInput();
    });
    this.shipperNameConfirmControl.valueChanges.debounceTime(700).subscribe(search => {
      this.checkShipperNameCreateInput();
    })
  }

  filterShipperName(){
    this.shippers = this.shipperData.filter((shipper) => {
      return shipper.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
    });
  }

  checkShipperAddressCreateInput(){
    console.log("checkShipperAddress function fired");
    for(let shipper of this.shippers){
      if(shipper.address.toLowerCase() === this.shipperAddress.toLowerCase()){
        return this.shipperAddressMatch = true;
      }
      
    }
    return this.shipperAddressMatch = false;
  }

  checkShipperNameCreateInput(){
    console.log("checkDriverName function fired");
    for(let shipper of this.shippers){
      if(shipper.name.toLowerCase() === this.shipperName.toLowerCase()){
        return this.shipperNameMatch = true;
      }
      
    }
    return this.shipperNameMatch = false;
  }

  onSearchInput(){
    this.searching = true;
  }

  addNewShipper(){
    let shipper = {
      name: this.shipperName,
      address: this.shipperAddress, 
      city: this.shipperCity,
      state: this.shipperState,
      zipCode: parseInt(this.shipperZipCode)
    } 
    console.log("name", shipper.name);
    console.log("address", shipper.address);
    console.log("city", shipper.city);
    console.log("state", shipper.state);

    let prompt = this.alertCtrl.create({
      title: 'Add shipper ' + shipper.name,
      message: 'Are you sure you want to create and add ' + shipper.name + "?",
      buttons:[
        {
          text: 'Cancel',
        },
        {
          text: 'Yes',
          handler:() => {
            console.log("Shipper inside of handlder", shipper);
            this.showLoader();
                //Remove from database
            this.shipperService.createShipper(shipper).then((result) => {
        
              this.loading.dismiss();
              //Pass back to create load page
              console.log("shipper created: ", result);
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

  addExistingShipper(shipper){
    // this.truck = truck
    let prompt = this.alertCtrl.create({
      title: 'Add Shipper ' + shipper.name,
      message: 'Are you sure you want to add ' + shipper.name + "?",
      buttons:[
        {
          text: 'Cancel',
        },
        {
          text: 'Yes',
          handler:() => {
            console.log("Shipper inside of handlder", shipper);
            //Pass back to create load page
            this.viewCtrl.dismiss(shipper); 
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

  closeShipperModal(){
    this.viewCtrl.dismiss();
  }

}
