import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.load = navParams.get("Load");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoadDetailsPage');
  }

}
