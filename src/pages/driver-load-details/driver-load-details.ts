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
    this.shipperService.retriveShipper(this.load.ShipperId).then((shipper) => {
      this.shippers.push(shipper);
      console.log("Shipper is", shipper);
    }, (err) => {
      console.log(err);
    })

    this.receiverService.retriveReceiver(this.load.ReceiverId).then((receiver) => {
      this.receivers.push(receiver);
      console.log("Receiver is", receiver);
    }, (err) => {
      console.log(err);
    });

    this.isLoadCompleted();
  }

  showStatusModal(){
    const status = this.status;
    console.log("inside show status", status);
    const statusModal:Modal = this.modalCtrl.create('StatusModalPage', {status: status})

    statusModal.present();
    statusModal.onDidDismiss((status) => {
      if(status){
        if(this.status !== status){
          this.status = status;
          console.log("status", this.status)
          if(this.status === this.load.status){
            console.log("status after return", this.status);
            return this.statusModalReturned = false; 
          }
          this.statusModalReturned = true;
        }
      }
      console.log("statusModal:", this.statusModalReturned);
    })
  }

  updateLoad(){
    let updateWord = 'update'
    if(this.status === 'assigned' && this.loadAccepted === false){
      updateWord = 'reject'
    }
    if(this.status !== 'assigned' && this.loadAccepted === true){
      updateWord = 'accept'
    }

    let updatedStatus = {
      id: this.load.id,
      status: this.status,
      loadAccepted: this.loadAccepted,
      loadRejected: this.loadRejected
    }

    console.log("this is the update status", updatedStatus);

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
            console.log("Load inside of handlder", updatedStatus);
            this.isLoadUpdated();
            this.showLoader();
            //Update to the database
            this.loadService.updateLoad(updatedStatus).then((result) => {
        
              this.loading.dismiss();
              //Pass back to home page
              this.navCtrl.setRoot('DriverHomePage', {
                loadAccepted: this.loadAccepted
              });
        
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
    this.loadAccepted = true;
    this.loadRejected = false;
    this.updateLoad();
  }


}
  