import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ServiceFactoryThread } from '../../services/ServiceFactoryThread';
import { GlobalDataService } from '../../services/globaldata.service';

/**
 * Generated class for the CoconutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-coconut',
  templateUrl: 'coconut.html',
})
export class CoconutPage {
  img = this.navParams.get('data');
  type = this.navParams.get('type');
  title = this.navParams.get('title');
  Profile = this.navParams.get('Profile');
  num = this.navParams.get('num');




  data: any;
  constructor(public navCtrl: NavController, public gd: GlobalDataService, public navParams: NavParams, public serviceFactoryThread: ServiceFactoryThread) {
    // // console.log(this.Profile['user_id']);
    // console.log(this.Profile.following);
    if (this.title && this.type) {
      this.serviceFactoryThread.ServiceThread('followme', { "type": this.type, 'user_id': this.Profile['user_id'] }, 'POST')
        .then(data => {
          if (data['res_code'] != '00') {
            // console.log(data);
          } else {
            // console.log(data);
            this.data = data['res_result'];
          }
        });
    } else {
      this.title = " Coconuts"
      serviceFactoryThread.ServiceThread('coconut', { 'photo_id': this.img['photo_id'], 'userType': this.img['user_id'] }, 'POST')
        .then(data => {
          // console.log();
          if (data['res_code'] != "00") {
            // console.log(data['res_text']);
          } else {
            this.data = data['res_result'];
          }
        }, (err) => {
          // console.log(err);
        });
    }
  }


  NextPage(page, image) {
    // console.log(image);
    if (page == 'ProfilePage' && this.gd.userProfile['user_id'] == image['user_id']) {
      this.navCtrl.parent.select(4);
    } else {
      this.gd.nextpage(this.navCtrl, page, { 'data': image })
    }
  }





  ionViewDidLoad() {
    // console.log('ionViewDidLoad CoconutPage');
  }

  follow(type, index) {
    // console.log(this.data);

    let senddata = {
      'follow_user': this.data[index]['user_id'],
      'type': type
    }
    this.serviceFactoryThread.ServiceThread('indefollowing', senddata, 'POST')
      .then(datas => {
        // console.log(datas);
        if (datas['res_code'] != '00') {
          // console.log(datas['res_text']);
        } else {
          if (type == 1) {
            // console.log('เพิ่ม');
            // this.Profile['followers']= this.Profile['followers']+1;
            this.data[index]['follow'] = 1;
            // this.num =  parseInt(this.num)+1;
            this.gd.userProfile.following = this.gd.userProfile.following + 1;

          } else {
            // console.log('ลบ');
            // this.Profile['followers']= this.Profile['followers']-1;
            this.data[index]['follow'] = 0;
            this.gd.userProfile.following = this.gd.userProfile.following - 1;
          }
        }
      });

  }


}
