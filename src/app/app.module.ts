import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';
import { HttpModule } from '@angular/http';
import { MyApp } from './app.component';
import { AuthProvider } from '../providers/auth/auth';
import { LoadProvider } from '../providers/load/load';
import { FormsModule } from '@angular/forms';
import { EqualValidator } from '../directives/equal-validator.directive';
import { ShipperProvider } from '../providers/shipper/shipper';
import { ReceiverProvider } from '../providers/receiver/receiver';
import { TruckProvider } from '../providers/truck/truck';
import { DriverProvider } from '../providers/driver/driver';

import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { CallNumber } from '@ionic-native/call-number';
import { EmailComposer } from '@ionic-native/email-composer';



@NgModule({
  declarations: [
    MyApp,
    EqualValidator,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    LoadProvider,
    ShipperProvider,
    ReceiverProvider,
    TruckProvider,
    DriverProvider,
    Transfer,
    Camera,
    FilePath,
    CallNumber,
    EmailComposer,
    File
  ]
})
export class AppModule {}
