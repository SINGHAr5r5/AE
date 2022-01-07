import { Response } from '@angular/http';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, normalizeURL, ModalController, Events, Slides, Content, PopoverController, AlertController, LoadingController } from 'ionic-angular';
import { Location } from '@angular/common';
import { ServiceFactoryThread } from '../../services/ServiceFactoryThread';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { GlobalDataService } from '../../services/globaldata.service';
import { PhotoLibrary, GetLibraryOptions } from '@ionic-native/photo-library';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { File } from '@ionic-native/file';
import { MenuRightComponent } from '../../components/menu-right/menu-right';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { VideoEditor } from '@ionic-native/video-editor';
import * as $ from 'jquery'

const baseUrl = "https://myadventureearth.com/api/omiseCall/upload.php";
const MAX_FILE_SIZE = 50 * 1024 * 1024;
const ALLOWED_MIME_TYPE = "video/mp4";
/**
 * Generated class for the CameraPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-camera',
  templateUrl: 'camera.html',
})
export class CameraPage {
  win: any = window;
  @ViewChild(Content) content: Content;
  @ViewChild(Slides) slides: Slides;
  numload: any = 1;
  imageChoos: any = [];
  data: any = {};
  hlighligh_Status:any =[];
  heightPhoto: any = 0;
  Latitude: any = "";
  Longitude: any = "";
  status: boolean = true; //prevent multi click
  imageShow: any = [];
  dataGet: any = "";
  stOpen: boolean = true;
  videoFileUpload: FileTransferObject;
  loading: any = "";
  imgDelete: any = [];
  PathOld: any = "";
  stOpenModal: boolean = true;
  newVideo: any = '';
  uriVideo: any = '';
  loadder: any;
  public items_img:string = '';
  public banner:string = '';
  public banner1:string = '';
  posthighlight:any = [];
  private myimage_banner:any = ['','https://www.myadventureearth.com/assets/img/travel.svg','https://www.myadventureearth.com/assets/img/good.svg'];

  hlighlighStatus: any ="";

  private myimage:any = ['','https://www.myadventureearth.com/assets/img/good.svg','https://www.myadventureearth.com/assets/img/travel.svg'];
  public mybanner:string = '';

  constructor(private videoEditor: VideoEditor, public loadingCtrl: LoadingController, private transfer: FileTransfer, private alertCtrl: AlertController, public popoverCtrl: PopoverController, public events: Events, public modalCtrl: ModalController, private file: File, private sanitizer: DomSanitizer, private photoLibrary: PhotoLibrary, private gd: GlobalDataService, private camera: Camera, private SFT: ServiceFactoryThread, private location: Location, public navCtrl: NavController, public navParams: NavParams, public actionSheetCtrl: ActionSheetController) {
    this.data['feeling_id'] = 1;
    this.data['feeling_tx_sort'] = 1;
    this.data['TypeLocation'] = 1;
    this.data['TypeLocation_srot'] = 1;
    this.data['user_id'] = this.gd.userProfile['user_id'];
    this.loadLocation();
    this.showiconbar();
    this.dataGet = navParams.get('data');
    console.log(`data from previous page`,this.dataGet);
    console.log(`old page`,this.gd.oldPage);
    this.PathOld = this.gd.oldPage;

    if (this.gd.posthighlight.length !== 0) {

      console.log("--------ค่าไม่ว่าง--------");
    } else {
      console.log("--------ค่าว่าง--------");
    }


    if (this.dataGet != '' && this.dataGet != undefined) {
      this.heightPhoto = navParams.get('data')['sizeFullheight'];
      this.imageShow = navParams.get('data')['pictureResize'];

      navParams.get('data')['pictureResize'].forEach((element, index) => {
        let dataPush
        if (element.type == 2) { //video
          dataPush = {
            type: '5',
            id: element.photo_id,
            videoPath: element.path_full
          }
        } else { //image
          dataPush = {
            type: '4',
            id: element.photo_id,
            path: element.path_full
          }
        }
        this.imageChoos.push(dataPush);
      });

      console.log(`imageChoos from previous page`,this.imageChoos,"_______-------_____-----");
      
      this.data['TypeLocation_srot'] = gd.TypeLocation.filter(word => word.TypeLocation_id == navParams.get('data')['TypeLocation_id'])[0].TypeLocation_srot;
      this.data['feeling_tx_sort'] = gd.feelingNew.filter(word => word.feeling_tx_id == navParams.get('data')['feeling_id'])[0].feeling_tx_sort;
      this.data['photo_location'] = navParams.get('data')['photo_location'];
      this.data['photo_caption'] = navParams.get('data')['hashtag'];
      this.data['photo_la'] = navParams.get('Latitude');
      this.data['photo_long'] = navParams.get('Longitude');
      this.data['caption'] = navParams.get('data')['capEdit'];
      this.data['TypeLocation'] = navParams.get('data')['TypeLocation_id'];
      this.data['feeling_id'] = navParams.get('data')['feeling_id'];
      this.Latitude = navParams.get('data')['photo_la'];
      this.Longitude = navParams.get('data')['photo_long'];
      this.data['photo_id'] = navParams.get('data')['photo_id'];
      console.log(this.data);
      // this.aroundmap.push(dataaround);
      //  this.select(0);
      setTimeout(() => {
        this.loadLocation();
      }, 500);
    }

  }
  presentPopover(myEvent) {
    $(".share").removeClass('share');
    $("body").addClass('rightMenu');

    let popover = this.popoverCtrl.create(MenuRightComponent, { navCtrl: this.navCtrl });
    popover.present({
      ev: myEvent
    });
  }
  goprofile() {
    this.gd.nextpage(this.navCtrl, 'ProfilePage', this.gd.userProfile);
  }
  gonoti() {
    this.gd.nextpage(this.navCtrl, 'NotificationsPage', {});
  }
  saerchPage() {
    let modalbirthday = this.modalCtrl.create('SearchNewfeedPage', { typeSearch: "Recent" });
    modalbirthday.onDidDismiss(data => {
      console.log(data);
      this.gd.nextrootpage(this.navCtrl, "NewsfeedPage", { filter: data })
    });
    modalbirthday.present();
  }
  ionViewDidEnter() {
    this.PathOld = this.gd.oldPage;
    this.stOpenModal = true;
    if (!this.navParams.get('data')) {
      this.data = {};
      console.log('ionViewDidEnter');
      this.heightPhoto = 0;
      this.data['feeling_id'] = 1;
      this.data['feeling_tx_sort'] = 1;
      this.data['TypeLocation'] = 1;
      this.data['TypeLocation_srot'] = 1;
      this.data['user_id'] = this.gd.userProfile['user_id'];
      this.imageShow = [];
      this.imageChoos = [];
      this.Latitude = this.SFT.userlocation['lat'];
      this.Longitude = this.SFT.userlocation['long'];
      this.loadLocation();
      if (this.gd.chooserShare == 1) {
        this.takePicture();
      } else {
        this.imageModal();
      }
    }

  }
  loadLocation() {
    
    console.log('loadLocation');
    console.log(this.Latitude, this.Longitude);
    if (!this.navParams.get('data')) {
      if (this.Latitude != "" && this.Longitude != "") {
        console.log('if');

        let data = {
          'latitude': this.Latitude,
          'longitude': this.Longitude
        }
        this.SFT.ServiceThread('aroundmap', data, 'POST')
          .then(data => {
            if (data['res_code'] == '00') {
              var i = 0;
              this.data['photo_la'] = data['res_result'][0]['place_location']['lat'];
              this.data['photo_long'] = data['res_result'][0]['place_location']['lng'];
              this.data['photo_location'] = data['res_result'][0]['place_name'];
            }
          });
      } else {
        console.log('else');

        let data = {
          'latitude': this.SFT.userlocation['lat'],
          'longitude': this.SFT.userlocation['long']
        }
        this.SFT.ServiceThread('aroundmap', data, 'POST')
          .then(data => {
            if (data['res_code'] == '00') {
              console.log(data);
              console.log(data['res_result'][0]);
              this.data['photo_la'] = data['res_result'][0]['place_location']['lat'];
              this.data['photo_long'] = data['res_result'][0]['place_location']['lng'];
              this.data['photo_location'] = data['res_result'][0]['place_name'];
            }
          });
      }
    }
  }


  ionViewDidLoad() {
    this.data.hlighlighStatus = this.gd.hlighligh_Status;
    if(this.data.hlighligh_Status == undefined){
    this.data.hlighligh_Status = "1";
    }
    console.log("camera hlighligh",this.data.hlighlighStatus,">>>>>>>>>>")
    console.log('ionViewDidLoad CameraPage');
     this.banner = this.myimage[1];
     this.banner1 = this.myimage[2];
   
    
    console.log(this.gd.chooserShare);
    console.log(!this.navParams.get('data'));
    let t = this;
    $("#contentTag").focus(() => {
      console.log('contentTag');
      console.log(t.content);
      t.content.scrollToBottom();
    })
    if (!this.navParams.get('data') && this.stOpen) {
      if (this.gd.chooserShare == 1) {
        this.takePicture();
      } else {
        console.log('testOpen');
        this.imageModal();
      }
    }

  }
  showiconbar(){
    
    
    
  }
  addMore() {
    // this.gd.openChooserApp().then(data => {
    //   if (data == 1) {
    //     this.takePicture();
    //   } else if (data == 2) {
    //     this.imageModal();
    //     this.stOpenModal = false;
    //   } else if (data == 3) {
    //     this.takeVideo();
    //   }
    // })

    this.imageModal();
    this.stOpenModal = false;

    // this.takeVideo();
  }
  onKey(event) {
    // $('#textCaption').val().replace('\n','<br />');

    //  console.log( JSON.stringify($('#textCaption').val().replace(/\n/g,'<br />')));
    // console.log(JSON.stringify(this.data.caption.replace(/\n/g,'<br />')))
  }
  imageModal() {
    if (this.stOpen) {
      this.stOpen = false;
      let modal = this.modalCtrl.create('ModelImagePage', { data: this.imageChoos });
      modal.dismiss();
      modal.present();
      modal.onDidDismiss(res => {
        console.log('get photo from ModelImagePage ',res);
        this.stOpen = true;
        if (res) {
          if (res != 'close') {
            console.log('test');
            this.imageShow = [];
            this.imageChoos = res;
            let t = this;
            this.imageChoos.forEach((element, index) => {
              console.log(t.imageChoos);
              if (t.heightPhoto == 0) {
                t.heightPhoto = ($('ng-component').width() * element.original.height) / element.original.width;
              }
              if (t.imageChoos[0].type == 2) {
                if (element.latitude != 0 && element.longitude != 0) {
                  t.Latitude = t.imageChoos[0].original.latitude;
                  t.Longitude = t.imageChoos[0].original.longitude;
                  setTimeout(() => {
                    console.log('loadlocation');
                    t.loadLocation();
                  }, 100);
                }
              }
              // t.imageShow.push(element["path"]);
            });
          } else {
            if (this.stOpenModal) {
              this.back();
            }
          }
        }

      });
    }

  }

  takePicture() {
    console.log('log');

    let t = this;
    var key = Date.now() + this.SFT.user_api_key;
    this.camera.getPicture({
      quality: 50,
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: true,
      allowEdit: true,
      mediaType: this.camera.MediaType.PICTURE,
    }).then((imageData) => {
      var image = document.createElement('img');
      image.addEventListener('load', function () {
        // t.imageShow.push("data:image/jpeg;base64," + imageData);
        if (t.heightPhoto == 0) {
          t.heightPhoto = ($('ng-component').width() * image.width) / image.width;
        }
        // console.log(t.imageShow, $('ng-component').width(), t.heightPhoto, image.width, image.height);
        let dataPush = {
          type: '1',
          id: t.imageChoos.length,
          path: "data:image/jpeg;base64," + imageData
        }
        t.imageChoos.push(dataPush)
      });
      image.src = "data:image/jpeg;base64," + imageData;
    }, (err) => {
      // this.presentActionSheet();
    });
  }


  // libraryImage() {
  //   let option: GetLibraryOptions = {
  //     quality: 10,
  //     thumbnailHeight: 150,
  //     thumbnailWidth: 150
  //   }
  //   let t = this;
  //   this.photoLibrary.requestAuthorization({ write: true, read: true }).then(() => {
  //     this.photoLibrary.getLibrary(option).subscribe({
  //       next: library => {
  //         t.allImage = library;
  //         this.getShowImage();
  //       },
  //       error: err => { console.log('could not get photos'); },
  //       complete: () => { console.log('done getting photos'); }
  //     });
  //   })


  // }
  // getShowImage() {
  //   if (this.imgPath.length < this.allImage.length) {
  //     let indexs = this.imgPath.length;
  //     for (let index = indexs; index < this.numload * 30; index++) {
  //       if (this.imgPath.length > index) {
  //         this.photoLibrary.getThumbnail(this.allImage[index], {}).then(datas => {
  //           var objectURL = URL.createObjectURL(datas);
  //           this.allImage[index].statusChooser = 0;
  //           this.allImage[index].id = index;
  //           this.allImage[index].number = 0;
  //           this.allImage[index].path = this.sanitizer.bypassSecurityTrustUrl(objectURL);
  //           this.imgPath.push(this.allImage[index]);
  //         })
  //       }
  //       if (index >= (this.numload * 30)) {
  //         this.numload++;
  //       }
  //     }
  //   }
  // }

  // chooserImage(data) {
  //   if (data.statusChooser == 0) {
  //     if (this.imageChoos.length < 10) {
  //       this.imageChoos.push(data);
  //       data.statusChooser = 1;
  //       data.number = this.imageChoos.length;
  //     } else {
  //       this.gd.toast('limit 10 picture')
  //     }

  //   } else {
  //     data.statusChooser = 0;
  //     data.number = 0;
  //     this.imageChoos.splice(this.imageChoos.map((el) => el.id).indexOf(data.id), 1);
  //     this.imgPath.filter(datas => {
  //       if (datas.statusChooser == 1) {
  //         datas.number = this.imageChoos.map((el) => el.id).indexOf(datas.id) + 1;
  //       }
  //     });
  //   }
  // }
  posts() {
    // console.log();
    $("#textCaption").val(this.data.photo_caption);
    console.log($("#contentTag").html());

  }
  post() {
    this.data.caption = $("#contentTag").html(); //ถ้าไม่กรอกอะไรจะมีค่า "<br>" ควรใช้ .text() แทน .html() 
    this.data['key'] = this.navParams.get('key');
    
    console.log('html() caption of post',this.data.caption);
    console.log('val() caption of post',$("#contentTag").val());
    console.log('text() caption of post',$("#contentTag").text()); 
    if (this.data['caption'] != undefined && this.data['photo_location'] != undefined && this.data['TypeLocation'] != undefined && this.data['feeling_id'] != undefined &&
      $.trim(this.data['caption']) != "" && $.trim(this.data['photo_location']) != "" && $.trim(this.data['feeling_id']) != "" && this.data.caption !== undefined && this.data.caption !== "" && $("#contentTag").text() != "") {
      if (this.status == true) {
        this.status = false;
        if (this.navParams.get('data')) { //ถ้ามี data เป็นการ edit
          // $('#feeling'+this.data['feeling_id']+' div')[0]['parentElement']['innerText'];
          // TypeLocation_name
          if (this.imageChoos != undefined && this.imageChoos.length > 0) {
            let dataImage = [];
            this.imageChoos.forEach((element, index) => {
              //upload only picture, not video
              if (element.type != 3 && element.type != 4 && element.type != 5) {
                let datapush = {
                  number: index,
                  path: element.path
                }
                dataImage.push(datapush);
              }
            });
            this.data.imgUpload = JSON.stringify(dataImage);
            this.data.imgDelete = JSON.stringify(this.imgDelete);
            // this.data.caption = JSON.stringify(this.data.caption.replace(/\n/g,'<br />'));
            this.data.caption = $("#contentTag").html();
            this.SFT.ServiceThread('UpdatePOSTIMG', this.data, 'POST')
              .then(datas => {
                let video = [];
                if (datas['res_code'] == '00') {
                  if (this.imgDelete.length > 0) {
                    this.imgDelete.forEach(element => {
                      this.navParams.get('data')['pictureResize'].splice(this.navParams.get('data')['pictureResize'].map((el) => el.photo_id).indexOf(element["id"]), 1)
                    });
                  }
                  if (dataImage.length > 0) {
                    console.log(`%c dataImage.length >  0`,`color:blue`);
                    
                    let dataSend = {
                      'lastId': this.data.photo_id,
                      'original': '',
                      'folder_name': '',
                      'nameiamge': '',
                      'namefile': '',
                    }
                    this.SFT.ServiceThread('updatePhotoResize', dataSend, 'POST')
                    datas["res_result"].forEach(element => {
                      let dataImagePush = {
                        photo_id: element.photoId,
                        path_full: 'https://myadventureearth.com/' + element.photoPath,
                        path_resize: 'https://myadventureearth.com/' + element.photoPath,
                        number: '',
                        type: 1
                      }
                      this.navParams.get('data')['pictureResize'].push(dataImagePush);
                    });
  
                    console.log(`imageChoos ==== `,this.imageChoos);   
                  }else{
                    console.log(`%c dataImage.length <  0`,`color:brown`);
                  }
  
                  this.imageChoos.forEach((element, index) => {
                    if (element.type == 3) {
                      let datapush = {
                        path: element.videoPath,
                        number: index
                      };
                      video.push(datapush);
                      console.log(`-------------video push-----------`);
                      console.log(video);                      
                      console.log(`-------------video push-----------`);
                      
                    }
                  });
  
                  console.log(this.navParams.get('data'));
                  this.navParams.get('data')['photo_location'] = this.data['photo_location'];
                  this.navParams.get('data')['photo_locationText'] = this.data['photo_location'];
                  this.navParams.get('data')['Latitude'] = this.data['photo_la'];
                  this.navParams.get('data')['Longitude'] = this.data['photo_long'];
                  this.navParams.get('data')['photo_caption'] = datas["res_results"];
                  this.navParams.get('data')['hashtag'] = datas["res_results"];
                  this.navParams.get('data')['capEdit'] = this.data['caption'];
                  this.navParams.get('data')['TypeLocation_id'] = this.data['TypeLocation'];
                  this.navParams.get('data')['feeling_id'] = this.data['feeling_id'];
                  this.navParams.get('data')['photo_id'] = this.data['photo_id'];
                  this.navParams.get('data')['feeling_name'] = this.gd.feelingNew[this.data['feeling_tx_sort'] - 1].feeling_tx_name;
                  this.navParams.get('data')['TypeLocation_name'] = this.gd.TypeLocation[this.data['TypeLocation'] - 1].TypeLocation_name;
                  // this.navParams.get('data')['feeling_name'] = $('#feeling' + this.data['feeling_id'] + ' div')[0]['parentElement']['innerText'];
                  // this.navParams.get('data')['TypeLocation_name'] = $('#TypeLocation')[0]['innerText'];
                  this.gd.toast(' Update Success');
                  if (this.data.photo_share) {
                    this.gd.facebookShare(datas);
                  }
                  if (video.length > 0) {
                    let t = this;
                    let n = video.length;
                    this.SFT.loading_present('upload Video');
                    video.forEach(async (element, index) => {
                      await t.uploadVideo(this.data.photo_id, element).then((data:any) => {
                        n--;
                        if (n == 0) {
                          console.log(`***************************************************************`);                        
                          console.log(data);
                          console.log(data["res_code"]);                       
                          console.log(`***************************************************************`);
                                                  
                          if (data["res_code"] == "00") {
                            setTimeout(() => {
                              let dataImagePush = {
                                photo_id: '',
                                path_full: data["res_result"],
                                path_resize: data["res_result"],
                                number: '',
                                type: 2
                              }
                              this.navParams.get('data')['pictureResize'].push(dataImagePush);
                              
                            }, 1000);
                            console.log(` %c upload video successfully.`,`color:green`);
                            
                          } else {
                            this.gd.toast('upload video failed.');
                          }
                          try {
                            this.SFT.Check_Count('upload Video');
                            // this.navCtrl.pop();
                            this.navCtrl.popToRoot();
                          } catch (error) {
                          }
                        }
                      })
                    });
                  } else {
                    // this.navCtrl.pop();
                    this.navCtrl.popToRoot();
                  }
                } else {
                  // console.log(datas);
                }
              });
          } else {
            this.gd.toast("Please share your adventure");
            this.status = true;
          }
         
        } else { //การ new post 
          console.log(`%c New Post`,`color: green`);
          console.log(`%c imageChoos ${this.imageChoos}`,`color: green`,this.imageChoos);
          
          if (this.imageChoos.length > 0) {
            let video = [];
            let dataImage = [];
            this.imageChoos.forEach((element, index) => {
              if (element.type != 3) {
                let datapush = {
                  number: index,
                  path: element.path
                }
                dataImage.push(datapush);
              }
            });

            let datasend = JSON.parse(JSON.stringify(this.data));
            // if(this.gd.platformtype == 'ios'){
            //   datasend["img"] = JSON.stringify(datasend["img"]);
            // }else{
            console.log(dataImage);

            datasend["img"] = JSON.stringify(dataImage);
            console.log(datasend);

            this.SFT.ServiceThread('Postimg', datasend, 'POST')
              .then(data => {
                if (data['res_code'] == '00') {
                  let dataSend = {
                    'lastId': data["lastId"],
                    'original': data["pathOriginal"],
                    'folder_name': data["folder_name"],
                    'nameiamge': data["nameiamge"],
                    'namefile': data["namefile"],
                  }
                  this.SFT.ServiceThread('updatePhotoResize', dataSend, 'POST');
                  this.imageChoos.forEach((element, index) => {
                    if (element.type == 3) {
                      let datapush = {
                        path: element.videoPath,
                        number: index
                      };
                      video.push(datapush);
                    }
                  });

                  if (video.length > 0) { 
                    let t = this;
                    let n = video.length;
                    this.SFT.loading_present('upload Video');
                    video.forEach(async (element, index) => {
                      await t.uploadVideo(data["lastId"], element).then(data => { //upload video
                        console.log(element); 
                        console.log('data');
                        console.log(n);
                        n--;
                        if (n == 0) {
                          setTimeout(() => {
                            this.events.publish('Newpost', true);
                          }, 1000);
                          if (this.data.photo_share) {
                            this.gd.facebookShare(data);
                          }
                          this.navCtrl.parent.select(0);
                          try {
                            this.SFT.Check_Count('upload Video');
                            console.log('test');
                          } catch (error) {
                          }
                        }
                      })
                    });
                  } else {
                    setTimeout(() => {
                      this.events.publish('Newpost', true);
                    }, 1000);
                    if (this.data.photo_share) {
                      this.gd.facebookShare(data);
                    }
                    this.navCtrl.parent.select(0);
                  }
                
                } else {
                  this.navCtrl.popToRoot();
                  this.navCtrl.parent.select(0);
                  this.events.publish('Newpost', false);
                }

              });

          } else {
        console.log(`%c New Post no image or video ${this.imageChoos.length}`,`color: orange`); 
            this.gd.toast("Please share your adventure");
          }
          setTimeout(() => {
            this.status = true;
          }, 5000);
        }
      }

    } else {
      if (this.data['caption'] == undefined || $.trim(this.data['caption']) == "" || this.data.caption == undefined || this.data.caption == "" || $("#contentTag").text() == "") {
        console.log(`%c New Post caption ${this.data['caption']}`,`color: orange`); 
        this.gd.toast("Please share your adventure");
        // this.gd.toast("Please enter Caption");
      } else if (this.data['photo_location'] == undefined || $.trim(this.data['photo_location']) == "") {
        console.log(`%c New Post photo_location ${this.data['photo_location']}`,`color: orange`);         
        this.gd.toast("Please share your adventure");
        // this.gd.toast("Please enter Location");
      } else if (this.data['feeling_id'] == undefined || $.trim(this.data['feeling_id']) == "") {
        console.log(`%c New Post feeling_id ${this.data['feeling_id']}`,`color: orange`);         
        this.gd.toast("Please share your adventure");
        // this.gd.toast("Please enter Feelling");
      }else{
        this.gd.toast("Please share your adventure");
      }
    }
  }
  post_modal() {
    console.log('test');

    console.log(this.data);
    let modal = this.modalCtrl.create('PostphotoModalPage', { 'data': this.data });
    modal.present();
    modal.onDidDismiss(data => {
    })
  }
  removeImage(banners) {
    console.log(this.imageChoos[banners]);

    // setTimeout(() => {
    // this.slides.lockSwipeToPrev(true);
    this.slides.slidePrev()
    setTimeout(() => {
      // this.imageShow.splice(banners, 1);
      if (this.imageChoos[banners].type == 4 || this.imageChoos[banners].type == 5) {
        this.imgDelete.push(this.imageChoos[banners]);
        console.log(this.imgDelete);
      }
      // this.slides.removeSlide(1)
      this.imageChoos.splice(banners, 1);
      this.slides.slideTo(banners - 1);
      console.log(this.imageChoos);
      this.imageChoos.forEach((element, index) => {
        if (element.type == 2) {
          element.number = index + 1;
        }
      });


    }, 500);
  }
  back() {

    console.log(this.PathOld);

    if (this.dataGet) {
      this.navCtrl.pop();
    } else {
      console.log(this.PathOld.split('/'));

      if (this.PathOld.split('/')[2] == "home") {
        this.navCtrl.parent.select(0);
      } else {
        this.navCtrl.parent.select(2);
      }
    }
  }
  presentAlert(title, message) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }
  // takeVideo() {
  //   const options: CameraOptions = {
  //     quality: 50,
  //     mediaType: this.camera.MediaType.VIDEO,
  //     sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
  //   }
  //   let t = this;
  //   this.camera.getPicture(options).then((imageData) => {
  //     console.log(imageData);
  //     let dataPush = {
  //       type: '3',
  //       id: t.imageShow.length,
  //       path: this.sanitizer.bypassSecurityTrustResourceUrl(this.win.Ionic.WebView.convertFileSrc("file://"+imageData+"#t=0.1")),
  //       videoPath: imageData
  //     }
  //     t.imageChoos.push(dataPush)
  //     // const fileTransfer: FileTransferObject = this.transfer.create();
  //     // let options1: FileUploadOptions = {
  //     //   fileKey: 'upfile',
  //     //   fileName: imageData,
  //     //   headers: {
  //     //     'postID' : 123,
  //     //   }
  //     // }
  //     // console.log(imageData);

  //     // fileTransfer.upload("file://"+imageData, 'https://www.myadventureearth.com/api/omiseCall/upload.php', options1)
  //     //   .then((data) => {
  //     //     // success
  //     //     console.log(data);

  //     //     alert("success");
  //     //   }, (err) => {
  //     //     // error
  //     //     alert("error" + JSON.stringify(err));
  //     //   });
  //   });
  // }
  takeVideo() {
    let videoA = this.imageChoos.filter(word => word.type == 3 || word.type == 5);
    console.log(videoA);
    if (videoA.length > 0) return this.presentAlert("Error", "Can choose 1 video.");
    let t = this;
    const options: CameraOptions = {
      mediaType: this.camera.MediaType.VIDEO,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      correctOrientation: true,
      targetWidth: 150,
      targetHeight: 150,
      quality: 1
    }

    this.camera.getPicture(options).then(async (videoUrl) => {
      if (videoUrl) {

        console.log(videoUrl);
        var filename = videoUrl.substr(videoUrl.lastIndexOf('/') + 1);
        var dirpath = videoUrl.substr(0, videoUrl.lastIndexOf('/') + 1);
        console.log(dirpath);
        dirpath = dirpath.includes("file://") ? dirpath : "file://" + dirpath;
        console.log("688 =>> ", dirpath);
        try {
          var dirUrl = await this.file.resolveDirectoryUrl(dirpath);
          console.log("691 =>> ", dirUrl);
          console.log("692 =>> ", filename);
          var retrievedFile = await this.file.getFile(dirUrl, filename, {});
          console.log("694 =>> ", retrievedFile);

        } catch (err) {
          console.log('error', err);
          // this.dismissLoader();
          return this.presentAlert("Error", "Something went wrong.");
        }
        retrievedFile.file(data => {
          let urlFile = retrievedFile.nativeURL
          if (this.gd.platformtype == 'ios') {
            urlFile = videoUrl
          } else {
            urlFile = retrievedFile.nativeURL
          }
          t.uriVideo = t.sanitizer.bypassSecurityTrustResourceUrl(this.win.Ionic.WebView.convertFileSrc(urlFile));
          setTimeout(() => {
            let video = <HTMLVideoElement>document.getElementById('videoDuration');
            console.log(video);
            console.log(video.duration);
            // if (data.size > MAX_FILE_SIZE) return this.presentAlert("Error", "You cannot upload more than 250mb.");
            if (video.duration > 15) return this.presentAlert("Error", "The selected video must not exceed 15 seconds.");
            // if (data.type !== ALLOWED_MIME_TYPE) return this.presentAlert("Error", "Incorrect file type.");
            console.log("713 =>> ", video.duration);
            console.log("714 =>> ", data);
            t.SFT.loading_present('video');
            this.videoEditor.transcodeVideo({
              fileUri: urlFile,
              outputFileName: '' + Date.now(),
              saveToLibrary: false,
              width: 640,
              height: 640,
              progress: (info: number) => {
                console.log('progress' + info)
              }
            }).then((fileUri: string) => {
              console.log('video transcode success', fileUri)
              this.newVideo = fileUri;
              let dataPush = {
                type: '3',
                id: t.imageShow.length,
                path: t.sanitizer.bypassSecurityTrustResourceUrl(this.win.Ionic.WebView.convertFileSrc(urlFile + "#t=0.1")),
                videoPath: fileUri
              }
              t.imageChoos.push(dataPush)
              t.SFT.Check_Count('video');
              console.log('imageChoos', t.imageChoos)
            })
              .catch((error: any) => {
                t.SFT.Check_Count('video');
                console.log('video transcode error', error)
              });
          }, 1000);

        });
      }
    }, (err) => {
      console.log(err);
    });
  }

  uploadVideo(postID, video) {
    return new Promise((resolve, reject) => {
      let count = 0;
      let selectedVideo = video.path;
      const fileTransfer: FileTransferObject = this.transfer.create();
      let options1: FileUploadOptions = {
        fileKey: 'upfile',
        fileName: 'name.jpg',
        headers: {
          'postID': postID,
          'number': video.number
        }
      }
      // fileTransfer.upload(selectedVideo, 'https://myadventureearth.com/api/v8/upload.php', options1)
      fileTransfer.upload(selectedVideo, 'https://myadventureearth.com/api/omiseCall/upload.php', options1)
        .then((data) => {
          console.log(`-----------upload video-----------`);          
          console.log(data);
          console.log(`-----------upload video-----------`); 
          resolve(JSON.parse(data.response));
        }, (err) => {
          alert("error" + JSON.stringify(err));
          resolve("error" + JSON.stringify(err));
        });
    });
  }
}