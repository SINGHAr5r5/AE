import { trigger } from "@angular/animations";
import { Component, ViewChild } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  Toast,
  ModalController,
  ActionSheetController,
} from "ionic-angular";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { Storage } from "@ionic/storage";
import { GlobalDataService } from "../../services/globaldata.service";
import { ServiceFactoryThread } from "../../services/ServiceFactoryThread";
import { Slides } from "ionic-angular";
import { Camera } from "@ionic-native/camera";
import * as $ from "jquery";
import { NgZone } from "@angular/core";

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var select2;

@IonicPage()
@Component({
  selector: "page-register",
  templateUrl: "register.html",
})
export class RegisterPage {
  @ViewChild(Slides) slides: Slides;
  typeRegister: any = this.navParams.get("stChooser") ? "2" : "1";
  dataFB: any;
  dataApple: any;
  country: any;
  data: any = {};
  STHide: any = this.gd.showbtn;
  countryChooser: any = "";
  public dataGroup1: FormGroup;
  public dataGroup2: FormGroup;
  locationSet: any = "";
  locationGet: any;
  statusPage: boolean = false;
  constructor(
    private camera: Camera,
    public actionSheetCtrl: ActionSheetController,
    public modalCtrl: ModalController,
    private storage: Storage,
    private SFT: ServiceFactoryThread,
    private gd: GlobalDataService,
    private formBuilder: FormBuilder,
    public navCtrl: NavController,
    public navParams: NavParams,
    private ngZone: NgZone
  ) {
    console.log(this.STHide);
    this.dataFB = this.navParams.get("dataFB");
    this.dataApple = this.navParams.get("dataApple");

    console.log(`-------------------------------------`);
    console.log(`dataFB`,this.dataFB);
    console.log(`dataApple`,this.dataApple);
    console.log(`-------------------------------------`);


    if (this.dataFB != undefined) {
      this.statusPage = true;
    }

    if (this.dataApple != undefined) {
      this.statusPage = true;
    }

    setTimeout(() => {
      this.country = gd.Country;
    }, 1500);
    console.log(this.country);
    setTimeout(() => {
      console.log("change0 Country", this.dataGroup2.value);
      $(".outer").hide();
      select2();
      var t = this;
      $(".js-example-basic-single").change(function () {
        console.log("change2 Country", this.dataGroup2.value);
        t.countryChooser = $(".js-example-basic-single").val();
        t.dataGroup2.patchValue({
          country: $(".js-example-basic-single").val(),
        });
      });
    }, 1000);
    this.dataGroup1 = this.formBuilder.group({
      email: ["", Validators.required],
      username: ["", Validators.required],
      password: ["", Validators.required],
      conpassword: ["", Validators.required],
    });
    if (this.STHide == 1) {
      if (this.typeRegister == 2) {
        this.dataGroup2 = this.formBuilder.group({
          imageData: [""],
          storeName: ["", Validators.required],
          phone: ["", Validators.required],
          location: ["", Validators.required],
          country: [""],
          fname: ["", Validators.required],
          lname: ["", Validators.required],
          sex: [""],
          date: [""],
          termsAccepted: ["", Validators.required],
        });
      } else {
        this.dataGroup2 = this.formBuilder.group({
          imageData: [""],
          country: [""],
          fname: ["", Validators.required],
          lname: ["", Validators.required],
          date: [""],
          sex: [""],
          termsAccepted: ["", Validators.required],
        });
      }
    } else {
      if (this.typeRegister == 2) {
        this.dataGroup2 = this.formBuilder.group({
          imageData: ["", Validators.required],
          storeName: ["", Validators.required],
          phone: ["", Validators.required],
          country: ["", Validators.required],
          fname: ["", Validators.required],
          lname: ["", Validators.required],
          sex: ["", Validators.required],
          date: ["", Validators.required],
          termsAccepted: ["", Validators.required],
        });
      } else {
        this.dataGroup2 = this.formBuilder.group({
          imageData: ["", Validators.required],
          country: ["", Validators.required],
          fname: ["", Validators.required],
          lname: ["", Validators.required],
          sex: ["", Validators.required],
          date: ["", Validators.required],
          termsAccepted: ["", Validators.required],
        });
      }
    }

    if (this.dataFB != undefined) {
      this.data.uid = this.dataFB.id;
      this.dataGroup1.controls["email"].setValue(this.dataFB.email);
      this.dataGroup1.controls["username"].setValue(this.dataFB.name);
      this.dataGroup1.controls["password"].setValue("fb");
      this.dataGroup1.controls["conpassword"].setValue("fb");
      this.dataGroup2.controls["fname"].setValue(
        this.dataFB.name.split(" ")[0]
      );
      this.dataGroup2.controls["lname"].setValue(
        this.dataFB.name.split(" ")[1]
      );
      this.dataGroup2.controls["imageData"].setValue(
        this.dataFB.picture.data.url
      );
      gd.convertToDataURLviaCanvas(
        this.dataFB.picture.data.url,
        "image/jpeg"
      ).then((base64) => {
        this.dataGroup2.controls["imageData"].setValue(base64);
      });
    }

    if (this.dataApple != undefined) {
      this.data.uid = this.dataApple.appleId;
      this.dataGroup1.controls["email"].setValue(this.dataApple.email);
      this.dataGroup1.controls["username"].setValue(this.dataApple.firstName);
      this.dataGroup1.controls["password"].setValue("");
      this.dataGroup1.controls["conpassword"].setValue("");
      this.dataGroup2.controls["fname"].setValue(this.dataApple.firstName);
      this.dataGroup2.controls["lname"].setValue(this.dataApple.lastName);
    }
    setTimeout(() => {
      this.lockSlide(true);
    }, 1000);
  }
  lockSlide(status) {
    this.slides.lockSwipeToNext(status);
    this.slides.lockSwipeToPrev(status);
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad RegisterPage");
  }


  check1() {
    console.log(this.dataGroup1.value);
    let dataGet = this.dataGroup1.value;
    if (dataGet.email == "") {
      this.gd.toast("Please enter your email.");
    } else if (!this.gd.ValidateEmail(dataGet.email)) {
      this.gd.toast("Plaease check your email");
    } else if (dataGet.username == "") {
      this.gd.toast("Please enter username.");
    } else if (!this.gd.checklength(dataGet.username, "6")) {
      this.gd.toast("Username must be more than 6 characters.");
    } else if (dataGet.password == "") {
      this.gd.toast("Please enter password.");
    } else if (!this.gd.checklength(dataGet.password, "6")) {
      this.gd.toast("Password must be more than 6 characters.");
    } else if (dataGet.conpassword == "") {
      this.gd.toast("Please enter Conﬁrm your Password.");
    } else if (dataGet.conpassword != dataGet.password) {
      this.gd.toast("Password and confirm password do not match.");
    } else {
      this.SFT.ServiceThread(
        "ChkEmail",
        { Email: dataGet.emails },
        "POST"
      ).then((data) => {
        console.log(data);
        if (data["res_code"] == "00") {
          this.gd.toast(data["res_text"]);
        } else {
          this.statusPage = true;
          setTimeout(() => {
            select2();
            setTimeout(() => {
              $(".outer").hide();
              // select2();
              var t = this;
              $(".js-example-basic-single").change(function () {
                t.countryChooser = $(".js-example-basic-single").val();
                t.dataGroup2.patchValue({
                  country: $(".js-example-basic-single").val(),
                });
              });
            }, 500);
            this.lockSlide(false);
            this.slides.slideNext();
            setTimeout(() => {
              this.lockSlide(true);
            }, 1000);
          }, 500);
        }
      });
    }
  }

  check2() {
    console.log(this.dataGroup2.value);
    let dataGet = this.dataGroup2.value;
    if (dataGet.country == "" && dataGet.country == null && this.STHide != 1) {
      this.gd.toast("Please choose your country.");
    } else if (dataGet.fname == "") {
      this.gd.toast("Please enter your firstname.");
    } else if (dataGet.lname == "") {
      this.gd.toast("Please enter your lastname.");
    } else if (dataGet.sex == "" && this.STHide != 1) {
      this.gd.toast("Please choose gender.");
    } else if (dataGet.date == "" && this.STHide != 1) {
      this.gd.toast("Please enter your birthday.");
    } else if (dataGet.termsAccepted == "") {
      this.gd.toast("Please accept the terms.");
    } else if (dataGet.imageData == "") {
      this.gd.toast("Please choose your pickture.");
    } else {
      console.log("register");
      this.data = Object.assign(this.dataGroup1.value, this.dataGroup2.value);
      console.log(this.data);
      this.register();
    }
  }
  more() {
    let modal = this.modalCtrl.create("ModelPage", {
      Latitude: this.SFT.userlocation.lat,
      Longitude: this.SFT.userlocation.long,
    });
    modal.present();
    modal.onDidDismiss((data) => {
      console.log("data >>>>>>>");
      console.log(data);
      console.log("data >>>>>>>");
      this.locationGet = data;
      this.locationSet = data.place_name;
      this.dataGroup2.patchValue({ location: data.place_name });
      // this.data.location = data.place_name;
    });
  }
  onTermsChecked($event) {
    console.log(`event`,$event);
    console.log(`Accept Terms and Poliies `,$event.checked);
    this.ngZone.run(() => {
      if (!$event.checked) {
        this.dataGroup2.patchValue({ termsAccepted: "" });
      } else {
        this.dataGroup2.patchValue({ termsAccepted: 1 });
      }
    });

  }
  onChangeHandler(type, event) {
    console.log(event);
      this.dataGroup2.patchValue({ sex: event });
      this.countryChooser = $(".js-example-basic-single").val();
      this.dataGroup2.patchValue({
        country: $(".js-example-basic-single").val(),
      });
  }

  back() {
    console.log(this.slides.getActiveIndex());
    if (this.slides.getActiveIndex() == 1) {
      this.lockSlide(false);
      this.slides.slidePrev();
      setTimeout(() => {
        this.lockSlide(true);
      }, 1000);
    } else {
      // this.gd.nextrootpage(this.navCtrl, 'LoginPage', {});
      // this.navCtrl.pop({ animate: true, animation: "ios-transition" });
      this.navCtrl.setRoot("LoginPage", {
        animate: true,
        animation: "ios-transition",
        direction: "forward",
      });
    }
  }

  register() {
    if (this.typeRegister == 2) {
      this.data.step = "store";
      this.data["lat"] = this.locationGet["place_location"]["lat"];
      this.data["lng"] = this.locationGet["place_location"]["lng"];
      this.data["place_vicinity"] = this.locationGet["place_vicinity"];
      this.data["place_name"] = this.locationGet["place_name"];
    }
    this.data.typeRegister = this.typeRegister;
    var userData = this.data;
    console.log(this.data);
    if (this.dataFB != undefined) {
      this.data.uid = this.dataFB.id;
      this.data["type_account"] = '2';
    }else if(this.dataApple != undefined){
      this.data.uid = this.dataApple.appleId;
      this.data["type_account"] = '3';
    }else{
      this.data["type_account"] = '1';
    }

    this.SFT.ServiceThread("register", this.data, "POST").then((data) => {
      if (data["res_code"] != "00") {
        this.gd.toast(data["res_text"]);
      } else {
        if (this.dataFB || this.dataApple) {
          if (this.dataFB) {
            this.SFT.ServiceThread("login", { email: this.dataFB.id, password: "fb"}, "POST")
            .then((data) => {
              if (data["res_code"] != "00") {
              } else {
                // this.gd.showbtn = datas['res_show'];
                data["res_result"]["user_path_img"] =
                  this.gd.BASE_URL + data["res_result"]["user_path_img"];
                this.gd.userProfile = data["res_result"]; //global user profile
                this.SFT.user_api_key = data["res_result"]["user_api_key"];
                this.storage.set("login_type", "fb");
                this.storage.set("email", this.dataFB.id);
                this.storage.set("password", "fb");
                this.storage.set(
                  "user_api_key",
                  data["res_result"]["user_api_key"]
                );
                this.gd.nextrootpage(this.navCtrl, "TabsPage", {
                  user: data["res_result"],
                });
              }
            })
            .catch((e) => console.log("Error login", e));
          }else{
            this.SFT.ServiceThread("loginApple", {uid: this.dataApple.appleId}, "POST")
            .then((data) => {
              if (data["res_code"] != "00") {
              } else { //login success
                // this.gd.showbtn = datas['res_show'];
                data["res_result"]["user_path_img"] = this.gd.BASE_URL + data["res_result"]["user_path_img"];
                this.gd.userProfile = data["res_result"]; //global user profile
                this.SFT.user_api_key = data["res_result"]["user_api_key"];
                this.storage.set("login_type", "apple");
                this.storage.set("email", this.dataApple.appleId);
                this.storage.set("password", "apple");
                this.storage.set(
                  "user_api_key",
                  data["res_result"]["user_api_key"]
                );
                this.gd.nextrootpage(this.navCtrl, "TabsPage", {
                  user: data["res_result"],
                });
              }
            })
            .catch((e) => console.log("Error login", e));
          }

        } else {
          var datass = {
            email: userData["username"],
            password: userData["password"],
          };
          this.SFT.ServiceThread("login", datass, "POST").then((datas) => {
            if (datas["res_code"] != "00") {
              this.gd.toast(datas["res_text"]);
              this.gd.regisLogout();
              this.storage.clear();
            } else {
              // this.gd.showbtn = datas['res_show'];
              // this.SFT.userlocation = { 'lat': '', 'long': '' };
              // console.log(this.SFT.userlocation);
              datas["res_result"]["user_path_img"] =
                this.gd.BASE_URL + datas["res_result"]["user_path_img"];
              this.gd.userProfile = datas["res_result"];
              this.storage.set("login_type", "email");
              this.storage.set("email", userData["username"]);
              this.storage.set("password", userData["password"]);
              this.storage.set(
                "user_api_key",
                datas["res_result"]["user_api_key"]
              );
              this.SFT.user_api_key = datas["res_result"]["user_api_key"];
              this.gd.nextrootpage(this.navCtrl, "TabsPage", {});
              this.gd.regisNoti();
            }
          });
        }
      }
    });
  }
  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: "Option",
      buttons: [
        {
          text: "Choose Form Library",
          cssClass: "",
          handler: () => {
            this.takePicture(2, this.navCtrl);
            // console.log('Destructive clicked');
          },
        },
        {
          text: "Take Photo",
          cssClass: "",
          handler: () => {
            this.takePicture(1, this.navCtrl);
            // console.log('Archive clicked');
          },
        },
        {
          text: "Cancel",
          cssClass: "Select3",
          handler: () => {
            // console.log('Archive clicked');
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
          // this.data['imageData'] = "data:image/jpeg;base64," + imageData;
          this.dataGroup2.patchValue({
            imageData: "data:image/jpeg;base64," + imageData,
          });
          console.log(this.dataGroup2.value);

          // document.getElementById('profile').setAttribute('src', this.data['imageData']);
        },
        (err) => {}
      );
  }
}
