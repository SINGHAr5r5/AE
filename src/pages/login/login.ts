import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  Events,
  ModalController,
  Platform,
} from "ionic-angular";
import { Storage } from "@ionic/storage";
import { GlobalDataService } from "../../services/globaldata.service";
import { ServiceFactoryThread } from "../../services/ServiceFactoryThread";
import { Facebook, FacebookLoginResponse } from "@ionic-native/facebook";
import * as $ from "jquery";
import { Keyboard } from "@ionic-native/keyboard";
import * as firebase from 'firebase';
import {AngularFireAuth} from 'angularfire2/auth';
declare var cordova: any;


/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-login",
  templateUrl: "login.html",
})
export class LoginPage {
  data: any = [];
  localSt: boolean = false;
  statusLo: boolean = false;
  StBusi: boolean = false;
  screenHeight: any;

  constructor(
    public events: Events,
    private fb: Facebook,
    private gd: GlobalDataService,
    private SFT: ServiceFactoryThread,
    private storage: Storage,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    private keyboard: Keyboard,
    private platform: Platform,
    private afAuth: AngularFireAuth
  ) {

  }

  ngOnInit() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.keyboard.hideFormAccessoryBar(false);
    });
  }

  ionViewDidEnter(){

  //  console.log(`date now `, now);
  //  console.log(`date tomorrow `, publish);
  // console.log(`app version`, this.appVersion.getVersionNumber());

  }


  ionViewDidLoad() {

    this.storage.get("login_type").then((val)=>{
      let type = val;
      this.storage.get("email").then((val) => {
        if (val) {
          let email = val;
          this.storage.get("password").then((val) => {
            this.data["login_type"] = type;
            this.data["email"] = email;
            this.data["password"] = val;

            this.gd.nextrootpage(this.navCtrl, "TabsPage", {});
            this.TabsPage();
            this.storage.get("user_api_key").then((vall) => {
              this.SFT.user_api_key = vall;
            });
          });
        } else {
          this.localSt = true;
        }
      });
    });


    this.storage.set("page", "login");
  }
  loginFacebook() {
    // this.SFT.loading_present('');
    this.fb
      .logout()
      .then((res) => {})
      .catch((e) => console.log("Error logout", e));
    let token;
    this.fb
      .login(["public_profile", "email"])
      .then((res: FacebookLoginResponse) => {
        token = res.authResponse.accessToken;
        this.fb
          .api(
            "me?access_token=" +
              res.authResponse.accessToken +
              "&fields=email,id,name,picture.type(large),gender,birthday",
            ["public_profile"]
          )
          .then((res) => {
            console.log("login Facebook");
            this.data = {
              email: res.id,
              password: "fb",
            };
            this.SFT.ServiceThread("login", this.data, "POST")
              .then((data) => {
                if (data["res_code"] != "00") {
                  // this.gd.toast(data['res_text']+' FB ');
                  this.navCtrl.push("RegisterPage", {
                    dataFB: res,
                    token: token,
                    type: 1,
                    stChooser: this.StBusi,
                  });
                  setTimeout(() => {
                    // this.SFT.Check_Count('');
                  }, 1000);
                } else {
                  this.SFT.STLogin = true;
                  // this.gd.showbtn = data['res_show'];
                  data["res_result"]["user_path_img"] =
                    this.gd.BASE_URL + data["res_result"]["user_path_img"];
                  this.selectData(data["res_result"]);
                  this.gd.userProfile = data["res_result"];
                  this.gd.get_noti("old");
                  this.storage.set("login_type", "fb");
                  this.storage.set("email", res.id);
                  this.storage.set("password", "fb");
                  this.storage.set(
                    "user_api_key",
                    data["res_result"]["user_api_key"]
                  );
                  this.SFT.user_api_key = data["res_result"]["user_api_key"];
                  setTimeout(() => {
                    this.SFT.GCL().then((data) => {
                      this.statusLo = true;
                      this.gd.nextrootpage(this.navCtrl, "TabsPage", {
                        user: data["res_result"],
                      });
                      setTimeout(() => {
                        this.gd.chat().then((data) => {
                          // this.sumNoti = data;
                        });
                      }, 1000);
                    });
                    setTimeout(() => {
                      this.SFT.Check_Count("Location-*-");
                      if (!this.statusLo) {
                        let alert = this.alertCtrl.create({
                          title: "Location",
                          subTitle: "Can't find your location",
                          enableBackdropDismiss: false,
                          buttons: [
                            {
                              text: "Retry",
                              role: "Retry",
                              handler: () => {
                                console.log("Retry clicked");
                                this.loginFacebook();
                              },
                            },
                          ],
                        });
                        alert.present();
                      }
                    }, 10000);
                    this.gd.regisNoti();
                  }, 0);
                }
              })
              .catch((e) => {
                console.log("Error login", e);
                try {
                  setTimeout(() => {
                    // this.SFT.Check_Count('');
                  }, 500);
                } catch (error) {}
              });
          })
          .catch((e) => {
            console.log("Error api into Facebook", e);
            try {
              setTimeout(() => {
                // this.SFT.Check_Count('');
              }, 500);
            } catch (error) {}
          });
      })
      .catch((e) => {
        console.log("Error logging into Facebook", e);
        try {
          setTimeout(() => {
            // this.SFT.Check_Count('');
          }, 500);
        } catch (error) {}
      });
  }


   loginApple(){
    return new Promise(async (resolve, reject) => {
    await cordova.plugins.SignInWithApple.signin(
      {requestedScopes: [0, 1]},
      async (resp) => {
        // var provider = new firebase.auth.OAuthProvider('apple.com').credential({
        //   idToken: resp.identityToken
        // });
        // this.afAuth.auth.signInWithCredential(provider).then(result => {
        // console.log(`apple user info`, result)
        // resolve('Apple login successfully');
        // }).catch( error => {
        //     reject( error.message || error );
        // })
        let userProfile = {
          email: resp.email,
          firstName: resp.fullName.givenName,
          lastName: resp.fullName.familyName,
          appleId: resp.user
        }
        console.log(`apple data`, resp);
        console.log(userProfile);
        this.SFT.ServiceThread("loginApple", {uid: resp.user}, "POST").then((data)=>{
          if (data["res_code"] != "00") {
            // this.gd.toast(data['res_text']+' FB ');
            this.navCtrl.push("RegisterPage", {
              dataApple: userProfile,
              token: resp.user,
              type: 1,
              stChooser: this.StBusi,
            });
            setTimeout(() => {
              // this.SFT.Check_Count('');
            }, 1000);
          }else{
            this.SFT.STLogin = true;
                  // this.gd.showbtn = data['res_show'];
                  data["res_result"]["user_path_img"] =
                    this.gd.BASE_URL + data["res_result"]["user_path_img"];
                  this.selectData(data["res_result"]);
                  this.gd.userProfile = data["res_result"];
                  this.gd.get_noti("old");
                  this.storage.set("login_type", "apple");
                  this.storage.set("email", resp.user); //uid
                  this.storage.set("password", "apple"); //user_type_login
                  this.storage.set(
                    "user_api_key",
                    data["res_result"]["user_api_key"]
                  );
                  this.SFT.user_api_key = data["res_result"]["user_api_key"];
                  setTimeout(() => {
                    this.SFT.GCL().then((data) => {
                      this.statusLo = true;
                      this.gd.nextrootpage(this.navCtrl, "TabsPage", {
                        user: data["res_result"],
                      });
                      setTimeout(() => {
                        this.gd.chat().then((data) => {
                          // this.sumNoti = data;
                        });
                      }, 1000);
                    });
                    setTimeout(() => {
                      this.SFT.Check_Count("Location-*-");
                      if (!this.statusLo) {
                        let alert = this.alertCtrl.create({
                          title: "Location",
                          subTitle: "Can't find your location",
                          enableBackdropDismiss: false,
                          buttons: [
                            {
                              text: "Retry",
                              role: "Retry",
                              handler: () => {
                                console.log("Retry clicked");
                                this.loginFacebook();
                              },
                            },
                          ],
                        });
                        alert.present();
                      }
                    }, 10000);
                    this.gd.regisNoti();
                  }, 0);
          }
        })

      },
      (err) => {
        // console.error(err)
        // console.log(JSON.stringify(err))
        reject("Apple login failed");
      }
    )
    })
  }

  selectData(data) {
    this.SFT.ServiceThread("TAGExplore", { user_id: 78 }, "POST").then(
      (data) => {
        if (data["res_code"] == "00") {
          this.gd.myTag = data["res_result"];
        }
      }
    );
    this.SFT.ServiceThread("Recent", { user_id: data["user_id"] }, "POST").then(
      (data) => {
        if (data["res_code"] == "00") {
          this.gd.Recent = data["res_result"];
        }
      }
    );
    this.SFT.ServiceThread("follow", { user_id: data["user_id"] }, "POST").then(
      (data) => {
        if (data["res_code"] == "00") {
          this.gd.userProfile["followers"] = data["res_result"][0]["followers"];
          this.gd.userProfile["following"] = data["res_result"][0]["following"];
        }
      }
    );
  }

  TabsPage() {
    // this.loading.present();
    this.fb
      .logout()
      .then((res) => {
        // console.log('success');
      })
      .catch((e) => console.log("Error logout", e));
    setTimeout(() => {
      // this.geolocation.getCurrentPosition().then((position) => {
      //   let dataSend = {
      //     'lat': position["coords"]["latitude"],
      //     'long': position["coords"]["longitude"]
      //   };
      //   this.gd.userlocation = dataSend;
      let strPath = ( this.data["login_type"] == 'apple') ? 'loginApple' : 'login';
      this.SFT.ServiceThread(strPath, this.data, "POST").then((datas) => {
        if (datas["res_code"] != "00") {
          this.SFT.Check_Count("");
          this.gd.toast(datas["res_text"]);
          this.gd.regisLogout();
          this.events.publish("logout");
          this.storage.clear();
          this.fb
            .logout()
            .then((res) => {
              // console.log('success');
            })
            .catch((e) => console.log("Error logout", e));
        } else {
          this.SFT.STLogin = true;
          // this.gd.showbtn = datas['res_show'];
          datas["res_result"]["user_path_img"] =
            this.gd.BASE_URL + datas["res_result"]["user_path_img"];
          this.selectData(datas["res_result"]);
          this.gd.userProfile = datas["res_result"];
          this.gd.get_noti("old");
          this.storage.set("login_type", this.data["login_type"]);
          this.storage.set("email", this.data["email"]);
          this.storage.set("password", this.data["password"]);
          this.storage.set("user_api_key", datas["res_result"]["user_api_key"]);
          this.SFT.user_api_key = datas["res_result"]["user_api_key"];
          setTimeout(() => {
            this.gd.chat().then((data) => {});
            this.SFT.GCL();
            if (this.localSt) {
              this.gd.nextrootpage(this.navCtrl, "TabsPage", {});
            }
            console.log("test");
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
                      this.data["type"] = "updateDateCancel";
                      this.SFT.ServiceThread(
                        "updateDataUser",
                        this.data,
                        "POST"
                      ).then((data) => {});
                    },
                  },
                ],
              });
              alert.present();
            }
            this.gd.regisNoti();
          }, 0);
        }
      });
    }, 1000);
  }
  register() {
    // this.navCtrl.push("Register");
    // let modal = this.modalCtrl.create('TypeRegisterPage', {});
    // modal.present();
    // modal.onDidDismiss(res => {
    //   console.log(res);
    this.gd.nextrootpage(this.navCtrl, "RegisterPage", {
      type: 1,
      stChooser: this.StBusi,
    });
    // });
  }

  showConfirm() {
    setTimeout(() => {
      $(".alert-wrapper").css("margin-top", "20%");
    }, 10);

    let prompt = this.alertCtrl.create({
      title: "Forget Password",
      message: "Enter Email to reset your password.",
      inputs: [
        {
          name: "Email",
          placeholder: "Email",
        },
      ],
      buttons: [
        {
          text: "Cancel",
          handler: (data) => {
            // console.log('Cancel clicked');
          },
        },
        {
          text: "Send",
          handler: (data) => {
            console.log("Saved clicked");
            if (this.gd.ValidateEmail(data["Email"])) {
              this.SFT.ServiceThread(
                "forgot",
                { email: data["Email"] },
                "POST"
              ).then((data) => {
                if (data["res_code"] == "00") {
                  this.gd.toast(data["res_text"]);
                } else {
                  this.gd.toast(data["res_text"]);
                }
              });
            } else {
              this.gd.toast("Please check email");
            }
          },
        },
      ],
    });
    prompt.present();
  }
  goBussiness(status) {
    this.StBusi = status;
  }
}
