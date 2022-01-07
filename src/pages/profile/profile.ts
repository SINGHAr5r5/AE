import { Push } from "@ionic-native/push";
import { Component, NgZone, ViewChild } from "@angular/core";
import {
  PopoverController,
  IonicPage,
  NavController,
  NavParams,
  Events,
  Platform,
  AlertController,
  ActionSheetController,
  LoadingController,
  Modal,
  ModalOptions,
  ModalController,
  Content,
} from "ionic-angular";
import { GlobalDataService } from "../../services/globaldata.service";
import { ServiceFactoryThread } from "../../services/ServiceFactoryThread";
import { Camera } from "@ionic-native/camera";
import * as firebase from "Firebase";
import * as $ from "jquery";
import { locateHostElement } from "@angular/core/src/render3/instructions";
// import { PopoverPage } from './popover';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var masonry: any;
@IonicPage()
@Component({
  selector: "page-profile",
  templateUrl: "profile.html",
})
export class ProfilePage {
  @ViewChild('myContent') myContent: Content;
  ref = firebase.database().ref("chatrooms/");
  Profile = this.gd.userProfile;
  tabs: any = 1;
  section: string = "one";
  images: any = [];
  somethings: any = new Array(20);
  typeprofile: boolean = true;
  back: boolean = false;
  feedone: any = [];
  feedtwo: any = [];
  feedthree: any = [];
  feedone2: any = [];
  feedtwo2: any = [];
  feedthree2: any = [];
  status_Follow: boolean;
  platformtype: string;
  showfeedtwo2: boolean = false;
  showfeedtwo: boolean = false;
  showfeedthree: boolean = false;
  showfeedthree2: boolean = false;
  user: any = [];
  loading: boolean = true;
  dataChatroom: any = [];
  delayChat: boolean = true;
  goChat2: boolean = false;
  tag_shop: any;
  postEvent: any = [];
  incommentEvent: any = [];
  lastestEvent: any = [];
  monthLista: any = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  linit_last: any = 1;
  limit_incoming: any = 1;
  limit_post: any = 1;
  countpacket: any = 0;
  datasendObject: any = [];
  numLoad: number = 0;
  numLoadAlbum: number = 0;
  numLoadPhoto: number = 0;
  postList: any = [];
  tmpPostList: any = [];
  albumList: any = [];
  allPhoto: any = [];
  footprintList: any = [];
  
  viewType: any = 0;
  coverImage: any = "";
  totalPost: any = 0;
  feedType: any = 1;
  albumType: any = 0;
  favType: any = 0; //favorite type 0 = multi, 1 = single
  mode: any = 1; // 1 = album, 2 = see all album
  provinceSelected: any;
  country: any;
  n: number = 1;

  //tabs 2
  album: any;
  photoList: any;
  refresherEnabled:boolean = true; //if true show refresher 

  //show page
  showPage:boolean = true; 

  constructor(
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public popoverCtrl: PopoverController,
    public navCtrl: NavController,
    public actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    public ngZoneService: NgZone,
    public platform: Platform,
    public navParams: NavParams,
    public SFT: ServiceFactoryThread,
    public gd: GlobalDataService,
    public events: Events,
    private camera: Camera
  ) {
    this.loading = true;
    setTimeout(() => {
      console.log(this.gd.userProfile);
      this.goChat2 = true;
    }, 2000);

    // setTimeout(() => {
    //   $('ion-tab[aria-hidden="false"] .scroll-content:last').stop().animate({paddingTop: "205px"});
    // }, 1000);

    events.subscribe("deleteimg", (res) => {
      console.log("deleteimg");
      this.filterID(res);
    });
  }

  getAlbum() {
    return new Promise((resolve, reject) => {
      let datasend = {
        type: this.mode,
        province:  undefined,
        user_id: this.Profile["user_id"],
        width: $("ng-component").width(),
        LoadMoreLimit: this.SFT.LoadMoreLimit,
        numLoad: this.numLoadAlbum ,
      };
      this.datasendObject = datasend;
      this.SFT.ServiceThread("get_album_photo", datasend, "POST").then(
        (data) => {
          if (data["res_code"] == "00") {
            console.log(data);
            if (this.numLoadAlbum > 0) {
              //this.album.push(data["res_result"]); //ไม่ต้อง push เพราะดึงทั้งหมด
              this.album = data["res_result"];
            } else {
              this.album = data["res_result"];
            }
            this.numLoadAlbum++;
          } else {
            console.log(data);
          }
        
          resolve("finished");
        }
      );
    });
  }

  getAllPhoto(province) {
    return new Promise((resolve, reject) => {
      this.refresherEnabled = false;
      let tmpPhotoList = this.photoList;
      let tmpAlbumList = this.albumList;
      // this.loading = true;
      console.log('loading',this.loading);      
      if (this.numLoadPhoto < 1) {
        //clear array ก่อนดึงข้อมูลเฉพาะครั้งแรก numloadPhoto = 0       
        this.photoList = [];        
      }
      let datasend = {
        type: 2, //1= get post, 2 = get all photo in album, 3 = get favorite
        user_id: this.Profile["user_id"],
        width: $("ng-component").width(),
        lat: this.SFT.userlocation["lat"],
        long: this.SFT.userlocation["long"],
        LoadMoreLimit: this.SFT.LoadMoreLimit,
        numLoad: this.numLoadPhoto,
        province: province,
      };
      this.datasendObject = datasend;
      this.albumList = [];

      this.SFT.ServiceThread("photo_me", datasend, "POST").then((data) => {
        if (data["res_code"] == "00") {
          if (this.numLoadPhoto > 0) {
            for (let index in data["res_result"]) {
              this.photoList.push(data["res_result"][index]);
            }
            this.parseData().then(()=>{
              // this.loading = false;
              this.refresherEnabled = true;
      console.log('add loading',this.loading);      

            });
          } else {
            this.photoList = data["res_result"];
            this.parseData().then(()=>{
              // this.loading = false;
              this.refresherEnabled = true;
      console.log('new loading',this.loading);      

            });
          }
          this.numLoadPhoto++;
        } else {
          this.refresherEnabled = true;
          this.photoList = tmpPhotoList;
          this.albumList = tmpAlbumList;
          console.log('temp of photoList',tmpPhotoList);    
          console.log('temp of albumList',tmpAlbumList);     
          console.log('all photos of album', this.allPhoto);               
          console.log(`etAllPhoto() data not found`, `olor:red`);          
        }
        resolve("finished");

       
      });
    });
  }

  async viewAllAlbum(item) {
    console.log(`viewAllAlbum`, item);
    this.myContent.scrollToTop(0); 
    this.mode = 2;
    this.provinceSelected = item.province;
    console.log("provinceSelected", this.provinceSelected);
    console.log("albumList", this.albumList);

    $('[id="video"]').map(async (index, video: any) => {
      video.muted = true;
      if (!video.paused) {
        await video.pause();
      }
    });

    if (item.photo_count > 1 && this.mode == 2) {
      this.viewType = 0;
    } else {
      this.viewType = 1;
    }    
    await this.getAllPhoto(item.province);    
  }

  hashtag() {
    var t = this;
    $('ion-tab[aria-hidden="false"] page-profile:last .hashtag').unbind();
    $('ion-tab[aria-hidden="false"] page-profile:last .hashtag').click(
      function () {
        console.log("hashtag -------------");
        t.SFT.stLoad = true;
        t.gd.nextpage(t.navCtrl, "newsfeed", {
          frompage: 6,
          datapage: $(this).text(),
        });
      }
    );
  }

  async presentModalPreview(img: String, title) {
    const options: ModalOptions = {
      showBackdrop: true,
      enableBackdropDismiss: false,
      cssClass: "modal-preview",
    };    
    let imgFullsize = img.replace("img_resize","img_base64");
    const myModal: Modal = await this.modalCtrl.create(
      "PreviewPage",
      { image: imgFullsize },
      options
    );
    myModal.onDidDismiss((data) => {
      console.log("I have dismissed Preview.");
      console.log(data);
    });
    return await myModal.present();
  }

  viewImage(img, title) {
    console.log(title);
    this.presentModalPreview(img, title);
  }

  presentPopover() {
    console.log("string");

    let actionSheet = this.actionSheetCtrl.create({
      // title: 'Select Filter',
      buttons: [
        {
          text: "Setting",
          cssClass: "setting_img",
          handler: () => {
            this.gd.nextpage(this.navCtrl, "SettingPage", {});
          },
        },
        {
          text: "Refresh",
          cssClass: "setting_img",
          handler: () => {
            this.gd.getFollow(this.Profile["user_id"]);
            this.Profile["followers"] = this.gd["followers"];
            this.Profile["following"] = this.gd["following"];

            //       this.userProfile["followers"] = data["followers"];
            // this.userProfile["following"] = data["following"];
          },
        },
      ],
    });
    actionSheet.present();
  }
  settingFN() {
    this.gd.nextpage(this.navCtrl, "SettingPage", {});
  }

  filterID(id) {
    if (this.feedone.filter((x) => x.photo_id == id).length > 0) {
      var n = this.feedone.findIndex((x) => x.photo_id == id);
      this.feedone[n]["status_show"] = false;
    } else if (this.feedone2.filter((x) => x.photo_id == id).length > 0) {
      var n = this.feedone2.findIndex((x) => x.photo_id == id);
      this.feedone2[n]["status_show"] = false;
    }
  }

  sendComment(data, type) {
    console.log(data);
    if (data.textComment.trim() != "") {
      if (data.comment_key != "") {
        this.saveComment(data, type);
      } else {
        this.checkroom(data, type);
      }
    }
  }

  checkroom(getData, type) {
    if (getData.user_id != "TAT") {
      if (getData.comment_key == "") {
        let datasend = {
          id: getData.photo_id,
          key: "",
          type: "",
        };
        this.SFT.ServiceThread("check_key_comment", datasend, "POST").then(
          (data) => {
            console.log();

            if (data["res_code"] == "00") {
              getData.comment_key = data["res_result"]["res_result"];
              this.saveComment(getData, type);
            } else {
              let newData = this.ref.push();
              let type;
              if (getData.user_id == "TAT") {
                type = "TAT";
              } else {
                type = "user";
              }
              newData.set({
                roomname: getData.photo_id,
                type: type,
              });
              let datasend = {
                id: getData.photo_id,
                key: newData.key,
                type: type,
              };
              getData.comment_key = newData.key;
              this.SFT.ServiceThread(
                "check_key_comment",
                datasend,
                "POST"
              ).then((data) => {
                console.log("add_room");
                this.saveComment(getData, type);
              });
            }
          }
        );
      }
    }
  }
  saveComment(getData, type) {
    console.log(getData);

    let newData = firebase
      .database()
      .ref("comments/" + getData.comment_key + "/comment/")
      .push();
    let datasend = {
      fullname:
        this.gd.userProfile["user_firstname"] +
        " " +
        this.gd.userProfile["user_lastname"],
      userId: this.gd.userProfile["user_id"],
      comment: getData.textComment,
      date: firebase.database.ServerValue.TIMESTAMP,
      status: "0",
    };
    newData.set(datasend);

    setTimeout(() => {
      let datasend = {
        comment: getData.textComment,
        postId: getData.photo_id,
        userId: this.gd.userProfile["user_id"],
        dataPost: JSON.stringify(getData),
        keycomment: newData.key,
      };
      this.SFT.ServiceThread("saveComment", datasend, "PSOT").then((data) => {
        if (data["res_code"] == "00") {
          // let newData = firebase.database().ref('comments/' + getData.comment_key + '/comment/').push();
          getData.fulnameComment =
            this.gd.userProfile["user_firstname"] +
            " " +
            this.gd.userProfile["user_lastname"];
          getData.userIdComment = this.gd.userProfile["user_id"];
          getData.comment = getData.textComment;
          getData.comment_user_img = this.gd.userProfile.user_path_img;
          getData.timeComment = "0 sec";
          getData.countComment++;
          getData.textComment = "";
        }
      });
    }, 100);
  }

  filters(type, data, tmpFilter) {
    return new Promise(async (resolve, reject) => {
      let tmp: any = tmpFilter;
      console.log("data for filters", data);
      console.log("tmpPostList", this.tmpPostList);
      console.log("type", type);

      if (type == "post") {
        console.log("tmpPostList[data.index]", this.tmpPostList[data.index]);
        tmp = await this.tmpPostList[data.index].data.filter(
          (item) => item.photo_id == data.post_id
        )[0]; //เอาเฉพาะ array ที่มี photo_id ตรงกัน
        console.log("resolve tmp", tmp);
        resolve(tmp);
      } else {
        console.log("tmp data for filters", tmp);
        console.log("tmpFilter", tmpFilter);

        let picResize = await tmp.pictureResize.filter(
          (item) => item.post_id == data.post_id
        ); //เอาเฉพาะ array ที่มี post_id ตรงกัน เนื่องจาก array pictureResize จะเอารูปจากทุกโพสที่อยู่ใน group เดียวกันมา

        let newList = {
          TypeLocation_id: tmp.TypeLocation_id,
          TypeLocation_name: tmp.TypeLocation_name,
          capEdit: tmp.capEdit,
          checkCard: tmp.checkCard,
          checkshow: tmp.checkshow,
          comment: tmp.comment,
          comment_key: tmp.comment_key,
          comment_user_img: tmp.comment_user_img,
          countComment: tmp.countComment,
          country_img: tmp.country_img,
          country_name_en: tmp.country_name_en,
          country_name_th: tmp.country_name_th,
          distant: tmp.distant,
          feeling_id: tmp.feeling_id,
          feeling_name: tmp.feeling_name,
          followST: tmp.followST,
          followers: tmp.followers,
          following: tmp.following,
          fulnameComment: tmp.fulnameComment,
          hashtag: tmp.hashtag,
          imageLike: tmp.imageLike,
          linkshared: tmp.linkshared,
          photo_caption: tmp.photo_caption,
          photo_id: tmp.photo_id,
          photo_la: tmp.photo_la,
          photo_location: tmp.photo_location,
          photo_locationText: tmp.photo_locationText,
          photo_long: tmp.photo_long,
          photo_province: tmp.photo_province,
          photo_share: tmp.photo_share,
          pictureFull: tmp.pictureFull,
          pictureResize: picResize,
          sizeFullheight: tmp.sizeFullheight,
          sizeheight: tmp.sizeheight,
          status_bookmark: tmp.status_bookmark,
          status_comment: tmp.status_comment,
          status_like: tmp.status_like,
          status_show: tmp.status_show,
          sum_like: tmp.sum_like,
          textComment: tmp.textComment,
          time: tmp.time,
          timeComment: tmp.timeComment,
          userIdComment: tmp.userIdComment,
          user_firstname: tmp.user_firstname,
          user_id: tmp.user_id,
          user_img: tmp.user_img,
          user_lastname: tmp.user_lastname,
          user_path_img: tmp.user_path_img,
          user_type: tmp.user_type,
        };
        resolve(newList);
      }
    });
  }

  async goDetail(data) {
    console.log("click photoList", this.photoList);
    console.log("goDetail data", data);

    // this.filters("post", data, {}).then((dataFilter) => {
    //   this.filters("photo_id", data, dataFilter).then((result) => {
    this.NextPage("DetailfeedPage", this.photoList[data.index]);
    //     console.log(`result`, result);
    //   });
    // });
  }
  async doRefresh(refresher) {
    let senddata = {
      follow_user: this.Profile["user_id"],
    };
    if (this.navParams.get("data")) {
      this.Profile = JSON.parse(JSON.stringify(this.navParams.get("data")));
    } else {
      this.Profile = this.gd.userProfile;
    }
    this.SFT.ServiceThread(
      "getCoverImage",
      { user_id: this.Profile["user_id"] },
      "POST"
    ).then((data) => {
      console.log(data);
      if (data["res_code"] == "00") {
        this.coverImage = data["res_result"]["coverPath"];
        this.totalPost = data["res_result"]["totalPost"];
      }
    });
    this.SFT.ServiceThread("Chack_following", senddata, "POST").then((data) => {
      if (data["res_code"] == "00") {
        console.log(data);
        this.status_Follow = false;
      } else {
        console.log(data["res_text"]);
        this.status_Follow = true;
      }
      this.Profile.followers = data["res_result"]["followers"];
      this.Profile.following = data["res_result"]["following"];
    });
    this.numLoad = 0;
    console.log(refresher);
    if (this.tabs == 1) {
      let datasend = {
        type: this.tabs,
        user_id: this.Profile["user_id"],
        width: $("ng-component").width(),
        lat: this.SFT.userlocation["lat"],
        long: this.SFT.userlocation["long"],
        LoadMoreLimit: this.SFT.LoadMoreLimit,
        numLoad: this.numLoad,
        province: this.provinceSelected,
      };
      this.datasendObject = datasend;

      this.SFT.ServiceThread("photo_me", datasend, "POST").then((data) => {
        if (data["res_code"] == "00") {
          this.postList = data["res_result"];
          this.tmpPostList = data["res_result"];
          console.log(
            "========================================================================"
          );
          if (this.tabs == 1) {
            this.changeAlbum(this.feedType);
          }
          console.log(
            "========================================================================"
          );

          setTimeout(() => {
            $(".app").addClass("active");
            this.hashtag();
          }, 500);
          setTimeout(() => {
            try {
              refresher.complete();
            } catch (error) {}
          }, 500);
        } else {
          setTimeout(() => {
            try {
              refresher.complete();
            } catch (error) {}
          }, 500);
        }
        this.loading = false;
      });
    } else if (this.tabs == 2) {
      if (this.mode == 1) {
        this.numLoadAlbum = 0;
        await this.getAlbum();
      } else {
        this.numLoadPhoto = 0;
        await this.getAllPhoto(this.provinceSelected);
      }
      setTimeout(() => {
        try {
          refresher.complete();
        } catch (error) {}
      }, 1000);
    } else if (this.tabs == 3) {
      this.showfeedthree = true;
      let datasend = {
        type: 3,
        user_id: this.Profile["user_id"],
        width: $("ng-component").width(),
        lat: this.SFT.userlocation["lat"],
        long: this.SFT.userlocation["long"],
        LoadMoreLimit: this.SFT.LoadMoreLimit,
        numLoad: this.numLoad,
      };
      this.datasendObject = datasend;
      this.SFT.ServiceThread("photo_me", datasend, "POST").then((data) => {
        this.feedthree2.length = 0;
        this.feedthree.length = 0;
        console.log(data);
        if (data["res_code"] == "00") {
          console.log(data["res_text"]);
          this.footprintList = data["res_result"];        
          setTimeout(() => {
            $(".app").addClass("active");
            this.hashtag();
          }, 500);
          setTimeout(() => {
            try {
              refresher.complete();
            } catch (error) {}
          }, 500);
        } else {
          setTimeout(() => {
            try {
              refresher.complete();
            } catch (error) {}
          }, 500);
          this.feedthree2.length = 0;
          this.feedthree.length = 0;
          // this.gd.feedthree.length = 0;
        }      
      });
    }
    setTimeout(() => {
      console.log("Async operation has ended");
    }, 2000);
  }

  async parseData() {
    if (this.tabs == 2) {
      this.albumList = [];
      for (let index in this.photoList) {
        // for (let index2 in this.postList[index].pictureResize) {
        this.photoList[index].pictureResize.forEach((element) => {
          let strProvince:any;
          if(this.photoList[index].photo_province != ''){
            strProvince =this.photoList[index].photo_province+','
          }else{
            strProvince = ''
          }
          let dataPush = {
            index: index,
            province: this.photoList[index].photo_province,
            album_name: strProvince+this.photoList[index].photo_location.split(',').reverse()[0],
            photo_id: this.photoList[index].photo_id,
            path_full: element.path_full,
            path_resize: element.path_resize,
            path_height: element.path_height,
            number: element.number,
            type: element.type,
          };
          this.albumList.push(dataPush);
        });
        // }
      }
      this.allPhoto = this.albumList;
      console.log("parseData into albumList", this.albumList);
      console.log("parseData into album", this.album);
    }
    console.log(`----------- parseData ------------`);
  }



  changeAlbum(id) {
    if (this.tabs == 1) {
      this.feedType = id;
    } else if (this.tabs == 2 && this.mode == 1) {
      this.albumType = id;
    } else if (this.tabs == 2 && this.mode == 2) {
      this.viewType = id;
    }else if(this.tabs == 3){
      this.favType = id
    }
    console.log(id);
  }
  changeTabs(id) {
    this.tabs = id;
    $('ion-tab[aria-hidden="false"] page-profile:last .tabsAction').removeClass(
      "tabsAction"
    );
    if (id == 1) {
      $('ion-tab[aria-hidden="false"] page-profile:last #postTabs').addClass(
        "tabsAction"
      );
      this.doRefresh($("#refresher"));
    } else if (id == 2) {
      $('ion-tab[aria-hidden="false"] page-profile:last #albumTabs').addClass(
        "tabsAction"
      );
      this.provinceSelected = undefined;
      // if (this.tabs == 2 && this.mode == 1 && this.postList.length > 1) {
      //   this.albumType = 0;
      // } else {
      //   this.albumType = 1;
      // }
      // if (this.tabs == 2 && this.mode == 2 && this.allPhoto.length > 1) {
      //   this.viewType = 0;
      // } else {
      //   this.viewType = 1;
      // }

      this.numLoadPhoto = 0; //reset numload of photo
      this.mode = 1; //reset mode if mode 2
      this.getAlbum().then(()=>{
        if (this.album.length > 1) {
          this.albumType = 0;
        }else{
          this.albumType = 1;
        }
      }) //มีการเรียกดู doRefresh() ซึ่งใน function doRefresh() มีการเรียก getAlbum() แล้ว
    }else if (id == 3) {
      $('ion-tab[aria-hidden="false"] page-profile:last #footprintTabs').addClass("tabsAction");
      this.showfeedthree = true;
      let datasend = {
        type: 3,
        user_id: this.Profile["user_id"],
        width: $("ng-component").width(),
        lat: this.SFT.userlocation["lat"],
        long: this.SFT.userlocation["long"],
        LoadMoreLimit: this.SFT.LoadMoreLimit,
        numLoad: this.numLoad,
      };
      this.datasendObject = datasend;
      this.SFT.ServiceThread("photo_me", datasend, "POST").then((data) => {
        this.feedthree2.length = 0;
        this.feedthree.length = 0;
        console.log(data);
        if (data["res_code"] == "00") {
          console.log(data["res_text"]);
          this.footprintList = data["res_result"];
          if (this.footprintList.length > 1) {
            this.favType = 0; //multi post
          }else{
            this.favType = 1; //single post
          }
    
        } else {        
        
          this.feedthree2.length = 0;
          this.feedthree.length = 0;
          // this.gd.feedthree.length = 0;
        }      
      });
    } else {      
      this.doRefresh($("#refresher"));
    }
    // this.doRefresh($("#refresher"));    
  }
  doRefreshshop(refresher) {
    console.log(refresher);
    if (this.section == "one") {
      this.SFT.ServiceThread(
        "photo_me",
        {
          type: 1,
          user_id: this.Profile["user_id"],
          width: $("ng-component").width(),
          lat: this.SFT.userlocation["lat"],
          long: this.SFT.userlocation["long"],
        },
        "POST"
      ).then((data) => {
        this.feedone2.length = 0;
        this.feedone.length = 0;
        if (data["res_code"] == "00") {
          var virtualScroll1 = 0;
          var virtualScroll2 = 0;
          for (let index = 0; index < data["res_result"].length; index++) {
            if (virtualScroll1 <= virtualScroll2) {
              this.feedone.push(data["res_result"][index]);
              virtualScroll1 += data["res_result"][index]["sizeheight"] + 114;
            } else {
              this.feedone2.push(data["res_result"][index]);
              virtualScroll2 += data["res_result"][index]["sizeheight"] + 114;
            }
          }
          setTimeout(() => {
            $('ion-tab[aria-hidden="false"] page-profile:last .app').addClass(
              "active"
            );
            this.hashtag();
          }, 500);
          setTimeout(() => {
            try {
              refresher.complete();
            } catch (error) {}
          }, 500);
        } else {
          setTimeout(() => {
            try {
              refresher.complete();
            } catch (error) {
              this.ngZoneService.run(() => {
                console.log("Reenetering angular context....");
              });
            }
          }, 500);
          this.feedone2.length = 0;
          this.feedone.length = 0;
          // this.gd.feedone.length = 0;
        }
        this.loading = false;
      });
    } else if (this.section == "two") {
      this.showfeedtwo2 = true;
      // this.serviceFactoryThread.ServiceThread('get_infomation', { 'user_id': this.gd.userProfile.user_id}, 'POST')
      //   .then(data => {
      //     this.tag_shop = data[""]
      //   });
    } else if (this.section == "three") {
      this.showfeedthree = true;
      this.SFT.ServiceThread(
        "photo_me",
        {
          type: 3,
          user_id: this.Profile["user_id"],
          width: $("ng-component").width(),
          lat: this.SFT.userlocation["lat"],
          long: this.SFT.userlocation["long"],
        },
        "POST"
      ).then((data) => {
        this.feedthree2.length = 0;
        this.feedthree.length = 0;
        console.log(data);
        if (data["res_code"] == "00") {
          console.log(data["res_text"]);
          if (this.typeprofile) {
            // this.gd.feedthree = data['res_result'];
          }
          var virtualScroll1 = 0;
          var virtualScroll2 = 0;
          for (let index = 0; index < data["res_result"].length; index++) {
            if (virtualScroll1 <= virtualScroll2) {
              this.feedthree.push(data["res_result"][index]);
              virtualScroll1 += data["res_result"][index]["sizeheight"] + 114;
            } else {
              this.feedthree2.push(data["res_result"][index]);
              virtualScroll2 += data["res_result"][index]["sizeheight"] + 114;
            }
          }
          setTimeout(() => {
            $(".app").addClass("active");
            this.hashtag();
          }, 500);
          setTimeout(() => {
            try {
              refresher.complete();
            } catch (error) {
              this.ngZoneService.run(() => {
                console.log("Reenetering angular context....");
              });
            }
          }, 500);
        } else {
          setTimeout(() => {
            try {
              refresher.complete();
            } catch (error) {
              this.ngZoneService.run(() => {
                console.log("Reenetering angular context....");
              });
            }
          }, 500);
          this.feedthree2.length = 0;
          this.feedthree.length = 0;
          // this.gd.feedthree.length = 0;
        }
        this.loading = false;
      });
    } else if (this.section == "four") {
      console.log("four 123");
      this.loading = false;
    }
    setTimeout(() => {
      console.log("Async operation has ended");
    }, 2000);
  }
  // changepage() {
  //   $('ion-tab[aria-hidden="false"] page-profile:last .app').removeClass(
  //     "active"
  //   );
  //   this.loading = true;
  //   if (this.section == "one") {
  //     this.doRefresh($("#refresher"));
  //   } else if (this.section == "two") {
  //     this.showfeedtwo2 = true;
  //     this.doRefresh($("#refresher"));
  //   } else if (this.section == "three") {
  //     this.showfeedthree = true;
  //     this.doRefresh($("#refresher"));
  //   } else if (this.section == "four") {
  //     console.log("four");
  //     this.doRefresh($("#refresher"));
  //   } else if (this.section == "five") {
  //     console.log("five");
  //     this.doRefresh($("#refresher"));
  //   }
  // }

  ionViewDidLoad() {
    console.log("ionViewDidLoad ProfilePage");

    console.log("gd Profile", this.gd.userProfile);
    this.Profile = this.gd.userProfile;
    let user = this.Profile["user_id"];
    if (this.navParams.get("data")) {
      this.Profile = JSON.parse(JSON.stringify(this.navParams.get("data")));
      console.log("data Profile", this.navParams.get("data"));
      console.log("if have navparams Profile", this.Profile);
      if (this.Profile["user_id"] == user) {
        this.typeprofile = true;
      } else {
        this.typeprofile = false;
      }
      this.back = true;
    }
    this.SFT.ServiceThread(
      "getCoverImage",
      { user_id: this.Profile["user_id"] },
      "POST"
    ).then((data) => {
      console.log(data);

      if (data["res_code"] == "00") {
        this.coverImage = data["res_result"]["coverPath"];
        this.totalPost = data["res_result"]["totalPost"];
      }
    });
    console.log(this.navParams.get("data"));
    this.events.subscribe("refollowProfile", (user, type) => {
      console.log("refollowProfile ----*****----");
      if (this.Profile.user_id == user) {
        if (type == 1) {
          console.log("เพิ่ม");
          this.Profile.followers += 1;
          this.status_Follow = false;
        } else {
          console.log("ลบ");
          this.Profile.followers -= 1;
          this.status_Follow = true;
        }
      }
    });

    if (this.typeprofile) {   
      let datasend = {
        type: 1,
        user_id: this.Profile["user_id"],
        width: $("ng-component").width(),
        lat: this.SFT.userlocation["lat"],
        long: this.SFT.userlocation["long"],
        LoadMoreLimit: this.SFT.LoadMoreLimit,
        numLoad: this.numLoad,
      };
      this.datasendObject = datasend;
      this.SFT.ServiceThread("photo_me", datasend, "POST").then((data) => {
        if (data["res_code"] == "00") {
          // this.feedone = data['res_result'];
          // gd.feedone = data['res_result'];
          this.postList = data["res_result"];
          this.tmpPostList = data["res_result"];
          console.error(this.postList);

          console.log(
            "***********************************************************************************"
          );
        
            if (this.postList.length > 1) {
              this.feedType = 0; //show 2 feed per row
            } else {
              this.feedType = 1; //show 1 feed per rows
            }

            // if (this.tabs == 2 && this.mode == 1 && this.postList.length > 1) {
            //   this.albumType = 0;
            // } else {
            //   this.albumType = 1;
            // }

            // if (this.tabs == 2 && this.mode == 2 && this.allPhoto.length > 1) {
            //   this.viewType = 0;
            // } else {
            //   this.viewType = 1;
            // }         

          console.log(
            "***********************************************************************************"
          );

          setTimeout(() => {
            this.hashtag();
            $(".app").addClass("active");
          }, 500);
        } else {
          // gd.feedone.length = 0;
        }
        this.loading = false;
      });
    } else {
      let senddata = {
        follow_user: this.Profile["user_id"],
      };
      this.SFT.ServiceThread("Chack_following", senddata, "POST").then(
        (data) => {
          if (data["res_code"] == "00") {
            console.log(data);
            this.status_Follow = false;
          } else {
            console.log(data["res_text"]);
            this.status_Follow = true;
          }
          this.Profile.followers = data["res_result"]["followers"];
          this.Profile.following = data["res_result"]["following"];
        }
      );
      let datasend = {
        type: 1,
        user_id: this.Profile["user_id"],
        width: $("ng-component").width(),
        lat: this.SFT.userlocation["lat"],
        long: this.SFT.userlocation["long"],
        LoadMoreLimit: this.SFT.LoadMoreLimit,
        numLoad: this.numLoad,
      };
      this.datasendObject = datasend;
     

      this.SFT.ServiceThread("photo_me", datasend, "POST").then((data) => {
        if (data["res_code"] == "00") {
          this.postList = data["res_result"];
          this.tmpPostList = data["res_result"];
          console.warn(this.postList);

          if (this.postList.length > 1) {
            this.feedType = 0; //show 2 feed per row
            console.log(`>1`);
          } else {
            this.feedType = 1; //show 1 feed per rows
            console.log(`<1`);
          }

          console.warn(this.postList.length);
          console.log(
            "------------------------------------------------------------------------------------"
          );
        
          console.log(
            "------------------------------------------------------------------------------------"
          );

          setTimeout(() => {
            $(".app").addClass("active");
            this.hashtag();
          }, 500);
        } else {
          // gd.feedone.length = 0;
        }
        this.loading = false;
      });
    }
  }
  navPop() {
    if (this.mode == 2 && this.tabs == 2) {
      this.mode = 1;
      this.provinceSelected = undefined;
    } else {
      this.navCtrl.pop();
    }
  }

  setting() {
    // this.navCtrl.setRoot("login", {});
    // this.events.publish('logout');
    this.gd.nextpage(this.navCtrl, "SettingPage", {});
  }

  follow(type) {
    console.log(this.gd.userProfile);
    let datanew = JSON.parse(JSON.stringify(this.gd.userProfile));
    delete datanew.same;
    delete datanew.follow;
    delete datanew.ic;
    delete datanew.samelength;
    delete datanew.status_Follow;
    delete datanew.message;
    delete datanew.data_message;

    let senddata = {
      follow_user: this.Profile["user_id"],
      type: type,
      data: JSON.stringify(datanew),
    };
    this.SFT.ServiceThread("indefollowing", senddata, "POST").then((data) => {
      console.log(data);
    });
    if (type == 1) {
      console.log("เพิ่ม");
      // this.Profile.followers += 1;
      // this.status_Follow = false;
      // this.Profile['following'] =  this.Profile['following']+1;
      this.gd.userProfile.following += 1;
      this.events.publish("refollowlocation", this.Profile["user_id"], 1);
      this.events.publish("refollowDetail", this.Profile["user_id"], 1);
      this.events.publish("refollowProfile", this.Profile["user_id"], 1);
    } else {
      console.log("ลบ");
      // this.Profile.followers -= 1;
      // this.status_Follow = true;
      // this.Profile['following'] =  this.Profile['following']-1;
      this.gd.userProfile.following -= 1;
      this.events.publish("refollowlocation", this.Profile["user_id"], 2);
      this.events.publish("refollowDetail", this.Profile["user_id"], 2);
      this.events.publish("refollowProfile", this.Profile["user_id"], 2);
    }
  }

  NextPage(page, image) {
    console.log(image, page);
    console.log(this.gd.goDetail);
    console.log(`image`,image);
    console.log(`page`,page);

    $('[id="video"]').map(async (index, video: any) => {
      video.muted = true;
      if (!video.paused) {
        await video.pause();
      }
    });
    

    if (page == "viewComment" && this.gd.goDetail) {
      console.log("if--*");

      let dataSend = JSON.parse(JSON.stringify(image));
      dataSend["openmodel"] = true;
      this.gd.nextpage(this.navCtrl, "DetailfeedPage", { data: dataSend });
    } else if (page == "TouristPage") {
      image.latitude = image.photo_la;
      image.longitude = image.photo_long;
      this.gd.startExternalMap(image);
    } else {
      if (
        page == "ProfilePage" &&
        this.gd.userProfile["user_id"] == image["user_id"]
      ) {
        this.navCtrl.parent.select(4);
      } else {
        if (
          this.Profile["user_id"] != image["user_id"] ||
          page != "ProfilePage"
        ) {
          if (page == "DetailfeedPage") {
            // this.gd.pageDetail = 'sameType';
          }
          this.gd.nextpage(this.navCtrl, page, { data: image });
          this.gd.saveLog("Go", image);
        }
      }
    }
  }

  like(data, type, index, row) {
    console.log(type + "," + index + "," + row);
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
      console.log("ลบ");
      if (this.tabs == 1) {
        this.postList[index]["status_like"] = false;
        this.postList[index]["sum_like"] = this.postList[index]["sum_like"] - 1;
      } else if (this.tabs == 3) {
        this.footprintList[index]["status_like"] = false;
        this.footprintList[index]["sum_like"] =
          this.postList[index]["sum_like"] - 1;
      }
    } else {
      console.log("บวก");
      if (this.tabs == 1) {
        this.postList[index]["status_like"] = true;
        this.postList[index]["sum_like"] = this.postList[index]["sum_like"] + 1;
      } else if (this.tabs == 3) {
        this.footprintList[index]["status_like"] = false;
        this.footprintList[index]["sum_like"] =
          this.postList[index]["sum_like"] - 1;
      }
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
      console.log(data);
    });
  }

  bookmark(data, type, index, row) {
    let senddata = {
      photo_id: data.photo_id,
      type: type,
    };

    this.SFT.ServiceThread("bookmark", senddata, "POST").then((data) => {
      console.log(data);
      if (data["res_code"] == "00") {
        if (type == 1) {
          console.log("ลบ");

          if (this.tabs == 1) {
            this.postList[index]["status_bookmark"] = false;
          } else if (this.tabs == 3) {
            this.footprintList[index]["status_bookmark"] = false;
          }
        } else {
          console.log("บวก");
          if (this.tabs == 1) {
            this.postList[index]["status_bookmark"] = true;
          } else if (this.tabs == 3) {
            this.footprintList[index]["status_bookmark"] = true;
          }
        }
      }
    });
  }

  userfollows(type, text, num) {
    this.gd.nextpage(this.navCtrl, "CoconutPage", {
      type: type,
      title: text,
      Profile: this.Profile,
      num: this.Profile.following,
    });
  }

  chat(data, item) {
    console.log();
    // this.gd.room = data;
    console.log(item);
    console.log(data);

    this.gd.nextpage(this.navCtrl, "ChatPage", {
      key: item["room_name"],
      imguser: item["user_path_img"],
      data: item,
    });

    // this.gd.nextpage(this.navCtrl, "ChatPage", { 'data': data, 'room': item['room_id'] })
  }

  chat2(datas) {
    if (this.gd.clickGo && this.goChat2) {
      this.gd.clickGo = false;
      this.SFT.ServiceThread(
        "check_room",
        { user_id: this.gd.userProfile["user_id"], user_to: datas["user_id"] },
        "POST"
      ).then((data) => {
        if (data["res_code"] == "00") {
          let dataroom = this.gd.roomchat.filter(
            (message) => message.room_name === data["res_result"]
          );
          console.log(dataroom);
          this.gd.nextpage(this.navCtrl, "ChatPage", {
            key: data["res_result"],
            imguser: datas["user_path_img"],
            data: dataroom[0],
          });
        } else {
          let newData = this.ref.push();
          newData.set({
            roomname: this.gd.userProfile["user_id"] + "/" + datas["user_id"],
          });
          let senddata = {
            key: newData.key,
            to_user: datas["user_id"],
          };
          this.SFT.ServiceThread("addroom", senddata, "POST").then((data) => {
            this.gd.chat();
            datas["room_name"] = newData.key;
            this.gd.nextpage(this.navCtrl, "ChatPage", {
              key: newData.key,
              imguser: datas["user_path_img"],
              data: datas,
            });
          });
        }
      });
    }
  }
  followFC(st, id) {
    let datanew = JSON.parse(JSON.stringify(this.gd.userProfile));
    delete datanew.same;
    delete datanew.follow;
    delete datanew.ic;
    delete datanew.samelength;
    delete datanew.status_Follow;
    delete datanew.message;
    delete datanew.data_message;
    let senddata = {
      follow_user: id,
      type: st,
      data: JSON.stringify(datanew),
    };
    this.SFT.ServiceThread(
      "indefollowing",
      senddata,
      "POST"
    ).then((data) => {});
    if (st == 1) {
      if (this.tabs == 3) {
        this.footprintList.forEach((element, index) => {
          if (element.user_id == id) {
            this.footprintList[index]["followST"] = true;
          }
        });
      } else {
        this.postList.forEach((element, index) => {
          if (element.user_id == id) {
            this.postList[index]["followST"] = true;
          }
        });
      }

      if (this.gd.userProfile.user_id == this.Profile.user_id) {
        this.Profile.following++;
      } else {
        this.Profile.followers++;
      }
    } else {
      if (this.tabs == 3) {
        this.footprintList.forEach((element, index) => {
          if (element.user_id == id) {
            this.footprintList[index]["followST"] = false;
          }
        });
      } else {
        this.postList.forEach((element, index) => {
          if (element.user_id == id) {
            this.postList[index]["followST"] = false;
          }
        });
      }

      if (this.gd.userProfile.user_id == this.Profile.user_id) {
        this.Profile.following--;
      } else {
        this.Profile.followers--;
      }
    }
  }
  deleteMsg(data, i) {
    let alert = this.alertCtrl.create({
      message: "Confirm Delete Messager",
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
            let senddata = {
              room_id: data["room_id"],
            };
            this.SFT.ServiceThread("Delectmessageroom", senddata, "POST").then(
              (data) => {
                this.gd.sumNoti -= data["noread"];
                this.gd.chat();
                if (data["res_code"] != "00") {
                  // this.gd.datamessage.splice(i, 1);
                } else {
                  // this.gd.datamessage.splice(i, 1);
                }
              }
            );

            console.log(data["room_id"]);
          },
        },
      ],
    });
    alert.present();
  }

  presentActionSheet(type) {
    let actionSheet = this.actionSheetCtrl.create({
      title: "Option",
      buttons: [
        {
          text: "Choose Form Library",
          cssClass: "",
          handler: () => {
            if (type == 1) {
              this.takePicture(2, this.navCtrl);
            } else {
              this.coverImageChange(2, this.navCtrl);
            }
            console.log("Destructive clicked");
          },
        },
        {
          text: "Take Photo",
          cssClass: "",
          handler: () => {
            if (type == 1) {
              this.takePicture(1, this.navCtrl);
            } else {
              this.coverImageChange(1, this.navCtrl);
            }
            console.log("Archive clicked");
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

  takePicture(check, navCtrl) {
    let type;
    if (check == 1) {
      type = this.camera.PictureSourceType.CAMERA;
    } else {
      type = this.camera.PictureSourceType.PHOTOLIBRARY;
    }

    this.camera
      .getPicture({
        sourceType: type,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        allowEdit: true,
        mediaType: this.camera.MediaType.PICTURE,
      })
      .then(
        (imageData) => {
          // imageData is a base64 encoded string
          // this.data['imageData'] = "data:image/jpeg;base64," + imageData;
          // console.log(this.data['imageData']);
          // // console.log("data:image/jpeg;base64," + imageData);
          // document.getElementById('profile').setAttribute('src', this.data['imageData']);

          let alert = this.alertCtrl.create({
            title: "Confirm Edit Profile",
            // message: 'Do you want to buy this book?',
            buttons: [
              {
                text: "Cancel",
                role: "cancel",
                handler: () => {
                  console.log("Cancel clicked");
                },
              },
              {
                text: "Confirm",
                handler: () => {
                  console.log("Confirm");
                  this.SFT.ServiceThread(
                    "UpdateProfile",
                    { imageData: "data:image/jpeg;base64," + imageData },
                    "POST"
                  ).then((data) => {
                    if (data["res_code"] != "00") {
                    } else {
                      console.log(data["res_result"]);
                      this.gd.userProfile["user_path_img"] =
                        data["res_result"]["user_path_img"];
                    }
                  });
                },
              },
            ],
          });
          alert.present();
        },
        (err) => {
          console.log(err);
        }
      );
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
  nextPaged(dataget) {
    let datasend = {
      booking_code: dataget.booking_code_order,
      lat: this.SFT.userlocation.lat,
      lng: this.SFT.userlocation.long,
      widthPhone: $("ng-component").width(),
    };
    this.SFT.ServiceThread("get_booking_detail", datasend, "POST").then(
      (data) => {
        this.gd.nextpage(this.navCtrl, "PaymentStatusPage", {
          data: data["res_result"],
        });
      }
    );
  }
  async doInfinite(event) {
    console.log(">>>>>>>>>>>>>>>>>>>> loadmore >>>>>>>>>>>>>>>>>>>");
    if (this.section != "five" && this.section != "four") {
      if (this.tabs != 2) {
        this.numLoad++;
        this.datasendObject.numLoad = this.numLoad;
        this.SFT.ServiceThread("photo_me", this.datasendObject, "POST").then(
          (data) => {
            if (data["res_code"] == "00") {
              if (this.tabs == 1) {
                console.log("data for push postList", data["res_result"]);
                for (
                  let index = 0;
                  index < data["res_result"].length;
                  index++
                ) {
                  this.postList.push(data["res_result"][index]);
                  if (this.tabs == 2) {
                    // for (let index2 in data["res_result"][index]) {
                    data["res_result"][index].data[0].pictureResize.forEach(
                      (element) => {
                        let dataPush = {
                          id: data["res_result"][index].data[0].photo_id,
                          path: element.path_resize,
                        };
                        this.albumList.push(dataPush);
                      }
                    );
                    // }
                  }
                }
                setTimeout(() => {
                  $(".app").addClass("active");
                  this.hashtag();
                  try {
                    event.complete();
                  } catch (error) {}
                }, 500);
              } else if (this.tabs == 3) {
                for (
                  let index = 0;
                  index < data["res_result"].length;
                  index++
                ) {
                  this.footprintList.push(data["res_result"][index]);
                }
                setTimeout(() => {
                  $(".app").addClass("active");
                  this.hashtag();
                  try {
                    event.complete();
                  } catch (error) {}
                }, 500);
              } else {
                setTimeout(() => {
                  try {
                    event.complete();
                  } catch (error) {}
                }, 500);
              }
            } else {
              setTimeout(() => {
                try {
                  event.complete();
                } catch (error) {}
              }, 500);
            }
          }
        );
      } else {
        if (this.mode == 1) {
          await this.getAlbum().then(()=>{
            setTimeout(() => {
              try {
                console.log('close infinite load album');                
                event.complete();
              } catch (error) {}
            }, 1000);
          });
        } else {
          await this.getAllPhoto(this.provinceSelected).then(()=>{
            setTimeout(() => {
              try {
                console.log('close infinite load photo');
                event.complete();
              } catch (error) {}
            }, 1000);
          });
        }      
      }
    } else {
      try {
        event.complete();
      } catch (error) {}
    }
  }

  coverImageChange(check, navCtrl) {
    let type;
    if (check == 1) {
      type = this.camera.PictureSourceType.CAMERA;
    } else {
      type = this.camera.PictureSourceType.PHOTOLIBRARY;
    }
    this.camera
      .getPicture({
        sourceType: type,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        allowEdit: true,
        mediaType: this.camera.MediaType.PICTURE,
      })
      .then(
        (imageData) => {
          let alert = this.alertCtrl.create({
            title: "Confirm Edit Profile",
            // message: 'Do you want to buy this book?',
            buttons: [
              {
                text: "Cancel",
                role: "cancel",
                handler: () => {
                  console.log("Cancel clicked");
                },
              },
              {
                text: "Confirm",
                handler: () => {
                  console.log("Confirm");
                  this.SFT.ServiceThread(
                    "saveCoverImage",
                    { image: "data:image/jpeg;base64," + imageData },
                    "POST"
                  ).then((data) => {
                    if (data["res_code"] != "00") {
                    } else {
                      console.log(data["res_result"]);
                      // this.coverImage = "data:image/jpeg;base64," + imageData;
                      this.SFT.ServiceThread(
                        "getCoverImage",
                        { user_id: this.Profile["user_id"] },
                        "POST"
                      ).then((data) => {
                        console.log(data);

                        if (data["res_code"] == "00") {
                          this.coverImage = data["res_result"]["coverPath"];
                          this.totalPost = data["res_result"]["totalPost"];
                        }
                      });
                    }
                  });
                },
              },
            ],
          });
          alert.present();
        },
        (err) => {
          console.log(err);
        }
      );
  }

  pressEvent(event: Event) {
    var myVar = setInterval(function () {
      console.log(event);
    }, 200);
    //
    setTimeout(() => {
      clearInterval(myVar);
    }, 5000);
  }
}
