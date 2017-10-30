import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ModalController, Modal, Platform } from 'ionic-angular';
import {  ReceiverProvider } from '../../providers/receiver/receiver';
import {  ShipperProvider } from '../../providers/shipper/shipper';
import {  TruckProvider } from '../../providers/truck/truck';
import { LoadProvider } from '../../providers/load/load';
import { CallNumber } from '@ionic-native/call-number';
import { EmailComposer } from '@ionic-native/email-composer';



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
  imagesLoaded:boolean = false;
  email:any;
  browser:boolean = false;
  loadAccepted:boolean

  constructor(public navCtrl: NavController, public navParams: NavParams, public shipperService: ShipperProvider, public receiverService: ReceiverProvider, public truckService: TruckProvider, public alertCtrl:AlertController, public loadingCtrl: LoadingController, public loadService: LoadProvider, public modalCtrl:ModalController, private callNumber: CallNumber, private emailComposer: EmailComposer, public platform: Platform) {
    this.load = this.navParams.get("Load");
  }

  ionViewDidLoad() {
    if(this.load !== undefined){
      if(this.platform.is('core')){
        this.browser = true;
      }
      
      this.load.filesData.length > 0 ? this.imagesLoaded = true : this.imagesLoaded = false;
  
      this.shipperService.retriveShipper(this.load.ShipperId).then((shipper) => {
        this.shippers.push(shipper);
      }).catch((err) => {
        let prompt = this.alertCtrl.create({
          title: "Error",
          message: "There was an error fetching the shipper, please try again.",
          buttons:[
            {
              text: 'Ok',
              handler: () => {
                this.navCtrl.setRoot("LandingPage");
              }
            }
          ]
        });
        prompt.present();
      });
  
      this.receiverService.retriveReceiver(this.load.ReceiverId).then((receiver) => {
        this.receivers.push(receiver);
      }).catch((err) => {
        let prompt = this.alertCtrl.create({
          title: "Error",
          message: "There was an error fetching the reciever, please try again.",
          buttons:[
            {
              text: 'Ok',
              handler: () => {
                this.navCtrl.setRoot("LandingPage");
              }
            }
          ]
        });
        prompt.present();
      });
  
      this.truckService.retriveTruck(this.load.TruckId).then((truck) => {
        this.trucks.push(truck);
      }).catch((err) => {
        let prompt = this.alertCtrl.create({
          title: "Error",
          message: "There was an error fetching the truck, please try again.",
          buttons:[
            {
              text: 'Ok',
              handler: () => {
                this.navCtrl.setRoot("LandingPage");
              }
            }
          ]
        });
        prompt.present();
      })
    }
    else{
      this.navCtrl.setRoot("LandingPage")
    }
  }

  showLoadEditPage(){
    this.navCtrl.push('LoadEditPage',{
      Load: {
        id: this.load.id,
        driver: this.load.driver,
        shipper: this.shippers[0],
        receiver: this.receivers[0],
        truck: this.trucks[0],
        pickupDate: this.load.pickupDate,
        pickupTime: this.load.pickupTime,
        deliveryDate: this.load.deliveryDate,
        deliveryTime: this.load.deliveryTime,
        status: this.load.status,
        loadAccepted: this.load.loadAccepted,
        loadRejected: this.load.loadRejected
      }
    });
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
        
            }).catch((err) => {
              this.loading.dismiss();
              let prompt = this.alertCtrl.create({
                title: "Error",
                message: "There was an error deleting the load, please try again.",
                buttons:[
                  {
                    text: 'Ok',
                    handler: () => {
                      this.navCtrl.setRoot("LandingPage");
                    }
                  }
                ]
              });
              prompt.present();
            });
          }
        }
      ]
    });
    prompt.present();
  }

  showLoadDownlaodPage(){
    const load = this.load
    const downloadModal:Modal = this.modalCtrl.create('LoadDownloadModalPage', {load: load})

    downloadModal.present();
  }

  showLoader(){
    this.loading = this.loadingCtrl.create({
      content: 'Loading...'
    });
    this.loading.present();
  }

  callDriver(){
    let phone = '1'+ this.load.driver.phone.toString(); 

    this.callNumber.callNumber(phone, true).then(() => {
    }).catch(() => {
      let prompt = this.alertCtrl.create({
        title: 'Call denied',
        message: 'The call feature is not avaliable for this device',
        buttons: [
          {
            text: 'Ok'
          }
        ]
      })
      prompt.present();
    })
  }

  emailDriver(){
    let email = {
      to: this.load.driver.email,
      cc: 'admin@gmail.com',
      subject: `Load# ${this.load.id}`,
      body: `Hi ${this.load.driver.email}`,
      isHtml: true
    };
    this.emailComposer.hasPermission().then((permission:boolean) => {
      if(permission){
        this.emailComposer.open(email)
      }
      else{
        this.emailComposer.requestPermission().then((permission:boolean) => {
          if(permission){
            this.emailComposer.open(email);
          }
          else{
            let prompt = this.alertCtrl.create({
              title: 'Permission Denied',
              message: 'Permission to send email was denied by user',
              buttons: [
                {
                  text: 'Ok'
                }
              ]
            })
            prompt.present();
          }
        })
      }
    }).catch((err) => {
      let prompt = this.alertCtrl.create({
        title: 'Email service not avaliable',
        message: 'The Email service is not avaliable for this device',
        buttons: [
          {
            text: 'Ok'
          }
        ]
      });
      prompt.present();
    });
  }

}
