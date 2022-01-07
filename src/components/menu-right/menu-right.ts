import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController, Events } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { GlobalDataService } from '../../services/globaldata.service';

/**
 * Generated class for the MenuRightComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'menu-right',
  templateUrl: 'menu-right.html'
})
export class MenuRightComponent {

  text: string;

  constructor(public events: Events, private fb: Facebook, private storage: Storage, private alertCtrl: AlertController, public viewCtrl: ViewController, private gd: GlobalDataService, public navCtrl: NavController, public navParams: NavParams) {
    console.log(this.navParams.get('navCtrl'));
    console.log('Hello MenuRightComponent Component');
    this.text = 'Hello World';
  }
  close(type) {
    if (type == '1') {
      this.gd.nextpage(this.navParams.get('navCtrl'), "ProfilePage", { 'data': this.gd.userProfile });
    } else if (type == '2') {
      this.navParams.get('navCtrl').parent.select(2);
    } else if (type == '3') {
      // this.navParams.get('navCtrl').parent.select(2);
      // setTimeout(() => {
        this.gd.nextpage(this.navParams.get('navCtrl'), "MyticketPage", {});
      // }, 500);
    } else if (type == '4') {
      this.gd.nextpage(this.navParams.get('navCtrl'), 'SettingPage', {})
    } else if (type == '5') {
      let alert = this.alertCtrl.create({
        title: 'Confirm Logout',
        message: 'Are you sure you want to log out?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              // console.log('Cancel clicked');
            }
          },
          {
            text: 'Log Out',
            handler: () => {
              this.gd.regisLogout();
              this.events.publish('logout');
              this.storage.clear();
              this.fb.logout().then(res => {
                // console.log('success');
              }).catch(e => console.log('Error logout', e));
            }
          }
        ]
      });
      alert.present();

    }

    this.viewCtrl.dismiss();
  }

}
