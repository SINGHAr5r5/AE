import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { ServiceFactoryThread } from '../../services/ServiceFactoryThread';
import { GlobalDataService } from '../../services/globaldata.service';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the RepasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-repassword',
  templateUrl: 'repassword.html',
})
export class RepasswordPage {
  data: any = {};
  oldPassword: any;
  constructor(public navCtrl: NavController, private storage: Storage, public gd: GlobalDataService, public serviceFactoryThread: ServiceFactoryThread, public viewCtrl: ViewController, private alertCtrl: AlertController, public navParams: NavParams) {
    this.data.NewPassword="";
    storage.get('password').then((val) => {
      this.oldPassword = val;
    })
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad RepasswordPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
  send() {
    if (this.data.OldPassword != this.oldPassword) {
      this.gd.toast('Old passwords not match.');
    } else if (this.data.NewPassword != this.data.Confirm) {
      this.gd.toast('Confirm new password not match.');
    } else if (!this.gd.checklength(this.data.NewPassword, 6)) {
      this.gd.toast('Password must be more than 6 characters.');
    } else {
      try {
        // console.log($('.page1')[0]['textContent']);
        let alert = this.alertCtrl.create({
          // title: 'Confirm ResetPassword',
          message: 'Confirm Reset Password ?',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
                // console.log('Cancel clicked');
              }
            },
            {
              text: 'Edit',
              handler: () => {
                // console.log('Buy clicked');
                // console.log('send');

                this.serviceFactoryThread.ServiceThread('UpdatePassword', this.data, 'POST')
                  .then(datas => {
                    if (datas['res_code'] == '00') {
                      this.gd.toast(datas['res_result']);
                      this.storage.set('password', this.data['NewPassword']);
                      this.viewCtrl.dismiss();
                      // console.log(datas['res_result']);
                    } else {
                      // console.log(datas['res_text']);
                    }
                  });
              }
            }
          ]
        });
        alert.present();
      } catch (error) {
        

      }
    }
    // try {
    //       // console.log($('.page1')[0]['textContent']);

    // } catch (error) {
    //       let alert = this.alertCtrl.create({
    //         // title: 'Confirm ResetPassword',
    //         message: 'Confirm ResetPassword ?',
    //         buttons: [
    //           {
    //             text: 'Cancel',
    //             role: 'cancel',
    //             handler: () => {
    //               // console.log('Cancel clicked');
    //             }
    //           },
    //           {
    //             text: 'Edit',
    //             handler: () => {
    //               // console.log('Buy clicked');
    //               // console.log('send');

    //               this.serviceFactoryThread.ServiceThread('UpdatePassword',this.data , 'POST')
    //               .then(datas => {
    //                 if (datas['res_code'] == '00') {
    //                   this.gd.toast(datas['res_result']);
    //                   this.storage.set('password',this.data['NewPassword']);
    //                   this.viewCtrl.dismiss();
    //                   // console.log(datas['res_result']);
    //                 } else {
    //                   // console.log(datas['res_text']);
    //                 }
    //               });
    //             }
    //           }
    //         ]
    //       });
    //       alert.present();

    // } 

  }


}
