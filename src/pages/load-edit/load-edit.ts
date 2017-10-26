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
  status: any;
  pickup = {
    date: '',
    time: ''
  };
  delivery = {
    date: '',
    time: ''
  };
  loadAccepted:any;
  loadRejected:any;
  truckModalReturned: any = false;
  driverModalReturned: any = false;
  shipperModalReturned: any = false;
  receiverModalReturned: any = false;
  pickupDateModalReturned: any = false;
  deliveryDateModalReturned: any = false;
  statusModalReturned: any = false;
  createFormComplete: any = false;
  loading: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadService: LoadProvider, public modalCtrl:ModalController, public alertCtrl: AlertController, public loadingCtrl:LoadingController){

  }

  ionViewWillLoad() {
    this.load = this.navParams.get("Load");
    this.driver = this.load.driver;
    this.shipper = this.load.shipper;
    this.receiver = this.load.receiver;
    this.truck  = this.load.truck;
    this.pickup.date = this.load.pickupDate;
    this.pickup.time = this.load.pickupTime;
    this.delivery.date = this.load.deliveryDate;
    this.delivery.time = this.load.deliveryTime;
    this.status = this.load.status;
    this.loadAccepted = this.load.loadAccepted;
    this.loadRejected = this.load.loadRejected;
    this.checkValidForm();
  }

  showStatusModal(){
    const status = this.status;
    console.log("inside show status", status);
    const statusModal:Modal = this.modalCtrl.create('StatusModalPage', {status: status})

    statusModal.present();
    statusModal.onDidDismiss((status) => {
      if(status){
        this.status = status;
        console.log("status after return", this.status);
        this.statusModalReturned = true;
      }
    })
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
        this.loadRejected = false;
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

  showPickupDateModal(){
    const message = {
      event: "Pickup",
      date: this.pickup.date,
      time: this.pickup.time
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
      event: "Delivery",
      date: this.delivery.date,
      time: this.delivery.time
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

  checkValidForm(){
    if(this.driver !== undefined && this.shipper !== undefined && this.receiver !== undefined && this.truck !== undefined &&this.pickup.date !== '' && this.pickup.time !== '' && this.delivery.date !== '' && this.delivery.time !== ''){
      this.createFormComplete = true;
    }
  }

  isLoadUpdated(){
    if(this.driver === this.load.driver &&
      this.shipper === this.load.shipper &&
      this.receiver === this.load.receiver &&
      this.truck  === this.load.truck &&
      this.pickup.date === this.load.pickupDate &&
      this.pickup.time === this.load.pickupTime &&
      this.delivery.date === this.load.deliveryDate &&
      this.delivery.time === this.load.deliveryTime){
        this.navCtrl.setRoot("HomePage");
      }
    
  }

  updateLoad(){
    if(this.status === 'assigned' && this.load.loadAccepted === true){
      this.loadAccepted = false;
    }
    let load = {
      id: parseInt(this.load.id),
      userId: parseInt(this.driver.id),
      shipperId: parseInt(this.shipper.id),
      receiverId: parseInt(this.receiver.id),
      truckId: parseInt(this.truck.id),
      pickupDate: this.pickup.date, 
      pickupTime: this.pickup.time,
      deliveryDate: this.delivery.date,
      deliveryTime: this.delivery.time,
      status: this.status,
      loadAccepted: this.loadAccepted.toString(),
      loadRejected: this.loadRejected.toString()
    }

    console.log("loadId inside updateLoad function", load.id);
    console.log("userId inside updateLoad function", load.userId);
    console.log("shipperId inside updateLoad function", load.shipperId);
    console.log("receiverId inside updateLoad function", load.receiverId);
    console.log("truckId inside updateLoad function", load.truckId);
    console.log("pickupDate inside updateLoad function", load.pickupDate);
    console.log("pickupTime inside updateLoad function", load.pickupTime);
    console.log("deliveryDate inside updateLoad function", load.deliveryDate);
    console.log("deliveryTime inside updateLoad function", load.deliveryTime);
    console.log("status inside updateLoad function", load.status);
    console.log("load accepted: ", load.loadAccepted);

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
