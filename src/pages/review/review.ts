import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ViewController } from 'ionic-angular';
import { GlobalDataService } from '../../services/globaldata.service';
import { ServiceFactoryThread } from '../../services/ServiceFactoryThread';
import { Base64 } from '@ionic-native/base64';
import { ImagePicker } from '@ionic-native/image-picker';
import * as firebase from 'Firebase';
import * as $ from 'jquery';

/**
 * Generated class for the ReviewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var EXIF: any;
declare var canvasResize: any;

@IonicPage()
@Component({
  selector: 'page-review',
  templateUrl: 'review.html',
})
export class ReviewPage {
  tetxReview: any = '';
  commentRate: any = 0;
  widthPhoto: any = [];
  heightPhoto: any = [];
  photoresize: any = [];
  imageArray: any = [];
  dataGet: any = this.navParams.get('data');

  constructor(public viewCtrl: ViewController, private imagePicker: ImagePicker, private base64: Base64, public navCtrl: NavController, public navParams: NavParams, private gd: GlobalDataService, public serviceFactoryThread: ServiceFactoryThread, public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReviewPage');
    console.log(this.dataGet);

  }

  sendRate(score) {
    console.log(score);

    if (this.commentRate == score) {
      this.commentRate = 0;
    } else {
      this.commentRate = score;
    }
  }
  addPhoto() {
    // if (this.gd.platformtype == 'ios') {
    $('#filGallerys').click();
    // } else {
    //   this.chooser_image();
    // }
  }
  changeListener($event): void {
    $('#actionCamera').slideUp(200);
    this.readThis($event.target);
  }

  readThis(inputValue: any): void {
    console.log(inputValue.files.length);
    if (inputValue.files.length <= 10) {
      var t = this;
      t.photoresize = [];
      t.widthPhoto = [];
      t.heightPhoto = [];
      var Latitude = "";
      var Longitude = "";
      var key;
      var countFile = inputValue.files;
      let loading = this.loadingCtrl.create({
        spinner: 'hide',
        content: `
          <div class='textCenter'>Please Wait.</div>
          <div class='textCenter'>Image processing ...</div>
            `
      });
      loading.present();
      Object.keys(countFile).forEach(element => {
        var resize = '';
        var myReader: FileReader = new FileReader();
        var file: File = inputValue.files[element];
        canvasResize(file, {
          width: '1000',
          height: 0,
          crop: false,
          quality: 40,
          rotate: 0,
          callback: function (data, width, height) {
            resize = data;
            myReader.onloadend = (e) => {
              t.widthPhoto.push(width);
              t.heightPhoto.push(height);
              t.photoresize.push(resize);
            }
            myReader.readAsDataURL(file);
            if (parseInt(element) == (countFile.length - 1)) {
              let setin = setInterval(() => {
                if (t.photoresize.length == countFile.length) {
                  console.log(t.photoresize);
                  console.log(t.widthPhoto);
                  console.log(t.heightPhoto);
                  loading.dismiss();
                  let photoHeight = ($('ng-component').width() * t.heightPhoto[0]) / t.widthPhoto[0];
                  // $('ng-component').width();
                  // t.gd.nextpage(t.navCtrl, 'PostphotoPage', { 'img': t.photoresize, 'Latitude': Latitude, 'Longitude': Longitude, 'key': key, 'heightPhoto': photoHeight.toFixed(0) });
                  // t.photoresize = [];
                  // t.widthPhoto = [];
                  // t.heightPhoto = [];
                  clearInterval(setin);
                }
              }, 1000)
              console.log(t.photoresize);
            }
          }
        });
      });
    } else {
      this.gd.toast("Can select maximum 10 images");
      this.presentActionSheet(this.navCtrl);
    }
  }
  toDecimal(number) {
    return number[0].numerator + number[1].numerator /
      (60 * number[1].denominator) + number[2].numerator / (3600 * number[2].denominator);
  }
  presentActionSheet(navCtrl) {
    // this.photoresize = [];
    // this.widthPhoto = [];
    // this.heightPhoto = [];
    // this.gd.stCamera = false;
    // var vthis = this;
    // console.log('.camera_Advertising');
    // $('#actionCamera').slideDown(200);
  }
  chooser_image() {
    var key = Date.now() + this.serviceFactoryThread.user_api_key;
    let loading
    let photoHeight;
    let options = {
      maximumImagesCount: 10,
      quality: 20,
      outputType: 0
    }

    this.imagePicker.getPictures(options).then((results) => {
      var t = this;
      var Latitude = "";
      var Longitude = "";
      var key;
      let base6fAll = [];
      for (let i = 0; i < results.length; i++) {
        if (i == 0) {
          loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: `
              <div class='textCenter'>Please Wait.</div>
              <div class='textCenter'>Image processing ...</div>
                `
          });
          loading.present();
          let newimg = new Image();
          newimg.onload = function () {
            console.log(newimg.width + ", " + newimg.height);
            photoHeight = ($('ng-component').width() * newimg.width) / newimg.height;
          };
          newimg.src = results[i];
        }
        var img = new Image();
        img.crossOrigin = 'Anonymous';
        this.base64.encodeFile(results[i]).then((base64File: string) => {
          console.log(base64File);
          let imgURI = base64File.replace("data:image/*;charset=utf-8;base64,", "data:image/jpeg;base64,");
          base6fAll.push(imgURI);
          this.photoresize.push(results[i]);
          if (i == results.length - 1) {
            setTimeout(() => {
              // console.log(this.photoresize);
              // this.gd.nextpage(this.navCtrl, 'PostphotoPage', { 'img': this.photoresize, 'Latitude': "", 'Longitude': '', 'key': key, 'heightPhoto': parseInt(photoHeight).toFixed(0) , "base64": base6fAll});
              loading.dismiss();
            }, 1000);
            console.log('success');
          }
        }, (err) => {
          console.log(err);
        });
        // CordovaExif.readData(results[i], function(exifObject) {
        //   console.log(exifObject);
        //  });
        img.src = results[i];
        console.log('Image URI: ' + results[i]);
      }
    }, (err) => { })
  }
  send_review() {
    console.log(this.commentRate, this.tetxReview);

    this.upload_img().then(data => {
      console.log(JSON.stringify(data));
      // let newData = firebase.database().ref('shopComment/' + this.dataGet.package_room_key + '/comment/').push();
      // let datasend = {
      //   fullname: this.gd.userProfile['user_firstname'] + " " + this.gd.userProfile['user_lastname'],
      //   userId: this.gd.userProfile['user_id'],
      //   comment: this.tetxReview,
      //   rate: this.commentRate,
      //   date: firebase.database.ServerValue.TIMESTAMP,
      //   image: JSON.stringify(data),
      //   status: '0'
      // }
      // newData.set(datasend);
      let dataS = {
        Package_ID: this.dataGet.packet_id,
        Booking_Code: this.dataGet.booking_code_order,
        User_ID: this.gd.userProfile['user_id'],
        Score: this.commentRate
      }
      this.serviceFactoryThread.ServiceThread('package_rate', dataS, 'POST').then(data => {
        this.dataGet.package_rate.Average = this.commentRate;
        this.viewCtrl.dismiss();
      });
    });

  }
  upload_img() {
    return new Promise(resolve => {
      if (this.photoresize.length > 0) {
        let datasend = {
          user_id: this.gd.userProfile['user_id'],
          img: JSON.stringify(this.photoresize),
          booking_id: this.dataGet.booking_code_order,
        }
        console.log(datasend);
        this.serviceFactoryThread.ServiceThread('upload_img_review', datasend, 'POST').then(data => {
          if (data["res_code"] == '00') {
            resolve(data["res_result"]);
          }
        })
      }else{
        resolve("");
      }

    });

  }
  close() {
    this.viewCtrl.dismiss();
  }

}
