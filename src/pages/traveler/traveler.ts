import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, ModalController, Platform, AlertController, Events, VirtualScroll, ViewController, PopoverController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { ServiceFactoryThread } from '../../services/ServiceFactoryThread';
import { GlobalDataService } from '../../services/globaldata.service';
import * as firebase from 'Firebase';
import * as $ from 'jquery'
import { MenuRightComponent } from '../../components/menu-right/menu-right';

/**
 * Generated class for the TravelerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var google;

@IonicPage()
@Component({
  selector: 'page-traveler',
  templateUrl: 'traveler.html',
})
export class TravelerPage {
  @ViewChild(Content) content: Content;
  @ViewChild('map') mapElement: ElementRef; // Added
  @ViewChild(VirtualScroll) virtualScroll: VirtualScroll;
  pet: string = "1";
  map: any; // Added 
  drawerOptions: any;
  images: any = [];
  namemap: string;
  datafeed: any = [];
  datafeed2: any = [];
  check: boolean = false;
  numLoad: number = 0;
  mylat: string;
  mylong: string;
  user: any;
  follow: boolean;
  chkf: boolean = true;
  items = this.gd.Country;
  countryselect: string;
  ref = firebase.database().ref('chatrooms/');
  lat: any;
  long: any;
  ckRefresh: any = "";
  getSearch: any = [];
  fillterSel: any = '';
  countuser: any = 1;
  type_page: any = '0'; //0 = traveler, 1 = chat
  itemMain: any = [];
  list_chat: any = [];
  distant: any = 1;
  maxHeard: any = 130;
  marginDefault: any = $('ion-tab[aria-hidden="false"]  page-traveler:last .scroll-content').css('margin-top');


  constructor(public popoverCtrl: PopoverController, public viewCtrl: ViewController, public events: Events, public alertCtrl: AlertController, public platform: Platform, public navCtrl: NavController, private gd: GlobalDataService, private SFT: ServiceFactoryThread, public modalCtrl: ModalController, public navParams: NavParams, public geolocation: Geolocation) {
    console.log(this.marginDefault);
    setTimeout(() => {
      this.marginDefault = $('ion-tab[aria-hidden="false"]  page-traveler:last .scroll-content').css('margin-top');
    }, 1000);
    // SFT.chkGPS();
    events.subscribe('scrollTop2', () => {
      console.log('scrolltop');
      this.content.scrollToTop();
    })
    this.list_chat = gd.roomchat;
    console.log(gd.roomchat);
    setTimeout(() => {
      let t = this;
      $('ion-tab[aria-hidden="false"] page-traveler:last .scroll-content').scroll(function () {
        let height = $($('ion-tab[aria-hidden="false"] page-traveler:last #contentRow')[0]).height();
        let scroll = $(this).scrollTop();
        let calcurate = scroll / height;
        let position = parseInt(calcurate + "");
        if (t.type_page == 0) {
          if (parseInt(t.itemMain[position][0]["dis"]) > 0) {
            t.distant = parseInt(t.itemMain[position][0]["dis"]);
          } else {
            t.distant = 1;
          }
        }
      });
    }, 1000);
    this.ref.on('value', resp => {
    });
    this.drawerOptions = {
      handleHeight: 50,
      thresholdFromBottom: 200,
      thresholdFromTop: 50,
      bounceBack: true
    };


    this.follow = false;
    this.getdata(false, "", "");

    setInterval(() => {
      if (this.fillterSel == "Following") {
        this.getdata(true, "", "Following");
      } else if (this.fillterSel == "country") {
        this.getdata(true, "", "country");
      } else {
        if (this.ckRefresh == "") {
          this.getdata(true, "", "");
        } else {
          this.locationList(true, "", "", this.getSearch);
        }
      }

    }, 300000);

    events.subscribe('refollowlocation', (user, type) => {
      let divshowbottom = this.user.filter((item) => {
        if (item.user_id == user) {
          if (type == 1) {
            item.follow = 1;
          } else {
            item.follow = 0;
          }
        }
      });
    });
  }
  change(id) {
    let t = this;
    if (id == 0) {
      $('ion-tab[aria-hidden="false"] page-traveler:last .scroll-content').animate({ 'margin-top': this.marginDefault }, 200);
    } else {
      const top = (parseInt(this.marginDefault.slice(0, -2)) - 40.8).toString() + 'px';
      $('ion-tab[aria-hidden="false"] page-traveler:last .scroll-content').animate({ 'margin-top': top }, 200);
    }
    this.content.scrollToTop();
  }
  change_tab(data) {
    this.type_page = data;
  }
  segmentChanged(e) {
    console.log(e);

  }
  getdata(chk, refresher, type) {
    console.log('getdata');
    var dataFeeling = {};
    //  setTimeout(() => {


    if (type == 'country') {
      dataFeeling = {
        'data': this.countryselect,
        'type': 'country',
        'lat': this.SFT.userlocation['lat'],
        'long': this.SFT.userlocation['long']
      }
      this.SFT.ServiceThread('locationUser', dataFeeling, 'POST')
        .then(data => {
          // console.log(data['res_result']);
          if (data['res_code'] != '00') {
            this.itemMain = [];
            this.user = [];
            this.countuser = 0;
          } else {
            this.itemMain = [];
            this.user = data['res_result'];
            let array = [];
            for (let index = 0; index < this.user.length; index++) {
              if (array.length == 3) {
                array = [];
              }
              array.push(this.user[index]);
              if ((index % 3) == 0) {
                this.itemMain.push(array);
              }
            }
            this.countuser = 1;
            if (chk) {
              setTimeout(() => {
                try {
                  refresher.complete();
                } catch (error) {

                }

              }, 100);
            }
            // this.user = data['res_result'];
            // this.itemMain = data['res_result'];         

            // this.countuser = 1;
            // if (chk) {
            //   setTimeout(() => {
            //     try {
            //       refresher.complete();
            //     } catch (error) {

            //     }
            //   }, 100);
            // }
          }
        });
    } else {
      // console.log(this.gd.userlocation);
      let dataSend = {
        'lat': this.SFT.userlocation['lat'],
        'long': this.SFT.userlocation['long']
      }
      // this.loadMap(this.gd.userlocation['lat'], this.gd.userlocation['long']);
      // this.gd.locationGet(dataSend);
      this.SFT.ServiceThread('nameLocation', dataSend, 'POST')
        .then(data => {
          if (data['res_code'] == '00') {
            // console.log(data['res_text']);
            this.namemap = data['res_result'];
          } else {
            // console.log(data['res_text']);
          }
        });
      if (type == 'Following') {
        dataFeeling = {
          'type': type,
          'location': this.SFT.userlocation['lat'] + "," + this.SFT.userlocation['long'],
          'lat': this.SFT.userlocation['lat'],
          'long': this.SFT.userlocation['long']
        }
      } else {
        dataFeeling = {
          'location': this.SFT.userlocation['lat'] + "," + this.SFT.userlocation['long'],
          'lat': this.SFT.userlocation['lat'],
          'long': this.SFT.userlocation['long']
        }
      }
      this.getSearch = dataFeeling;
      this.locationList(chk, refresher, type, dataFeeling);
    }

  }


  locationList(chk, refresher, type, data) {
    console.log('locationList');

    // this.gd.gpsLocation().then(data => {
    //   if (data == false) {
    //     try {
    //       refresher.complete();
    //     } catch (error) {

    //     }
    //   }
    // })
    this.SFT.ServiceThread('locationUser', data, 'POST')
      .then(data => {
        console.log(data['res_result']);
        if (data['res_code'] != '00') {
          // console.log(data['res_text']);
          this.user = [];
          this.countuser = 0;
        } else {
          this.itemMain = [];
          this.user = data['res_result'];
          let array = [];
          for (let index = 0; index < this.user.length; index++) {
            if (array.length == 3) {
              array = [];
            }
            array.push(this.user[index]);
            if ((index % 3) == 0) {
              this.itemMain.push(array);
            }
          }
          this.countuser = 1;
          if (chk) {
            setTimeout(() => {
              try {
                refresher.complete();
              } catch (error) {

              }

            }, 100);
          }
          // console.log(data);
        }
      });
    console.log(this.itemMain);

  }
  doRefresh(refresher) {
    // this.chkGPS();
    // console.log(this.getSearch);

    setTimeout(() => {
      if (this.fillterSel == "Following") {
        this.getdata(true, refresher, "Following");
      } else if (this.fillterSel == "country") {
        this.getdata(true, refresher, "country");
      } else {
        if (this.ckRefresh == "") {
          this.getdata(true, refresher, "");
        } else {
          this.locationList(true, refresher, "", this.getSearch);
        }
      }

    }, 200);

  }
  presentPopover(myEvent) {
    $(".share").removeClass('share');
    $("body").addClass('rightMenu');

    let popover = this.popoverCtrl.create(MenuRightComponent, { navCtrl: this.navCtrl });
    popover.present({
      ev: myEvent
    });
  }
  ionViewDidLoad() { // Added this function to loadMap


    $('#filterlocation').html($('#filterL').html());
    $('#filterL').html("");
    $("#DfilterL").click(function () {
      $("#DfilterL").toggle();
      $('#filterlocation').slideToggle();
      $('ion-app').toggleClass('disable-scroll');
    })
  }

  NextPage(page, image) {
    // console.log(image);
    // if (page == 'ProfilePage' && this.gd.userProfile['user_id'] == image['user_id']) {
    //   this.navCtrl.parent.select(4);
    // } else {
    this.gd.nextpage(this.navCtrl, page, { 'data': image })
    // }

  }
  scrollTopFN() {
    this.navCtrl.parent.select(0);
    // $("#segmentTraveler").click();
  }

  gonoti() {
    this.gd.nextpage(this.navCtrl, 'NotificationsPage', {});
  }
  search() {
    // // console.log(5555);
    let modal = this.modalCtrl.create('ModelPage', {});
    modal.present();
    modal.onDidDismiss(data => {

      if (data['place_name'] != null && data['place_name'] != "" && data['place_name'] != undefined) {
        // console.log(data);
        //  this.selectedData = data
        // this.loadMap(data['place_location']['lat'], data['place_location']['lng'])
        this.namemap = data['place_name'];
        this.datafeed.length = 0;
        this.datafeed2.length = 0;
        // this.loading(data['place_location']['lat'], data['place_location']['lng']);
        let dataFeeling = {
          'location': data['place_location']['lat'] + "," + data['place_location']['lng'],
          'lat': data['place_location']['lat'],
          'long': data['place_location']['lng']
        }
        this.getSearch = dataFeeling;
        this.locationList(false, "", "", dataFeeling);
        this.ckRefresh = "search";
      }
    })
  }



  loadMap(latitude, longitude) {

  }







  addMarker() { // To Add Marker
    let latLng = new google.maps.LatLng(this.mylat, this.mylong);
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: latLng,
      icon: "./img/mylocation.png"

    });
  }





  follows(type, index) {
    let datanew = JSON.parse(JSON.stringify(this.gd.userProfile));
    delete datanew.same;
    delete datanew.follow;
    delete datanew.ic;
    delete datanew.samelength;
    delete datanew.status_Follow;
    delete datanew.message;
    delete datanew.data_message;

    let senddata = {
      'follow_user': this.user[index]['user_id'],
      'type': type,
      'data': JSON.stringify(datanew)
    }
    this.SFT.ServiceThread('indefollowing', senddata, 'POST')
      .then(data => {
        let divshowbottom = this.user.filter((item) => {
          if (item.user_id == this.user[index]['user_id']) {
            // console.log(item);
            if (type == 1) {
              item.follow = 1;
              item.followers += 1;
              this.gd.userProfile.following += 1;
              this.events.publish('refollowlocation', this.user[index]['user_id'], 1);
              this.events.publish('refollowDetail', this.user[index]['user_id'], 1);
            } else {
              item.follow = 0;
              item.followers -= 1;
              this.gd.userProfile.following -= 1;
              this.events.publish('refollowlocation', this.user[index]['user_id'], 2);
              this.events.publish('refollowDetail', this.user[index]['user_id'], 2);
            }
          }
        });
        // console.log(data);
      });
    if (type == 1) {
      // console.log('เพิ่ม');
      this.user[index]['follow'] = true;
      setTimeout(() => {
        $('ion-tab[aria-hidden="false"]  page-traveler:last .locatFID' + index).addClass('bounceIn animated');
        setTimeout(() => {
          $('ion-tab[aria-hidden="false"]  page-traveler:last .locatFID' + index).removeClass('bounceIn animated');
        }, 1500);
      }, 100);
    } else {
      // console.log('ลบ');
      this.user[index]['follow'] = false;
      setTimeout(() => {
        $('ion-tab[aria-hidden="false"]  page-traveler:last .locatFD' + index).addClass('bounceIn animated');
        setTimeout(() => {
          $('ion-tab[aria-hidden="false"]  page-traveler:last .locatFD' + index).removeClass('bounceIn animated');
        }, 1500);
      }, 100);
    }
  }


  chat(datas) {

    // let newData = this.ref.push();
    // newData.set({
    //   roomname:"test"
    // });
    if (this.gd.clickGo) {
      this.gd.clickGo = false;
      this.SFT.ServiceThread('check_room', { 'user_id': this.gd.userProfile['user_id'], 'user_to': datas['user_id'] }, 'POST')
        .then(data => {
          console.log(data);
          console.log(this.gd.roomchat);
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
            this.SFT.ServiceThread('addroom', senddata, 'POST')
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


  presentfilter() {
    var t = this;
    $("#DfilterL").toggle();
    $('#filterlocation').slideToggle();
    $('ion-app').toggleClass('disable-scroll');
    if (this.chkf) {
      this.chkf = false;
      $('tr .nopadding #Country').click(function () {
        try {
          $('#CountryFilter').slideToggle("slow");
          $($(this)[0]['children'][0]).toggleClass('icon-arrow-up')
        } catch (error) { }
      })

      $('.inLineList button').click(function () {
        $('.inLineList button').css('background-color', 'transparent');
        $(this).css('background-color', '#ffffff57');
        t.countryselect = $(this)[0].innerText;
        t.getdata(false, false, "country");
        t.fillterSel = "country";
        t.closefilter();
        $('#filterlocation .check_New').removeClass('check_New');
        $('#filterlocation .fillterList').removeClass('fillterList');

      })

      $("#searchTerm").on("keyup", function () {
        t.fliters();
      })
      $('#filterlocation tr .btnfilter').click(function () {
        $('#filterlocation .check_New').removeClass('check_New');
        $($(this)[0]['children'][0]).toggleClass('check_New');
        $('#filterlocation .fillterList').removeClass('fillterList');
        $($(this)[0]['children'][0]).toggleClass('fillterList');
        if ($.trim($(this)[0].innerText) == "Following") {
          t.getdata(false, false, "Following");
          t.fillterSel = "Following";
        } else {
          t.getdata(false, "", "");
          t.fillterSel = "";
        }
        t.closefilter();
      })
    }
  }

  closefilter() {
    $("#DfilterL").toggle();
    $('#filterlocation').slideToggle();
    $('ion-app').toggleClass('disable-scroll');
  }


  fliters() {
    var t = this;
    this.items = this.gd.Country;
    var text = $('#searchTerm').val() + "";
    this.items = this.items.filter((el) => el.country_name_en.toLowerCase().indexOf(text.toLowerCase()) > -1);
    var htmls = "";
    this.items.forEach(element => {
      htmls += '    <button class="item item-block item-ios" id="btncountry" ion-item="" style="border: 0px; padding-left: 15%; background-color: transparent; color: white;"><div class="item-inner"><div class="input-wrapper">\
                        <ion-label class="label label-ios">'+ element['country_name_en'] +
        '</ion-label></div>\
                        </div><div class="button-effect"></div>\
                    </button>';
    });
    $('.inLineList').html(htmls)
    $('.inLineList button').click(function () {
      $('.inLineList button').css('background-color', 'transparent');
      $(this).css('background-color', '#ffffff57');
      t.countryselect = $(this)[0].innerText;
      t.getdata(false, false, "country");
      t.closefilter();
      $('#filterlocation .check_New').removeClass('check_New');
    })
  }

  openModal(dataSend) {
    // this.gd.nextpage(this.navCtrl, "ProfilePage", {data: dataSend})
    console.log(dataSend);
    let modal = this.modalCtrl.create('ModalProfilePage', { data: dataSend });
    modal.present();
    modal.onDidDismiss(res => {
      if (res == '1') {
        this.gd.nextpage(this.navCtrl, "ProfilePage", { data: dataSend })
      } else if (res == '2') {
        this.chat(dataSend);
      }
    });
  }

}
