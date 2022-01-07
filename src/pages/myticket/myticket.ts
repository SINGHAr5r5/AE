import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, PopoverController } from 'ionic-angular';
import { GlobalDataService } from '../../services/globaldata.service';
import { ServiceFactoryThread } from '../../services/ServiceFactoryThread';
import { MenuRightComponent } from '../../components/menu-right/menu-right';
import * as $ from 'jquery'
/**
 * Generated class for the MyticketPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-myticket',
  templateUrl: 'myticket.html',
})
export class MyticketPage {
  postEvent: any = [];
  incommentEvent: any = [];
  lastestEvent: any = [];
  monthLista: any = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  status: boolean = false;
  linit_last: any = 1;
  limit_incoming: any = 1;
  limit_post: any = 1;
  datadype:any = this.navParams.get('data');
  dataRes:any = [];

  constructor(public popoverCtrl: PopoverController,public modalCtrl: ModalController, public serviceFactoryThread: ServiceFactoryThread, private gd: GlobalDataService, public navCtrl: NavController, public navParams: NavParams) {
    this.getData('');
  }
  gobooking(){
    this.navCtrl.popToRoot();
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
  getData(refresher) {
    // this.serviceFactoryThread.ServiceThread("get_booking", { 'user_id': this.gd.userProfile.user_id }, "post").then(data => {
    this.serviceFactoryThread.ServiceThread("get_booking", { 'user_id': '55' }, "post").then(data => {
      console.log(data);
      if (data["res_code"] == '00') {
        
        this.postEvent = [];
        this.incommentEvent = [];
        this.lastestEvent = [];
        let index = 0;
        this.dataRes = data["res_result"];
        // data["res_result"].forEach(element => {
        //   element.month = this.monthLista[new Date(element.booking_date).getMonth()];
        //   element.day = new Date(element.booking_date).getDate();
        //   element.year = new Date(element.booking_date).getFullYear();
        //   if (index == 0 && new Date(element.booking_date) >= new Date()) {
        //     this.lastestEvent.push(element);
        //   } else if (new Date(element.booking_date) >= new Date()) {
        //     this.incommentEvent.push(element);
        //   } else {
        //     this.postEvent.push(element);
        //   }
        //   index++;
        // });
        if(this.datadype == 'status'){
          let datasend = {
            'booking_code': data["res_result"][0].booking_code_order,
            'lat': this.serviceFactoryThread.userlocation.lat,
            'lng': this.serviceFactoryThread.userlocation.long,
            'widthPhone': $('ng-component').width()
          }
          this.serviceFactoryThread.ServiceThread("get_booking_detail", datasend, "POST").then(data => {
            this.gd.nextpage(this.navCtrl, "PaymentStatusPage", { 'data': data['res_result'] });
          });
        }
        if (this.status) {
          setTimeout(() => {
            refresher.complete();
          }, 500);
        }
      }
    })
  }
  doRefresh(refresher) {
    this.getData(refresher);
    this.status = true;
  }
  seeMore(data) {
    if (data == 1) {
      this.linit_last = 50;
    } else if (data == 2) {
      this.limit_incoming = 50;
    } else if (data == 3) {
      this.limit_post = 50;
    }
  }
  seeless(data) {
    if (data == 1) {
      this.linit_last = 1;
    } else if (data == 2) {
      this.limit_incoming = 1;
    } else if (data == 3) {
      this.limit_post = 1;
    }
  }
  // nextPaged(dataget) {
  //   let datasend = {
  //     'booking_code': dataget.booking_code_order,
  //     'lat': this.gd.userlocation.lat,
  //     'lng': this.gd.userlocation.long,
  //     'widthPhone': $('ng-component').width()
  //   }
  //   this.serviceFactoryThread.ServiceThread("get_booking_detail", datasend, "POST").then(data => {
  //     // this.gd.nextpage(this.navCtrl, "PaymentStatusPage", { 'data': data['res_result'] });
  //   });
  // }
  nextPage(data){
    console.log(data);
    if(data.booking_status == 1){
      this.gd.nextpage(this.navCtrl,'TicketPage',{data:data});
    }
  }
  review(data) {
    
    let modalbirthday = this.modalCtrl.create('ReviewPage', { data: data });
    modalbirthday.onDidDismiss(data => {
      console.log(data);
    });
    modalbirthday.present();
  }
  scrollTopFN() {
    this.navCtrl.parent.select(0);
  }



}
