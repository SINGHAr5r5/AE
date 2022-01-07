import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the SocialsharingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-socialsharing',
  templateUrl: 'socialsharing.html',
})
export class SocialsharingPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad SocialsharingPage');
  }
  close(id){
    this.viewCtrl.dismiss(id);
  }

}
