import { Component } from "@angular/core";
import { Platform } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { GlobalDataService } from "../services/globaldata.service";
import * as $ from "jquery";
import { Storage } from "@ionic/storage";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { ServiceFactoryThread } from "../services/ServiceFactoryThread";


const config = {
  apiKey: "AIzaSyCgCdlkt3XbZhT8jK0Xk2teiXrrZVzR_Bo",
  authDomain: "adventureearth-4343d.firebaseapp.com",
  databaseURL: "https://adventureearth-4343d.firebaseio.com",
  projectId: "adventureearth-4343d",
  storageBucket: "adventureearth-4343d.appspot.com",
  messagingSenderId: "145451048347",
};

@Component({
  templateUrl: "app.html",
})
export class MyApp {
  rootPage:any = 'LoginPage';
  // rootPage: any = "SplashLoadPage";

  constructor(
    private SFT: ServiceFactoryThread,
    private storage: Storage,
    private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private gd: GlobalDataService,

  ) {
    this.initializeApp();
    firebase.initializeApp(config);
    // storage.get('email').then((val) => {
    //   console.log(val);
    //   if (val != null && val != '' && val != undefined) {
    //     storage.get('user_api_key').then((vall) => {
    //       if (vall != null) {
    //         this.SFT.user_api_key = vall;
    //         this.rootPage = 'TabsPage';
    //       }
    //     })
    //   } else {
    //     this.rootPage = 'LoginPage';
    //   }
    // })
    platform.ready().then(() => {
      console.log("platform width", platform.width());
      console.log("platform height", platform.height());


      statusBar.styleDefault();
      splashScreen.hide();
      if (window.indexedDB) {
        console.log("I have WKWebview installed!");
      } else {
        console.log("I have UIWebView installed!");
      }
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      setTimeout(() => {
        this.splashScreen.hide();
      }, 1000);
    });
    // this.googleAnalyticsTrackingHandler();
  }
}
