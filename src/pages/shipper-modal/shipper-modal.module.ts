import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShipperModalPage } from './shipper-modal';

@NgModule({
  declarations: [
    ShipperModalPage,
  ],
  imports: [
    IonicPageModule.forChild(ShipperModalPage),
  ],
})
export class ShipperModalPageModule {}
