import { Component } from '@angular/core';
import { IonicPage, NavParams, AlertController, ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';


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
  completed: any = false;
  userIsAdmin: any = false;

  constructor(public alertCtnrl: AlertController, public navParams: NavParams, public viewCtrl:ViewController, public storage:Storage) {
  }

  ionViewWillLoad() {
    this.storage.get('role').then((role) => {
      console.log("Role inside status modal ", role);
      this.checkRole(role);
    })
    this.checkLoadStatus(this.navParams.get("status"));
    console.log("Inside the status modal", this.status);
  }

  closeStatusModal(){
    this.viewCtrl.dismiss();
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
    if(status === 'completed'){
      this.status = 'completed';
      this.completed = true;
    }
  }

  checkRole(role){
    if(role === "admin"){
      this.userIsAdmin = true;
    }
  }

  saveStatusModal(){
    console.log(this.status);
    this.viewCtrl.dismiss(this.status);
  }




}
