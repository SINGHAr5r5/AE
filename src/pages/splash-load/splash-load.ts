import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ServiceFactoryThread } from '../../services/ServiceFactoryThread';
import { GlobalDataService } from '../../services/globaldata.service';

/**
 * Generated class for the SplashLoadPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-splash-load',
  templateUrl: 'splash-load.html',
})
export class SplashLoadPage {

  constructor(private gd: GlobalDataService, private SFT: ServiceFactoryThread, private storage: Storage, public navCtrl: NavController, public navParams: NavParams) {
    SFT.ServiceThread("hideStatus", {}, "POST").then(data => {
      
      gd.showbtn = data['res_show'];
      console.log(gd.showbtn);
      
      if(data['res_show'] == '1'){
        SFT.userlocation = { 'lat': '37.4327278137207', 'long': '-121.93013763427734' }
      }
    });
    storage.get('email').then((val) => {
      console.log(val);
      if (val != null && val != '' && val != undefined) {
        storage.get('user_api_key').then((vall) => {
          if (vall != null) {
            this.SFT.STLogin = true;
            this.SFT.user_api_key = vall;
            gd.nextrootpage(navCtrl,'TabsPage', {})
            SFT.GCL();
          }
        })
      } else {
        gd.nextrootpage(navCtrl,'LoginPage', {})
      }
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SplashLoadPage');
  }

}
