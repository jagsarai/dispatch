import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoadDownloadModalPage } from './load-download-modal';

@NgModule({
  declarations: [
    LoadDownloadModalPage,
  ],
  imports: [
    IonicPageModule.forChild(LoadDownloadModalPage),
  ],
})
export class LoadDownloadModalPageModule {}
