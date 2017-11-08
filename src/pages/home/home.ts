import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, LoadingController, ModalController } from 'ionic-angular';
import { LoadProvider } from '../../providers/load/load';
import { AuthProvider } from '../../providers/auth/auth';
import { FormControl } from '@angular/forms';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/debounceTime';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  user: any;
  loading: any;
  loads: any;
  loadsData:any;
  searchControl: FormControl;
  searchTerm:string = '';
  searching: any = false;
  

  constructor(public navCtrl: NavController, public loadService: LoadProvider, public modalCtrl: ModalController, 
    public alertCtrl: AlertController, public authService: AuthProvider, public loadingCtrl: LoadingController, public storage:Storage) {
      this.searchControl = new FormControl();
  }


  ionViewWillLoad(){
    //Check for user authentication
    this.authService.checkAuthentication().then(() => {
    }).catch((err) => {
      let prompt = this.alertCtrl.create({
        title: 'Error',
        message: 'There was an authentication error. Please log in again.',
        buttons:[
          {
            text: 'Ok',
            handler: () => {
              this.authService.logout();
              this.navCtrl.setRoot("LandingPage");
            }
          }
        ]
      });
      prompt.present();
    });
    //get user cerdentials from storage
    this.storage.get('user').then((user)=> {
      this.user = user;
      //check specific role of user and get load information. 
      if((this.user.role !== "admin" && this.user.role !== null) || this.user.role === undefined){ 
        this.navCtrl.setRoot("LandingPage")
        }
        else{
          this.loadService.getLoads().then((data) => {
            this.loadsData = data;
            this.filterLoadNumbers();
            this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
              this.searching = false;
              this.filterLoadNumbers();
            })
          }).catch((err) => {
              let prompt = this.alertCtrl.create({
                title: 'Error',
                message: 'There was an error fetching the loads',
                buttons:[
                  {
                    text: 'Ok'
                  }
                ]
              });
              prompt.present();
          });
        }
      }).catch((err) => {
        let prompt = this.alertCtrl.create({
          title: "Error",
          message: "There was an error fetching the user.",
          buttons: [
            {
              text: 'Ok',
            }
          ]
        });
        prompt.present();
      })
  }

  filterLoadNumbers(){
    this.loads = this.loadsData.filter((load) => {
      return load.id.toString().indexOf(this.searchTerm) > -1;
    }).reverse()
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
            }).catch((err) => {
              this.loading.dismiss();
              let prompt = this.alertCtrl.create({
                title: 'Error',
                message: 'There was an error deleting the load',
                buttons:[
                  {
                    text: 'Ok'
                  }
                ]
              });
              prompt.present();
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
