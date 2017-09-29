import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {  ReceiverProvider } from '../../providers/receiver/receiver';
import {  ShipperProvider } from '../../providers/shipper/shipper';
import {  TruckProvider } from '../../providers/truck/truck';


/**
 * Generated class for the LoadDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

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
  

  constructor(public navCtrl: NavController, public navParams: NavParams, public shipperService: ShipperProvider, public receiverService: ReceiverProvider, public truckService: TruckProvider) {
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

}
