import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import {  ReceiverProvider } from '../../providers/receiver/receiver';
import {  ShipperProvider } from '../../providers/shipper/shipper';
import {  TruckProvider } from '../../providers/truck/truck';
import { LoadProvider } from '../../providers/load/load';


@IonicPage()
@Component({
  selector: 'page-load-details',
  templateUrl: 'load-details.html',
})
export class LoadDetailsPage {
  load: any;
  shippers: Array<any> = [];
  receivers: Array<any> = [];
  trucks: Array<any> = [];
  loading: any;
  

  constructor(public navCtrl: NavController, public navParams: NavParams, public shipperService: ShipperProvider, public receiverService: ReceiverProvider, public truckService: TruckProvider, public alertCtrl:AlertController, public loadingCtrl: LoadingController, public loadService: LoadProvider) {
    this.load = navParams.get("Load");
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
    }, (err) => {
      console.log(err);
    })

    this.truckService.retriveTruck(this.load.TruckId).then((truck) => {
      this.trucks.push(truck);
    }, (err) => {
      console.log(err);
    })
  }

  showLoadEditPage(){
    this.navCtrl.push('LoadEditPage',{
      Load: {
        id: this.load.id,
        driver: this.load.driver,
        shipper: this.shippers[0],
        receiver: this.receivers[0],
        truck: this.trucks[0]
      }
    })
  }

  deleteLoad(){
    
    let prompt = this.alertCtrl.create({
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete this load?',
      buttons:[
        {
          text: 'Cancel',
        },
        {
          text: 'Yes',
          handler: (load) => {
            this.showLoader();
                //Remove from database
                this.loadService.deleteLoad(this.load.id).then((result) => {
            
                  this.loading.dismiss();
                  
                  this.navCtrl.setRoot('HomePage');
            
                }, (err) => {
                  this.loading.dismiss();
                    console.log("not allowed");
                });
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
