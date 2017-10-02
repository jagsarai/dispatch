import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Modal, AlertController, LoadingController } from 'ionic-angular';
import { LoadProvider } from '../../providers/load/load';

@IonicPage()
@Component({
  selector: 'page-load-edit',
  templateUrl: 'load-edit.html',
})
export class LoadEditPage {
  load:any;
  driver:any;
  truck:any;
  shipper:any;
  receiver:any;
  truckModalReturned: any = false;
  driverModalReturned: any = false;
  shipperModalReturned: any = false;
  receiverModalReturned: any = false;
  createFormComplete: any = false;
  loading: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadService: LoadProvider, public modalCtrl:ModalController, public alertCtrl: AlertController, public loadingCtrl:LoadingController){
    this.load = navParams.get("Load");
    this.driver = this.load.driver;
    this.shipper = this.load.shipper;
    this.receiver = this.load.receiver;
    this.truck  = this.load.truck;
  }

  ionViewDidLoad() {
    this.checkValidForm();
  }

  showTruckModal(){
    const truckModal:Modal = this.modalCtrl.create('TruckModalPage',) 

    truckModal.present();
    truckModal.onDidDismiss((truck) => {
      if(truck){
        this.truck = truck;
        this.truckModalReturned = true
      }
      this.checkValidForm();
    });
  }

  showDriverModal(){
    const driverModal:Modal = this.modalCtrl.create('DriverModalPage',) 

    driverModal.present();
    driverModal.onDidDismiss((driver) => {
      if(driver){
        this.driver = driver;
        this.driverModalReturned = true;
      }
      this.checkValidForm();
    });
  }

  showShipperModal(){
    const shipperModal:Modal = this.modalCtrl.create('ShipperModalPage',) 

    shipperModal.present();
    shipperModal.onDidDismiss((shipper) => {
      if(shipper){
        this.shipper = shipper;
        this.shipperModalReturned = true;
      }
      this.checkValidForm();
    });
  }

  showReceiverModal(){
    const receiverModal:Modal = this.modalCtrl.create('ReceiverModalPage',) 

    receiverModal.present();
    receiverModal.onDidDismiss((receiver) => {
      if(receiver){
        this.receiver = receiver;
        this.receiverModalReturned = true;
      }
      this.checkValidForm();
    });
  }

  checkValidForm(){
    if(this.driver !== undefined && this.shipper !== undefined && this.receiver !== undefined && this.truck !== undefined){
      this.createFormComplete = true;
    }
  }

  isLoadUpdated(){
    if(this.driver === this.load.driver &&
      this.shipper === this.load.shipper &&
      this.receiver === this.load.receiver &&
      this.truck  === this.load.truck){
        this.navCtrl.setRoot("HomePage");
      }
    
  }

  updateLoad(){

    console.log("Driver inside updateLoad function", this.driver);
    console.log("Shipper inside updateLoad function", this.shipper);
    console.log("Receiver inside updateLoad function", this.receiver);    
    console.log("Truck inside updateLoad function", this.truck);

    let load = {
      id: parseInt(this.load.id),
      userId: parseInt(this.driver.id),
      shipperId: parseInt(this.shipper.id),
      receiverId: parseInt(this.receiver.id),
      truckId: parseInt(this.truck.id)
    }

    console.log("loadId inside updateLoad function", load.id);
    console.log("userId inside updateLoad function", load.userId);
    console.log("shipperId inside updateLoad function", load.shipperId);
    console.log("receiverId inside updateLoad function", load.receiverId);
    console.log("truckId inside updateLoad function", load.truckId);

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
            console.log("Load inside of handlder", load);
            this.isLoadUpdated();
            this.showLoader();
            //Update to the database
            this.loadService.updateLoad(load).then((result) => {
        
              this.loading.dismiss();
              //Pass back to home page
              this.navCtrl.setRoot('HomePage');
        
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

  showLoader(){
    this.loading = this.loadingCtrl.create({
      content: 'Loading...'
    });
    this.loading.present();
  }
}
