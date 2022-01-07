import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GlobalDataService } from '../../services/globaldata.service';
import { ServiceFactoryThread } from '../../services/ServiceFactoryThread';
import * as $ from 'jquery';

/**
 * Generated class for the EditTagPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-tag',
  templateUrl: 'edit-tag.html',
})
export class EditTagPage {
  data: any = {};
  showpage: number = this.navParams.get('data')
  typeNum1: number = 0;
  typeNum2: number = 0;
  numtag: number = 0;
  feeling: any;
  travel: any;
  tag: any = [];
  Fulltag: any = [];
  Title: any;
  Detail: string = "";
  textId: string = '';
  selecttext: any;
  datatag: any = [];
  constructor(public zone: NgZone, public navCtrl: NavController, private gd: GlobalDataService, private serviceFactoryThread: ServiceFactoryThread, public navParams: NavParams) {
    // console.log(this.showpage);
    if (this.showpage == 1) {
      this.feeling = gd.feeling;
      this.data['feeling'] = [];
      this.Title = "Pick the Picture Inspired you";
      this.Detail = "Help us inspire our community by sharing how would you like to feel in your adventures";
      this.selecttext = "Select Pictures that Inspire You";
    } else if (this.showpage == 2) {
      this.travel = gd.travel;
      this.data['travel'] = [];
      this.Title = "Pick the Place Inspired you";
      this.Detail = "Help us contribute to our community by sharing places you love to be in your adventures";
      this.selecttext = "Select Pictures of Your Freedom";
    } else {
      this.tag = gd.tag;
      this.Fulltag = gd.tag;
      this.SharedRow(this.tag)
      this.data['tag'] = [];
      this.Title = "What’s your Interesting";
      this.selecttext = "SELECT UP TO 5 Tags";
      this.Detail = "Help us learn more about you by sharing your interests";

      // console.log(this.tag);

    }

    serviceFactoryThread.ServiceThread('TagUser', { 'type': this.showpage }, 'POST')
      .then(data => {
        if (data['res_code'] == '00') {
          // console.log(data);
          if (this.showpage == 1 || this.showpage == 2) {
            data['res_result'].forEach(element => {
              // console.log();
              this.showselected(this.showpage, element['tag_id']);
            });
          } else {
            data['res_result'].forEach(element => {
              this.numtag++;
              this.data['tag'].push(element['tag_id']);
            });

          }
        } else {
          // console.log(data['res_text']);
        }
      });





  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad EditTagPage');
  }


  SharedRow(data) {
    var lastId = 0;;
    let i = 0;
    this.tag = [];
    this.tag[0] = [];
    this.tag[1] = [];
    this.tag[2] = [];
    this.tag[3] = [];
    for (let j = 0; j < data.length; j++) {
      this.tag[i].push(data[j]);
      if (lastId < data[j]['tag_id']) {
        lastId = data[j]['tag_id'];
        this.textId = i + '' + data[j]['tag_id'];
      }
      if (i == 3) { i = 0; } else { i++; }
    }
    setTimeout(() => {
      if (data.length != 0) {
        $('.wrapper').width($('#tag' + this.textId).width() + $('#tag' + this.textId)[0]['offsetLeft']);
        $(".outer ").scrollLeft((($('#tag' + this.textId).width() + $('#tag' + this.textId)[0]['offsetLeft']) / 2) - (($('#tag' + this.textId).width() + $('#tag' + this.textId)[0]['offsetLeft']) / 4));
      }

    }, 10);

  }

  showselected(type, id) {
    let check = false;
    if ($('#select' + type + id).css('display') == 'none') {
      if (type == 1) {
        if (this.typeNum1 < 5) {
          this.typeNum1++;
          check = true;
          this.data['feeling'].push(id);
        }
      } else {
        if (this.typeNum2 < 5) {
          this.typeNum2++;
          check = true;
          this.data['travel'].push(id);
        }
      }
    } else {
      if (type == 1) {
        this.typeNum1--;
        this.remove(this.data['feeling'], id);
      } else {
        this.typeNum2--;
        this.remove(this.data['travel'], id);
      }
      check = true;
    }
    if (check) {
      $('#select' + type + id).toggle()
      $('#select' + type + id).css('width', $('#images').width());
    }
  }

  remove(array, element) {
    const index = array.indexOf(element);
    array.splice(index, 1);
  }

  tagselect(row, id, text) {
    if ($('#tag' + row + id).hasClass("btn1_1")) {
      $('#tag' + row + id + " span").addClass("btn_de");
      $('#tag' + row + id).removeClass("btn1_1");
      $('#tag' + row + id).removeClass("bounceIn");
      this.remove(this.data['tag'], id);
      this.numtag--;
    } else {
      if (this.numtag < 5) {
        $('#tag' + row + id).addClass("btn1_1");
        $('#tag' + row + id + " span").removeClass("btn_de");
        $('#tag' + row + id).addClass("bounceIn");
        this.data['tag'].push(id);
        // this.datatag.push({'tag_id':id, 'tag_name':text});
        this.numtag++;
      }
    }
  }
  onSearchChange(searchValue: string) {
    this.tag = this.Fulltag;
    if (searchValue != '') {
      this.tag = this.tag.filter((tag) => {
        return tag['tag_name'].toString().toLowerCase().indexOf(searchValue.toString().toLowerCase()) > -1;
      });
      this.SharedRow(this.tag);
    } else {
      this.SharedRow(this.tag);
    }
    // console.log(this.data);
  }

  send() {
    // console.log(this.datatag);

    // console.log(this.data);
    this.data['type'] = this.showpage;

    if (this.showpage == 1) {
      let getfeeling = "";
      for (let i = 0; i < this.data['feeling'].length; i++) {
        if (i == 0) {
          getfeeling += this.data['feeling'][i];
        } else {
          getfeeling += ',' + this.data['feeling'][i];
        }
      }
      this.data['newfeeling'] = getfeeling;
    } else if (this.showpage == 2) {
      let gettravel = "";
      for (let i = 0; i < this.data['travel'].length; i++) {
        if (i == 0) {
          gettravel += this.data['travel'][i];
        } else {
          gettravel += ',' + this.data['travel'][i];
        }
      }
      this.data['newtravel'] = gettravel;
    } else {
      let gettag = "";
      let datatag = "";
      // console.log(this.data);

      for (let i = 0; i < this.data['tag'].length; i++) {
        if (i == 0) {
          gettag += this.data['tag'][i];
          // datatag += {tag_id: 20, tag_name: "Sports"}
        } else {
          gettag += ',' + this.data['tag'][i];
        }
      }
      this.data['newtag'] = gettag;
      this.gd.exploreTag = [];
      for (let index = 0; index < $('page-edit-tag .btn1_1').length; index++) {
        this.gd.exploreTag.push({ 'tag_id': $('page-edit-tag .btn1_1')[index].id.slice(-2), 'tag_name': $($('page-edit-tag .btn1_1')[index]).text().trim() })
      }

      // this.gd.exploreTag = gettag;
    }
    this.serviceFactoryThread.ServiceThread('Updatedata_get_tag', this.data, 'POST')
      .then(data => {
        // console.log(this.data);

        if (data['res_code'] == '00') {
          // console.log(data);
          this.gd.toast(data['res_text']);
          this.navCtrl.pop();
        } else {
          // console.log(data['res_text']);
          this.gd.toast(data['res_text']);
        }
      });
  }


  Clear(id) {

    if (id == 1 || id == 2) {
      for (let i = 0; i < $('page-edit-tag .sizeimg').length; i++) {
        // console.log(i);
        if ($($('page-edit-tag .sizeimg')[i]).css('display') == 'block') {
          $($('page-edit-tag .sizeimg')[i]).css('display', 'none');
          this.typeNum1 = 0;
          this.typeNum2 = 0;
        }
        this.data['travel'] = [];
        this.data['feeling'] = [];
      }
    } else {
      $('.btn1_1 span').addClass('btn_de');
      $('.btn1_1').removeClass("btn1_1");
      $('.btn1_1').removeClass("bounceIn");
      this.numtag = 0;
      this.data['tag'] = [];
      this.datatag = [];
    }


  }
}
