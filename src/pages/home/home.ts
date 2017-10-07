import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, LoadingController, ModalController } from 'ionic-angular';
import { LoadProvider } from '../../providers/load/load';
import { AuthProvider } from '../../providers/auth/auth';
// import { SlicePipe } from '@angular/common';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  loading: any;
  loads: any;

  constructor(public navCtrl: NavController, public loadService: LoadProvider, public modalCtrl: ModalController, 
    public alertCtrl: AlertController, public authService: AuthProvider, public loadingCtrl: LoadingController) {
  }


  ionViewWillLoad(){
    
    this.authService.role !== "admin" && this.authService.role !== null ? this.navCtrl.setRoot("LandingPage") : console.log ("User is admin and authorized");

    this.loadService.getLoads().then((data) => {
          this.loads = data;
    }, (err) => {
        console.log("This user is not allowed");
    });
  }
    
  deleteLoad(load){

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
                this.loadService.deleteLoad(load.id).then((result) => {
            
                  this.loading.dismiss();
                  //Remove locally
                    let index = this.loads.indexOf(load);

                    if(index > -1){
                        this.loads.splice(index, 1);
                    }   
            
                }, (err) => {
                  this.loading.dismiss();
                    console.log("not allowed");
                });
          }
        }
      ]
    });
    prompt.present();
  }
    
  addLoadDetail(){
    this.navCtrl.push('LoadCreatePage');
  }

  showLoadDetail(load){
    this.navCtrl.push('LoadDetailsPage', {
      Load: load
    });
  }

  showLoadEdit(load){
    this.navCtrl.push('LoadEditPage', {
      Load: load
    });
  }

  showLoader(){
    this.loading = this.loadingCtrl.create({
      content: 'Loading...'
    });
    this.loading.present();
  }
    
  logout(){
    this.authService.logout();
    this.navCtrl.setRoot("LandingPage");
  }

}
