import { Component } from '@angular/core';
import { IonicPage, ViewController, NavController, NavParams, ActionSheetController, ToastController, Platform, LoadingController, Loading } from 'ionic-angular';
import { File } from '@ionic-native/file';
// import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { storage} from 'firebase';
import { FIREBASE_CONFIG } from '../../app/firebase.config';

declare var cordova: any;


@IonicPage()
@Component({
  selector: 'page-upload-modal',
  templateUrl: 'upload-modal.html',
})
export class UploadModalPage {

  images:any = [];
  dataUrlImages: any;
  lastImage: string = null;
  loading: Loading;
  duplicateImage:Boolean = false;
  load: any;
  downloadUrl:any = [];
  image: any;

  constructor(public navCtrl: NavController, private camera: Camera, private file: File, private filePath: FilePath, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public platform: Platform, public loadingCtrl: LoadingController, public viewCtrl: ViewController, public navParams: NavParams) { 
  }
  

  ionViewDidLoad() {
    //get the load object from driver load details page
    this.load = this.navParams.get('load');
  }

  //present option to user to select camera or library option for uploading. 
  presentActionSheet() {
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

  takePicture(sourceType) {
  // Create options for the Camera Dialog
    var options = {
        quality: 50,
        sourceType: sourceType,
        saveToPhotoAlbum: false,
        correctOrientation: true,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
      };

      // Get the data of an image
       this.camera.getPicture(options).then((imagePath) => {
        // Special handling for Android library 
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


  // Create a new name for the image using the current date and time. 
  createFileName() {
    var d = new Date(),
    month = (d) => {
      if(d.getMonth() < 9){
        return '0' + (d.getMonth() + 1).toString();
      }
      else{
        return (d.getMonth() + 1).toString();
      }
    },
    day = (d) => {
      if(d.getDate() < 10){
        return '0' + d.getDate().toString();
      }
      else{
        return d.getDate().toString();
      }
    },
    hour = (d) => {
      if(d.getHours() < 10){
        return '0' + d.getHours().toString();
      }
      else{
        return d.getHours().toString()
      }
    },
    minutes = (d) => {
      if(d.getMinutes() < 10){
        return '0' + d.getMinutes().toString();
      }
      else{
        return d.getMinutes().toString();
      }
    },
    seconds = (d) => {
      if(d.getSeconds() < 10){
        return '0' + d.getMonth().toString()
      }
      else{
        return d.getSeconds().toString();
      }
    }, 
    n = d.getFullYear().toString() + month(d) + day(d) +  hour(d) + minutes(d) + seconds(d),
    newFileName =  n + ".jpg";
    return newFileName;
  }
 
  // Copy the image to a local folder
  copyFileToLocalDir(namePath, currentName, newFileName) {
    
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.images.push(newFileName);
      this.lastImage  = this.images[this.images.length - 1];
    }).catch((error) => {
      this.presentToast('Error while storing file.');
    });
  }
 
  presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
 
// Always get the accurate path to your apps folder
  pathForImage(image) {
    if (image === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + image; 
    }
  }

  uploadImage(){
    this.loading = this.loadingCtrl.create({
      content: 'Uploading...'
    });
    this.loading.present();

    this.images.map((image) => {
      this.imagesToDataUrlUpload(image);
    });
  }

  //Upload data url of images to firebase.
  imagesToDataUrlUpload(imageName){
    //get the images and convert into data urls.
    this.file.readAsDataURL(cordova.file.dataDirectory, imageName).then((result) => {
      const image = result;
      const storageRef = storage().ref(`/loads/${this.load.id}/${imageName}`);
      const uploadTask = storageRef.putString(image, 'data_url');

      uploadTask.on('state_changed', (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (uploadTask.snapshot.bytesTransferred / uploadTask.snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (uploadTask.snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break;
        }
      }, (err) => {
        this.loading.dismiss(this.presentToast("Upload was not completed"));
        console.error(err);
      }, () => {
        var key = imageName;
        var downloadUrlObject = {};
        downloadUrlObject[key] = uploadTask.snapshot.downloadURL;

        this.downloadUrl.push(downloadUrlObject);
        if(this.images.length === this.downloadUrl.length){
          this.images = [];
          this.loading.dismiss(this.presentToast("Upload successful"));
        }
      });
    }, (err) => {
      this.loading.dismiss(this.presentToast("Upload error"));
    }).catch((err) => {
      this.loading.dismiss(this.presentToast("There was an error with the request"))
    });
  }

  closeUploadModal(){
    //check if there were any image urls created and send back download url object.
    if(this.downloadUrl.length === 0){
      this.viewCtrl.dismiss();
    }
    else{
      this.viewCtrl.dismiss(this.downloadUrl);
    }
   
  }

}
