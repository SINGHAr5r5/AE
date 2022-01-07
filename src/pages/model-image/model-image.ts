import { VideoEditor } from '@ionic-native/video-editor';
import { Component, SecurityContext } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
  LoadingController,
  Platform,
  normalizeURL,
  AlertController,
} from "ionic-angular";
import { PhotoLibrary, GetLibraryOptions } from "@ionic-native/photo-library";
import { DomSanitizer } from "@angular/platform-browser";
import { GlobalDataService } from "../../services/globaldata.service";
import { CompileTemplateMetadata } from "@angular/compiler";
import { CDVPhotoLibraryPipe } from '../../pipes/cdv-photo-library/cdv-photo-library';

declare var EXIF: any;
/**
 * Generated class for the ModelImagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-model-image",
  templateUrl: "model-image.html",
})
export class ModelImagePage {
  allImage: any = [];
  image: any = [];
  numload: any = 2; // 2 เพราะครั้งแรกทำตอนโหลดไปแล้ว
  imageChoos: any = this.navParams.get("data");
  loading: any = "";
  datashow: boolean = false;

  // show/hide loading
  isShow: boolean = true;

  //show image
  isShowImg: boolean = false;

  photoLib: any;
  win: any = window;


  constructor(
    public loadingCtrl: LoadingController,
    public viewCtrl: ViewController,
    private gd: GlobalDataService,
    private sanitizer: DomSanitizer,
    private photoLibrary: PhotoLibrary,
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    private videoEditor: VideoEditor,
    private alertCtrl: AlertController
  ) {
    console.log(EXIF);
  }
  ionViewDidLoad() {
    console.log("ionViewDidLoad ModelImagePage");
    this.libraryImage();
  }

  presentAlert(title, message) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }


  libraryImage() {
    let j = 0;
    let option: GetLibraryOptions = {
      quality: 0.5,
      itemsInChunk: 100, // Loading large library takes time, so output can be chunked so that result callback will be called on
      chunkTimeSec: 0, // each X items, or after Y secons passes. You can start displaying photos immediately.
      useOriginalFileNames: false, // default, true will be much slower on iOS
      includeVideos: false
      // maxItems: 300
    };
    let t = this;
    t.loading = this.loadingCtrl.create({
      spinner: "hide",
      content: `
        <div class='textCenter'>Please Wait.</div>
        <div class='textCenter'>Image processing ...</div>
          `,
    });
    t.loading.present();
    this.photoLibrary
      .requestAuthorization({ write: true, read: true })
      .then(() => {
        this.photoLib = this.photoLibrary.getLibrary(option).subscribe({
          next: async (chunk: any) => {
            // console.log(`%c chunk[0]`, `color: green`,chunk[0]);
            // if ( chunk.map((el) => el.id).indexOf('201ACD30-06B6-4606-BA66-7FD8E2911C16/L0/001')) {
            //   console.log(`%c chunk ${j}`, `color: green`,chunk);
            //   console.log(`allImage ${j}`,t.allImage);
            //   j++;
            // }
            console.log(`chunk`, chunk);



            for (let index = 0; index < chunk.length; index++) {

              if (this.platform.is('ios')) {
                if (chunk[index].filePath != undefined) {
                  console.log(`push ${index} fileName`, chunk[index].fileName);
                  t.allImage.push(chunk[index]);
                }
              }else{
                  t.allImage.push(chunk[index]);
              }


              console.log(`this.allImage.length = ${this.allImage.length}`);

              if (this.allImage.length >= 30) {
                j += 30;
                if (j <= 30) { //ทำเฉพาะรอบแรก
                  await t.sortarray().then(async (data) => {
                    console.log(`%c -*-*-*- getShowImage() -*-*-*-`, `color:red`);
                    await t.getShowImage(j).then(() => {
                      console.log(`%c t.loading.dismiss`, `color: orange`);
                      t.loading.dismiss().then(() => {
                        t.isShowImg = true;
                      });
                      console.log("done getting photos");
                    })
                  });
                }
              }

            }

            // t.allImage = t.allImage.concat(chunk);


          },
          error: (err) => {
            console.log("could not get photosss");
          },
          complete: async () => {
            console.log("result");
            //กรณีรูปภาพไม่ถึง 30 รูป
            console.log(`j= ${j}`);
            if (t.allImage.length < 30) { //ทำเฉพาะรอบแรก
              await t.sortarray().then(async (data) => {
                console.log(`%c -*-*-*- getShowImage() -*-*-*-`, `color:red`);
                await t.getShowImage(t.allImage.length).then(() => {
                  console.log(`%c t.loading.dismiss`, `color: orange`);
                  t.loading.dismiss().then(() => {
                    t.isShowImg = true;
                  });
                  console.log("done getting photos");
                })
              });
            }
          },
        });

      })
      .catch((e) => {
        console.log("error requestAuthorization", e);
      });
  }

  sortarray() {
    let t = this;
    return new Promise((resolve, reject) => {
      let index = 1;
      this.allImage.sort(function (a, b) {
        index++;
        // console.log(index,a.id , t.allImage.length);
        if (index == t.allImage.length) {
          // console.log('ifGooo');
          resolve("test");
        }
        return b.creationDate - a.creationDate;
      });
      setTimeout(() => {
      }, 3000);
    });
  }

  getShowImage(indexImage) {
    return new Promise(async (resolve, reject) => {
      let t = this;
      if (indexImage <= this.allImage.length) {
        // let indexs = this.imgPath.length;
        // let numload = this.numload * 30;
        let constantValue  = (indexImage < 30)? indexImage : 30; //กรณีมีรูปภาพไม่ถึง 30 รูป constantValue = จำนวนรูปที่มี, กรณีมีมากกว่า 30 รูป constantValue =  30
        for (let index = indexImage - constantValue; index < indexImage; index++) { //ทำต่อจาก indexImage ที่ได้มา
          let dataPush = {};
          let type
          if (this.platform.is('ios')) {
           type = t.allImage[index].mimeType.split("/")[0] == "image" ? 2 : 3; //2 = image, 3 = video
          } else {
            type = 2 //image only
          }

          await this.photoLibrary.getThumbnail(t.allImage[index], {
            thumbnailWidth: (type == 2) ? 200 : t.allImage[index].width,
            thumbnailHeight: (type == 2) ? 200 : t.allImage[index].height,
            quality: 0.5,
          }).then(async (imgBLOB) => {
            let imgURL = URL.createObjectURL(imgBLOB);
            dataPush["original"] = t.allImage[index];
            dataPush["statusChooser"] = 0;
            dataPush["id"] = t.allImage[index].id;
            dataPush["number"] = 0;
            dataPush["thumbnail"] = t.sanitizer.bypassSecurityTrustResourceUrl(imgURL);
            dataPush["videoPath"] = (type == 3) ? t.allImage[index].filePath : "";
            dataPush["type"] = type;

            if (t.imageChoos.length > 0) {
              if (t.imageChoos.map((el) => el.id).indexOf(dataPush["id"]) != "-1") {
                // let checkType = t.imageChoos[t.imageChoos.map((el) => el.id).indexOf(dataPush["id"])].type;
                dataPush["statusChooser"] = 1;
                dataPush["number"] = await t.imageChoos[t.imageChoos.map((el) => el.id).indexOf(dataPush["id"])].number;
                dataPush["path"] = await t.imageChoos[t.imageChoos.map((el) => el.id).indexOf(dataPush["id"])].path;
              }
            }

            this.image.push(dataPush);

            console.log('getShowImage() index', index);
            console.log(`getShowImage() this.image`, this.image);

          })
            .catch((e) => {
              console.log("error getThumbnail", e);
            });
        }

        resolve(true);

      } else {
        this.isShow = false;
        resolve(false);
      }
    });
  }

  chooserImage(img) {

    console.log(`img Choose before`, img);

    if (img.statusChooser == 0) { //รูปยังไม่ถูกเลือก
      if (this.imageChoos.length < 10) {
        img.statusChooser = 1,
          img.number = this.imageChoos.length + 1,
          img.path = "",
          this.imageChoos.push(img);
      } else {
        this.gd.toast("limit 10 item");
      }

    } else { //รูปถูกเลือกแล้ว (เมื่อเลือกอีกครั้งจะเป็นไม่เลือก)
      img.statusChooser = 0;
      img.number = 0;
      this.imageChoos.splice(this.imageChoos.map((el) => el.id).indexOf(img.id), 1);

      //filter เอาเฉพาะ img ที่เลือก statusChooser = 1 เลือก / 2 = ไม่ได้เลือก
      this.image.filter((datas) => {
        if (datas.statusChooser == 1) {
          datas.number =
            this.imageChoos.map((el) => el.id).indexOf(datas.id) + 1;
        }
      });
    }

    console.log(`img Choose after`, img);

  }

  cloce() {
    let t = this;
    if (this.imageChoos.length > 0) {
      this.loading = this.loadingCtrl.create({
        spinner: 'crescent',
        cssClass: 'loading-video',
        content: `
        <div class=''>Please Wait,</div>
        <div class=''>Image processing.</div>
          `,
      });
      this.loading.present();
      let n = this.imageChoos.length;
      console.log("1111");

      setTimeout(() => {
        console.log('this.imageChoos before addOriginal', this.imageChoos);
        this.imageChoos.forEach(async (element, index) => {
          if (element["type"] != 1) {
            if (element["path"] == "") {
              await t.AddOriginal(element).then((data) => {
                n--;
                if (n == 0) {
                  this.viewCtrl.dismiss(this.imageChoos);
                  this.photoLib.unsubscribe();
                  try {
                    t.loading.dismiss();
                  } catch (error) { }
                }
              });
            } else {
              n--;
              if (n == 0) {
                this.viewCtrl.dismiss(this.imageChoos);
                this.photoLib.unsubscribe();
                try {
                  t.loading.dismiss();
                } catch (error) { }
              }
            }
          } else {
            n--;
            if (n == 0) {
              this.viewCtrl.dismiss(this.imageChoos);
              this.photoLib.unsubscribe();
              try {
                t.loading.dismiss();
              } catch (error) { }
            }
          }
        });
      }, 200);
    } else {
      this.viewCtrl.dismiss(this.imageChoos);
      this.photoLib.unsubscribe();
      try {
        t.loading.dismiss();
      } catch (error) { }
    }
  }

  AddOriginal(element) {
    let t = this;
    return new Promise((resolve, reject) => {
      let text = element.type == 3 ? "Video" : "Image";
      if (element.type == 3) { //video
        let trustUrl = new CDVPhotoLibraryPipe(this.sanitizer);
        setTimeout(() => {
          // let video = <HTMLVideoElement>document.getElementById('videoDuration');
          // console.log(video);
          // console.log(video.duration);
          // if (data.size > MAX_FILE_SIZE) return this.presentAlert("Error", "You cannot upload more than 250mb.");
          // if (video.duration > 15) return this.presentAlert("Error", "The selected video must not exceed 15 seconds.");
          // if (data.type !== ALLOWED_MIME_TYPE) return this.presentAlert("Error", "Incorrect file type.");
          // console.log("713 =>> ", video.duration);
          // t.SFT.loading_present('video');

          this.videoEditor.getVideoInfo({
            fileUri: this.sanitizer.sanitize(SecurityContext.RESOURCE_URL, this.sanitizer.bypassSecurityTrustResourceUrl(element.videoPath))
          }).then((videoInfo) => {
            if (videoInfo.duration > 15) {
              console.log('videoInfo', videoInfo);
              this.presentAlert("Error", "The selected video must not exceed 15 seconds.");
              this.loading.dismiss();
              // element.statusChooser = 0;
              // this.imageChoos.splice(this.imageChoos.map((el) => el.id).indexOf(element.id), 1);
            } else {
              let checkFirst: boolean = true; //ทำครั้งเดียว
              console.log(`transcode video`, this.sanitizer.sanitize(SecurityContext.RESOURCE_URL, this.sanitizer.bypassSecurityTrustResourceUrl(element.videoPath)));
              this.videoEditor.transcodeVideo({
                fileUri: this.sanitizer.sanitize(SecurityContext.RESOURCE_URL, this.sanitizer.bypassSecurityTrustResourceUrl(element.videoPath)),
                outputFileName: '' + Date.now(),
                outputFileType: this.videoEditor.OutputFileType.MPEG4,
                saveToLibrary: false,
                optimizeForNetworkUse: 1,
                width: 640,
                height: 640,
                progress: (info: number) => {
                  console.log('progress  ' + info)

                  // try {
                  //   console.log('progress  ' + info)
                  //   let sec = 0;
                  //   if (checkFirst) {
                  //     let time = setInterval(()=>{
                  //       checkFirst = false;
                  //       sec = sec + 1;
                  //       console.log(`sec : ${sec}`);
                  //       if (sec >= 30) {
                  //         clearInterval(time);
                  //         sec = 0;
                  //         throw 'cancel';
                  //       }
                  //     },1000);
                  //   }
                  // } catch (error) {
                  //   if (error == 'cancel') {
                  //     this.loading.dismiss();
                  //     this.presentAlert("Error", "Video can not transcode");
                  //   }else{
                  //     console.log('throw',error);

                  //   }
                  // }

                }
              }).then((fileUri: string) => {
                console.log('video transcode success', fileUri)
                if (fileUri != undefined && fileUri != null) {
                  // this.newVideo = fileUri;
                  element.type = 3
                  element.path = trustUrl.transform(element.videoPath)
                  element.videoPath = fileUri
                  resolve(element);
                }

              }).catch((error: any) => {
                if (error == 'cancel') {
                  this.loading.dismiss();
                  this.presentAlert("Error", "Video can not transcode");
                } else {
                  console.log('video transcode error', error)
                  this.presentAlert("Error", error);
                  this.loading.dismiss();
                }
              });
            }
          }).catch((err) => {
            console.log('getVideoInfo error', err);
            this.presentAlert("Error", err);
            this.loading.dismiss();
          });

        }, 1000);

      } else { //image
        this.photoLibrary
          .getPhoto(element.id, {})
          .then((datas) => {
            console.log("img blob", datas);
            var canvas = <HTMLCanvasElement>document.getElementById("canvas");
            var ctx = canvas.getContext("2d");
            var cw = canvas.width;
            var ch = canvas.height;
            var img = document.createElement("img");
            console.log("out EXIF.getData");
            EXIF.getData(datas, function () {
              var orientation = EXIF.getTag(this, "Orientation");
              console.log(orientation);
              console.log("in EXIF.getData", orientation);

              img.onload = function () {
                var iw = img.width;
                var ih = img.height;
                let widthResize = (img.height * img.width) / 1024 / 1350;
                let scale = Math.sqrt(widthResize);
                let iwScaled, ihScaled;
                if (widthResize > 1) {
                  iwScaled = iw / scale;
                  ihScaled = ih / scale;
                } else {
                  iwScaled = iw;
                  ihScaled = ih;
                }
                // var maxW = iw / 2;
                // var maxH = ih / 2;
                // var scale = Math.min((maxW / iw), (maxH / ih));
                // var iwScaled = iw * scale;
                // var ihScaled = ih * scale;
                canvas.width = iwScaled;
                canvas.height = ihScaled;
                console.log(iw, ih, iwScaled, ihScaled, scale);
                switch (orientation) {
                  case 3:
                    // // canvas.width = ihScaled;
                    // // canvas.height = iwScaled;
                    // ctx.clearRect(0, 0, canvas.width, canvas.height);
                    // ctx.save();
                    // ctx.translate(canvas.width / 2, canvas.height / 2);
                    // ctx.rotate((180 * Math.PI) / 180);
                    // ctx.drawImage(
                    //   img,
                    //   -iwScaled / 2,
                    //   -ihScaled / 2,
                    //   iwScaled,
                    //   ihScaled
                    // );
                    // ctx.restore();
                    ctx.drawImage(img, 0, 0, iwScaled, ihScaled);
                    break;
                  case 6:
                    // canvas.width = ihScaled;
                    // canvas.height = iwScaled;
                    // ctx.clearRect(0, 0, canvas.width, canvas.height);
                    // ctx.save();
                    // ctx.translate(canvas.width / 2, canvas.height / 2);
                    // ctx.rotate((90 * Math.PI) / 180);
                    // ctx.drawImage(
                    //   img,
                    //   -iwScaled / 2,
                    //   -ihScaled / 2,
                    //   iwScaled,
                    //   ihScaled
                    // );
                    // ctx.restore();
                    ctx.drawImage(img, 0, 0, iwScaled, ihScaled);
                    break;

                  default:
                    ctx.drawImage(img, 0, 0, iwScaled, ihScaled);
                    break;
                }
                element["path"] = canvas.toDataURL("image/jpeg", 0.7); //base64
                element["blobOriginal"] = datas; //BLOB
                element["originalPath"] = t.sanitizer.bypassSecurityTrustUrl(
                  URL.createObjectURL(datas)
                ); //Path

                console.log("---------- after ---------- ");
                console.log("element", element);
                console.log("element id", element.id);
                console.log("element path", element.path);
                console.log("element blobOriginal", element.blobOriginal);
                console.log("element originalPath", element.originalPath);
                console.log("---------- after ---------- ");
                resolve(element);
              };

              img.src = URL.createObjectURL(datas);
              console.log("img", img);
            });

            // var objectURL = new Blob([URL.createObjectURL(datas)]);
            // console.log(objectURL);

            // var reader = new FileReader();
            // reader.readAsDataURL(objectURL);
            // reader.onloadend = function () {
            //   var base64data = reader.result;
            //   console.log(base64data);
            // }
          })
          .catch((e) => {
            console.log("error can not addOriginal", e);
          });
      }

    });
  }

  cloces() {
    this.viewCtrl.dismiss("close");
    this.photoLib.unsubscribe();
  }

  async doInfinite(infiniteScroll) {
    console.log("Begin async operation");
    console.log(`this num load`, this.numload);
    console.log(`this all images length`, this.allImage.length);
    console.log(`this all images `, this.allImage);
    console.log(`this images length`, this.image.length);
    console.log(`this images `, this.image);


    let indexEnd = this.numload * 30; //ทำตั้งแต่ เช่น 2*30 = 60 จะทำตัวที่ 60-30 ใน function getShowImage()
    await this.sortarray().then(async (data) => {
      console.log(`%c -*-*-*- getShowImage() -*-*-*-`, `color:red`);
      await this.getShowImage(indexEnd).then((status) => {
        console.log(`%c doInfinite`, `color: orange`);
        this.numload++;
        console.log("doInfinite done getting photos");
        infiniteScroll.complete();
      })
    });
  }

  playVideo(video) {
    console.log('video pause ?', video.paused);
    console.log('video', video);
  }
}
