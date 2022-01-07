import { Component, ViewChild } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  Content,
  AlertController,
  Events,
  ModalController,
  PopoverController,
  App,
} from "ionic-angular";
import { GlobalDataService } from "../../services/globaldata.service";
import { ServiceFactoryThread } from "../../services/ServiceFactoryThread";
import { VirtualScroll } from "ionic-angular";
import { Storage } from "@ionic/storage";
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";
import { MenuRightComponent } from "../../components/menu-right/menu-right";
import * as $ from "jquery";
import { InViewportMetadata } from "ng-in-viewport";
/**
 * Generated class for the NewfeedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-newsfeed",
  templateUrl: "newfeed.html",
  animations: [
    trigger("animateTop", [
      transition(":enter", [
        style({ top: "-40px" }),
        animate("200ms", style({ top: "0px" })),
      ]),

      transition(":leave", [
        style({ top: "0px" }),
        animate("200ms", style({ top: "-40px" })),
      ]),
    ]),
    trigger("animateFade", [
      transition(":enter", [
        style({ opacity: 0 }),
        animate("200ms", style({ opacity: 1 })),
      ]),

      transition(":leave", [
        style({ opacity: 1 }),
        animate("200ms", style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class NewsfeedPage {
  @ViewChild("virtualScroll", { read: VirtualScroll })
  virtualScroll: VirtualScroll;
  @ViewChild(Content) content: Content;
  backText: any = "hideBackButton";
  otherPage: boolean = false;
  dataPhoto: any = "";
  numLoad: any = 0;
  defaultDistant: any = 30;
  dataFeedAll: any = [];
  albumType: any = 0;
  userData: any;
  maxvalues: any = 1;
  chakDataFilter: boolean = false;
  TypeLoad: any = "1"; // 1=newOpen, 2=search
  LoadFilterType: any = "Most Recent"; //Most Recent , My Current Location
  clickLike: boolean = true;
  inputSearch: any = "";
  nowChoose: any = "Recent";
  status: boolean = true;
  Title: any = "";
  appoveLoad: boolean = true;
  alert: any;
  stAl: boolean = true;
  stLoadinfinity: boolean = true;
  chatST: boolean = true;
  rw = 0;
  percent: number;
  isRefresh: boolean = true;

  constructor(
    private app: App,
    public modalCtrl: ModalController,
    public events: Events,
    public alertCtrl: AlertController,
    private storage: Storage,
    private SFT: ServiceFactoryThread,
    private gd: GlobalDataService,
    public navCtrl: NavController,
    public navParams: NavParams,
    public popoverCtrl: PopoverController
  ) {
    console.log(navParams.get("data"));

    if (navParams.get("search") != undefined) {
      console.log(navParams.get("search"));

      let data = navParams.get("search");
      this.inputSearch = data.data;
      this.Title = data.data;
      this.TypeLoad = 2;
      this.nowChoose = data.typeSearch;
      if (data.typeSearch == "Recent") {
        this.LoadFilterType = "Most Recent";
      } else {
        this.LoadFilterType = "My Current Location";
        console.log(this.LoadFilterType);
      }
      this.searchAll("");

      try {
        this.content.scrollToTop();
      } catch (error) { }
    } else if (navParams.get("frompage") != undefined) {
      this.TypeLoad = 4;
      this.Title = navParams.get("datapage");
      console.log(this.Title);

      this.getExplore("");
    } else if (navParams.get("data") != undefined) {
      this.TypeLoad = 3;
      this.Title = navParams.get("data").formpage;
      console.log(this.Title);

      navParams.get("data").filter.LoadMoreLimit = 20;
      this.sameFilter(navParams.get("data").filter, "");
    } else {
      if (SFT.userlocation.lat == "" && SFT.userlocation.long == "") {
        console.log("location");
        this.checkGPS();
      } else {
        console.log("loadData");
        this.loadData("");
      }
    }

    if (gd.userProfile.length == 0) {
      storage.get("login_type").then((type) => {
        storage.get("email").then((mail) => {
          if (mail != null) {
            storage.get("password").then((pwd) => {
              this.userData = {
                login_type: type,
                email: mail,
                password: pwd
              }
              this.login().then((data) => {
                if (data != 'failed') {
                  setTimeout(() => {
                    console.log(`login data `, data);
                    console.log(`gd userProfile`, gd.userProfile);
                  }, 5000);
                }
              })
              storage.get("user_api_key").then((vall) => {
                console.log(vall);
                // SFT.user_api_key = vall;ƒ
              });
            });
          }
        });
      })

    }
    // setTimeout(() => {
    //   this.events.publish('Newpost', true);

    // }, 10000);
    // events.publish('selectPost', user, Date.now());
    events.subscribe("selectPost", () => {
      this.navCtrl.parent.select(1);
    });
    events.subscribe("logNoti", (data) => {
      console.log("test");
      console.log(data);
    });
    events.subscribe("deleteimg", (res) => {
      console.log("deleteimg");
      console.log(res);
      let myArray = [];
      if (res.type == 1) {
        myArray = this.dataFeedAll.filter(function (obj) {
          return obj.photo_id !== res.id;
        });
      } else {
        myArray = this.dataFeedAll.filter(function (obj) {
          return obj.user_id !== res.id;
        });
      }


      this.dataFeedAll = [];
      setTimeout(() => {
        this.dataFeedAll = myArray;
        this.callScroll();
      }, 500);

      // this.filterID(res)
    });
    setTimeout(() => {
      console.log($("page-newsfeed").length);

      if ($("page-newsfeed").length == 1) {
        console.log("test");

        this.events.unsubscribe("chat");
        this.events.unsubscribe("notilike");
        this.events.unsubscribe("notifollow");
        this.events.unsubscribe("Newpost");

        events.subscribe("scrollTop", () => {
          console.log("scrolltop");
          this.content.scrollToTop();
        });
        events.subscribe("chat", (res) => {
          console.log(res);
          if (this.chatST) {
            this.chatST = false;

            this.gd.nextpage(this.app.getActiveNav(), "ChatPage", res);
            setTimeout(() => {
              this.chatST = true;
            }, 10000);
          }
        });
        events.subscribe("notilike", (res) => {
          console.log(res);
          let datasent = {
            lat: this.SFT.userlocation["lat"],
            long: this.SFT.userlocation["long"],
            width: $("ng-component").width(),
            post_id: res.photo_id,
          };
          SFT.ServiceThread("getPrepost", datasent, "post").then((data) => {
            console.log(data);
            if (data["res_code"] == "00") {
              this.gd.nextpage(this.navCtrl, "DetailfeedPage", {
                data: data["res_result"][0][0],
              });
            }
          });
        });
        events.subscribe("notifollow", (res) => {
          this.gd.nextpage(this.navCtrl, "ProfilePage", { data: res });
        });
        events.subscribe("Newpost", (res) => {
          this.gd.newFeedTextSearch = "";
          this.nowChoose = "Recent";
          this.LoadFilterType = "Most Recent";
          this.navCtrl.popToRoot();
          setTimeout(() => {
            this.loading(res);
            $(".scroll-content").animate(
              {
                scrollTop: 0,
              },
              800
            );
          }, 500);
        });
      }
      this.content.ionScrollEnd.subscribe((data) => {
        // console.log('scroll 123456');
        this.hashtag();
      });
    }, 1000);
    events.subscribe("deleteimg", (res) => {
      this.filterID(res);
    });

    // setTimeout(() => {
    //   let t = this;
    //   this.content.ionScroll.subscribe((datas) => {
    //     if (this.status) {
    //       console.log(datas.directionY);
    //       t.status = false;
    //       if (datas.directionY == 'up') {
    //         // $(".tabbar.show-tabbar").animate({ marginBottom: "0px" });
    //         // $('ion-tab[aria-hidden="false"] page-newsfeed:last .header2').animate({ top: "0px" });
    //         // $('ion-tab[aria-hidden="false"] page-newsfeed:last .header1').animate({ top: "-180px" });
    //       } else {
    //         // $(".tabbar.show-tabbar").animate({ marginBottom: "-80px" });
    //         // $('ion-tab[aria-hidden="false"] page-newsfeed:last .header2').animate({ top: "-180px" });
    //         // $('ion-tab[aria-hidden="false"] page-newsfeed:last .header1').animate({ top: "0px" });
    //       }
    //       setTimeout(() => {
    //         t.status = true;
    //       }, 500);
    //     }
    //   })
    // }, 1000);
  }

  checkGPS() {
    console.log("checkGPS");

    this.SFT.ServiceThread("hideStatus", {}, "POST").then((data) => {
      console.log(data["res_show"]);
      if (data["res_show"] != "1") {
        console.log("checkGPS");
        if (this.appoveLoad) {
          console.log("checkGPS");

          // this.SFT.loading_present("checkGPS");
          this.appoveLoad = false;
          this.SFT.GCL().then((data) => {
            // setTimeout(() => {
            this.loadData("");
            console.log("complete");
            this.SFT.Check_Count("checkGPS");
            this.stAl = false;
            // }, 20000);
          });
        }

        setTimeout(() => {
          this.alert = this.gd.alertCtrl.create({
            title: "Location",
            subTitle: "Can't find your location",
            enableBackdropDismiss: false,
            buttons: [
              {
                text: "Retry",
                role: "Retry",
                handler: () => {
                  console.log("Retry clicked");
                  this.checkGPS();
                },
              },
            ],
          });
          if (this.stAl) {
            this.alert.present();
          }
        }, 15000);
      } else {
        this.SFT.userlocation = {
          lat: "37.4327278137207",
          long: "-121.93013763427734",
        };
        this.loadData("");
      }
    });
  }
  filterID(id) {
    if (this.dataFeedAll.filter((x) => x.photo_id == id).length > 0) {
      var n = this.dataFeedAll.findIndex((x) => x.photo_id == id);
      this.dataFeedAll[n]["status_show"] = false;
      this.doRefresh("");
    }
  }
  login() {
    return new Promise((resolve, reject) => {
      let strPath = (this.userData.login_type == 'apple') ? 'loginApple' : 'login';
      let request = (this.userData.login_type == 'apple') ?  {uid: this.userData.email} : this.userData
      this.SFT.ServiceThread(strPath, request, "POST").then((datas) => {
        if (datas["res_code"] == "00") {
          this.gd.chat();
          // this.gd.showbtn = datas['res_show'];
          datas["res_result"]["user_path_img"] =
            this.gd.BASE_URL + datas["res_result"]["user_path_img"];
          this.gd.selectData(datas["res_result"]);
          this.gd.userProfile = datas["res_result"];
          this.gd.get_noti("old");
          this.SFT.user_api_key = datas["res_result"]["user_api_key"];
          this.gd.statusDataInput = datas["res_result"]["checkData"];
          if (datas["res_result"]["checkData"] == 1) {
            let alert = this.alertCtrl.create({
              title: datas["res_result"]["titleText"],
              subTitle: datas["res_result"]["detailText"],
              enableBackdropDismiss: false,
              buttons: [
                {
                  text: datas["res_result"]["EnterText"],
                  role: "enter data",
                  handler: () => {
                    this.gd.nextrootpage(this.navCtrl, "InputDataPage", {});
                  },
                },
                {
                  text: datas["res_result"]["CancelText"],
                  role: "Cancel",
                  handler: () => {
                    this.userData.type = "updateDateCancel";
                    this.SFT.ServiceThread(
                      "updateDataUser",
                      this.userData,
                      "POST"
                    ).then((data) => { });
                  },
                },
              ],
            });
            alert.present();
          }
          this.gd.regisNoti();
          resolve(datas);
        } else {
          resolve('failed');
        }
      });
    });
    // setTimeout(() => {
    // }, 1000);
  }

  // onClickProgress() {
  //   // let value = 0;
  //   $("#loading").show();
  //   let value = ((10*$(".progress2").width())/100);
  //   $(".cssProgress-bar").width(value.toString()+'px');
  //   console.log('width full',$(".progress2").width());
  //   let run = setInterval(() => {
  //     if ($(".cssProgress-bar").width() < $(".progress2").width()) {
  //       value += 10;
  //       // $("#progressId").attr("data-percent", value.toString());
  //       $(".cssProgress-bar").width(value.toString()+'%');
  //       console.log("button css width", $(".cssProgress-bar").width());

  //     } else {
  //       clearInterval(run);
  //       $("#loading").hide();
  //       value = 0;
  //       $(".cssProgress-bar").width(value.toString()+'%');
  //     }
  //   },2000);
  // }

  loading(res) {
    console.log(res);
    setTimeout(() => {
      this.SFT.ServiceThread("photos_google", {}, "POST").then((data) => { });
    }, 5000);
    this.percent = 0;
    let check = true;
    $("#loading").show();
    this.isRefresh = false; // disabled refresh page between loading is progress
    let refreshIntervalId = setInterval(() => {
      if ($(".cssProgress-bar").width() > $(".progress2").width()) { // ถ้า progress เต็มความกว้าง
        console.log(`%c cssProgress-bar > progress2`, `color:red`);
        clearInterval(refreshIntervalId);
        this.percent = 0;
        $(".cssProgress-bar").width(this.percent.toString() + "%");
        $("#loading").hide();
        this.isRefresh = true;
        this.doRefresh("");
      } else { // ถ้า progress ยังไม่เต็มความกว้าง
        this.percent += 10;
        if (res) { //เมื่อ new post = true
          $(".cssProgress-bar").width(this.percent.toString() + "%");
          console.log(`%c cssProgress-bar < progress2`, `color:green`);
          console.log("percent", this.percent.toString() + "%");
          console.log("css width", $(".cssProgress-bar").width());
        } else {
          // if (check) {
          // check = false;
          console.log(`%c else cssProgress-bar < progress2`, `color:orange`);
          console.log("else percent", this.percent.toString() + "%");
          console.log("else css width", $(".cssProgress-bar").width());
          clearInterval(refreshIntervalId);
          $(".cssProgress-bar").width(this.percent.toString() + "%");
          $(".cssProgress-bar").addClass("cssProgress-danger");
          $(".cssProgress-bar").removeClass("cssProgress-success");
          this.gd.toast("Error");
          $("#loading").hide();
          this.isRefresh = true;
          this.doRefresh("");
          // }
        }
      }
    }, 2000);
  }
  ionViewDidLoad() {
    console.log("ionViewDidLoad NewfeedPage");
  }
  changeAlbum(type) {
    this.status = false;
    this.content;
    try {
      this.content.scrollToTop();
    } catch (error) { }
    // $(".tabbar.show-tabbar").animate({ marginBottom: "0px" });
    // $('ion-tab[aria-hidden="false"] page-newsfeed:last .header2').animate({ top: "0px" });
    // $('ion-tab[aria-hidden="false"] page-newsfeed:last .header1').animate({ top: "-180px" });
    this.SFT.loading_present("");
    setTimeout(() => {
      this.albumType = type;
      this.dataFeedAll = [];
      this.doRefresh("");
      this.status = true;
      this.SFT.Check_Count("");
    }, 500);
  }
  callScroll() {
    this.virtualScroll.readUpdate(true);
    this.virtualScroll.writeUpdate(true);
    this.hashtag();
    setTimeout(() => {
      // this.content.scrollTo(100, 1, 100);
    }, 500);
  }
  loadData(refresh) {
    console.log("loaddata");

    if (this.numLoad == 0) {
      this.dataFeedAll = [];
    }
    let datasend = {
      lat: this.SFT.userlocation["lat"],
      long: this.SFT.userlocation["long"],
      LoadMoreLimit: this.SFT.LoadMoreLimit,
      numLoad: this.numLoad,
      filter: this.LoadFilterType,
      datapage_id:
        this.SFT.userlocation["lat"] + "," + this.SFT.userlocation["long"],
      width: $("ng-component").width(),
      distant: this.defaultDistant,
    };
    this.SFT.ServiceThread("Datafeed", datasend, "POST").then((data) => {
      if (data["res_code"] != "00") {
        console.log(data["res_text"]);
      } else {
        this.maxvalues = data["maxvalues"];
        data["res_result"].forEach((element) => {
          this.dataFeedAll.push(element);
        });
        setTimeout(() => {
          if (this.numLoad == 0) {
            this.callScroll();
          }
        }, 200);
      }
      this.stLoadinfinity = true;
      this.refreshComplete(refresh);
      setTimeout(() => {
        $("#bGRefresh").fadeOut();
      }, 200);
    });
  }

  doRefresh(refresher) {
    if (this.isRefresh) { // if refresh is not disable
      this.numLoad = 0;
      $("#bGRefresh").fadeIn();
      console.log("refresh");
      console.log(this.TypeLoad);
      setTimeout(() => {
        if (this.TypeLoad == 1) {
          console.log(`doRefresh before infinity scroll loadData`);
          this.loadData(refresher);
          console.log(`doRefresh after infinity scroll loadData`);
        } else if (this.TypeLoad == 2) {
          console.log(`doRefresh before infinity scroll searchAll`);
          this.searchAll(refresher);
          console.log(`doRefresh after infinity scroll searchAll`);
        } else if (this.TypeLoad == 3) {
          console.log(`doRefresh before infinity scroll sameFilter`);
          try {
            refresher.complete();
          } catch (error) { }
          this.sameFilter(this.navParams.get("data").filter, "");
          console.log(`doRefresh after infinity scroll sameFilter`);
          setTimeout(() => {
            $("#bGRefresh").fadeOut();
          }, 1000);
        } else {
          try {
            refresher.complete();
          } catch (error) { }
          this.getExplore(refresher);
          setTimeout(() => {
            $("#bGRefresh").fadeOut();
          }, 1000);
        }
      }, 200);
    }
  }

  test(i) {
    this.rw = this.rw + 1;
    console.log(this.rw);
    console.log("========================================================");
    console.log(this.TypeLoad);
    setTimeout(() => {
      this.refreshComplete(i);
      this.stLoadinfinity = true;
    }, 1000);
  }

  doInfinite(event) {
    // console.log(event);
    // console.log(this.TypeLoad);
    console.log("test infinity");

    if (this.TypeLoad == undefined) {
      console.log(`type undefined`);
    } else {
      console.log(`type load`, this.TypeLoad);
    }

    // this.stLoadinfinity = false;
    if (this.TypeLoad == 1) {
      console.log("TypeLoad : ", this.TypeLoad);
      this.numLoad++;
      this.SFT.LoadMoreLimit = 100;
      console.log(`doInfinite before infinity scroll loadData()`);
      this.loadData(event);
      console.log(`doInfinite after infinity scroll loadData()`);
    } else if (this.TypeLoad == 2) {
      console.log("TypeLoad : ", this.TypeLoad);
      this.numLoad++;
      console.log(`doInfinite before infinity scroll infinitySearch()`);
      this.infinitySearch(event);
      console.log(`doInfinite after infinity scroll infinitySearch()`);
    } else if (this.TypeLoad == 3) {
      console.log("TypeLoad : ", this.TypeLoad);
      this.numLoad++;
      console.log(`doInfinite before infinity scroll sameFilter()`);
      this.sameFilter(this.navParams.get("data").filter, event);
      console.log(`doInfinite after infinity scroll sameFilter()`);
    } else {
      console.log("NO TypeLoad ");
      event.complete();
      this.stLoadinfinity = true;
    }
  }
  refreshComplete(refresh) {
    setTimeout(() => {
      try {
        refresh.complete();
        setTimeout(() => {
          $("#bGRefresh").fadeOut();
        }, 1000);
      } catch (error) { }
    }, 500);
  }
  hashtag() {
    var t = this;
    console.log($('ion-tab[aria-hidden="false"] page-newsfeed:last .hashtag'));
    $('ion-tab[aria-hidden="false"] page-newsfeed:last .hashtag').unbind();
    $('ion-tab[aria-hidden="false"] page-newsfeed:last .hashtag').click(
      function () {
        t.SFT.stLoad = true;
        t.gd.nextpage(t.navCtrl, "NewsfeedPage", {
          frompage: 6,
          datapage: $(this).text(),
        });
      }
    );
  }
  // goHashtag(text){
  // this.gd.nextpage(this.navCtrl, 'NewsfeedPage', { 'frompage': 6, 'datapage': text });
  // }

  NextPage(page, data) {
    console.log(page);

    $('[id="videoPost"]').map(async (index, video: any) => {
      video.muted = true;
      if (!video.paused) {
        await video.pause();
      }
    });

    if (page == "viewComment") {
      let dataSend = JSON.parse(JSON.stringify(data));
      dataSend["openmodel"] = true;
      this.gd.nextpage(this.navCtrl, "DetailfeedPage", { data: dataSend });
    } else if (page == "TouristPage") {
      data.latitude = data.photo_la;
      data.longitude = data.photo_long;
      this.gd.startExternalMap(data);
    } else {
      if (page == "viewComment") {
        let datasend = JSON.parse(JSON.stringify(data));
        datasend["openmodel"] = true;
        this.gd.nextpage(this.navCtrl, "DetailfeedPage", { data: datasend });
      } else {
        if (page == "ProfilePage") {
          if (data.user_id != "TAT") {
            this.gd.nextpage(this.navCtrl, page, { data: data });
          }
        } else {
          this.gd.nextpage(this.navCtrl, page, { data: data });
        }
      }
    }
  }

  like(data, type, index, row) {
    console.log(data);
    console.log(type);
    console.log(index);
    console.log(row);

    if (this.clickLike == true) {
      this.clickLike = false;
      let datas = JSON.parse(JSON.stringify(data));
      delete datas.same;
      delete datas.follow;
      delete datas.ic;
      delete datas.samelength;
      delete datas.status_Follow;
      delete datas.imageLike;
      delete datas.path_resize;
      delete datas.comment_user_img;
      delete datas.pictureResize;
      delete datas.user_path_img;
      delete datas.photo_img_Full;
      delete datas.user_img;
      delete datas.nameLocation;
      delete datas.photo_location;
      delete datas.photo_locationText;
      let senddata = {
        photo_id: data.photo_id,
        type: type,
        data: JSON.stringify(datas),
      };
      if (type == 1) {
        this.dataFeedAll[index]["status_like"] = false;
        this.dataFeedAll[index]["sum_like"] =
          this.dataFeedAll[index]["sum_like"] - 1;
      } else {
        this.dataFeedAll[index]["status_like"] = true;
        this.dataFeedAll[index]["sum_like"] =
          this.dataFeedAll[index]["sum_like"] + 1;
      }
      setTimeout(() => {
        console.log($('ion-tab[aria-hidden="false"] #like' + data.photo_id));
        $('ion-tab[aria-hidden="false"] #like' + data.photo_id).addClass(
          "liked"
        );
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
          this.clickLike = true;
        }, 1100);
      }, 10);

      this.SFT.ServiceThread("like", senddata, "POST").then((data) => {
        if (data["res_code"] == "00") {
        } else {
        }
      });
    }
  }
  bookmark(data, type, index, row) {
    let senddata = {
      photo_id: data.photo_id,
      type: type,
      userType: data.user_id,
    };
    this.dataFeedAll[index]["status_bookmark"] = !this.dataFeedAll[index][
      "status_bookmark"
    ];
    this.SFT.ServiceThread("bookmark", senddata, "POST").then((data) => { });
  }

  saerchPage() {
    let modalbirthday = this.modalCtrl.create("SearchNewfeedPage", {
      typeSearch: this.nowChoose,
    });
    modalbirthday.onDidDismiss((data) => {
      console.log(data);
      if (data != undefined) {
        if (data != undefined && data.type == "search") {
          if (this.TypeLoad != 2) {
            this.gd.nextpage(this.navCtrl, "NewsfeedPage", { search: data });
          } else {
            this.inputSearch = data.data;
            this.Title = data.data;
            this.TypeLoad = 2;
            this.nowChoose = data.typeSearch;
            console.log(this.nowChoose);

            if (data.typeSearch == "Recent") {
              this.LoadFilterType = "Most Recent";
            } else {
              this.LoadFilterType = "My Current Location";
            }
            this.searchAll("");

            try {
              this.content.scrollToTop();
            } catch (error) { }
          }
        } else if (data.type == "clear") {
          this.numLoad = 0;
          this.inputSearch = "";
          this.nowChoose = data.typeSearch;
          if (data.typeSearch == "Recent") {
            this.datafilter("Most Recent", "", false, "");
            this.LoadFilterType = "Most Recent";
          } else {
            this.datafilter("My Current Location", "", false, "");
            this.LoadFilterType = "My Current Location";
          }
          $(".scroll-content").animate(
            {
              scrollTop: 0,
            },
            800
          );
        }
      }
    });
    modalbirthday.present();
  }
  searchAll(refresh) {
    this.TypeLoad = 2;
    this.datafilter("searchAll", this.inputSearch, false, refresh);
  }
  infinitySearch(refresh) {
    this.TypeLoad = 2;
    this.datafilter("searchAll", this.inputSearch, true, refresh);
  }
  datafilter(type, id, scroll, refresh) {
    if (this.maxvalues == -1) {
      this.maxvalues = 500;
    }
    type = type.trim();
    var dataFeeling;
    if (this.defaultDistant == 0 || this.defaultDistant == "") {
      this.defaultDistant = 1;
      $("#Dis").val(1);
    }

    if (type == "searchAll") {
      let typeChoose = "";
      if (this.nowChoose == "Recent") {
        typeChoose = "Most Recent";
      } else {
        typeChoose = "My Current Location";
      }
      console.log(typeChoose);

      dataFeeling = {
        LoadMoreLimit: this.SFT.LoadMoreLimit,
        numLoad: this.numLoad,
        width: $("ng-component").width(),
        filter: "searchAll",
        typeFillter: typeChoose,
        datapage_id: id,
        lat: this.SFT.userlocation["lat"],
        long: this.SFT.userlocation["long"],
      };
      this.getdatafilter(dataFeeling, scroll, refresh);
    } else {
      if (type == "hashtag") {
        // this.title = id;
        dataFeeling = {
          LoadMoreLimit: this.SFT.LoadMoreLimit,
          numLoad: this.numLoad,
          width: $("ng-component").width(),
          filter: type,
          datapage_id: id,
          lat: this.SFT.userlocation["lat"],
          long: this.SFT.userlocation["long"],
        };
        this.nowChoose = "Hashtag";
        this.getdatafilter(dataFeeling, scroll, refresh);
      } else {
        console.log("go else สุดท้าย");

        dataFeeling = {
          LoadMoreLimit: this.SFT.LoadMoreLimit,
          numLoad: this.numLoad,
          width: $("ng-component").width(),
          filter: type,
          datapage_id: id,
          lat: this.SFT.userlocation["lat"],
          long: this.SFT.userlocation["long"],
          distant: this.defaultDistant,
        };
        if (type == "My Current Location") {
          this.nowChoose = "Near Location";
          // this.typeid = 'Current Location';
        } else {
          if (type == "Most Recent") {
            this.nowChoose = "Recent";
          } else {
            this.nowChoose = type;
          }
          // this.typeid = type;
          // this.textsearch = id;
        }
        console.log(this.nowChoose);

        this.getdatafilter(dataFeeling, scroll, refresh);
      }
    }
    this.fillterLog(dataFeeling);
  }

  getdatafilter(dataFeeling, scroll, refresh) {
    console.log(scroll);

    if (this.maxvalues > this.SFT.LoadMoreLimit * this.numLoad) {
      this.SFT.ServiceThread("Datafeed", dataFeeling, "POST").then((data) => {
        if (data["res_code"] == "00") {
          this.maxvalues = data["maxvalues"];
          if (!scroll) {
            this.dataFeedAll = [];
            // this.callScroll();
          }
          for (let index = 0; index < data["res_result"].length; index++) {
            this.dataFeedAll.push(data["res_result"][index]);
            if (index == data["res_result"].length - 1) {
              console.log("testcal");
              if (this.numLoad == 0) {
                this.callScroll();
              }
            }
          }
        } else {
          if (this.numLoad == 0) {
            console.log("close 000000");

            this.dataFeedAll = [];
            this.callScroll();
          }
        }
        this.refreshComplete(refresh);
        this.stLoadinfinity = true;
        setTimeout(() => {
          $("#bGRefresh").fadeOut();
        }, 1000);
      });
    }
  }
  fillterLog(data) {
    this.gd.saveLog("fillter", data);
  }
  scrollTopFN() {
    this.status = false;
    this.content.scrollToTop();
    // $(".tabbar.show-tabbar").animate({ marginBottom: "0px" });
    $('ion-tab[aria-hidden="false"] page-newsfeed:last .header2').fadeIn();
    // $('ion-tab[aria-hidden="false"] page-newsfeed:last .header1').animate({ top: "-180px" });
    setTimeout(() => {
      this.status = true;
    }, 2000);
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
  gonoti() {
    this.gd.nextpage(this.navCtrl, "NotificationsPage", {});
  }
  sameFilter(dataplace, refresh) {
    if (this.numLoad == 0) {
      this.dataFeedAll = [];
    }
    dataplace.numLoad = this.numLoad;
    this.SFT.ServiceThread("Same", dataplace, "POST").then((data) => {
      if (data["res_code"] != "00") {
        console.log(data["res_text"]);
        // this.dataFeedAll = [];
        let dataFeeling = {
          Feeling: this.navParams.get("data")["photo"]["feeling_id"],
          type: 2,
          width: $("ng-component").width(),
          LoadMoreLimit: 20,
          numLoad: this.numLoad,
          lat: this.SFT.userlocation.lat,
          long: this.SFT.userlocation.long,
        };
        this.SFT.ServiceThread("Same", dataFeeling, "POST").then((data) => {
          console.log(data);
          if (data["res_code"] == "00") {
            data["res_result"].forEach((element) => {
              this.dataFeedAll.push(element);
            });
          }
        });
      } else {
        this.maxvalues = data["maxvalues"];
        data["res_result"].forEach((element) => {
          this.dataFeedAll.push(element);
        });
        if (this.dataFeedAll.length < 2) {
          // this.dataFeedAll = [];
          let dataFeeling = {
            Feeling: this.navParams.get("data")["photo"]["feeling_id"],
            type: 2,
            width: $("ng-component").width(),
            LoadMoreLimit: 20,
            numLoad: this.numLoad,
            lat: this.SFT.userlocation.lat,
            long: this.SFT.userlocation.long,
          };
          this.SFT.ServiceThread("Same", dataFeeling, "POST").then((data) => {
            console.log(data);
            if (data["res_code"] == "00") {
              data["res_result"].forEach((element) => {
                this.dataFeedAll.push(element);
              });
            }
          });
        }
        console.log(`===========================`);
        console.log(data["res_result"]);

        setTimeout(() => {
          if (this.numLoad == 0) {
            console.log(`before callScroll`);
            // this.callScroll();
          }
        }, 200);
      }
      console.log(`before refreshComplete`);
      this.refreshComplete(refresh);
      this.stLoadinfinity = true;
      console.log(`after refreshComplete`);

      setTimeout(() => {
        $("#bGRefresh").fadeOut();
      }, 1000);
    });
  }

  getExplore(refresher) {
    if (this.numLoad == 0) {
      this.dataFeedAll = [];
    }
    let datasend = {
      lat: this.SFT.userlocation["lat"],
      long: this.SFT.userlocation["long"],
      LoadMoreLimit: this.SFT.LoadMoreLimit,
      numLoad: this.numLoad,
      width: $("ng-component").width(),
      explore: this.navParams.get("frompage"),
      datapage_id: this.navParams.get("datapage"),
    };
    this.SFT.ServiceThread("Datafeed", datasend, "POST").then((data) => {
      if (data["res_code"] != "00") {
        console.log(data["res_text"]);
      } else {
        this.maxvalues = data["maxvalues"];
        data["res_result"].forEach((element) => {
          this.dataFeedAll.push(element);
        });
        setTimeout(() => {
          if (this.numLoad == 0) {
            this.callScroll();
          }
        }, 200);
      }
      this.refreshComplete(refresher);
      setTimeout(() => {
        $("#bGRefresh").fadeOut();
      }, 200);
    });
  }
  onIntersection($event) {
    const { [InViewportMetadata]: { entry }, target } = $event;
    const ratio = entry.intersectionRatio;
    const vid = target;

    if (ratio >= 0.65) {
      vid.play();
      vid.muted = true;
    } else {
      vid.pause()
      vid.muted = true;
    }
  }

}
