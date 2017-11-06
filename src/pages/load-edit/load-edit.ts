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
    //get load object passed by the LoadDetialsPage.
    this.load = this.navParams.get("Load");
    //setup local variables if the load object is defined. 
    if(this.load !== undefined){
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
    else{
      this.navCtrl.setRoot("LandingPage")
    }
  }

  showStatusModal(){
    const status = this.status;
    //pass the status object to the status modal page. 
    const statusModal:Modal = this.modalCtrl.create('StatusModalPage', {status: status})
    statusModal.present();

    statusModal.onDidDismiss((status) => {
      if(status){
        this.status = status;
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
    //create a pickup event object with the date and time detials.
    const event = {
      event: "Pickup",
      date: this.pickup.date,
      time: this.pickup.time
    }
    //pass the event object into the pickup modal page. 
    const dateModal:Modal = this.modalCtrl.create('DateModalPage',{event: event})
    dateModal.present();

    dateModal.onDidDismiss((date) => {
      if(date){
        this.pickup.date = date.date;
        this.pickup.time = date.time;
        this.pickupDateModalReturned = true;
      }
      this.checkValidForm();
    });
  }


  showDeliveryDateModal(){
    //create a delivery event object with the date and time detials.
    const event ={
      event: "Delivery",
      date: this.delivery.date,
      time: this.delivery.time
    }
    //pass the event object into the delivery modal page    
    const dateModal:Modal = this.modalCtrl.create('DateModalPage', {event: event})
    dateModal.present();

    dateModal.onDidDismiss((date) => {
      if(date){
        this.delivery.date = date.date;
        this.delivery.time = date.time;
        this.deliveryDateModalReturned = true;
      }
      this.checkValidForm();
    });
  }
  //check if all required feilds are filled. 
  checkValidForm(){
    if(this.driver !== undefined && this.shipper !== undefined && this.receiver !== undefined && this.truck !== undefined &&this.pickup.date !== '' && this.pickup.time !== '' && this.delivery.date !== '' && this.delivery.time !== ''){
      this.createFormComplete = true;
    }
  }

  //check if any load data has changed. 
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
    //if the load was accepted and status is changed to assigned, the load can no longer be accepted. 
    if(this.status === 'assigned' && this.load.loadAccepted === true){
      this.loadAccepted = false;
    }
    //create a load object with appropriate data. 
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
            this.isLoadUpdated();
            this.showLoader();
            //Update to the database
            this.loadService.updateLoad(load).then((result) => {
        
              this.loading.dismiss();
              //Pass back to home page
              this.navCtrl.setRoot('HomePage');
        
            }).catch((err) => {
              this.loading.dismiss();
              let prompt = this.alertCtrl.create({
                title: 'Error updating laod',
                message: 'There was an error updating the load, please try again',
                buttons: [
                  {
                    text: 'Ok',
                    handler: () => {
                      this.navCtrl.setRoot('LandingPage');
                    }
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

  showLoader(){
    this.loading = this.loadingCtrl.create({
      content: 'Loading...'
    });
    this.loading.present();
  }

}
