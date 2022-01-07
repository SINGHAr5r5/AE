import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, PopoverController } from 'ionic-angular';
import { DELEGATE_CTOR } from '@angular/core/src/reflection/reflection_capabilities';
import { ServiceFactoryThread } from '../../services/ServiceFactoryThread';
import { GlobalDataService } from '../../services/globaldata.service';
import { MenuRightComponent } from '../../components/menu-right/menu-right';
import * as $ from 'jquery'
/**
 * Generated class for the NotificationsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {
  getData: any;
  constructor(public popoverCtrl: PopoverController, public loadingCtrl: LoadingController, public SFT: ServiceFactoryThread, private gd: GlobalDataService, public navCtrl: NavController, public navParams: NavParams) {
    this.get_noti();
    this.update_all();
    this.getData = gd.notiAll;

  }
  update_all(){
    this.SFT.ServiceThread('noti_read_all',{},'POST').then(data => {
      console.log(data);
      if(data["res_code"] == "00"){
        this.gd.sumNoti = 0;
      }
    });
  }
  get_noti() {
    let datasend = {
      'user_id': this.gd.userProfile["user_id"],
      'widthphone': $('ng-component').width(),
      'lat': this.SFT.userlocation['lat'],
      'lng': this.SFT.userlocation['long'],
    }
    // this.serviceFactoryThread.ServiceThread("get_noti", datasend, "POST").then(data => {
    //   console.log(data);
    //   this.getData = data["res_result"];
    // })
    console.log(datasend);
  }
  doRefresh(event){
    this.gd.notiAll = [];
    this.gd.sumNoti = this.gd.notiBase - this.gd.sumNoti;
    this.gd.notiBase = 0;
    this.gd.numLoadmore = 0;
    this.gd.get_noti('old');
    this.get_noti();
    setTimeout(() => {
      this.getData = this.gd.notiAll;
      event.complete();
    }, 500);
  }
  doInfinite(event){
    this.gd.get_noti('old');
    setTimeout(() => {
      this.getData = this.gd.notiAll;
      event.complete();
    }, 500);
  }
  nextPage(data) {
    console.log(data);
    
    this.SFT.ServiceThread("updateNoti",data,"POST").then( result =>{
      if(result["res_code"] == "00"){
        data["noti_read"] = 1;
        this.gd.sumNoti--;
      }
    })
    if(data.noti_type == 3){
      
    }else if(data.noti_type == 2){
      var roomnumber = this.gd.roomchat.findIndex(x => x.room_name == data.noti_post_id);
      let datasend = this.gd.roomchat[roomnumber];
      this.gd.nextpage(this.navCtrl, "ChatPage", { 'key': datasend['room_name'],'imguser':datasend['user_path_img'],'data': datasend });
    }else{
      let loading = this.loadingCtrl.create({
        spinner: 'hide',
        content: `
        <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
          `,
      });
      // this.gd.goDetail = false;
      try {
        loading.present();
      } catch (error) {
  
      }
      setTimeout(() => {
        console.log(data);
        
        this.gd.nextpage(this.navCtrl, 'DetailfeedPage', { 'data': data.post[0][0] });
        loading.dismiss();
  
      }, 500);
    }
  }
  NextPages(page,data){
    this.gd.nextpage(this.navCtrl, page, { 'data': data });
  }

  presentPopover(myEvent) {
    $(".share").removeClass('share');
    $("body").addClass('rightMenu');

    let popover = this.popoverCtrl.create(MenuRightComponent, { navCtrl: this.navCtrl });
    popover.present({
      ev: myEvent
    });
  }

}
