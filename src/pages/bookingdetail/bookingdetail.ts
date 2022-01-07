import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, PopoverController } from 'ionic-angular';
import { GlobalDataService } from '../../services/globaldata.service';
import { ServiceFactoryThread } from '../../services/ServiceFactoryThread';
import { app } from 'firebase';
import * as firebase from 'Firebase';
import * as $ from 'jquery'

import { trigger, state, style, transition, animate } from '@angular/animations';
import { MenuRightComponent } from '../../components/menu-right/menu-right';

/**
 * Generated class for the BookingDetailNewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var google;
@IonicPage()
@Component({
  selector: 'page-bookingdetail',
  templateUrl: 'bookingdetail.html',
  animations: [
    trigger(
      'myAnimation',
      [
        transition(':enter',
          [style({ height: '0px', opacity: 0, padding: '0px', margin: '0px 0px 0px 0px' }),
          animate('200ms', style({ height: '*', 'opacity': 1, padding: '10px', margin: '0px 0px 10px 0px' }))]),

        transition(':leave',
          [style({ height: '*', 'opacity': 1, padding: '10px', margin: '0px 0px 10px 0px' }),
          animate('200ms', style({ height: '0px', 'opacity': 0, padding: '0px', margin: '0px 0px 0px 0px' }))])
      ])
  ]
})
export class BookingdetailPage {
  @ViewChild('slideP') slides: Slides;
  @ViewChild('map') mapElement: ElementRef; // Added
  ref = firebase.database().ref('shopComment/');
  firebaseConnect: any;
  map: any; // Added
  getData: any = this.navParams.get('data');
  rate_review: any = 0;
  commentText: any = '';
  commentRate: any = 0;
  keyRoom: any = '';
  arrayComment: any = [];
  reviewCount: any = 0;
  sortST: any = 0;
  limitComment: any = 5;


  constructor(public popoverCtrl: PopoverController, private gd: GlobalDataService, public navCtrl: NavController, public navParams: NavParams, public serviceFactoryThread: ServiceFactoryThread) {
    console.log(navParams.get('data'));

  }

  goProfile(image) {
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
    console.log('ionViewDidLoad BookingDetailNewPage');
    this.loadMap();
    this.getRate();
    this.getComment();
  }
  scrollTopFN() {
    this.navCtrl.parent.select(0);
  }

  loadMap() {
    console.log(this.getData.package_lat);
    console.log(this.getData.package_lng);


    let latLng = new google.maps.LatLng(this.getData.package_lat, this.getData.package_lng);
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
    var t = this;

    setTimeout(() => {
      // this.addMarker();
    }, 2000);
  }

  getRate() {
    this.serviceFactoryThread.ServiceThread('get_rate_package', { package_id: this.getData.packet_id }, 'POST').then(data => {
      console.log(data);
      if (data["res_code"] == "00") {
        this.rate_review = data["res_result"];
        this.reviewCount = this.rate_review.Review.length;
        this.rate_review.Review.forEach(element => {
          console.log(element);
          
          let img = [];
          if (element.image_path != null) {
            element.image_path.split(',').forEach(elements => {
              img.push(elements);
            });
          }

          let datapush = {
            comment: element.Rate_Review,
            date: element.Review_Time,
            dateTime: this.timeConverter(new Date(element.Review_Time).getTime() / 1000),
            fullname: element.user_firstname + " " + element.user_lastname,
            image: img,
            rate: element.Rate_Average,
            userId: element.Rate_User_ID,
            userUrl: element.user_path_img
          };
          this.arrayComment.push(datapush);
        });
        console.log(this.arrayComment);
        
        this.arrayComment.forEach((element, index) => {
          let url = "";
          if (this.gd.likeUser.map((el) => el.user_id).indexOf(element.userId) == '-1') {
            let datasend = {
              "idUser": element.userId
            }
            this.serviceFactoryThread.ServiceThread("imgComment", datasend, "POST").then(data => {
              if (data["res_code"] == "00") {
                data["res_result"].forEach(element => {
                  console.log(element);
                  
                  this.gd.likeUser.push(element);
                  url = element["user_photo"];
                  this.arrayComment[index]["userUrl"] = element["user_photo"];
                  console.log(this.arrayComment[index]);
                  
                });
              }

            })
          } else {
            this.gd.likeUser.filter(data => {
              if (data.user_id === element.userId) {
                url = data.user_photo;
                this.arrayComment[index]["userUrl"] = data.user_photo;
              }
            });
          }
        });

      }


    })
  }

  sendRate(score) {
    if (this.commentRate == score) {
      this.commentRate = 0;
    } else {
      this.commentRate = score;
    }
  }

  saveComment() {
    console.log();

    let newData = firebase.database().ref('shopComment/' + this.getData.package_room_key + '/comment/').push();
    let datasend = {
      fullname: this.gd.userProfile['user_firstname'] + " " + this.gd.userProfile['user_lastname'],
      userId: this.gd.userProfile['user_id'],
      // fullname: 'Amnart Ratchakom',
      // userId: '55',
      comment: this.commentText,
      rate: this.commentRate,
      date: firebase.database.ServerValue.TIMESTAMP,
      status: '0'
    }
    newData.set(datasend);
  }
  getComment() {
    // firebase.database().ref('shopComment/' + this.getData.package_room_key + '/comment').off();
    // firebase.database().ref('shopComment/' + this.getData.package_room_key + '/comment').on('value', resp => {
    //   this.snap(resp).then(data => {
    //     console.log(data);
    //     let result:any = [];
    //     result = data;
    //     let countComment = result.filter((item) => {
    //       return item.status != 1;
    //     });
    //     this.reviewCount = countComment.length;
    //     countComment.forEach(element => {
    //       element.dateTime = this.timeConverter(element.date);
    //     });
    //     this.arrayComment = data;
    //     this.arrayComment.forEach((element, index) => {
    //       let url = ""; 
    //       if (this.gd.likeUser.map((el) => el.user_id).indexOf(element.userId) == '-1') {
    //         let datasend = {
    //           "idUser": element.userId
    //         }
    //         this.serviceFactoryThread.ServiceThread("imgComment", datasend, "POST").then(data => {
    //           data["res_result"].forEach(element => {
    //             this.gd.likeUser.push(element);
    //             url = element["user_photo"];
    //             this.arrayComment[index]["userUrl"] = element["user_photo"];
    //           });
    //         })
    //       } else {
    //         this.gd.likeUser.filter(data => {
    //           if (data.user_id === element.userId) {
    //             url = data.user_photo;
    //             this.arrayComment[index]["userUrl"] = data.user_photo;
    //           }
    //         });
    //       }
    //     });
    //   });
    // })
  }

  snap(data) {
    return new Promise(resolve => {
      let returnArr = [];
      data.forEach(childSnapshot => {
        let item = childSnapshot.val();
        item.key = childSnapshot.key;
        returnArr.push(item);
      });
      resolve(returnArr);
      // return returnArr;
    });
  }

  timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
    return time;
  }

  swiftSort(id) {
    if (this.sortST == id) {
      this.sortST = 0;
    } else {
      this.sortST = 1;
    }
  }

  slidePrev() {
    this.slides.slidePrev();
  }
  slideNext() {
    this.slides.slideNext();
  }
  goChat() {
    let datas = this.getData.user[0];
    if (this.gd.clickGo) {
      this.gd.clickGo = false;
      this.serviceFactoryThread.ServiceThread('check_room', { 'user_id': this.gd.userProfile['user_id'], 'user_to': datas['user_id'] }, 'POST')
        .then(data => {
          console.log(data);
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

                // // console.log(datas);
              });
          }
        });
    }
  };
  booking() {
    this.gd.nextpage(this.navCtrl, 'PaymentPage', { data: this.getData });
  }



}
