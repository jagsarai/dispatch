import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Modal } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { TruckProvider } from "../../providers/truck/truck";
import { ShipperProvider } from "../../providers/shipper/shipper";
import { ReceiverProvider } from "../../providers/receiver/receiver";
import { DriverProvider } from "../../providers/driver/driver";

/**
 * Generated class for the LoadCreatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-load-create',
  templateUrl: 'load-create.html',
})
export class LoadCreatePage {

  driver: any;
  truck: any;
  shipper: any;
  receiver: any;
  truckModalReturned: any = false;
  driverModalReturned: any = false;
  shipperModalReturned: any = false;
  receiverModalReturned: any = false;

  drivers: Array<any> = [];
  trucks: Array<any> = [];
  shippers: Array<any> = [];
  receivers: Array<any> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public truckService: TruckProvider, public shipperService: ShipperProvider, public driverService: DriverProvider, public authService: AuthProvider, public modalCtrl:ModalController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoadCreatePage');
  }

  showTruckModal(){
    const truckModal:Modal = this.modalCtrl.create('TruckModalPage',) 

    truckModal.present();
    truckModal.onDidDismiss((truck) => {
      this.truck = truck;
      this.truckModalReturned = true;
    })
  }

  showDriverModal(){
    const driverModal:Modal = this.modalCtrl.create('DriverModalPage',) 

    driverModal.present();
  }

  showShipperModal(){
    const shipperModal:Modal = this.modalCtrl.create('ShipperModalPage',) 

    shipperModal.present();
  }

  showReceiverModal(){
    const receiverModal:Modal = this.modalCtrl.create('ReceiverModalPage',) 

    receiverModal.present();
  }


}
