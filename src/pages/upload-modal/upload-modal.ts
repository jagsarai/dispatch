import { Component } from '@angular/core';
import { IonicPage, ViewController, NavController, NavParams, ActionSheetController, ToastController, Platform, LoadingController, Loading } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { storage, initializeApp} from 'firebase';
import { FIREBASE_CONFIG } from '../../app/firebase.config';

declare var cordova: any;


@IonicPage()
@Component({
  selector: 'page-upload-modal',
  templateUrl: 'upload-modal.html',
})
export class UploadModalPage {

  images:any = [];
  lastImage: string = null;
  loading: Loading;
  duplicateImage:Boolean = false;

  constructor(public navCtrl: NavController, private camera: Camera, private transfer: Transfer, private file: File, private filePath: FilePath, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public platform: Platform, public loadingCtrl: LoadingController, public viewCtrl: ViewController) { 
    initializeApp(FIREBASE_CONFIG);
  }
  

  ionViewDidLoad() {
    console.log('ionViewDidLoad UploadModalPage');
  }

  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  public takePicture(sourceType) {
  // Create options for the Camera Dialog
    var options = {
        quality: 100,
        sourceType: sourceType,
        saveToPhotoAlbum: false,
        correctOrientation: true,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
      };

      // Get the data of an image
       this.camera.getPicture(options).then((imagePath) => {
        // Special handling for Android library
        console.log("This is the proper image path " + imagePath);
        if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
          this.filePath.resolveNativePath(imagePath)
            .then(filePath => {
              let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
              let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
              this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
            });
        } else {
          var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
          var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
          this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
        }
      }, (err) => {
        this.presentToast('Error while selecting image.');
      });  
   }

  // public async takePicture(sourceType){
  //   try{
  //     var options = {
  //       quality: 100,
  //       sourceType: sourceType,
  //       saveToPhotoAlbum: false,
  //       correctOrientation: true,
  //       destinationType: this.camera.DestinationType.DATA_URL,
  //       encodingType: this.camera.EncodingType.JPEG,
  //       mediaType: this.camera.MediaType.PICTURE
  //     };

  //     const result = await this.camera.getPicture(options);

  //     const pictures = storage().ref('/loads/');
  //     const image = `data:image/jpeg;base64,${result}`;

  //     pictures.putString(image, 'data_url')
  //   }
  //   catch(e){
  //     console.error(e);
  //   }
  // }

  // Create a new name for the image
  private createFileName() {
    var d = new Date(),
    n = d.getHours() + '' + d.getMinutes() + '' + d.getSeconds(),
    newFileName =  n + ".jpg";
    return newFileName;
  }
 
  // Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      console.log("Copy event fired");
      console.log("Success storing in local folder " +  cordova.file.dataDirectory + " " + newFileName);
      this.images.push(newFileName);
      this.lastImage  = this.images[this.images.length - 1];
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }
 
  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
 
// Always get the accurate path to your apps folder
  public pathForImage(image) {
    if (image === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + image; 
    }
  }

  // public uploadImage() {
  //   // Destination URL
  //   var url = "gs://simpledispatch-a02d7.appspot.com/";
   
  //   // File for Upload
  //   var targetPath = this.pathForImage(this.lastImage);
   
  //   // File name only
  //   var filename = this.lastImage;
   
  //   var options = {
  //     fileKey: "file",
  //     fileName: filename,
  //     chunkedMode: false,
  //     mimeType: "multipart/form-data",
  //     params : {'fileName': filename}
  //   };
   
  //   const fileTransfer: TransferObject = this.transfer.create();
   
  //   this.loading = this.loadingCtrl.create({
  //     content: 'Uploading...',
  //   });
  //   this.loading.present();
   
  //   // Use the FileTransfer to upload the image
  //   fileTransfer.upload(targetPath, url, options).then(data => {
  //     this.loading.dismiss()
  //     this.presentToast('Image succesfully uploaded.');
  //   }, err => {
  //     this.loading.dismiss()
  //     this.presentToast('Error while uploading file.');
  //   });
  // }

  public async uploadImage(){
    try{
      console.log("This is the image name " + this.lastImage);
      this.loading = this.loadingCtrl.create({
        content: 'Uploading...',
       });

      this.loading.present();

      const image = await this.file.readAsDataURL(cordova.file.dataDirectory, this.lastImage);

      console.log("This is the file " + image);
  
      const storageRef = storage().ref('/loads/' + this.lastImage);
      
      storageRef.putString(image, 'data_url');


      this.images = [];
      this.loading.dismiss();
      this.presentToast("Upload successfull");
    }
   
    catch(e){
      this.loading.dismiss();
      this.presentToast("Upload failed, please try again");
      console.error(e);
    }
        
  }
  
  closeUploadModal(){
    this.viewCtrl.dismiss();
  }
}
