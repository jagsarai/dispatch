import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, ViewController, AlertController, ModalController, Modal} from 'ionic-angular';
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


  constructor(public navCtrl: NavController, public authService: AuthProvider, public loadService: LoadProvider, public storage: Storage, public viewCtrl: ViewController, public alertCtrl: AlertController, public loadingCtrl:LoadingController, public modalCtrl:ModalController) {
    this.currentLoadSearchControl = new FormControl();
    this.pastLoadSearchControl = new FormControl();
  }

  ionViewWillLoad() {
      this.authService.role !== "driver" && this.authService.role !== null ? this.navCtrl.setRoot("LandingPage") : console.log("User is driver");

      this.storage.get("id").then((id) => {
        this.driverId = id;
        this.loadService.getDriverLoads(this.driverId).then((loads) => {
            console.log("loads inside driver home", loads);
            this.driverLoads = loads;
            this.currentDriverLoads = this.filterCurrentLoads(this.driverLoads);
            this.pastDriverLoads = this.filterPastLoads(this.driverLoads);
            console.log("CurrentDriverLoad ", this.currentDriverLoads)            
            }, (err) => {
              console.log("There was an error with the request");
            });
      }, (err) => {
        console.log("Unable to get the driver id");
      })

      this.currentLoadSearchControl.valueChanges.debounceTime(700).subscribe(search => {
        this.currentLoadSearching = false;
        this.filterCurrentDriverLoadsByName();
      })
  
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

  showLoadDetail(load){
    console.log(load);
    this.navCtrl.push('DriverLoadDetailsPage', {
      Load: load
    });
  }

  showUploadDocsModal(load){
    const uploadModal:Modal = this.modalCtrl.create('UploadModalPage', {load: load})

    uploadModal.present();
    uploadModal.onDidDismiss((downloadUrl) => {
      console.log(downloadUrl);
      if(downloadUrl){

        downloadUrl.map((urlObject) => {
          return load.filesData.push(urlObject);
        })

        load.filesUploaded = true;

        this.loading = this.loadingCtrl.create({
          content: 'Loading...',
        });
        this.loading.present();
        
        this.loadService.updateLoad(load).then((updateLoad) => {
          this.areDocumentsUploaded(updateLoad);
          load = updateLoad;
        }, (err) => {
          this.loading.dismiss();
          console.error("There was a problem with the request ");
        });

        this.loadService.getDriverLoads(this.driverId).then((loads) => {
          console.log("loads inside driver home", loads);
          this.driverLoads = loads;
          this.currentDriverLoads = this.filterCurrentLoads(this.driverLoads);
          this.pastDriverLoads = this.filterPastLoads(this.driverLoads);
          console.log("CurrentDriverLoad ", this.currentDriverLoads)          
          this.loading.dismiss();
          }, (err) => {
            this.loading.dismiss();
            console.log("There was an error with the request");
        });
      }
    })
  }

  areDocumentsUploaded(load){
    // if(load.status === 'delivered' && load.filesUploaded === true && load.filesData.length > 0){
    //   return true;
    // }
    // else{
    //   return false;
    // }
    return false;
  }


}
