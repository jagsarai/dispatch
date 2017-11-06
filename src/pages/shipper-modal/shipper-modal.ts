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
    //get all the receivers from the database. 
    this.shipperService.getShippers().then((data) => {
      //set the respnonse data to local var.
      this.shipperData = data;
      console.log("Shipper Data", this.shipperData);
      this.filterShipperName();
       //create an observable on the search bar. 
      this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
        this.searching = false;
        this.filterShipperName();
      })
    }).catch((err) => {
      let prompt = this.alertCtrl.create({
        title: 'Error',
        message: 'There was an error fetching the shippers, please try again',
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
    //create an obserable on the receiver address input 
    this.shipperAddressConfirmControl.valueChanges.debounceTime(700).subscribe(search => {
      this.checkShipperAddressCreateInput();
    });
    //create an obserable on the receiver name input
    this.shipperNameConfirmControl.valueChanges.debounceTime(700).subscribe(search => {
      this.checkShipperNameCreateInput();
    })
  }

  filterShipperName(){
    this.shippers = this.shipperData.filter((shipper) => {
      return shipper.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
    });
  }

  //check if address already exists in local shipper object.
  checkShipperAddressCreateInput(){
    console.log("checkShipperAddress function fired");
    for(let shipper of this.shippers){
      if(shipper.address.toLowerCase() === this.shipperAddress.toLowerCase()){
        return this.shipperAddressMatch = true;
      }
      
    }
    return this.shipperAddressMatch = false;
  }

  //check if name already exists in local shipper object.
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
      name: this.toTitleCase(this.shipperName),
      address: this.toTitleCase(this.shipperAddress), 
      city: this.toTitleCase(this.shipperCity),
      state: this.shipperState,
      zipCode: parseInt(this.shipperZipCode)
    } 

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
            this.showLoader();
            this.shipperService.createShipper(shipper).then((result) => {
        
              this.loading.dismiss();
              //Pass back to create load page
              this.viewCtrl.dismiss(result); 
        
            }).catch((err) => {
              this.loading.dismiss();
              let prompt = this.alertCtrl.create({
                title: 'Error',
                message: err,
                buttons:[
                  {
                    text:'Ok'
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

  addExistingShipper(shipper){
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
            //Pass back to create load page.
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

  //make sure we have title cased format for all our inputed data. 
  toTitleCase(str){
    return str.replace(/[A-z]\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  }

}
