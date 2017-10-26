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

      this.storage.get("id").then((id) => {
        this.driverId = id;
        this.loadService.getDriverLoads(this.driverId).then((loads) => {
            console.log("loads inside driver home", loads);
            this.driverLoads = loads;
            this.currentDriverLoads = this.filterCurrentLoads(this.driverLoads);
            this.pastDriverLoads = this.filterPastLoads(this.driverLoads);
            console.log("CurrentDriverLoad ", this.currentDriverLoads)       
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

  checkAssignedLoads(loads){
    return loads.filter((load) => {
      return load.status === 'dispatched' && load.loadAccepted === false;
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
          this.isLoadAccepted(updateLoad);
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
