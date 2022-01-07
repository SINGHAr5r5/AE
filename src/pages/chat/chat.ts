import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Content, Platform, AlertController } from 'ionic-angular';
import { ServiceFactoryThread } from '../../services/ServiceFactoryThread';
import { GlobalDataService } from '../../services/globaldata.service';
import * as firebase from 'Firebase';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Keyboard } from '@ionic-native/keyboard';
import * as $ from 'jquery'
/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})


export class ChatPage {
  @ViewChild(Content) content: Content;
  mouth: any = [];
  data = this.navParams.get('data');
  roomN = this.navParams.get('room');
  imguser = this.navParams.get('imguser');
  key = this.navParams.get('key');
  keyChat: any = [];
  message: any = [];
  room: string;
  read: any = [];
  dataSend: any = {
    // data: this.navParams.get('data'),
    imguser: this.gd.userProfile.user_path_img,
    key: this.navParams.get('key'),
    room_name: this.navParams.get('key'),
    // roomN: this.navParams.get('room'),
    user_id: this.gd.userProfile['user_id'],
    user_firstname: this.data['user_firstname'],
    user_lastname: this.data['user_lastname']
  };
  constructor(private alertCtrl: AlertController, public platform: Platform, private keyboard: Keyboard, private location: Location, public navCtrl: NavController, public navParams: NavParams, public events: Events, private gd: GlobalDataService, public serviceFactoryThread: ServiceFactoryThread) {
    // console.log(this.data);
    // console.log();

    console.log(this.dataSend);
    setTimeout(() => {
      gd.chatKeyLog = this.navParams.get('key');
      console.log(this.gd.chatKeyLog);
    }, 300);
    this.gd.clickGo = true;
    if (gd.platformtype == 'ios') {
      // keyboard.disableScroll(true);
      keyboard.onKeyboardHide().subscribe(data => {
        console.log('scrollBottom onKeyboardHide');
        this.content.scrollToBottom();
        this.scrollbottom();
        setTimeout(() => {
          this.scrollbottom();
        }, 500);
      });
      keyboard.onKeyboardShow().subscribe(data => {
        console.log('scrollBottom onKeyboardShow');
        this.content.scrollToBottom();
        this.scrollbottom();
        setTimeout(() => {
          this.scrollbottom();
        }, 500);
      });
    }
    this.sendMessage().then(data => {
      this.gd.roomchat.filter(message => {
        if (message.room_name === this.data['room_name']) {
          message.noread = 0;
        }
        return message.room_name === this.data['room_name'];
      });
      // console.log(this.gd.roomchat);
      // console.log(this.data.user_id);

      this.keyChat = this.message.filter(message => message.status === '0' && message.id === this.data.user_id);
      setTimeout(() => {
        this.gd.sumNoti = parseInt(this.gd.sumNoti) - parseInt(this.keyChat.length);
        for (let index = 0; index < this.keyChat.length; index++) {
          let newData = firebase.database().ref('chatrooms/' + this.key + '/chats/' + this.keyChat[index]['key']).update({
            status: '1'
          });
        }
        this.scrollbottom();
      }, 100);
    });
    // this.message = this.data['message'];

    // this.read = this.message.filter(message => message.status === '0' && message.id !== this.data.user_id);
    // this.keyChat = this.message.filter(message => message.status === '0' && message.id === this.data.user_id);
    // setTimeout(() => {
    //   this.gd.sumNoti = parseInt(this.gd.sumNoti) - parseInt(this.keyChat.length);
    //   for (let index = 0; index < this.keyChat.length; index++) {
    //     let newData = firebase.database().ref('chatrooms/' + this.key + '/chats/' + this.keyChat[index]['key']).update({
    //       status: '1'
    //     });
    //   }
    // }, 100);
    // let newData = firebase.database().ref('chatrooms/'+this.key+'/chats').push();
    // newData.update({
    //   status: '1'
    // });
    setTimeout(() => {
      $('#footer').hide();
      $('.tabbar').hide();
      setTimeout(() => {
        $('page-chat .back-button.show-back-button').click(function () {
          $('#footer').show();
          $('.tabbar').show().css('display', 'flex');        
          $('#sendmessage').css('display', 'none');
        });
      }, 200);

      $("page-chat .scroll-content").css("cssText", "padding-bottom: 25px !important;margin-top: 44px;");
      console.log('scrollBottom setTimeout');
      this.content.scrollToBottom();
    }, 200);

    events.subscribe('Newmsg', (res) => {
      // console.log("Newmsg");
    });

    // serviceFactoryThread.ServiceThread('readmessenger', { 'room': this.roomN }, 'POST')
    //   .then(data => {
    //     if (data['res_code'] != "00") {
    //       // console.log(data);
    //     } else {
    //       // console.log(data);
    //     }
    //   }, (err) => {
    //     // console.log(err);
    //   });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');
  }
  ionViewDidLeave() {
    console.log('ionViewDidLeave ChatPage');
    $('#footer').show();
    $('.tabbar').show().css('display', 'flex');
    $('#sendmessage').css('display', 'none');
    this.gd.chatKeyLog = "";
    console.log(this.gd.chatKeyLog);

  }

  sendMessage() {
    return new Promise((resolve, reject) => {
      firebase.database().ref('chatrooms/' + this.key + '/chats').on('value', resp => {
        this.snap(resp).then(data => {
          // console.log('newroom');
          console.log('resp',resp);
          console.log('data',data);

          var newIndex;
          this.message = data;
          for (let index = 0; index < this.message.length; index++) {
            if (index == 0) {
              newIndex = index;
            } else {
              newIndex = index - 1;
            }

            if (index == 0) {
              this.message[index].showdate = true;
            } else if (this.message[index]["date"] != this.message[newIndex]["date"]) {
              this.message[index].showdate = true;
            } else {
              this.message[index].showdate = false;
            }

          }
          // console.log(this.message);
          setTimeout(() => {
            // console.log('Chat');
            // console.log(this.location.path());
            let path = this.location.path().split('/');
            if (path[(path.length) - 1] == 'chat') {
              // this.read = this.message.filter(message => message.status === '0' && message.id !== this.data.user_id);
              // console.log(this.message);

              this.keyChat = this.message.filter(message => message.status === '0' && message.id === this.data.user_id);
              // console.log(this.keyChat);

              setTimeout(() => {
                this.gd.sumNoti = parseInt(this.gd.sumNoti) - parseInt(this.keyChat.length);
                for (let index = 0; index < this.keyChat.length; index++) {
                  // console.log(this.keyChat[index]['key']);

                  let newData = firebase.database().ref('chatrooms/' + this.key + '/chats/' + this.keyChat[index]['key']).update({
                    status: '1'
                  });
                }
              }, 100);
            }
          }, 1500);
          setTimeout(() => {
            try {
              console.log('scrollBottom sendMessage');
              this.content.scrollToBottom();
            } catch (error) {

            }
          }, 100);
          resolve(data);
        });
      });
    });
  }
  messenger() {

  }
  send() {
    let d = new Date();
    d.getDate
    this.mouth = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    console.log(this.mouth[d.getMonth()]);
    // console.log('send');
    if ($('ion-tab[aria-hidden="false"] page-chat:last #send').val() != '') {
      let newData = firebase.database().ref('chatrooms/' + this.key + '/chats').push();
      newData.set({
        user: this.gd.userProfile['user_firstname'] + " " + this.gd.userProfile['user_lastname'],
        id: this.gd.userProfile['user_id'],
        message: $('#send').val(),
        sendDate: this.GetFormattedDate(),
        chkDate: d.getDate(),
        date: d.getDate() + " " + this.mouth[d.getMonth()],
        status: '0'
      });
      // console.log(this.data);
      // console.log($('#send').val());
      this.gd.sendNoti(this.data["room_name"], this.data['user_id'], $('#send').val(), this.gd.userProfile['user_firstname'] + " " + this.gd.userProfile['user_lastname'], this.dataSend)
        .then(data => {
          this.gd.chat();
          if (data == '01') {
            let alert = this.alertCtrl.create({
              title: 'Notify user',
              subTitle: this.data['user_firstname'] + " " + this.data['user_lastname'] + ' has deleted this chat room.',
              buttons: [{
                text: 'OK',
                role: 'OK',
                handler: () => {
                  this.navCtrl.pop();
                  this.gd.chat();
                  $('#footer').show();
                  $('.tabbar').show().css('display', 'flex');
                  $('#sendmessage').css('display', 'none');
                }
              }]
            });
            alert.present();
          }
        })
      $('#send').val('');
    }
  }

  GetFormattedDate() {
    // var d = new Date();
    // console.log(d.getSeconds());

    // if(d.getSeconds() < 10){
    //   console.log("0"+d.getSeconds());
    // }else{
    //   console.log(d.getSeconds());
    // }

    // return d.getHours() + ":" + d.getMinutes();
    let hours;
    let minute;
    var d = new Date();
    if (d.getMinutes() < 10) {
      minute = "0" + d.getMinutes();
    } else {
      minute = d.getMinutes();
    }
    if (d.getHours() < 10) {
      hours = "0" + d.getHours();
    } else {
      hours = d.getHours();
    }
    return hours + ":" + minute;
  }



  splitTime(time) {
    return time = time.split(" ")[1];
  }

  scrollbottom() {
    setTimeout(() => {
      console.log('scrollBottom Click');
      this.scrollbottoms();
      this.content.scrollToBottom();
    }, 500);
  }

  scrollbottoms() {
    setTimeout(() => {
      console.log('scrollBottom Click');

      this.content.scrollToBottom();
    }, 500);
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

}

export const snapshotToArray = snapshot => {
  let returnArr = [];
  snapshot.forEach(childSnapshot => {
    let item = childSnapshot.val();
    item.key = childSnapshot.key;
    returnArr.push(item);
  });

  return returnArr;
};
