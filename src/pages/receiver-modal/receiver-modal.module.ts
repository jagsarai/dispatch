import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReceiverModalPage } from './receiver-modal';

@NgModule({
  declarations: [
    ReceiverModalPage,
  ],
  imports: [
    IonicPageModule.forChild(ReceiverModalPage),
  ],
})
export class ReceiverModalPageModule {}
