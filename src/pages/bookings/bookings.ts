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
 * Generated class for the BookingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bookings',
  templateUrl: 'bookings.html',
  animations: [
    trigger(
      'myAnimation',
      [
        transition(':enter',
          [style({ height: '0px', opacity: 0 }),
          animate('200ms', style({ height: '*', 'opacity': 1 }))]),

        transition(':leave',
          [style({ height: '*', 'opacity': 1 }),
          animate('200ms', style({ height: '0px', 'opacity': 0 }))])
      ])
  ]
})
export class BookingsPage {
  @ViewChild('slideP') slides: Slides;
  ref = firebase.database().ref('shopComment/');
  firebaseConnect: any;
  popularData: any = [];
  filterOpen: any = '';
  province: any = [];
  popularText: any = { name: 'Popular Activities', id: '' };
  wheretogoText: any = { name: 'Where to go?', id: '' };
  package:any = [];
  category:any = [];

  constructor(public popoverCtrl: PopoverController, private gd: GlobalDataService, public navCtrl: NavController, public navParams: NavParams, public serviceFactoryThread: ServiceFactoryThread, ) {
    var dt = new Date(1571388208601 * 1000);
    var hr = dt.getHours();
    var m = "0" + dt.getMinutes();
    var s = "0" + dt.getSeconds();
    console.log(hr + ':' + m.substr(-2) + ':' + s.substr(-2));
    let datasend = {
      user_lat: 1,
      user_lng: 100,
      widthphone: 360,
      type_search: 'feed'
    }
    serviceFactoryThread.ServiceThread('get_package', datasend, "POST").then(data => {
      console.log(data);
      this.package = data["res_result"];

    })
    serviceFactoryThread.ServiceThread('get_booking_category', {}, "POST").then(data => {
      console.log(data);
      if(data["res_code"] == '00'){
        this.category = data["res_result"];
      }
    })
  }
  scrollTopFN() {
    this.navCtrl.parent.select(0);
  }
  ionViewDidLoad() {
    this.getPopularAc();
    this.getProvince();
    setTimeout(() => {
      console.log(this.gd.TypeLocation);
    }, 1000);
  }
  doRefresh(event){
    var dt = new Date(1571388208601 * 1000);
    var hr = dt.getHours();
    var m = "0" + dt.getMinutes();
    var s = "0" + dt.getSeconds();
    console.log(hr + ':' + m.substr(-2) + ':' + s.substr(-2));
    let datasend = {
      user_lat: 1,
      user_lng: 100,
      widthphone: 360,
      type_search: 'feed'
    }
    this.serviceFactoryThread.ServiceThread('get_package', datasend, "POST").then(data => {
      console.log(data);
      this.package = data["res_result"];
      event.complete();
    })
    this.getPopularAc();
    this.getProvince();
  }

  getPopularAc() {
    let data = {
      province: this.wheretogoText.id,
      activity: this.popularText.id,
      type_query: 'popular',
      widthphone: $('ng-component').width()
    }
    this.serviceFactoryThread.ServiceThread('getPacket', data, 'POST').then(data => {
      console.log(data);
      if (data['res_code'] == '00') {
        this.popularData = data["res_result"][0];
      }
    })
  }

  getProvince() {
    this.serviceFactoryThread.ServiceThread('get_package_province', {}, 'POST').then(data => {
      console.log(data);
      if (data['res_code'] == '00') {
        this.province = data["res_result"];
      }
    })
  }

  slidePrev() {
    this.slides.slidePrev();
  }
  slideNext() {
    this.slides.slideNext();
  }
  nextPage() {
    this.checkroom(this.popularData).then(data => {
      console.log(this.popularData);
      
      this.gd.nextpage(this.navCtrl, 'BookingdetailPage', { data: this.popularData });
    })
  }
  goProfile(image){
    this.gd.nextpage(this.navCtrl, 'ProfilePage', { 'data': image })
  }
  nextDetail(dataGet){    
    this.checkroom(dataGet).then(data => {
      console.log(dataGet);
      this.gd.nextpage(this.navCtrl, 'BookingdetailPage', { data: dataGet });
    })
  }

  openFilter(type) {
    if (this.filterOpen != type) {
      this.filterOpen = type;
    } else {
      this.filterOpen = '';
    }
  }

  selectFilter(type, data) {
    if (type == 1) {
      this.wheretogoText = { name: data.province_name_en, id: data.province_id };
    } else {
      this.popularText = { name: data.cat_name, id: data.cat_id };
    }
    this.filterOpen = '';
  }

  filter(type) {
    // this.getPopularAc();
    let data_send;
    if(type == '1'){
      data_send = {
        type_search: 'feed',
        province: this.wheretogoText,
        activity: this.popularText,
      }
    }else if(type == '2'){
      data_send = {
        type_search: 'explore',
        province: this.wheretogoText.id,
        activity: this.popularText.id,
        widthphone: 360,
      }
      console.log(data_send);
      
      this.serviceFactoryThread.ServiceThread('get_package',data_send,'POST').then(data => {
        console.log(data);
        this.package = data["res_result"];
      })
    }

    // this.gd.nextpage(this.navCtrl, 'BookingExplorePage', data_send);
    
  }
  presentPopover(myEvent) {
    $(".share").removeClass('share');
    $("body").addClass('rightMenu');
    let popover = this.popoverCtrl.create(MenuRightComponent, { navCtrl: this.navCtrl });
    popover.present({
      ev: myEvent
    });
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

  seeAll(data){
    this.gd.nextpage(this.navCtrl, 'BookingExplorePage', {data:data})
  }
  showProvince(main){
    if(main.Section_ST == '1'){
      main.Section_ST = '0';
    }else{
      main.Section_ST = '1';
    }
  }
  chooserProvince(main,province){
    main.Section_ST = '0';
    console.log(main,province);
    main.Section_Sub.forEach(element => {
      element.Sub_Package.forEach(packet => {
        if(province.province_id == packet.package_province){
          packet.st_show = '1';
        }else{
          packet.st_show = '0';
        }
      });
    });
  }

}
