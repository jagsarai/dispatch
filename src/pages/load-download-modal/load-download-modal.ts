import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { storage } from 'firebase';
import { FIREBASE_CONFIG } from '../../app/firebase.config';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';

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



  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl:ViewController, private transfer: Transfer, private file: File, private filePath:FilePath, public loadingCtrl:LoadingController, public toastCtrl:ToastController, public alertCtrl:AlertController) {
  }

  ionViewWillLoad() {
    this.load = this.navParams.get("load");
    console.log("load passed from details page: ", this.load);

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
          console.error("There was an error with the download process", err);
        })
      }
      else{
        let prompt = this.alertCtrl.create({
          title: 'Images not processed',
          message: 'The load images have no been processed, please try again later.' ,
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

  // downloadImage(imageName){
  //   // const destination = this.checkDevice();
    
  //   imageName = imageName + '.jpg';
  //   let imageUrl = ''

  //   this.load.filesData.map((object) => {
  //     const img = Object.keys(object)[0];
  //     if(img === imageName) {
  //       return imageUrl =  object[img];
  //     }
  //   });

  //   console.log("ImageUrl for " + imageName + " :" + imageUrl);

  //   this.loading = this.loadingCtrl.create({
  //     content: 'Downloading...',
  //   });
  //   this.loading.present();

  //   const fileTransfer: TransferObject = this.transfer.create();
  

  //   fileTransfer.download(imageUrl, cordova.file.documentsDirectory + imageName, true).then((result) => {
  //     console.log('download complete: ' + result.toURL());
  //     this.loading.dismiss(this.presentToast("Download Complete!"))
  //     this.imageDownloaded = true;
  //   }).catch((err) => {
  //     this.loading.dismiss(this.presentToast("Download Failed! Please try again"))
  //     console.error(err);
  //   })
  // }

  presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  // imageName(image){
  //   image.name ? image.name : '' 
  // }

  // pathForImage(image) {
  //   image.url ? image.url : ''
  // }

  // pathForImageThumbnail(image){
  //   image.thumbnailUrl ?  image.thumbnailUrl : ''
  // }

  // getImageLink(imageName){
  //   imageName = imageName + 'jpg';

  //   this.load.filesData.map((object) => {
  //         const img = Object.keys(object)[0];
  //         if(img === imageName) {
  //           return this.imageLink = object[img].toString();
  //         }
  //   });
  // }

  

}
