import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DriverModalPage } from './driver-modal';

@NgModule({
  declarations: [
    DriverModalPage,
  ],
  imports: [
    IonicPageModule.forChild(DriverModalPage),
  ],
})
export class DriverModalPageModule {}
