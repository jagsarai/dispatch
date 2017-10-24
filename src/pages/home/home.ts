import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, LoadingController, ModalController } from 'ionic-angular';
import { LoadProvider } from '../../providers/load/load';
import { AuthProvider } from '../../providers/auth/auth';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  loading: any;
  loads: any;
  loadsData:any;
  searchControl: FormControl;
  searchTerm:string = '';
  searching: any = false;
  

  constructor(public navCtrl: NavController, public loadService: LoadProvider, public modalCtrl: ModalController, 
    public alertCtrl: AlertController, public authService: AuthProvider, public loadingCtrl: LoadingController) {
      this.searchControl = new FormControl();
  }


  ionViewDidLoad(){
    
    this.authService.role !== "admin" && this.authService.role !== null ? this.navCtrl.setRoot("LandingPage") : console.log ("User is admin and authorized");

    this.loadService.getLoads().then((data) => {
      this.loadsData = data;
      this.filterLoadNumbers();
      this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
        this.searching = false;
        this.filterLoadNumbers();
      })
    }, (err) => {
        console.log("This user is not allowed");
    });
  }

  filterLoadNumbers(){
    this.loads = this.loadsData.filter((load) => {
      return load.id.toString().indexOf(this.searchTerm) > -1;
    })
  }

  onSearchInput(){
    this.searching = true;
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
