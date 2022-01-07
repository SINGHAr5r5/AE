import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ActionSheetController, AlertController } from 'ionic-angular';
import { GlobalDataService } from '../../services/globaldata.service';
import { Camera } from '@ionic-native/camera';
import { ServiceFactoryThread } from '../../services/ServiceFactoryThread';

/**
 * Generated class for the EditprofilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-editprofile',
  templateUrl: 'editprofile.html',
})
export class EditprofilePage {
  country: any;
  data: any = {};
  constructor(public viewCtrl: ViewController, public serviceFactoryThread: ServiceFactoryThread, private alertCtrl: AlertController, public actionSheetCtrl: ActionSheetController, private camera: Camera, private gd: GlobalDataService, public navCtrl: NavController, public navParams: NavParams) {
    this.country = gd.Country;
    this.data['fname'] = gd.userProfile['user_firstname'];
    this.data['lname'] = gd.userProfile['user_lastname'];
    this.data['email'] = gd.userProfile['user_email'];
    this.data['country'] = gd.userProfile['country_id'];
    this.data['date'] = gd.userProfile['user_birthday'];
    this.data['user_img'] = gd.userProfile['user_path_img'];

    if (gd.userProfile['user_gender'] == 'M') {
      this.data['sex'] = '1';
    } else {
      this.data['sex'] = '2';
    }

    if (gd.userProfile['user_interestedIn'] != undefined && gd.userProfile['user_interestedIn'].split(",").length == 1) {
      if (gd.userProfile['user_interestedIn'].split(",")[0] == 'M') {
        this.data['interestedin1'] = true;
      } else {
        this.data['interestedin2'] = true;
      }
    } else {
      this.data['interestedin1'] = true;
      this.data['interestedin2'] = true;
    }

    // this.data['sex'] = gd.userProfile['user_gender']
    // console.log(gd.userProfile);

  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad EditprofilePage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Option',
      buttons: [

        {
          text: 'Choose Form Library',
          cssClass: "",
          handler: () => {
            this.takePicture(2, this.navCtrl);
            // console.log('Destructive clicked');
          }
        }, {
          text: 'Take Photo',
          cssClass: "",
          handler: () => {
            this.takePicture(1, this.navCtrl);
            // console.log('Archive clicked');
          }
        }, {
          text: 'Cancel',
          cssClass: "Select3",
          handler: () => {
            // console.log('Archive clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  takePicture(check, navCtrl) {
    let type;
    if (check == 1) {
      type = this.camera.PictureSourceType.CAMERA
    } else {
      type = this.camera.PictureSourceType.PHOTOLIBRARY
    }

    this.camera.getPicture({
      sourceType: type,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      allowEdit: true,
      mediaType: this.camera.MediaType.PICTURE

    }).then((imageData) => {
      // imageData is a base64 encoded string
      this.data['imageData'] = "data:image/jpeg;base64," + imageData;
      // console.log(this.data['imageData']);
      // // console.log("data:image/jpeg;base64," + imageData);
      document.getElementById('profile').setAttribute('src', "data:image/jpeg;base64," + imageData);
    }, (err) => {
      // console.log(err);
    });
  }

  send() {
    // // console.log(this.data);

    if (this.data.fname == '') {
      this.gd.toast('Please enter your first name');
    } else if (this.data.lname == '') {
      this.gd.toast('Please enter your last name');
    } else if (this.data.email == '') {
      this.gd.toast('Please enter your email');
    } else if (!this.gd.ValidateEmail(this.data.email)) {
      this.gd.toast('Plaease check your email');
    } else if (this.data.interestedin1 == false && this.data.interestedin2 == false) {
      this.gd.toast('Please select your Interested');
    } else {
      this.serviceFactoryThread.ServiceThread('checkEmail', { email: this.data.email }, 'POST').then(data => {
        if (data['res_code'] != '00') {
          this.gd.toast('This email already exists.');
        } else {
          let alert = this.alertCtrl.create({
            title: 'Confirm',
            message: 'Confirm edit profile?',
            buttons: [

              {
                text: 'Edit',
                handler: () => {
                  // console.log('Buy clicked');
                  this.serviceFactoryThread.ServiceThread('UpdateUser', this.data, 'POST')
                    .then(data => {
                      if (data['res_code'] == '00') {
                        // console.log(data['res_result']);
                        var countryIndex = this.country.findIndex(x => x.country_id == this.data['country']);
                        this.gd.userProfile['user_firstname'] = this.data['fname'];
                        this.gd.userProfile['user_lastname'] = this.data['lname'];
                        this.gd.userProfile['user_email'] = this.data['email'];
                        this.gd.userProfile['country_id'] = this.data['country'];
                        this.gd.userProfile['user_birthday'] = this.data['date'];
                        this.gd.userProfile['country_name_en'] = this.country[countryIndex]['country_name_en'];
                        if (this.data['imageData']) {
                          this.gd.userProfile['user_path_img'] = data['res_result']['user_path_img'];
                        }
                        this.gd.userProfile['user_interestedIn'] = data['res_result']['user_interestedIn'];
                        this.gd.userProfile['user_gender'] = data['res_result']['user_gender'];
                        this.gd.toast(data['res_text']);
                        this.navCtrl.pop();
                      } else {
                        // console.log(data['res_text']);
                      }
                    });
                }
              },
              {
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                  // console.log('Cancel clicked');
                }
              }
            ]
          });
          alert.present();
        }
      })
    }
  }
}
