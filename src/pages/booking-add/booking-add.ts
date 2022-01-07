import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ServiceFactoryThread } from '../../services/ServiceFactoryThread';
import { GlobalDataService } from '../../services/globaldata.service';
import * as $ from 'jquery'

/**
 * Generated class for the BookingAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-booking-add',
  templateUrl: 'booking-add.html',
})
export class BookingAddPage {
  mlist = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  dataget: any = JSON.parse(JSON.stringify(this.navParams.get('data')));
  dateBooking: any = ['1', '2', '3', '6', '7', '8', '9', '10'];
  monthBooking: any = ['4', '5'];
  date_text: any = 'Select Date Trip';
  date_select: any = '';
  date: any = [];
  adultNum: any = '-';
  childrenNum: any = '-';
  currentEvents: any;
  choose_date: any = '';
  meetingPoint: any = '';
  Trip_cost: any = 0;
  Tax: any = 0;
  total_price: any = 0;
  totalP:any = 0;
  textMeeting:any = 'select meeting point';
  textPeple:any = "";
  meetlat:any = '';
  meetlng:any = '';
  meetaddress:any = '';
  countday:any = 1;
  stock:any = '';
  // meetingST:boolean = true;
  constructor(public serviceFactoryThread: ServiceFactoryThread, private gd: GlobalDataService, public navCtrl: NavController, public navParams: NavParams) {
    console.log(this.dataget);
    setTimeout(() => {
      if(this.dataget.tour_type == 1){
        let date = new Date(this.dataget["tour_start"]);
        let fulldate = date.getFullYear() + '-' + ('0'+(date.getMonth()+1)).slice(-2) + "-" + ('0'+(date.getDate())).slice(-2);
        let datasend = {
          "packet_id" : this.dataget["packet_id"],
          "packet_date" : fulldate
        };
        this.serviceFactoryThread.ServiceThread('check_stock',datasend,'POST').then(data => {
          if(data["res_code"] == '00'){
            let res = data["res_result"];
            this.stock = "( Balance : " + res.balance + " seat )";
          }
        })
        
        this.date_select = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        this.date_text = this.mlist[this.date_select.getMonth()] + ' ' + this.date_select.getDate() + ',' + this.date_select.getFullYear();
        this.choose_date = this.date_select;
      }
      let number;
      let start_month = new Date(this.dataget.tour_start).getMonth();
      let end_month = new Date(this.dataget.tour_end).getMonth();
      let year_start = new Date(this.dataget.tour_start).getFullYear();
      let year_end = new Date(this.dataget.tour_end).getFullYear();
      let currentdate = new Date();
      currentdate.setHours(0, 0, 0);
      currentdate.setDate(currentdate.getDate() - 1);
      for (let year_no = year_start; year_no <= year_end; year_no++) {        
        for (let index = start_month; index <= end_month; index++) {
          let days = [];
          if(this.dataget.tour_type == 0){
            for (let day = 1; day <= new Date(year_no, index, 0).getDate(); day++) {
              var date = new Date(year_no, index, day);
              if (date >= currentdate) {
                if ($.inArray(date.getDay().toString(), this.dataget["packet_recursive"]) !== -1) {
                  
                  let chkStart = new Date(this.dataget["tour_start"]);
                  let chkEnd = new Date(this.dataget["tour_end"]);
                  
                  let chkCurrent = new Date(year_no+"-"+('0'+(index+1)).slice(-2)+"-"+('0'+(day)).slice(-2));
                  chkStart.setHours(0,0,0);
                  chkEnd.setHours(0,0,0);
                  chkCurrent.setHours(0,0,0);
                  console.log(chkStart + " - " + chkEnd + " - " + chkCurrent);
                  if(chkStart <= chkCurrent && chkEnd >= chkCurrent){
                    days.push(day);
                  }
                }
              }
            }
          }else{
            days.push(new Date(this.dataget.tour_start).getDate());
          }
          
          this.date.push({
            'month': index,
            'days': days
          })
        }
      }

      
      $('.this-month').addClass('not-this-month current');
      $('.not-this-month').removeClass('this-month');

      this.bookingDate(new Date(new Date()).getMonth());
      let t = this;



    }, 500);
  }
  onChange(event){
  }
  total(type){
  }
  onDaySelect(event) {
    let fulldate = event['year'] + '-' + ('0'+(event['month']+1)).slice(-2) + "-" + ('0'+(event['date'])).slice(-2);
    let datasend = {
      "packet_id" : this.dataget["packet_id"],
      "packet_date" : fulldate
    };
    this.serviceFactoryThread.ServiceThread('check_stock',datasend,'POST').then(data => {
      if(data["res_code"] == '00'){
        let res = data["res_result"];
        this.stock = "( Balance : " + res.balance + " seat )";
      }
    })
    this.date_select = new Date(event['year'], event['month'], event['date']);
    this.date_text = this.mlist[this.date_select.getMonth()] + ' ' + this.date_select.getDate() + ',' + this.date_select.getFullYear();
    this.choose_date = this.date_select;

  }
  onMonthSelect(event) {
    setTimeout(() => {
      $('page-booking-add:last .this-month').addClass('not-this-month current');
      $('page-booking-add:last .not-this-month').removeClass('this-month');
      this.bookingDate(event['month']);
      this.choose_date = '';
    }, 100);

  }
  bookingDate(month) {    
    var mont = this.date.findIndex(x => x.month == month);
    let c = 0;
    if (mont >= 0) {      
      this.date[mont]['days'].forEach(element => {
        c++;
        $($('page-booking-add:last .current')[element - 1]).removeClass('not-this-month');
        $($('page-booking-add:last .current')[element - 1]).addClass('this-month');
      });
      this.countday = c;
    }else{
      this.countday = 0;
    }
  }

  chkhtmlfeeling() {
    if ($('page-booking-add:last #filter .tilie').length > 0) {
      return false;
    } else {
      return true;
    }
  }
  showCalendar() {
    console.log(this.date);
    let coutnday = 0;
    this.date.forEach(element => {
      coutnday += element.days.length;
    });
    if(coutnday == 0){
      this.gd.toast("Sorry,Tickets are sold out.");
    }else{
      $('page-booking-add:last #calendar-slide').slideToggle();
    }
  }
  selectDate() {
    if(this.date_select != ""){
      this.date_text = this.mlist[this.date_select.getMonth()] + ' ' + this.date_select.getDate() + ',' + this.date_select.getFullYear();
      this.choose_date = this.date_select;
      $('page-booking-add:last #calendar-slide').slideUp();
    }
  }
  cancleDate(){
    this.date_text = 'Select Date Trip';
    this.choose_date = '';
    $('page-booking-add:last #calendar-slide').slideUp();
    this.stock = '';
  }
  nextPage(){
    let count1 = 0;
    let count2 = 0;
    this.dataget.cos = this.Trip_cost;
    this.dataget.tex = this.Tax;
    this.dataget.total = this.total_price;
    this.dataget.data_select = this.date_select;
    this.dataget.adult = this.adultNum;
    this.dataget.children = this.childrenNum;
    this.dataget.choose_date = this.choose_date;
    this.dataget.totalP = this.totalP;
    this.dataget.meeting_select = this.meetingPoint;
    this.dataget.textpeple = this.textPeple;
    this.dataget.meet_lat = this.meetlat;
    this.dataget.meet_lng = this.meetlng;
    this.dataget.meet_address = this.meetaddress;
    
    if(this.dataget.choose_date == ''){
      this.gd.toast("Pless select trip date.");
    }else if(this.totalP == 0){
      this.gd.toast("Please specify the number of people.");
    }else if(this.meetingPoint == ''){
      this.gd.toast("Pless select meeting point.");
    }else{
      this.gd.nextpage(this.navCtrl,'PaymentPage',{'data' : this.dataget});
    }
  }
  NextPages(page, image) {
    if (page == 'ProfilePage') {
      let datasend = {
        "user_id": image.user[0].user_id,
        "user_type": image.user[0].user_type,
        "user_firstname": image.user[0].user_firstname,
        "user_lastname": image.user[0].user_lastname,
        "user_path_img": image.user[0].user_path_img,
        "country_name_th": image.user[0].country_name_th,
        "country_name_en": image.user[0].country_name_en,
        "user_img": image.user[0].user_path_img,
      }

      setTimeout(() => {
        this.gd.nextpage(this.navCtrl, 'ProfileStorePage', { 'data': datasend });
      }, 500);
    }
  }
  showmeeting(){
    console.log('toggle');
    
    $('page-booking-add:last .autosearchList').slideToggle();
  }
  chooseMeeting(data){
    console.log(data);
    
    this.meetingPoint = data.name_meet;
    this.textMeeting = data.name_meet;
    this.meetlat = data.meet_lat;
    this.meetlng = data.meet_lng;
    this.meetaddress = data.meet_address;
    $('page-booking-add:last .autosearchList').slideUp();
  }
  calculator_peple(type,index){
    let total = 0;
    let tex = 0;
    let cos = 0;
    let peple = 0;
    let text = '';
    let totals = 0;
    
    if(type == 'remove'){
      if(this.dataget.packet_price[index].num_of_peple > 0 ){
        this.dataget.packet_price[index].num_of_peple--;
      }
    }else{
      if(this.dataget.packet_price[index].num_of_peple >= 0 && this.totalP <= 9){
        this.dataget.packet_price[index].num_of_peple++;
      }
    }
    this.dataget.packet_price.forEach((element,i) => {
      console.log(element.price + ' * ' + element.num_of_peple + " = " +(element.price * element.num_of_peple));
      cos += (element.price * element.num_of_peple);
      total += (element.price * element.num_of_peple);
      peple += element.num_of_peple;
      if(element.num_of_peple > 0){
        text = text + element.num_of_peple.toString() + " " + element.price_name.toString() + ",";
      }
    });
    console.log(total);
    
    tex = (total*0.07);
    totals = total + tex;
    text = text.substring(0, text.length - 1);
    console.log(text);
    this.textPeple = text;
    // this.Trip_cost = Math.round(cos);
    this.Trip_cost = cos.toFixed(2);
    // this.Tax = Math.round(tex);
    this.Tax = tex.toFixed(2);
    // this.total_price =  Math.round(total);
    this.total_price = totals.toFixed(2);
    this.totalP = peple;
  }
}
