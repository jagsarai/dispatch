import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Modal, AlertController, LoadingController } from 'ionic-angular';
import { LoadProvider } from '../../providers/load/load';

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
  pickup = {
    date: '',
    time: ''
  }
  delivery = {
    date: '',
    time: ''
  }

  truckModalReturned: any = false;
  driverModalReturned: any = false;
  shipperModalReturned: any = false;
  receiverModalReturned: any = false;
  createFormComplete: any = false;
  pickupDateModalReturned: any = false;
  deliveryDateModalReturned: any = false;
  loading: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadService: LoadProvider, public modalCtrl:ModalController, public alertCtrl: AlertController, public loadingCtrl:LoadingController) {
  }

  ionViewDidLoad() {
    this.checkValidForm();
  }

  showPickupDateModal(){
    const message = {
      event: "Pickup"
    }
    const dateModal:Modal = this.modalCtrl.create('DateModalPage',{message: message})

    dateModal.present();
    dateModal.onDidDismiss((date) => {
      if(date){
        console.log("date returned from pickup", date);
        this.pickup.date = date.date;
        this.pickup.time = date.time;
        this.pickupDateModalReturned = true;
      }
      this.checkValidForm();
    });
  }


  showDeliveryDateModal(){
    const message ={
      event: "Delivery"
    }
    const dateModal:Modal = this.modalCtrl.create('DateModalPage', {message: message})

    dateModal.present();
    dateModal.onDidDismiss((date) => {
      if(date){
        console.log("date returned from delivery", date);
        this.delivery.date = date.date;
        this.delivery.time = date.time;
        this.deliveryDateModalReturned = true;
      }
      this.checkValidForm();
    });
  }

  showTruckModal(){
    const truckModal:Modal = this.modalCtrl.create('TruckModalPage') 

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
    const driverModal:Modal = this.modalCtrl.create('DriverModalPage') 

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
    const shipperModal:Modal = this.modalCtrl.create('ShipperModalPage') 

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
    const receiverModal:Modal = this.modalCtrl.create('ReceiverModalPage') 

    receiverModal.present();
    receiverModal.onDidDismiss((receiver) => {
      if(receiver){
        this.receiver = receiver;
        this.receiverModalReturned = true;
      }
      this.checkValidForm();
    });
  }

  createLoad(){
    console.log("Driver inside createLoad function", this.driver);
    console.log("Shipper inside createLoad function", this.shipper);
    console.log("Receiver inside createLoad function", this.receiver);    
    console.log("Truck inside createLoad function", this.truck);

    let load = {
      userId: this.driver.id,
      shipperId: this.shipper.id,
      receiverId: this.receiver.id,
      truckId: this.truck.id,
      pickupDate: this.pickup.date,
      pickupTime: this.pickup.time,
      deliveryDate: this.delivery.date,
      deliveryTime: this.delivery.time,
    }

    let prompt = this.alertCtrl.create({
      title: 'Create Load',
      message: 'Are you sure you want to create this load ?',
      buttons:[
        {
          text: 'Cancel',
        },
        {
          text: 'Yes',
          handler:() => {
            console.log("Load inside of handlder", load);
            this.showLoader();
                //Remove from database
            this.loadService.createLoad(load).then((result) => {
        
              this.loading.dismiss();
              //Pass back to create load page
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

  checkValidForm(){
    if(this.driver !== undefined && this.shipper !== undefined && this.receiver !== undefined && this.truck !== undefined &&this.pickup.date !== '' && this.pickup.time !== '' && this.delivery.date !== '' && this.delivery.time !== ''){
      this.createFormComplete = true;
    }
  }

  showLoader(){
    this.loading = this.loadingCtrl.create({
      content: 'Loading...'
    });
    this.loading.present();
  }

}
