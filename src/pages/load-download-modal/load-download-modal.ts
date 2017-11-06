import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { storage } from 'firebase';
import { FIREBASE_CONFIG } from '../../app/firebase.config';
import { Transfer } from '@ionic-native/transfer';

declare var cordova: any;


@IonicPage()
@Component({
  selector: 'page-load-download-modal',
  templateUrl: 'load-download-modal.html',
})
export class LoadDownloadModalPage {
  load: any;
  images = [];
  imageUri:string = 'gs://simpledispatch-a02d7.appspot.com/loads/';
  imageThumbnailSize:string = '_256_thumb.png'
  loading: any;
  imageDownloaded:boolean = false;



  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl:ViewController, private transfer: Transfer, public loadingCtrl:LoadingController, public toastCtrl:ToastController, public alertCtrl:AlertController) {
  }

  ionViewWillLoad() {
    //get the passed load object from the load details page.    
    this.load = this.navParams.get("load");
    //find the image url data on the object and download the thumbnails. 
    this.load.filesData.map((object)=> {
      const img = Object.keys(object)[0].toString();
      if(storage().ref(`/loads/${this.load.id}/${img}${this.imageThumbnailSize}`)){
        storage().ref(`/loads/${this.load.id}/${img}${this.imageThumbnailSize}`).getDownloadURL().then((url) => {
          this.images.push({
            name: img.replace('.jpg', ''),
            url: object[img].toString(),
            thumbnailUrl: url.toString()
          })
        }).catch((err) => {
          let prompt = this.alertCtrl.create({
            title: 'Download Error',
            message: 'There was a problem downloading the image links, please try again.',
            buttons: [
              {
                text: 'Ok'
              }
            ]
          });
          prompt.present();
        })
      }
      else{
        let prompt = this.alertCtrl.create({
          title: 'Images not processed',
          message: 'The load images have not been processed, please try again later.' ,
          buttons:[
            {
              text: 'Ok',
              handler:() => {
                this.closeDownloadModal();
              }
            }
          ]
        });
        prompt.present();
      }
    });
  }

  closeDownloadModal(){
    this.viewCtrl.dismiss();
  }

}
