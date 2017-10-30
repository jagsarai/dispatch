import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, ViewController, AlertController, ModalController, Modal, NavParams} from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { LoadProvider } from '../../providers/load/load';
import { Storage } from '@ionic/storage';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';


@IonicPage()
@Component({
  selector: 'page-driver-home',
  templateUrl: 'driver-home.html',
})
export class DriverHomePage {

  driverLoads:any;
  driverId: any;
  currentDriverLoads:any;
  filteredCurrentDriverLoads:any;
  pastDriverLoads:any;
  filteredPastDriverLoads:any;
  currentLoadSearchControl: FormControl;
  pastLoadSearchControl: FormControl;
  currentLoadSearching: any = false;
  pastLoadSearching: any = false;
  currentLoadSearchTerm:string = '';
  pastLoadSearchTerm:string = '';
  loading:any;
  loadAccepted:boolean = false;


  constructor(public navCtrl: NavController, public authService: AuthProvider, public loadService: LoadProvider, public storage: Storage, public viewCtrl: ViewController, public alertCtrl: AlertController, public loadingCtrl:LoadingController, public modalCtrl:ModalController, public navParams:NavParams) {
    this.currentLoadSearchControl = new FormControl();
    this.pastLoadSearchControl = new FormControl();
  }

  ionViewWillLoad() {
      this.authService.role !== "driver" && this.authService.role !== null ? this.navCtrl.setRoot("LandingPage") : console.log("User is driver");

      // Get the id of user that is stored inside the temp storage. 
      this.storage.get("id").then((id) => {
        this.driverId = id;
        // Use the id to lookup all of the loads associated with that Id.
        this.loadService.getDriverLoads(this.driverId).then((loads) => {
            this.driverLoads = loads;
            this.currentDriverLoads = this.filterCurrentLoads(this.driverLoads);
            this.pastDriverLoads = this.filterPastLoads(this.driverLoads); 
            // If there are new assigned loads, give an alert.       
            if(this.checkAssignedLoads(this.driverLoads).length > 0){
              let prompt = this.alertCtrl.create({
                title:'New Loads',
                message: 'You have new assigned loads, please accept or decline',
                buttons:[
                  {
                    text: 'Ok'
                  }
                ]
              });
              prompt.present();
            }
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
      }).catch((err) => {
        let prompt = this.alertCtrl.create({
          title: 'Error',
          message: 'There was an error fetching the driver',
          buttons:[
            {
              text: 'Ok'
            }
          ]
        });
        prompt.present();
      });

      // Watch for value change in the current loads field and search by load name
      this.currentLoadSearchControl.valueChanges.debounceTime(700).subscribe(search => {
        this.currentLoadSearching = false;
        this.filterCurrentDriverLoadsByName();
      })

      // Watch for value change in the past loads field and search by load name
      this.pastLoadSearchControl.valueChanges.debounceTime(700).subscribe(search => {
        this.pastLoadSearching = false;
        this.filterPastDriverLoadsByName();
      })
  }


  filterCurrentDriverLoadsByName(){
    this.filteredCurrentDriverLoads = this.currentDriverLoads.filter((load) => {
      return load.pickupDate.toString().indexOf(this.currentLoadSearchTerm) > -1;
    });
  }

  filterPastDriverLoadsByName(){
    this.filteredPastDriverLoads = this.pastDriverLoads.filter((load) => {
      return load.pickupDate.toString().indexOf(this.pastLoadSearchTerm) > -1;
    });
  }

  onCurrentLoadSearchInput(){
    this.currentLoadSearching = true;
  }

  onPastLoadSearchInput(){
    this.pastLoadSearching = true;
  }

  logout(){
    this.authService.logout();
    this.navCtrl.setRoot("LandingPage");
  }

  filterCurrentLoads(loads){
    return loads.filter((load) => {
      return load.status !== 'completed';
    })
  }

  filterPastLoads(loads){
    return loads.filter((load) => {
      return load.status === 'completed';
    })
  }

  checkAssignedLoads(loads){
    return loads.filter((load) => {
      return load.status === 'dispatched' && load.loadAccepted === false;
    })
  }

  showLoadDetail(load){
    this.navCtrl.push('DriverLoadDetailsPage', {
      Load: load
    });
  }

  showUploadDocsModal(load){
    const uploadModal:Modal = this.modalCtrl.create('UploadModalPage', {load: load})

    uploadModal.present();
    //Returning downloadUrls from the upload modal 
    uploadModal.onDidDismiss((downloadUrls) => {
      if(downloadUrls){
        //Push the download urls into the files data of the load
        downloadUrls.map((urlObject) => {
          return load.filesData.push(urlObject);
        })

        load.filesUploaded = true;

        this.loading = this.loadingCtrl.create({
          content: 'Loading...',
        });
        this.loading.present();

        // Update the load in the database
        this.loadService.updateLoad(load).then((updatedLoad) => {
          this.isLoadAssigned(updatedLoad);
          this.isLoadAccepted(updatedLoad);
          load = updatedLoad;
        }).catch((err) => {
          let prompt = this.alertCtrl.create({
            title: 'Error',
            message: 'There was an error updating the load, please try again.',
            buttons:[
              {
                text: 'Ok'
              }
            ]
          });
          prompt.present();
          this.loading.dismiss();
        });

        // Get the loads from the database by driver id
        this.loadService.getDriverLoads(this.driverId).then((loads) => {
          this.driverLoads = loads;
          this.currentDriverLoads = this.filterCurrentLoads(this.driverLoads);
          this.pastDriverLoads = this.filterPastLoads(this.driverLoads);          
          this.loading.dismiss();
          }).catch((err) => {
            this.loading.dismiss();
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
    })
  }

  isLoadAccepted(load){
    if(load.status !== 'dispatched' && load.loadAccepted === true){
      return true;
    }
    else{
      return false;
    }
  }

  isLoadAssigned(load){
    if(load.status === 'dispatched' && load.loadAccepted === false){
        return true;
      }
    else{
      return false
    }
  }
}
