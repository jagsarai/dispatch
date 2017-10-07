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

  constructor(public navCtrl: NavController, public navParams: NavParams, public shipperService:ShipperProvider, public receiverService:ReceiverProvider, public modalCtrl:ModalController, public alertCtrl:AlertController, public loadingCtrl:LoadingController, public loadService:LoadProvider) {
    this.load = navParams.get("Load");
    this.status = this.load.status;
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

    this.isLoadDelivered();
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
    let status = {
      id: this.load.id,
      status: this.status
    }

    let prompt = this.alertCtrl.create({
      title: 'Update Load# ' + this.load.id,
      message: 'Are you sure you want to update this load?',
      buttons:[
        {
          text: 'Cancel',
        },
        {
          text: 'Yes',
          handler:() => {
            console.log("Load inside of handlder", status);
            this.isLoadUpdated();
            this.showLoader();
            //Update to the database
            this.loadService.updateLoad(status).then((result) => {
        
              this.loading.dismiss();
              //Pass back to home page
              this.navCtrl.setRoot('DriverHomePage');
        
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
    if(this.status === this.load.status){
        this.navCtrl.setRoot("DriverHomePage");
      }
  }
  
  showLoader(){
    this.loading = this.loadingCtrl.create({
      content: 'Loading...'
    });
    this.loading.present();
  }

  isLoadDelivered(){
    if(this.load.status === 'delivered'){
      this.showStatusEditButton = false;
    }
  }
}
  