import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Modal, ModalController, AlertController, LoadingController } from 'ionic-angular';
import {  ReceiverProvider } from '../../providers/receiver/receiver';
import {  ShipperProvider } from '../../providers/shipper/shipper';
import { LoadProvider } from '../../providers/load/load';

@IonicPage()
@Component({
  selector: 'page-driver-load-details',
  templateUrl: 'driver-load-details.html',
})
export class DriverLoadDetailsPage {
  load: any;
  shippers: Array<any> = [];
  receivers: Array<any> = [];
  status:any;
  statusModalReturned:any = false;
  loading:any;
  showStatusEditButton: any = true;
  loadAccepted:boolean = false;
  loadRejected:boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public shipperService:ShipperProvider, public receiverService:ReceiverProvider, public modalCtrl:ModalController, public alertCtrl:AlertController, public loadingCtrl:LoadingController, public loadService:LoadProvider) {
    this.load = navParams.get("Load");
    this.status = this.load.status;
    this.loadAccepted = this.load.loadAccepted;
    this.loadRejected = this.load.loadRejected;
  }

  ionViewDidLoad() {
    //get shipper details from database
    this.shipperService.retriveShipper(this.load.ShipperId).then((shipper) => {
      this.shippers.push(shipper);
    }, (err) => {
      console.log(err);
    })
    //get reciever details from database
    this.receiverService.retriveReceiver(this.load.ReceiverId).then((receiver) => {
      this.receivers.push(receiver);
    }, (err) => {
      console.log(err);
    });

    this.isLoadCompleted();
  }

  showStatusModal(){
    const status = this.status;
    const statusModal:Modal = this.modalCtrl.create('StatusModalPage', {status: status})

    statusModal.present();
    statusModal.onDidDismiss((status) => {
      if(status){
        // If the status of the load has been changed we set the new status
        if(this.status !== status){
          this.status = status;
          // If the status of the load matches the load status in the database, we set the status model retured to false
          if(this.status === this.load.status){
            return this.statusModalReturned = false; 
          }
          this.statusModalReturned = true;
        }
      }
    })
  }

  updateLoad(){
    // Check to see if the load is being updated, rejected, or accepted
    let updateWord = 'update'
    if(this.status === 'assigned' && this.loadAccepted === false){
      updateWord = 'reject'
    }
    if(this.status === 'dispatched' && this.loadAccepted === true){
      updateWord = 'accept'
    }

    let updatedStatus = {
      id: this.load.id,
      status: this.status,
      loadAccepted: this.loadAccepted,
      loadRejected: this.loadRejected
    }

    let prompt = this.alertCtrl.create({
      title: `${updateWord} load#${this.load.id}`,
      message: `Are you sure you want to ${updateWord} this load?`,
      buttons:[
        {
          text: 'Cancel',
          handler:() => {
            this.status = this.load.status
            this.loadAccepted = this.load.loadAccepted
          }
        },
        {
          text: 'Yes',
          handler:() => {
            this.isLoadUpdated();
            this.showLoader();
            //Update to the database
            this.loadService.updateLoad(updatedStatus).then((result) => {
        
              this.loading.dismiss();
              //Pass back to home page
              this.navCtrl.setRoot('DriverHomePage', {
                loadAccepted: this.loadAccepted
              });
        
            }).catch((err) => {
              this.loading.dismiss();
                let prompt = this.alertCtrl.create({
                  title: 'Error updating load',
                  message: 'There was an error updating the load, please try again.',
                  buttons: [
                    {
                      text: 'Ok'
                    }
                  ]
                })
                prompt.present();
            });
          }
        }
      ]
    });
    prompt.present();
  }

  isLoadUpdated(){
    if(this.status === this.load.status && this.loadAccepted === this.load.loadAccepted){
        this.navCtrl.setRoot("DriverHomePage", {
          loadAccepted: this.loadAccepted 
        });
      }
  }
  
  showLoader(){
    this.loading = this.loadingCtrl.create({
      content: 'Loading...'
    });
    this.loading.present();
  }

  isLoadCompleted(){
    if(this.load.status === 'completed'){
      this.showStatusEditButton = false;
    }
  }

  rejectLoad(){
    this.status = 'assigned';
    this.loadAccepted = false;
    this.loadRejected = true;
    this.updateLoad();
  }
  
  acceptLoad(){
    this.status = 'dispatched';
    this.loadAccepted = true;
    this.loadRejected = false;
    this.updateLoad();
  }


}
  