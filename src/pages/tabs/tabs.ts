import { Component } from "@angular/core";
import { Events, IonicPage, NavParams, NavController, Platform } from "ionic-angular";
import { Storage } from "@ionic/storage";
import { GlobalDataService } from "../../services/globaldata.service";
import { Location } from "@angular/common";
import * as $ from "jquery";

@IonicPage({
  name: "TabsPage",
})
@Component({
  selector: "tab",
  templateUrl: "tabs.html",
})
export class TabsPage {
  user: any = { user: this.navParams.get("user") };
  tab1Root = "NewsfeedPage";
  tab2Root = "BookingsPage";
  tab3Root = "";
  tab4Root = "TravelerPage";
  delay: boolean = true;

  constructor(
    private location: Location,
    public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    private storage: Storage,
    public gd: GlobalDataService,
    public platform: Platform
  ) {

    gd.navtab = navCtrl;
    storage.set("page", "TabsPage");
    events.unsubscribe("logout");
    events.unsubscribe("reloadPage1");
    events.subscribe("logout", () => {
      this.navCtrl.setRoot("LoginPage", {});
      storage.set("page", "logout");
      this.gd.checkmenu3++;
    });
    events.subscribe("Newpost", (res) => {});

    this.storage.set("tab", 0);
    setTimeout(() => {
      let t = this;
      $("#tab-t0-0").click(() => {
        if (t.location.path() == "/tabs/home/newfeed") {
          if ($("page-newsfeed").length == 1) {
            console.log("tab scrollTop");
            this.events.publish("scrollTop");
          }
        }
      });
      $("#tab-t0-2").click(() => {
        if (t.location.path() == "/tabs/connect-with-traveler/traveler") {
          console.log("tabtraveler");

          this.events.publish("scrollTop2");
        }
      });
    }, 1000);
  }



  openMenu() {
    if (this.gd.statusChooserCamera == 0) {
      //   this.gd.openChooserApp().then(data => {
      //     this.gd.statusChooserCamera = data;
      //     if (data == 1 || data == 2) {
      //       console.log(data);

      this.tab3Root = "CameraPage";
      this.gd.chooserShare = 2;
      setTimeout(() => {
        this.events.publish("selectPost");
      }, 500);
      // }
      setTimeout(() => {
        this.tab3Root = "";
        this.gd.statusChooserCamera = 0;
      }, 2000);
      // })
    }
  }
  scrollHome(event) {
    console.log("tset-*-*-");
  }
  click() {
    // console.log('click');
    console.log(this.location.path());

    this.storage.get("page").then((val) => {
      if (val != "PostphotoPage" && val != "login" && val != "recomment") {
        setTimeout(() => {
          if (
            $('a[aria-selected="true"]')[0].id ==
            "tab-t" + this.gd.checkmenu3 + "-0"
          ) {
            // console.log('tab1');

            // setTimeout(() => {
            //   this.events.publish('scrollTop');
            // }, 200);
            this.storage.set("tab", "0");
          } else if (
            $('a[aria-selected="true"]')[0].id ==
            "tab-t" + this.gd.checkmenu3 + "-1"
          ) {
            this.storage.set("tab", "1");
          } else if (
            $('a[aria-selected="true"]')[0].id ==
            "tab-t" + this.gd.checkmenu3 + "-3"
          ) {
            this.storage.set("tab", "3");
          } else if (
            $('a[aria-selected="true"]')[0].id ==
            "tab-t" + this.gd.checkmenu3 + "-4"
          ) {
            this.storage.set("tab", "4");
          } else if (
            $('a[aria-selected="true"]')[0].id ==
            "tab-t" + this.gd.checkmenu3 + "-2"
          ) {
            if (this.gd.stCamera) {
              this.events.publish("reloadPage1");
            } else {
              this.gd.stCamera = true;
            }
          }
        }, 100);
      }
    });
  }
}
