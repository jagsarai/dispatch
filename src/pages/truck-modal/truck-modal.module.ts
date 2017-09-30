import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TruckModalPage } from './truck-modal';

@NgModule({
  declarations: [
    TruckModalPage,
  ],
  imports: [
    IonicPageModule.forChild(TruckModalPage),
  ],
})
export class TruckModalPageModule {}
