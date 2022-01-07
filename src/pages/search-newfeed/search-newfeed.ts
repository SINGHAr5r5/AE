import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ServiceFactoryThread } from '../../services/ServiceFactoryThread';
import { GlobalDataService } from '../../services/globaldata.service';
import * as $ from 'jquery';
/**
 * Generated class for the SearchNewfeedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search-newfeed',
  templateUrl: 'search-newfeed.html',
})
export class SearchNewfeedPage {
  @ViewChild('myInput') myInput;
  inputSearch: any = this.gd.newFeedTextSearch;
  typeSearch: any = 'Recent';
  segmentTypes: any = "1";
  dataSearch: any = [];

  constructor(private gd: GlobalDataService, public SFT: ServiceFactoryThread, public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams) {
    console.log(navParams["data"]["typeSearch"]);
    this.typeSearch = navParams["data"]["typeSearch"];
    // $("ion-input").focus();
    // this.myInput.setFocus();
    setTimeout(() => {
      if (this.gd.newFeedTextSearch != "") {
        this.filterItems();
      }
    }, 100);
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchNewfeedPage');
    setTimeout(() => {
      // this.focus();
    }, 500);
  }
  focus() {
    this.myInput.setFocus();
  }

  segmentChanged(event) {

  }
  cancle() {
    this.viewCtrl.dismiss();
  }
  searchAll(type) {
    console.log(type);
    if (type == 'search') {
      if (this.inputSearch != '') {
        this.viewCtrl.dismiss({ type: 'search', data: this.inputSearch, typeSearch: this.typeSearch });
      }
    } else if (type == 'clear') {
      this.viewCtrl.dismiss({ type: 'clear', data: this.inputSearch, typeSearch: this.typeSearch });
    }
  }
  chooser(text) {
    console.log(text);
    this.typeSearch = text;
    if (this.inputSearch == '') {
      this.typeSearch = text;
      this.searchAll('clear');
    }
  }
  filterItems() {
    this.gd.newFeedTextSearch = this.inputSearch;
    console.log(this.inputSearch);
    if (this.inputSearch != '') {
      // this.setItems();
      let type = 1;
      if (this.typeSearch != 'Recent') {
        type = 2;
      }
      let data = {
        'data': this.inputSearch,
        'type': type,
        'lat': this.SFT.userlocation["lat"],
        'long': this.SFT.userlocation["long"]
      }
      this.SFT.ServiceThread("getAuto", data, "POST").then(data => {
        console.log(data);
        // this.items = [];
        if (data["res_code"] != '01') {
          this.dataSearch = data["res_result"];
        } else {
          this.dataSearch = [];
        }
        // if (this.items.length > 0) {
        //   this.showSearch = true;
        // } else {
        //   this.showSearch = false;
        // }
      });
    } else {
      // this.items = [];
      // this.showSearch = false;
    }
  }
  selected(data) {
    this.gd.newFeedTextSearch = this.inputSearch;
    this.viewCtrl.dismiss({ type: 'search', data: data.photo_location, typeSearch: this.typeSearch });
  }
  enterSearch() {
    if (this.inputSearch != '') {
      // this.myInput.unfocus();
      $('#searchNewFeed .searchbar-input').blur();
      setTimeout(() => {
        this.gd.newFeedTextSearch = this.inputSearch;
        this.viewCtrl.dismiss({ type: 'search', data: this.inputSearch, typeSearch: this.typeSearch });
      }, 200);
    }

  }

}
