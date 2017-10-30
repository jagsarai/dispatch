import { Component } from '@angular/core';
import { IonicPage, ViewController, AlertController, LoadingController } from 'ionic-angular';
import { FormControl } from '@angular/forms';
import { ReceiverProvider } from '../../providers/receiver/receiver';
import 'rxjs/add/operator/debounceTime';

@IonicPage()
@Component({
  selector: 'page-receiver-modal',
  templateUrl: 'receiver-modal.html',
})
export class ReceiverModalPage {

  receiverData:any;
  receivers:any = [];
  searchTerm:string = '';
  searchControl: FormControl;
  receiverAddressConfirmControl: FormControl;
  receiverNameConfirmControl: FormControl;
  searching: any = false;
  createToggle: any = true;
  receiverAddressMatch: any = false;
  receiverNameMatch: any = false;
  loading: any;
  receiverName:string = '';
  receiverAddress:string = '';
  receiverCity:string;
  receiverState:string;
  receiverZipCode:string;

  constructor(public viewCtrl: ViewController, public alertCtrl: AlertController, public loadingCtrl:LoadingController, public receiverService:ReceiverProvider) {
    this.searchControl = new FormControl();
    this.receiverAddressConfirmControl = new FormControl();
    this.receiverNameConfirmControl = new FormControl();
  }

  ionViewDidLoad() {
    this.receiverService.getReceivers().then((data) => {
      this.receiverData = data;
      this.filterReceiverName();
      this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
        this.searching = false;
        this.filterReceiverName();
      })
    }).catch((err) => {
      let prompt = this.alertCtrl.create({
        title: 'Error',
        message: 'There was an error fetching the recievers, please try again',
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
    this.receiverAddressConfirmControl.valueChanges.debounceTime(700).subscribe(search => {
      this.checkReceiverAddressCreateInput();
    });
    this.receiverNameConfirmControl.valueChanges.debounceTime(700).subscribe(search => {
      this.checkReceiverNameCreateInput();
    })
  }

  filterReceiverName(){
    this.receivers = this.receiverData.filter((receiver) => {
      return receiver.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
    });
  }

  checkReceiverAddressCreateInput(){
    for(let receiver of this.receivers){
      if(receiver.address.toLowerCase() === this.receiverAddress.toLowerCase()){
        return this.receiverAddressMatch = true;
      }
      
    }
    return this.receiverAddressMatch = false;
  }

  checkReceiverNameCreateInput(){
    for(let receiver of this.receivers){
      if(receiver.name.toLowerCase() === this.receiverName.toLowerCase()){
        return this.receiverNameMatch = true;
      }
      
    }
    return this.receiverNameMatch = false;
  }

  onSearchInput(){
    this.searching = true;
  }

  addNewReceiver(){
    let receiver = {
      name: this.toTitleCase(this.receiverName),
      address: this.toTitleCase(this.receiverAddress), 
      city: this.toTitleCase(this.receiverCity),
      state: this.receiverState,
      zipCode: parseInt(this.receiverZipCode)
    }   

    let prompt = this.alertCtrl.create({
      title: 'Add receiver ' + receiver.name,
      message: 'Are you sure you want to create and add ' + receiver.name + "?",
      buttons:[
        {
          text: 'Cancel',
        },
        {
          text: 'Yes',
          handler:() => {
            this.showLoader();
            this.receiverService.createReceiver(receiver).then((result) => {
        
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

  addExistingReceiver(receiver){
    let prompt = this.alertCtrl.create({
      title: 'Add receiver ' + receiver.name,
      message: 'Are you sure you want to add ' + receiver.name + "?",
      buttons:[
        {
          text: 'Cancel',
        },
        {
          text: 'Yes',
          handler:() => {
            this.viewCtrl.dismiss(receiver); 
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

  closeReceiverModal(){
    this.viewCtrl.dismiss();
  }

  toTitleCase(str){
    return str.replace(/[A-z]\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  }

}
