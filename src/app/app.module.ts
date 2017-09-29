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
    TruckProvider
  ]
})
export class AppModule {}
