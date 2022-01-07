import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, PopoverController } from 'ionic-angular';
import { GlobalDataService } from '../../services/globaldata.service';
import { ServiceFactoryThread } from '../../services/ServiceFactoryThread';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MenuRightComponent } from '../../components/menu-right/menu-right';

import { app } from 'firebase';
import * as firebase from 'Firebase';
import * as $ from 'jquery'


/**
 * Generated class for the BookingExplorePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-booking-explore',
  templateUrl: 'booking-explore.html',
})
export class BookingExplorePage {
  ref = firebase.database().ref('shopComment/');
  firebaseConnect: any;
  data_get:any = [];
  constructor(public popoverCtrl: PopoverController, private gd: GlobalDataService, public navCtrl: NavController, public navParams: NavParams, public serviceFactoryThread: ServiceFactoryThread, ) {
    this.data_get = navParams.get('data');
    console.log(navParams.get('data'));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BookingExplorePage');
  }
  goProfile(image){
    this.gd.nextpage(this.navCtrl, 'ProfilePage', { 'data': image })
  }
  presentPopover(myEvent) {
    $(".share").removeClass('share');
    $("body").addClass('rightMenu');
    let popover = this.popoverCtrl.create(MenuRightComponent, { navCtrl: this.navCtrl });
    popover.present({
      ev: myEvent
    });
  }
  nextPage(dataget) {
    console.log(dataget);
    this.checkroom(dataget).then(data => {
      this.gd.nextpage(this.navCtrl, 'BookingdetailPage', { data: dataget });
    })
  }

  checkroom(getData) {
    return new Promise((resolve, reject) => {
      if (getData.package_room_key == "") {
        let datasend = {
          "id": getData.packet_id,
          "key": '',
        }
        this.serviceFactoryThread.ServiceThread("check_key_comment_package", datasend, "POST").then(data => {
          console.log(data);
          if (data["res_code"] == '00') {
            getData.package_room_key = data["res_result"]["res_result"];
            resolve();
          } else {
            this.createRoom(getData).then(data => {
              getData.package_room_key = data;
              let datasend = {
                "id": getData.packet_id,
                "key": data,
              }
              this.serviceFactoryThread.ServiceThread("check_key_comment_package", datasend, "POST").then(data => {
                console.log('add_room');
                resolve();
              });
            })

          }
        });
      } else {
        resolve();
      }
    });

  }
  createRoom(getData) {
    return new Promise((resolve, reject) => {
      let newData = this.ref.push();
      newData.set({
        roomname: getData.packet_id,
      });
      resolve(newData.key);
    })
  }

}
