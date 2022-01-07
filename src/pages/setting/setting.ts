import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Events, AlertController } from 'ionic-angular';
import { GlobalDataService } from '../../services/globaldata.service';
import { ServiceFactoryThread } from '../../services/ServiceFactoryThread';
import { Facebook } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the SettingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {
  type:any;
  constructor(public navCtrl: NavController,private fb: Facebook, private storage: Storage,private alertCtrl: AlertController,private serviceFactoryThread: ServiceFactoryThread,public modalCtrl: ModalController, private gd: GlobalDataService, public navParams: NavParams,public events: Events) {
    storage.get('password').then((val) => {
      this.type = val;
    });
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad SettingPage');
  }

  EditProfile(){
    // console.log('EditprofilePage');
    let modal = this.modalCtrl.create('EditprofilePage', {});
    modal.present();
    modal.onDidDismiss(data => {
    })
  }
  ResetPassword(){
    // console.log('ResetPassword');
    let modal = this.modalCtrl.create('RepasswordPage', {});
    modal.present();
    modal.onDidDismiss(data => {
    })
  }
  EditPick(){
    // console.log('EditPick');
    this.gd.nextpage(this.navCtrl, 'EditPickPage', {})
  }


  logout(){
      

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
                this.fb.logout().then(res=>{
                  // console.log('success');
                 }).catch(e => console.log('Error logout', e));
           
              }
            }
          ]
        });
        alert.present();
  }

}
