import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the ModalProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-profile',
  templateUrl: 'modal-profile.html',
})
export class ModalProfilePage {
  dataGet:any = {};
  constructor(public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams) {
    this.dataGet = navParams.get('data');
    console.log(navParams.get('data'));
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalProfilePage');
  }
  close(){
    this.viewCtrl.dismiss();
  }
  goDismiss(id){
    this.viewCtrl.dismiss(id);
  }

}
