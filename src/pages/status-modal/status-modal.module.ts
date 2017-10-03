import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StatusModalPage } from './status-modal';

@NgModule({
  declarations: [
    StatusModalPage,
  ],
  imports: [
    IonicPageModule.forChild(StatusModalPage),
  ],
})
export class StatusModalPageModule {}
