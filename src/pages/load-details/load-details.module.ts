import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoadDetailsPage } from './load-details';

@NgModule({
  declarations: [
    LoadDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(LoadDetailsPage),
  ],
})
export class LoadDetailsPageModule {}
