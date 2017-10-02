import { Component } from '@angular/core';
import { IonicPage, ViewController, AlertController, LoadingController, NavParams } from 'ionic-angular';



@IonicPage()
@Component({
  selector: 'page-date-modal',
  templateUrl: 'date-modal.html',
})
export class DateModalPage {
  calledFrom: any;
  calledFromPickup: any = false;
  calledFromDelivery: any = false;
  date = new Date();
  day = this.date.getDate();
  year = this.date.getFullYear().toString();
  month = (this.date.getMonth() + 1).toString();
  
  event = {
    date: this.year + '-' + this.month + '-' + this.checkDay(this.day),
    time: '00:00'
  }

  constructor(public viewCtrl: ViewController, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public navParams: NavParams) {
  }

  ionViewWillLoad() {
    this.calledFrom = this.navParams.get('message');
    console.log(this.calledFrom);
    this.checkCalledFromEvent(this.calledFrom);
  }

  closeDateModal(){
    this.viewCtrl.dismiss();
  }

  checkDay(day){
    if(day < 9){
      return '0' + day.toString();
    }
    else{
      return day.toString();
    }
  }

  checkCalledFromEvent(event){
    if(event.event === "Pickup" && event.date && event.time){
      this.event.date = event.date;
      this.event.time = event.time;
    }
    else if(event.event === "Delivery" && event.date && event.time){
      this.event.date = event.date;
      this.event.time = event.time;
    }
  }

  saveDate(){
    this.viewCtrl.dismiss(this.event);
  }

}
