import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, Platform, ModalController, PopoverController } from 'ionic-angular';
import { GlobalDataService } from '../../services/globaldata.service';
import { ServiceFactoryThread } from '../../services/ServiceFactoryThread';
import { Geolocation } from '@ionic-native/geolocation';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import * as firebase from 'Firebase';
import { MenuRightComponent } from '../../components/menu-right/menu-right';
import * as $ from 'jquery'

/**
 * Generated class for the TicketPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var QRCode: any;
declare var google;

@IonicPage()
@Component({
  selector: 'page-ticket',
  templateUrl: 'ticket.html',
})
export class TicketPage {
  @ViewChild('map') mapElement: ElementRef; // Added
  map: any; // Added
  mlist = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  dataget: any = this.navParams.get('data');
  datashow: any = this.navParams.get('data');
  location: any = [];
  image: any = ['http://www.myadventureearth.com/data/data_photos/1005/img_base64/1544258094.2018-12-08-15-34-5415122.jpg'];
  image_base64: any = [];
  image2: any = '';
  dateStart: any = '';
  meeting: any = [];
  secment: boolean = false;
  ref = firebase.database().ref('chatrooms/');
  guests:any = [];

  constructor(public popoverCtrl: PopoverController, public modalCtrl: ModalController, public platform: Platform, public iab: InAppBrowser, public geolocation: Geolocation, public actionSheetCtrl: ActionSheetController, public serviceFactoryThread: ServiceFactoryThread, private gd: GlobalDataService, public navCtrl: NavController, public navParams: NavParams) {
    setTimeout(() => {
      new QRCode(document.getElementById("qrcodeFrame"), this.dataget.booking_code_order);
      this.meeting = this.dataget.packet_meeting.filter(word => word.id_meet == this.dataget.booking_Meeting_ID)[0];
      console.log(this.meeting);
      // let parts = this.dataget.packet_start.split('-');
      // let mydate = new Date(parseInt(parts[0]) , parseInt(parts[1]) - 1, parseInt(parts[2]));
      // let day = mydate.getDate();
      // let monthIndex = mydate.getMonth();
      // let year = mydate.getFullYear();
      // this.dateStart = this.mlist[monthIndex] + ' ' + day + ', ' + year;
      let guestArray = this.dataget.Booking_Guest.split(',');
      console.log(guestArray);
      guestArray.forEach(element => {
        console.log(element);

        let split = element.trim().split(' ');
        let filter = this.dataget.package_price.filter(message => message.price_name === split[0])[0];
        console.log(split, filter,this.dataget);
        let dataG = {
          text: element + ' X ' + filter.price,
          price: 'THB ' + (parseInt(filter.price) * parseInt(split[1])),
        };
        this.guests.push(dataG);
      });
      console.log(this.guests);
    }, 200);
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

  ionViewDidLoad() {
    console.log(this.dataget);
  }


  imageTo() {

    let modalbirthday = this.modalCtrl.create('SaveImagePage', { data: this.dataget, meeting: this.meeting });
    modalbirthday.onDidDismiss(data => {
      console.log(data);
    });
    modalbirthday.present();
  }

  nextPage() {
    this.datashow.type_page = 'detail';
    this.gd.nextpage(this.navCtrl, "BookingdetailPage", { 'data': this.datashow });
  }

  loadmap() {
    this.location.name = this.dataget['packet_meeting'];
    this.location.latitude = this.dataget['meeting_lat'];
    this.location.longitude = this.dataget['meeting_lng'];
    if (this.gd.platformtype == 'ios') {

      let actionSheet = this.actionSheetCtrl.create({
        buttons: [
          {
            text: 'Open in Google Maps',
            cssClass: "setting_img",
            handler: () => {
              this.geolocation.getCurrentPosition().then((position) => {
                // window.open('https://www.google.com/maps/?daddr=' + this.location.latitude + ',' + this.location.longitude, '_system');
                this.iab.create('https://www.google.com/maps/?daddr=' + this.location.latitude + ',' + this.location.longitude, '_system');
              }, (err) => {
              });
            }
          }, {
            text: 'Open in Maps',
            cssClass: "setting_img",
            handler: () => {
              this.geolocation.getCurrentPosition().then((position) => {
                this.iab.create('maps://?q=' + this.location.name + '&saddr=' + position.coords.latitude + ',' + position.coords.longitude + '&daddr=' + this.location.latitude + ',' + this.location.longitude, '_system');
              }, (err) => {
              });
            }
          }
        ]
      });
      actionSheet.present();
    } else {
      this.geolocation.getCurrentPosition().then((position) => {
        if (this.platform.is('android')) {
          // window.open('geo://' + position.coords.latitude + ',' + position.coords.longitude + '?q=' + this.location.latitude + ',' + this.location.longitude + '(' + this.location.name + ')', '_system');
          this.iab.create('geo://' + position.coords.latitude + ',' + position.coords.longitude + '?q=' + this.location.latitude + ',' + this.location.longitude + '(' + this.location.name + ')', '_system');
        };
      }, (err) => {
      });
    }
  }

  getMap() {
    let latLng = new google.maps.LatLng(this.dataget.package_lat, this.dataget.package_lng);
    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      gestureHandling: 'cooperative'
    }
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);


    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });
    // var t = this;
  }
  showDetail() {
    this.secment = !this.secment;
    setTimeout(() => {
      this.getMap();
    }, 1000);
  }
  chat(datas) {
    console.log(datas);
    if (this.gd.userProfile['user_id'] != datas['user_id']) {
      if (this.gd.clickGo) {
        this.gd.clickGo = false;
        this.serviceFactoryThread.ServiceThread('check_room', { 'user_id': this.gd.userProfile['user_id'], 'user_to': datas['user_id'] }, 'POST')
          .then(data => {
            if (data['res_code'] == '00') {
              let dataroom = this.gd.roomchat.filter(message => message.room_name === data['res_result']);
              this.gd.nextpage(this.navCtrl, "ChatPage", { 'key': data['res_result'], 'imguser': datas['user_path_img'], 'data': dataroom[0] });
            } else {
              let newData = this.ref.push();
              newData.set({
                roomname: this.gd.userProfile['user_id'] + '/' + datas['user_id']
              });
              let senddata = {
                'key': newData.key,
                'to_user': datas['user_id']
              }
              this.serviceFactoryThread.ServiceThread('addroom', senddata, 'POST')
                .then(data => {
                  this.gd.chat().then(() => {
                    datas['room_name'] = newData.key;
                    this.gd.chat();
                    this.gd.nextpage(this.navCtrl, "ChatPage", { 'key': newData.key, 'imguser': datas['user_path_img'], 'data': datas });
                  })
                });
            }
          });
      }
    }
  }



}
