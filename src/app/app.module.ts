import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Keyboard } from '@ionic-native/keyboard';
import { File } from '@ionic-native/file';

import {BrowserAnimationsModule} from "@angular/platform-browser/animations"

import { MyApp } from './app.component';
import { ServiceHttp } from '../services/ServiceHttp';
import { ServiceFactoryThread } from '../services/ServiceFactoryThread';
import { GlobalDataService } from '../services/globaldata.service';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Geolocation } from '@ionic-native/geolocation';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { Facebook } from '@ionic-native/facebook';
import { MenuRightComponent } from '../components/menu-right/menu-right';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Clipboard } from '@ionic-native/clipboard';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Camera } from '@ionic-native/camera';
import { PhotoLibrary } from '@ionic-native/photo-library';
import { Push } from '@ionic-native/push';
import { AppAvailability } from '@ionic-native/app-availability';
import { LocationAccuracy } from '@ionic-native/location-accuracy';

import { Base64 } from '@ionic-native/base64';
import { ImagePicker } from '@ionic-native/image-picker';

import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery';

import { AnalyticsFirebase } from '@ionic-native/analytics-firebase';

import { FileTransfer } from '@ionic-native/file-transfer';

import { VideoEditor } from '@ionic-native/video-editor';

import { Network } from '@ionic-native/network';
import { InViewportService } from 'ng-in-viewport';
import { AppVersion } from '@ionic-native/app-version';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {AngularFireModule} from 'angularfire2';


const firebaseConfig = {
  apiKey: "AIzaSyCgCdlkt3XbZhT8jK0Xk2teiXrrZVzR_Bo",
  authDomain: "adventureearth-4343d.firebaseapp.com",
  databaseURL: "https://adventureearth-4343d.firebaseio.com",
  projectId: "adventureearth-4343d",
  storageBucket: "adventureearth-4343d.appspot.com",
  messagingSenderId: "145451048347",
  appId: "1:145451048347:web:395291b4a68fdf3278d53e",
  measurementId: "G-V80CRCSNWD"
};



@NgModule({
  declarations: [
    MyApp,
    MenuRightComponent,

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MenuRightComponent,

  ],
  providers: [
    StatusBar,
    SplashScreen,
    GlobalDataService,
    ServiceFactoryThread,
    ServiceHttp,
    Diagnostic,
    Geolocation,
    Facebook,
    InAppBrowser,
    Clipboard,
    SocialSharing,
    Camera,
    PhotoLibrary,
    Keyboard,
    File,
    Push,
    AppAvailability,
    LocationAccuracy,
    Base64,
    ImagePicker,
    AndroidPermissions,
    Base64ToGallery,
    AnalyticsFirebase,
    FileTransfer,
    VideoEditor,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Network,
    InViewportService,
    AppVersion

  ]
})
export class AppModule {}
