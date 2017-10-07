import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DriverLoadDetailsPage } from './driver-load-details';

@NgModule({
  declarations: [
    DriverLoadDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(DriverLoadDetailsPage),
  ],
})
export class DriverLoadDetailsPageModule {}
