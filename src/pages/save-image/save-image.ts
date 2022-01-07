import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Base64ToGallery, Base64ToGalleryOptions } from '@ionic-native/base64-to-gallery';
import { AndroidPermissions } from '@ionic-native/android-permissions';

/**
 * Generated class for the SaveImagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var htmlTOcanvas: any;
declare var QRCode: any;

@IonicPage()
@Component({
  selector: 'page-save-image',
  templateUrl: 'save-image.html',
})
export class SaveImagePage {
  hasWriteAccess: boolean = false;
  image: any =  [ 'www.adventureearth.co/api/v2/img/cutSecsion.png',
                  'www.adventureearth.co/api/v2/img/treecoconut.png',
                  'www.adventureearth.co/api/v2/img/iconping.png',
                ];
  section:any = "";
  logo:any = "";
  ping:any = "";

  image_base64: any = [];
  image2: any = '';
  dataGet: any = this.navParams.get('data');
  meeting: any = this.navParams.get('meeting');
  user_image: any = "";
  packgeImage: any = [];

  constructor(public viewCtrl: ViewController,private androidPermissions: AndroidPermissions, private base64ToGallery: Base64ToGallery, private http: HttpClient, public navCtrl: NavController, public navParams: NavParams) {
    console.log(this.dataGet, this.meeting);

    // this.image.forEach(element => {
    //   this.getBase64ImageFromUrl(element).then(data => {
    //     this.image_base64.push(data);
    //   })
    // });
    this.getBase64ImageFromUrl(this.image[0]).then(data => {
      this.section = data;
    })
    this.getBase64ImageFromUrl(this.image[1]).then(data => {
      this.logo = data;
    })
    this.getBase64ImageFromUrl(this.image[2]).then(data => {
      this.ping = data;
    })

    // this.dataGet.img.forEach(element => {
    this.getBase64ImageFromUrl(this.dataGet.img[0].img_resize).then(data => {
      console.log(data);
      this.packgeImage.push(data);
    })
    // });
    this.getBase64ImageFromUrl(this.dataGet.user.user_path_img).then(data => {
      // console.log(data);
      this.user_image = data;
    })
    setTimeout(() => {
      new QRCode(document.getElementById("qrcode"), this.dataGet.booking_code_order);
    }, 200);
    setTimeout(() => {
      this.imageTo();
      // console.log(this.image_base64);
    }, 2000);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ImageCapturePage');
    // this.checkPermissions();
  }

  imageTo() {
    let t = this;
    htmlTOcanvas(document.getElementById('container'), {
      backgroundColor: 'null',
    }).then(function (canvas) {
      // t.image2 = canvas.toDataURL('image/png');
      var base64URL = canvas.toDataURL('image/png').replace('data:image/png;base64,', '');
      // let todecode = atob(base64URL);
      // if (!t.hasWriteAccess) {
      //   t.checkPermissions();
      // }else{
      t.base64ToGallery.base64ToGallery(base64URL).then(
        res => console.log('Saved image to gallery ', res),
        err => console.log('Error saving image to gallery ', err)
      );
      // }
      // document.body.appendChild(canvas);
    });
  }
  checkPermissions() {
    this.androidPermissions
      .checkPermission(this.androidPermissions
        .PERMISSION.WRITE_EXTERNAL_STORAGE)
      .then((result) => {
        console.log('Has permission?', result.hasPermission);
        this.hasWriteAccess = result.hasPermission;
      }, (err) => {
        this.androidPermissions
          .requestPermission(this.androidPermissions
            .PERMISSION.WRITE_EXTERNAL_STORAGE);
      });
    if (!this.hasWriteAccess) {
      this.androidPermissions
        .requestPermissions([this.androidPermissions
          .PERMISSION.WRITE_EXTERNAL_STORAGE]);
    }
  }

  close(){
    this.viewCtrl.dismiss();
  }
  async  getBase64ImageFromUrl(imageUrl) {
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    console.log(imageUrl);
    // if (imageUrl.search("./assets/") == '-1') {
    var res = await fetch(proxyurl + imageUrl);
    var blob = await res.blob();
    // } else {
    //   var res = await fetch(imageUrl);
    //   var blob = await res.blob();
    //   // new XMLSerializer().serializeToString(document.getElementById("svg"))
    // }

    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.onload = function () {
        resolve(reader.result);
      }
      reader.onerror = () => {
        return reject(this);
      };
      reader.readAsDataURL(blob);
    })
  }

}
