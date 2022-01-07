import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GlobalDataService } from '../../services/globaldata.service';

/**
 * Generated class for the EditPickPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-pick',
  templateUrl: 'edit-pick.html',
})
export class EditPickPage {

  constructor(public navCtrl: NavController,private gd: GlobalDataService,  public navParams: NavParams) {
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad EditPickPage');
  }


}
