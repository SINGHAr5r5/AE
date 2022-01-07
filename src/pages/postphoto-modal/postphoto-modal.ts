import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { GlobalDataService } from '../../services/globaldata.service';

/**
 * Generated class for the PostphotoModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-postphoto-modal',
  templateUrl: 'postphoto-modal.html',
})
export class PostphotoModalPage {
  feeling:any = [];
  hlighligh_Status:any =[];
  typeplace:any = [];
  data:any = [];
  posthighlight:any = [];

  private myimage_chk:any = ['https://www.myadventureearth.com/assets/img/1_chk.svg','https://www.myadventureearth.com/assets/img/2_chk.svg', 'https://www.myadventureearth.com/assets/img/3_chk.svg'];
  private myimage:any = ['https://www.myadventureearth.com/assets/img/1.svg', 'https://www.myadventureearth.com/assets/img/2.svg', 'https://www.myadventureearth.com/assets/img/3.svg'];


  public myimage1:string = '';
  public myimage2:string = '';
  public myimage3:string = '';
  // public hlighligh_Status:string = "1";
  
  constructor(public modalCtrl: ModalController, private gd: GlobalDataService,public viewCtrl: ViewController,public navCtrl: NavController, public navParams: NavParams) {
    this.data = navParams.get('data');
    console.log(this.data);
    let array = [];
    console.log(">>><<<",this.gd.feelingNew),">>><<<";
    console.log(">>><<<",this.posthighlight,">>><<<")

    // if (this.gd.posthighlight.length !== 0) {
    //   this.myimage1 = this.gd.posthighlight[0];
    //   this.myimage2 = this.gd.posthighlight[1]
    //   this.myimage3 = this.gd.posthighlight[2];
    //   this.posthighlight = this.gd.posthighlight;
    // } else {
    //   this.myimage1 = this.myimage_chk[0]
    //   this.myimage2 = this.myimage[1]
    //   this.myimage3 = this.myimage[2]
    //   this.posthighlight = [this.myimage_chk[0], this.myimage[1], this.myimage[2]];
    // }

    this.gd.feelingNew.forEach((element,index) => {
      array.push(element);      
      if(((index+1) % 4) == 0 && index != 0){
        this.feeling.push(array);
        array = [];
      }
    });
    let array2 = [];
    this.gd.TypeLocation.forEach((element,index) => {
      array2.push(element);      
      if(((index+1) % 3) == 0 && index != 0){
        this.typeplace.push(array2);
        array2 = [];
      }
    });

    // console.log("++++++++++",this.feeling,"++++++++++");
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PostphotoModalPage');
    console.log("showID",this.data.feeling_id,"******** And ********",this.data.feeling_tx_sort);
    if(this.gd.hlighligh_Status == ""){
      // this.gd.hlighligh_Status = "1";
      console.log("00000000000000");
    }
   if (this.gd.posthighlight.length !== 0) {
      this.myimage1 = this.gd.posthighlight[0];
      this.myimage2 = this.gd.posthighlight[1]
      this.myimage3 = this.gd.posthighlight[2];
      this.posthighlight = this.gd.posthighlight;
    } else {
      this.myimage1 = this.myimage_chk[0]
      this.myimage2 = this.myimage[1]
      this.myimage3 = this.myimage[2]
      this.gd.hlighligh_Status= "1";
      this.posthighlight = [this.myimage_chk[0], this.myimage[1], this.myimage[2]];
    }
    console.log(">>>>>>",this.gd.hlighligh_Status,"<<<<<<");
  }
  
  
  addEvent1(){
    if(this.myimage1==this.myimage[0])
  	{
      let local = this.posthighlight.map((item, index) => index === 0 ? this.myimage_chk[index] : this.myimage[index])
      this.gd.posthighlight = local;
      this.posthighlight = local;
      this.gd.hlighligh_Status= "1";
      this.data.hlighligh_Status = this.gd.hlighligh_Status;
      console.log("show_hlighligh_Status",this.data.hlighligh_Status,"****************");
  		this.myimage1=local[0];
  		this.myimage2=local[1];
  		this.myimage3=local[2];
  	}
  }
  addEvent2(){
  	if(this.myimage2==this.myimage[1])
  	{
      let local = this.posthighlight.map((item, index) => index === 1 ? this.myimage_chk[index] : this.myimage[index])
      this.gd.posthighlight = local;
      this.posthighlight = local;
      this.gd.hlighligh_Status= "2";
      this.data.hlighligh_Status = this.gd.hlighligh_Status;
      console.log("show_hlighligh_Status",this.data.hlighligh_Status,"****************");
  		this.myimage1=local[0];
  		this.myimage2=local[1];
  		this.myimage3=local[2];
  	}
  }
  addEvent3(){
  	if(this.myimage3==this.myimage[2])
  	{
      let local = this.posthighlight.map((item, index) => index === 2 ? this.myimage_chk[index] : this.myimage[index])
      this.gd.posthighlight = local;
      this.posthighlight = local;
      this.gd.hlighligh_Status= "3";
      this.data.hlighligh_Status = this.gd.hlighligh_Status;
      console.log("show_hlighligh_Status",this.data.hlighligh_Status,"****************");
  		this.myimage1=local[0];
  		this.myimage2=local[1];
  		this.myimage3=local[2];
  	}
  }
  close() {
    this.viewCtrl.dismiss();
  }
  typeLocatSel(id,sort){
    this.data.TypeLocation = id;
    this.data.TypeLocation_srot = sort;
  }
  feelingSel(id,sort){
    this.data.feeling_id = id;
    this.data.feeling_tx_sort = sort;
    console.log("showID",this.data.feeling_id,"******** And ********",this.data.feeling_tx_sort,"******** And ********");
  }
  // hlighlighICON(id){
  //   this.data.hlighligh_Status = id;
  // }
  
  more() {
    let modal = this.modalCtrl.create('ModelPage', { 'Latitude': this.data.photo_la, 'Longitude': this.data.photo_long});
    modal.present();
    modal.onDidDismiss(data => {
      console.log(data);
      if(data["place_name"]){
        this.data.photo_location = data['place_name'];
        this.data.photo_long = data['place_location']['lng'];
        this.data.photo_la = data['place_location']['lat'];
        console.log(this.data);
      }
    })
  }
}
