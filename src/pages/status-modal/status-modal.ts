import { Component } from '@angular/core';
import { IonicPage, NavParams, AlertController, ViewController } from 'ionic-angular';

/**
 * Generated class for the StatusModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-status-modal',
  templateUrl: 'status-modal.html',
})
export class StatusModalPage {
  status: any;
  
  assigned: any =  false;
  dispatched: any =  false;
  atShipper: any =  false;
  loaded: any =  false;
  enRoute: any =  false;
  atReceiver: any =  false;
  delivered: any =  false;

  constructor(public alertCtnrl: AlertController, public navParams: NavParams, public viewCtrl:ViewController) {
  }

  ionViewWillLoad() {
    this.checkLoadStatus(this.navParams.get("status"));
    console.log("Inside the status modal", this.status);
  }

  closeStatusModal(){
    console.log(this.status);
    this.viewCtrl.dismiss(this.status);
  }

  checkLoadStatus(status){
    if(status === 'assigned'){
      this.status = 'assigned';
      this.assigned = true;
    }
    if(status === 'dispatched'){
      this.status = 'dispatched';
      this.dispatched = true;
    }
    if(status === 'at shipper'){
      this.status = 'at shipper';
      this.atShipper = true;
    }
    if(status === 'loaded'){
      this.status = 'loaded';
      this.loaded = true;
    }
    if(status === 'en route'){
      this.status = 'en route';
      this.enRoute = true;
    }
    if(status === 'at receiver'){
      this.status = 'at receiver';
      this.atReceiver = true;
    }
    if(status === 'delivered'){
      this.status = 'delivered';
      this.delivered = true;
    }
  }




}
