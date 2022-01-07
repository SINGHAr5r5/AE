import { Component, ViewChild, Input, style, ElementRef } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  ModalController,
  ActionSheetController,
  Events,
  PopoverController,
  Content,
  Platform,
} from "ionic-angular";
import { GlobalDataService } from "../../services/globaldata.service";
import { ServiceFactoryThread } from "../../services/ServiceFactoryThread";
import { Geolocation } from "@ionic-native/geolocation";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { MenuRightComponent } from "../../components/menu-right/menu-right";

import * as $ from "jquery";
import * as firebase from "Firebase";
import "firebase/auth";
import "firebase/firestore";
import { TimeCommentPipe } from "../../pipes/time-comment/time-comment";
import { Keyboard } from "@ionic-native/keyboard";


declare var PhotoSwipe: any;
declare var PhotoSwipeUI_Default: any;

/**
 * Generated class for the DetailfeedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-detailfeed",
  templateUrl: "detailfeed.html",
})
export class DetailfeedPage {
  @ViewChild("myInput") myInput;
  @ViewChild(Content) content: Content;
  @ViewChild("editComments") editComments; // for set auto focus
  @ViewChild('part1') private part1: ElementRef; //part of profile, caption, image, location, coconut
  @ViewChild('commentBox') private commentBox: ElementRef; //part of comment box
  ref = firebase.database().ref("comments/");
  img: any;
  viewMode: any = 1;
  keyRoom: any = "";
  dataFeed: any = [];
  commentlist: any = [];
  totalComment: any = 0;
  textId: any = "";
  commentMode: boolean = false;
  textTitle: any = "";
  numPage: any = 0;
  SamePlace: any = [];
  loadSameLocation: boolean = true;
  showSamePlace: boolean = false;
  showSameFeeling: boolean = false;
  showTypeLocation: boolean = false;
  filter: any = [];
  filter2: any = [];
  countImg: any = 0;
  textComment: any = "";
  userglobal: any = this.gd.userProfile["user_id"];
  st_focus: boolean = false;
  dataNearby: any = [];

  disableSendComment: boolean = false;

  //check video
  videoRunning: boolean = false;

  //edit comment
  yourComments: any;
  isEnabled: any = [];
  disabledEditDelete: boolean = false; // false = disabled Edit button, true = can edit
  disabledComment: boolean = false; // false = disabled show comment footer, true = can show comment

  constructor(
    public popoverCtrl: PopoverController,
    public geolocation: Geolocation,
    public events: Events,
    public actionSheetCtrl: ActionSheetController,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    private SFT: ServiceFactoryThread,
    private gd: GlobalDataService,
    public navCtrl: NavController,
    public navParams: NavParams,
    public element: ElementRef,
    private platform: Platform,
    private keyboard: Keyboard,
    private iab: InAppBrowser
  ) {
    // console.log(`%c this img navParams`, `color:blue`);
    // console.log(navParams.get('data'));
    // console.log(gd.showbtn);
    // console.log(this.gd.userProfile['user_firstname'] + " " + this.gd.userProfile['user_lastname']);
    // setTimeout(() => {
    //   this.photoViewer.show('https://wallpapercave.com/wp/KaNO7Ya.jpg');
    // }, 3000);
  } //close constructor

  ngOnInit() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.keyboard.hideFormAccessoryBar(true);
    });
  }

  goprofile() {
    this.gd.nextpage(this.navCtrl, "ProfilePage", this.gd.userProfile);
  }
  gonoti() {
    this.gd.nextpage(this.navCtrl, "NotificationsPage", {});
  }

  saerchPage() {
    let modalbirthday = this.modalCtrl.create("SearchNewfeedPage", {
      typeSearch: "Recent",
    });
    modalbirthday.onDidDismiss((data) => {
      console.log(data);
      this.gd.nextpage(this.navCtrl, "NewsfeedPage", { search: data });
    });
    modalbirthday.present();
  }

  ionViewDidEnter() {
    console.log("enter --");

    this.countImg = this.dataFeed[0].pictureResize.length;
    console.log("dataFeed[0]", this.dataFeed[0]);
    console.log("countImg", this.countImg);
  }

  async ionViewDidLoad() {
    console.log("ionViewDidLoad DetailfeedPage");
    this.img = await this.navParams.get("data");

    this.dataFeed.push(this.img);
    console.log("img", this.img);
    console.log("dataFeed", this.dataFeed);
    this.loadFeelling(this.img);
    if (this.img.comment_key != "") {
      this.keyRoom = this.img.comment_key;
      this.getComment();
    } else {
      this.checkroom();
    }

    console.log(" this.keyRoom", this.keyRoom);

    setTimeout(() => {
      if (this.img["user_id"] != "TAT") {
        let senddata = {
          follow_user: this.img["user_id"],
        };
        this.SFT.ServiceThread("Chack_following", senddata, "POST").then(
          (data) => {
            if (data["res_code"] == "00") {
              this.img["status_Follow"] = true;
              this.img["follow"] = 1;
            } else {
              this.img["status_Follow"] = false;
              this.img["follow"] = 0;
            }
          }
        );
      }
      this.countImg = this.dataFeed[0].pictureResize.length;
    }, 100);
    setTimeout(() => {
      this.hashtag();
    }, 1000);

    setTimeout(() => {
      if (this.img.openmodel) {
        console.log("test");
        // this.myInput.setFocus();
      }
    }, 1000);
  }

  hashtag() {
    var t = this;
    console.log($('ion-tab[aria-hidden="false"] page-newsfeed:last .hashtag'));
    $('ion-tab[aria-hidden="false"] page-detailfeed:last .hashtag').unbind();
    $('ion-tab[aria-hidden="false"] page-detailfeed:last .hashtag').click(
      function () {
        t.SFT.stLoad = true;
        t.gd.nextpage(t.navCtrl, "NewsfeedPage", {
          frompage: 6,
          datapage: $(this).text(),
        });
      }
    );
  }

  change_mode(data, getData, index) {
    console.log(`change mode`);
    console.log(`data: `, data);
    console.log(`getData: `, getData);
    console.log(`index: `, index);
    console.log("----------------------------------------");

    console.log(this.countImg);
    console.log(data, getData);
    if (this.countImg == 1) {
      this.zoomImg(getData, 0);
    } else if (this.viewMode == 2 && data == 2) {
      this.zoomImg(getData, index);
    } else {
      this.viewMode = data;
    }
  }

  getDetailFeed() {
    let senddata = {
      photo_id: this.img.photo_id,
    };
    this.SFT.ServiceThread("getDetailFeed", senddata, "POST").then((data) => {
      if (data["res_code"] == "00") {
      } else {
      }
    });
  }

  doRefresh(refresher) {
    this.loadFeelling(this.img);
    if (this.img.comment_key != "") {
      this.keyRoom = this.img.comment_key;
      this.getComment();
    } else {
      this.checkroom();
    }
    setTimeout(() => {
      if (this.img["user_id"] != "TAT") {
        let senddata = {
          follow_user: this.img["user_id"],
        };
        this.SFT.ServiceThread("Chack_following", senddata, "POST").then(
          (data) => {
            if (data["res_code"] == "00") {
              this.img["status_Follow"] = true;
              this.img["follow"] = 1;
            } else {
              this.img["status_Follow"] = false;
              this.img["follow"] = 0;
            }
          }
        );
      }
      this.countImg = this.dataFeed[0].pictureResize.length;
    }, 100);
    this.SFT.ServiceThread(
      "countCoconut",
      { idPost: this.img.photo_id, type: this.img.user_id },
      "POST"
    ).then((data) => {
      if (data["res_code"] == "00") {
        this.img.sum_like = data["res_result"];
      }
      refresher.complete();
    });
  }

  zoomImg(data, index) {
    console.log(index);

    // let datasend = {
    //   'data': this.dataFeed[0]
    // };
    // console.log(datasend);

    // let modal = this.modalCtrl.create('DetailfeedImgZoomPage', datasend);
    // modal.present();
    // modal.onDidDismiss(res => {
    // });
    var pswpElement = document.querySelectorAll(".pswp")[0];
    var items = [];
    data.pictureResize.forEach((element, index) => {
      let dataPush;
      if (element.type == 1) {
        dataPush = {
          src: element.path_full,
          w: parseInt($("ng-component").width() + ""),
          h: parseInt(element.path_height),
        };
      } else {
        dataPush = {
          id: `video${index}`,
          html:
            `<div style="height: 100%;display: grid;">
            <video id="video${index}" controls style="width: 100%;margin: auto;">
            <source src="${element.path_full}" type="video/mp4">
            </video>
            </div>`,
        };
      }

      items.push(dataPush);
    });

    var options = {
      maxSpreadZoom: 5,
      focus: true,
      index: index, // start at first slide
      loop: false,
      closeOnScroll: false,
      pinchToClose: false,
      tapToClose: false,
    };
    console.log(`items: `, items);

    var gallery = new PhotoSwipe(
      pswpElement,
      PhotoSwipeUI_Default,
      items,
      options
    );
    let t = this;

    gallery.listen("beforeChange", function () {
      console.log(`%c beforeChange: ${gallery.currItem}`, `color:green`);
    });

    // After slides change
    // (after content changed)
    gallery.listen("afterChange", function () {
      console.log(`%c afterChange: ${gallery.currItem}`, `color:green`);
      let video: any = $('video').html;
      console.log('gallery video', video);
      if (typeof gallery.currItem.src === "undefined") {
        console.log(gallery.currItem);
        // $("video").trigger("play");
      } else {
        console.log(`not video`);
      }
    });

    //    gallery.listen('gettingData', function(index, item) {
    //     // index - index of a slide that was loaded
    //     // item - slide object

    //     // e.g. change path to the image based on `something`
    //     console.log(`%c gettingData: ${gallery.currItem}`,`color:green`);
    //     console.log(gallery.currItem);

    //     if(typeof(gallery.currItem.src) === "undefined") {
    //         console.log(item.src);
    //         $('video').trigger('play');
    //     } else {
    //       console.log(`not video`);
    //     }
    // });

    gallery.init();
  }

  coconut(data) {
    this.gd.nextpage(this.navCtrl, "CoconutPage", { data: data });
  }

  presentActionSheetComment(data, i) {
    let options;
    if (!this.disabledEditDelete) {
      if (this.gd.userProfile.user_id == data.userId) {
        options = {
          buttons: [
            {
              text: "Edit",
              cssClass: "",
              handler: () => {
                this.yourComments = '';
                this.disabledEditDelete = true;
                console.log("isEnabled", this.isEnabled);
                console.log("commentlist", this.commentlist);
                console.log("i", i);
                this.isEnabled[i] = true;
                console.log(" this.isEnabled[i]", this.isEnabled[i]);
                setTimeout(() => {
                  this.yourComments = data.comment; //set comment to textarea
                  this.editComments.setFocus();
                }, 300);
              },
            },
            {
              text: "Delete Comment",
              cssClass: "setting_img",
              handler: () => {
                let alert = this.alertCtrl.create({
                  title: "Confirm Delete",
                  message: "Do you want to delete comment?",
                  buttons: [
                    {
                      text: "Cancel",
                      role: "cancel",
                      handler: () => {
                        console.log("Cancel clicked");
                      },
                    },
                    {
                      text: "Delete",
                      handler: () => {
                        // console.log('Buy clicked');
                        console.log(data);
                        let newData = firebase
                          .database()
                          .ref(
                            "comments/" +
                            this.keyRoom +
                            "/comment/" +
                            data["key"]
                          )
                          .update({
                            status: "1",
                          });
                        this.SFT.ServiceThread(
                          "deleteComment",
                          {
                            keycomment: data["key"],
                            user_id: this.gd.userProfile["user_id"],
                          },
                          "POST"
                        ).then((data) => {
                          console.log(data);

                          if (data["res_code"] == "00") {
                            this.img["status_comment"] =
                              data["res_result"].toLowerCase() == "true"
                                ? true
                                : false;
                            console.log(
                              `%c ${data["res_text"]}`,
                              `color:green`
                            );
                          } else {
                            console.error(data["res_text"]);
                          }
                        });
                      },
                    },
                  ],
                });
                alert.present();
              },
            },
          ],
        };
      } else {
        options = {
          buttons: [
            {
              text: "Delete Comment",
              cssClass: "setting_img",
              handler: () => {
                let alert = this.alertCtrl.create({
                  title: "Confirm Delete",
                  message: "Do you want to delete comment?",
                  buttons: [
                    {
                      text: "Cancel",
                      role: "cancel",
                      handler: () => {
                        console.log("Cancel clicked");
                      },
                    },
                    {
                      text: "Delete",
                      handler: () => {
                        // console.log('Buy clicked');
                        console.log(data);
                        let newData = firebase
                          .database()
                          .ref(
                            "comments/" +
                            this.keyRoom +
                            "/comment/" +
                            data["key"]
                          )
                          .update({
                            status: "1",
                          });
                        this.SFT.ServiceThread(
                          "deleteComment",
                          {
                            keycomment: data["key"],
                            user_id: this.gd.userProfile["user_id"],
                          },
                          "POST"
                        ).then((data) => {
                          console.log(data);

                          if (data["res_code"] == "00") {
                            this.img["status_comment"] =
                              data["res_result"].toLowerCase() == "true"
                                ? true
                                : false;
                            console.log(
                              `%c ${data["res_text"]}`,
                              `color:green`
                            );
                          } else {
                            console.error(data["res_text"]);
                          }
                        });
                      },
                    },
                  ],
                });
                alert.present();
              },
            },
          ],
        };
      }

      let actionSheet = this.actionSheetCtrl.create(options);
      actionSheet.present();
    }
  }

  btnCancel(data, i) {
    this.disabledEditDelete = false;
    this.isEnabled[i] = false;
  }

  btnConfirm(data, i) {
    this.disabledEditDelete = false;
    this.isEnabled[i] = false;
    let dataUpdate = {
      comment: this.yourComments,
      // date: firebase.database.ServerValue.TIMESTAMP,
      status: "2", //0=new comment, 1=deleted, 2=edited
    };
    this.SFT.ServiceThread(
      "editComment",
      {
        keycomment: data.key,
        comment: this.yourComments,
        user_id: this.gd.userProfile.user_id,
      },
      "POST"
    ).then((res) => {
      if (res["res_code"] == "00") {
        this.img["status_comment"] =
          res["res_result"].toLowerCase() == "true" ? true : false;
        console.log(`%c ${res["res_text"]}`, `color:green`);
        //update comment on firebase
        let update = firebase
          .database()
          .ref("comments/" + this.keyRoom + "/comment/" + data.key)
          .update(dataUpdate);
      } else {
        console.error(res["res_text"]);
      }
    });
  }

  checkroom() {
    // if (this.img.user_id != "TAT") {
    if (this.img.comment_key == "") {
      let datasend = {
        id: this.img.photo_id,
        key: "",
        type: "",
        user: this.img.user_id,
      };
      this.SFT.ServiceThread("check_key_comment", datasend, "POST").then(
        (data) => {
          if (data["res_code"] == "00") {
            this.keyRoom = data["res_result"]["res_result"];
            this.getComment();
          } else {
            let newData = this.ref.push();
            let type;
            if (this.img.user_id == "TAT") {
              type = "TAT";
            } else {
              type = "user";
            }
            newData.set({
              roomname: this.img.photo_id,
              type: type,
            });
            let datasend = {
              id: this.img.photo_id,
              key: newData.key,
              type: type,
              user: this.img.user_id,
            };
            this.keyRoom = newData.key;
            this.SFT.ServiceThread("check_key_comment", datasend, "POST").then(
              (data) => {
                this.getComment();
              }
            );
          }
        }
      );
    }
    // }
  }

  getComment() {
    firebase.database().ref("comments/" + this.keyRoom + "/comment").off();
    firebase.database().ref("comments/" + this.keyRoom + "/comment").on("value", (resp) => {
      this.snap(resp).then((data) => {
        console.log(data);
        var newIndex;
        let dataa: any = [];
        dataa = data;
        let countComment = dataa.filter((item) => {
          return item.status != 1; //0=new comment, 1=deleted, 2=edited
        });
        this.commentlist = dataa.filter((item) => {
          if (item.status != 1) {
            return item;
          }
        });
        this.commentlist.forEach((element, index) => {
          this.isEnabled[index] = false;
          console.log(index);
          console.log("element commentList", element);
          console.log("this.keyRoom", this.keyRoom);
          let url = "";
          if (
            this.gd.likeUser
              .map((el) => el.user_id)
              .indexOf(element.userId) == "-1"
          ) {
            let datasend = {
              idUser: element.userId,
            };
            this.SFT.ServiceThread("imgComment", datasend, "POST").then((data) => {
              data["res_result"].forEach((element) => {
                this.gd.likeUser.push(element);
                url = element["user_photo"];
                this.commentlist[index]["userUrl"] = element["user_photo"];
              });
              if (index == this.commentlist.length - 1) {
                console.log("last comment");
                const filterPipe = new TimeCommentPipe();
                this.img.comment = element.comment;
                this.img.comment_user_img = this.commentlist[index][
                  "userUrl"
                ];
                this.img.userIdComment = element.userId;
                this.img.timeComment = filterPipe.transform(element.date);
                this.img.fulnameComment = element.fullname;
              }
            }
            );
          } else {
            this.gd.likeUser.filter((data) => {
              if (data.user_id === element.userId) {
                url = data.user_photo;
                this.commentlist[index]["userUrl"] = data.user_photo;
                if (index == this.commentlist.length - 1) {
                  console.log("last comment");
                  const filterPipe = new TimeCommentPipe();
                  this.img.comment = element.comment;
                  this.img.comment_user_img = data.user_photo;
                  this.img.userIdComment = element.userId;
                  this.img.timeComment = filterPipe.transform(element.date);
                  this.img.fulnameComment = element.fullname;
                }
              }
            });
          }
        });
        if (this.commentlist.length == 0) {
          this.img.comment = "";
          this.img.comment_user_img = "";
          this.img.userIdComment = "";
          this.img.timeComment = "";
          this.img.fulnameComment = "";
        }
        this.totalComment = this.commentlist.length;
        this.img.countComment = countComment.length;
        for (let index = 0; index < this.commentlist.length; index++) {
          if (index == 0) {
            newIndex = index;
          } else {
            newIndex = index - 1;
          }
          if (index == 0) {
            this.commentlist[index].showdate = true;
          } else if (
            this.commentlist[index]["date"] !=
            this.commentlist[newIndex]["date"]
          ) {
            this.commentlist[index].showdate = true;
          } else {
            this.commentlist[index].showdate = false;
          }
          if (
            this.gd.idUserComment.indexOf(this.commentlist[index].userId) ==
            "-1"
          ) {
            if (index == 0) {
              this.textId += this.commentlist[index].userId;
            } else {
              this.textId += "," + this.commentlist[index].userId;
            }
            this.gd.idUserComment.push(this.commentlist[index].userId);
          }
          if (this.commentlist.length == index - 1) {
          }
        }
        if (this.textId != "") {
          let datasend = {
            idUser: this.textId,
          };
          this.SFT.ServiceThread("imgComment", datasend, "POST").then(
            (data) => {
              data["res_result"].forEach((element) => {
                this.gd.likeUser.push(element);
              });
            }
          );
        }
      });
    });
  }

  snap(data) {
    return new Promise((resolve) => {
      let returnArr = [];
      data.forEach((childSnapshot) => {
        let item = childSnapshot.val();
        item.key = childSnapshot.key;
        returnArr.push(item);
      });
      resolve(returnArr);
    });
  }

  presentPopover(myEvent) {
    $(".share").removeClass("share");
    $("body").addClass("rightMenu");

    let popover = this.popoverCtrl.create(MenuRightComponent, {
      navCtrl: this.navCtrl,
    });
    popover.present({
      ev: myEvent,
    });
  }

  loadFeelling(dataSend) {
    this.showSamePlace = false;
    this.showSameFeeling = false;
    this.showTypeLocation = false;
    if (this.numPage == 0 && this.loadSameLocation) {
      let dataplace = {
        Place: dataSend["photo_location"],
        type: 1,
        width: $("ng-component").width(),
        LoadMoreLimit: 5,
        numLoad: 0,
        lat: dataSend["photo_la"],
        long: dataSend["photo_long"],
        // 'lat': this.SFT.userlocation.lat,
        // 'long': this.SFT.userlocation.long
      };
      this.filter = dataplace;
      this.SFT.ServiceThread("Same", dataplace, "POST").then((data) => {
        if (data["res_code"] == "00") {
          this.SamePlace = data["res_result"];
          this.dataFeed[0]["same"] = this.SamePlace;
          this.dataFeed[0]["samelength"] = this.SamePlace.length;
          this.textTitle = this.img.photo_location;
          console.log(this.SamePlace);
          if (this.SamePlace.length > 1) {
            this.showSamePlace = true;
          } else {
            // this.textTitle = "Nearby Places";
            // let dataFeeling = {
            //   'Feeling': dataSend['feeling_id'],
            //   'type': 2,
            //   'width': $('ng-component').width(),
            //   'LoadMoreLimit': 5,
            //   'numLoad': 0,
            //   'lat': this.SFT.userlocation.lat,
            //   'long': this.SFT.userlocation.long
            // }
            // this.SFT.ServiceThread('Same', dataFeeling, 'POST')
            //   .then(data => {
            //     console.log(data);
            //     if (data['res_code'] == '00') {
            //       // // console.log(data);
            //       this.SamePlace = data['res_result'];
            //       this.dataFeed[0]['same'] = this.SamePlace;
            //       this.dataFeed[0]['samelength'] = this.SamePlace.length;
            //       if (this.SamePlace['length'] > 1) {
            //         this.showSamePlace = true;
            //       }
            //     } else {
            //       this.dataFeed[0]['same'] = [];
            //       this.dataFeed[0]['samelength'] = 0;
            //     }
            //     this.loadSameLocation = false;
            //     console.log(this.dataFeed[0]['samelength']);
            //   })
          }
        } else {
        }
        this.loadSameLocation = false;
        console.log(this.dataFeed[0]["samelength"]);
      });
      // this.dataNearby[0]['same'] = [];
      // this.dataNearby[0]['samelength'] = 0;
      let datafeel = {
        Feeling: dataSend["feeling_id"],
        textLocation: dataSend["photo_location"],
        type: 2,
        width: $("ng-component").width(),
        LoadMoreLimit: 5,
        numLoad: 0,
        lat: dataSend["photo_la"],
        long: dataSend["photo_long"],
      };
      this.filter2 = datafeel;
      this.SFT.ServiceThread("Same", datafeel, "POST").then((data) => {
        console.log(data);
        if (data["res_code"] == "00") {
          this.dataNearby = data["res_result"];
        } else {
          this.dataNearby = [];
        }
      });
    } else {
    }
  }

  like(data, type, index) {
    let datanew = JSON.parse(JSON.stringify(data));
    delete datanew.same;
    delete datanew.follow;
    delete datanew.ic;
    delete datanew.samelength;
    delete datanew.status_Follow;
    delete datanew.imageLike;
    delete datanew.path_resize;
    delete datanew.comment_user_img;
    delete datanew.pictureResize;
    delete datanew.user_path_img;
    delete datanew.photo_img_Full;
    delete datanew.user_img;
    delete datanew.nameLocation;
    delete datanew.photo_location;
    delete datanew.photo_locationText;
    console.log(datanew);
    let datanoti = data;
    let senddata = {
      photo_id: data.photo_id,
      type: type,
      data: JSON.stringify(datanew),
    };
    if (type == 1) {
      // // console.log('ลบ');
      data["status_like"] = false;
      data["sum_like"] = data["sum_like"] - 1;
    } else {
      // // console.log('บวก');
      data["status_like"] = true;
      data["sum_like"] = data["sum_like"] + 1;
    }

    setTimeout(() => {
      $('ion-tab[aria-hidden="false"] #like' + data.photo_id).addClass("liked");
      $('ion-tab[aria-hidden="false"] #like' + data.photo_id).css(
        "pointer-events",
        "none"
      );
      clearTimeout(tmq);
      var tmq = setTimeout(() => {
        $('ion-tab[aria-hidden="false"] #like' + data.photo_id).removeClass(
          "liked"
        );
        $('ion-tab[aria-hidden="false"] #like' + data.photo_id).css(
          "pointer-events",
          "unset"
        );
      }, 1100);
    }, 10);

    this.SFT.ServiceThread("like", senddata, "POST").then((data) => {
      // // console.log(data);/
    });
  }

  bookmark(data, type) {
    // // console.log(data);
    // // console.log(type);

    let senddata = {
      photo_id: data.photo_id,
      type: type,
      userType: data.user_id,
    };
    this.SFT.ServiceThread("bookmark", senddata, "POST").then((data) => {
      // // console.log(data);
    });
    if (type == 1) {
      // // console.log('ลบ');
      data["status_bookmark"] = false;
    } else {
      // // console.log('บวก');
      data["status_bookmark"] = true;
    }
  }

  follow(type, img, id) {
    console.log(this.gd.userProfile);

    let datanew = JSON.parse(JSON.stringify(this.gd.userProfile));
    delete datanew.same;
    delete datanew.follow;
    delete datanew.ic;
    delete datanew.samelength;
    delete datanew.status_Follow;
    delete datanew.message;
    delete datanew.data_message;
    // var datatest = [];
    // datatest.push(this.dataFeed);
    this.dataFeed.filter((data, index) => {
      if (data.user_id === img.user_id) {
        if (type == 1) {
          setTimeout(() => {
            $('ion-tab[aria-hidden="false"]  page-detailfeed:last .FID' + id).addClass("bounceIn animated");
          }, 100);
        } else {
          setTimeout(() => {
            $('ion-tab[aria-hidden="false"]  page-detailfeed:last .FD' + id).addClass("bounceIn animated");
          }, 100);
        }
      }
    });
    let senddata = {
      follow_user: img["user_id"],
      type: type,
      data: JSON.stringify(datanew),
    };
    this.SFT.ServiceThread("indefollowing", senddata, "POST").then((data) => { });
    if (type == 1) {
      img["status_Follow"] = true;
      img["follow"] = 1;
      this.gd.userProfile.following += 1;
    } else {
      img["status_Follow"] = false;
      img["follow"] = 0;
      this.gd.userProfile.following -= 1;
    }
  }

  GoPage(page, data, text) {
    if (page == "ProfilePage" && data["user_id"] != "TAT") {
      if (
        page == "ProfilePage" &&
        this.gd.userProfile["user_id"] == data["user_id"]
      ) {
        // if (this.gd.userProfile.user_type == '1') {
        //   this.gd.nextpage(this.navCtrl, 'ProfileStorePage', {});
        // } else {
        this.gd.nextpage(this.navCtrl, "ProfilePage", {});
        // }
      } else {
        // if (data['user_type'] == '1') {
        //   this.gd.nextpage(this.navCtrl, 'ProfileStorePage', { 'data': data });
        // } else {
        this.gd.nextpage(this.navCtrl, "ProfilePage", { data: data });
        // }
        this.gd.saveLog("Go", data);
      }
    } else if (page != "ProfilePage") {
      if (
        page == "ProfilePage" &&
        this.gd.userProfile["user_id"] == data["user_id"]
      ) {
        this.navCtrl.parent.select(4);
        setTimeout(() => {
          this.navCtrl.parent.select(4);
        }, 100);
      } else if (page == "DetailfeedPage") {
        console.log("DetailfeedPage");
        this.gd.nextpage(this.navCtrl, page, { data: data });
        this.gd.saveLog("Go", data);
      } else {
        this.gd.nextpage(this.navCtrl, page, { data: data });
        this.gd.saveLog("Go", data);
      }
    }
  }

  comment() {
    setTimeout(() => {
      this.myInput.setFocus();
    }, 0);
    // this.myInput.focus
  }

  commentV2() {
    this.myInput.setFocus();
    // this.myInput.focus
    setTimeout(() => {
      console.log("clickcomment");
      if (this.viewMode == 2 && this.commentMode == false) {
        this.commentMode = true;
      } else if (this.viewMode == 2 && this.commentMode == true) {
        // this.commentMode = false;
      }
    }, 0);
  }

  checkFocus() {
    console.log("in");
    this.st_focus = true;
    if (this.viewMode == "1") {
      let contentBottom = document.getElementById('contentBottom').offsetHeight; //พื้นที่ด่านล่างที่เหลือจาก comment
      let heightContent = this.content.getContentDimensions().scrollHeight; //all content
      let scrollY = (heightContent - (contentBottom * 2));

      this.content.scrollTo(0, scrollY).then(() => {

      });
      console.log('heightContent', heightContent);
      console.log('contentBottom', contentBottom);
      console.log('scrollY', scrollY);
    }
    $(".tabbar.show-tabbar").animate({ marginBottom: "-80px" });
  }

  checkBlur() {
    console.log("out");
    this.st_focus = false;
    $(".tabbar.show-tabbar").animate({ marginBottom: "0px" });
  }

  sendComment_comment() {
    if (this.disableSendComment == false) {
      this.disableSendComment = true;
      console.log(this.textComment);
      let datanew = {
        datacomment: JSON.parse(JSON.stringify(this.dataFeed[0])),
      };
      console.log(datanew);
      delete datanew["datacomment"].same;
      delete datanew["datacomment"].follow;
      delete datanew["datacomment"].ic;
      delete datanew["datacomment"].samelength;
      delete datanew["datacomment"].status_Follow;
      delete datanew["datacomment"].imageLike;
      delete datanew["datacomment"].path_resize;
      delete datanew["datacomment"].comment_user_img;
      delete datanew["datacomment"].pictureResize;
      delete datanew["datacomment"].user_path_img;
      delete datanew["datacomment"].photo_img_Full;
      delete datanew["datacomment"].user_img;
      delete datanew["datacomment"].nameLocation;
      delete datanew["datacomment"].photo_location;
      delete datanew["datacomment"].photo_locationText;
      if (this.textComment.trim() != "") {
        let newData = firebase
          .database()
          .ref("comments/" + this.keyRoom + "/comment/")
          .push();
        let datasend = {
          fullname:
            this.gd.userProfile["user_firstname"] +
            " " +
            this.gd.userProfile["user_lastname"],
          userId: this.gd.userProfile["user_id"],
          comment: this.textComment,
          date: firebase.database.ServerValue.TIMESTAMP,
          status: "0",
        };
        newData.set(datasend);
        this.img.countComment++;
        console.log(this.img["datacomment"]);

        // this.img.comment = this.textComment;
        // this.img.comment_user_img = this.gd.userProfile.user_path_img;
        // this.img.userIdComment = this.gd.userProfile['user_id'];
        // this.img.timeComment = "1 min";
        // this.img.fulnameComment = this.gd.userProfile['user_firstname'] + " " + this.gd.userProfile['user_lastname'];
        console.log(this.img);

        console.log(newData);
        console.log(datanew);

        setTimeout(() => {
          let datasend = {
            comment: this.textComment,
            postId: this.img.photo_id,
            userId: this.gd.userProfile["user_id"],
            dataPost: JSON.stringify(datanew),
            keycomment: newData.key,
          };
          this.SFT.ServiceThread("saveComment", datasend, "POST").then(
            (data) => {
              if (data["res_code"] == "00") {
                this.img["status_comment"] = data["res_result"];
                console.log(`%c ${data["res_text"]}`, `color:green`);
              } else {
                console.error(data["res_text"]);
              }
              this.disableSendComment = false;
            }
          );
          this.textComment = "";
        }, 100);
      }
    }
  }

  presentReport(data) {
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: "Hide post",
          cssClass: "setting_img",
          handler: () => {
            // this.hidepost(data);
            console.log(this.img["photo_id"]);

            this.events.publish("deleteimg", {
              id: this.img["photo_id"],
              type: 1,
            });
            // this.img['status_show'] = false;
            this.navCtrl.pop();
          },
        },
        {
          text:
            "Hide all posts from " +
            data["user_firstname"] +
            " " +
            data["user_lastname"],
          cssClass: "setting_img",
          handler: () => {
            // this.hideall(data);
            // this.hidepost(data);
            this.events.publish("deleteimg", {
              id: this.img["user_id"],
              type: 2,
            });
            // this.img['status_show'] = false;
            this.navCtrl.pop();
          },
        },
        {
          text: "Report inappropriate content",
          cssClass: "setting_img",
          handler: () => {
            this.gd.toast("Report Success");
          },
        },
      ],
    });
    actionSheet.present();
  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      // title: 'Select Filter',
      buttons: [
        {
          text: "Edit",
          cssClass: "setting_img",
          handler: () => {
            // console.log('Destructive clicked');
            let data = {
              img: this.img["photo_img_Full"],
              page: "edit",
              data: this.img,
              Latitude: this.img["photo_la"],
              Longitude: this.img["photo_long"],
            };
            this.gd.nextpage(this.navCtrl, "CameraPage", data);
          },
        },
        {
          text: "Delete",
          cssClass: "setting_img",
          handler: () => {
            let alert = this.alertCtrl.create({
              title: "Confirm Delete",
              message: "Do you want to delete post?",
              buttons: [
                {
                  text: "Cancel",
                  role: "cancel",
                  handler: () => {
                    console.log("Cancel clicked");
                  },
                },
                {
                  text: "Delete",
                  handler: () => {
                    // console.log('Buy clicked');
                    this.SFT.ServiceThread(
                      "DeleteImg",
                      { photo_id: this.dataFeed[this.numPage]["photo_id"] },
                      "POST"
                    ).then((data) => {
                      console.log(data);
                      console.log($("page-profile"));
                      console.log($("page-profile").length);
                      if ($("page-profile").length == 0) {
                        this.events.publish("deleteimg", {
                          id: this.img["photo_id"],
                          type: 1,
                        });
                      }
                      this.img["status_show"] = false;
                      this.navCtrl.pop();
                    });
                  },
                },
              ],
            });
            alert.present();
          },
        },
        {
          text: "Cancel",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          },
        },
      ],
    });
    actionSheet.present();
  }

  // testPreview() {
  //   var pswpElement = document.querySelectorAll('.pswp')[0];
  //   var items = [
  //     {
  //       src: 'https://placekitten.com/600/400',
  //       w: 600,
  //       h: 400
  //     },
  //     {
  //       src: 'https://placekitten.com/1200/900',
  //       w: 1200,
  //       h: 900
  //     }
  //   ];
  //   var options = {
  //     index: 0 // start at first slide
  //   };
  //   var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
  //   gallery.init();
  // }

  startExternalMap(data) {
    console.log(data);
    data.latitude = data.photo_la;
    data.longitude = data.photo_long;
    if (this.gd.platformtype == "ios") {
      let actionSheet = this.actionSheetCtrl.create({
        buttons: [
          {
            text: "Open in Google Maps",
            cssClass: "setting_img",
            handler: () => {
              this.geolocation.getCurrentPosition().then(
                (position) => {
                  this.iab.create("https://www.google.com/maps/?daddr=" + data.latitude + "," + data.longitude, "_system");
                  // window.open(
                  //   "https://www.google.com/maps/?daddr=" +
                  //   data.latitude +
                  //   "," +
                  //   data.longitude,
                  //   "_system"
                  // );
                },
                (err) => { }
              );
            },
          },
          {
            text: "Open in Maps",
            cssClass: "setting_img",
            handler: () => {
              this.geolocation.getCurrentPosition().then(
                (position) => {
                  this.iab.create("maps://?q=" + data.name + "&saddr=" + position.coords.latitude + "," + position.coords.longitude + "&daddr=" + data.latitude + "," + data.longitude, "_system");
                },
                (err) => { }
              );
            },
          },
          {
            text: "Cancel",
            role: "cancel",
            handler: () => {
              console.log("Cancel clicked");
            },
          },
        ],
      });
      actionSheet.present();
    } else {
      this.geolocation.getCurrentPosition().then(
        (position) => {
          this.iab.create("geo://" + position.coords.latitude + "," + position.coords.longitude + "?q=" + data.latitude + "," + data.longitude + "(" + data.name + ")", "_system")
          // window.open(
          //   "geo://" +
          //   position.coords.latitude +
          //   "," +
          //   position.coords.longitude +
          //   "?q=" +
          //   data.latitude +
          //   "," +
          //   data.longitude +
          //   "(" +
          //   data.name +
          //   ")",
          //   "_system"
          // );
        },
        (err) => { }
      );
    }
  }
}
