import { Component, getDebugNode } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { GlobalDataService } from '../../services/globaldata.service';
import { ServiceFactoryThread } from '../../services/ServiceFactoryThread';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';
import { AppAvailability } from '@ionic-native/app-availability';
import { PopoverController } from 'ionic-angular';
import { MenuRightComponent } from '../../components/menu-right/menu-right';
import * as $ from 'jquery'
/**
 * Generated class for the PaymentNewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var QRCode: any;
declare let Omise: any;
@IonicPage()
@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
  animations: [
    trigger(
      'myAnimation',
      [
        transition(':enter',
          [style({ height: '0px', opacity: 0 }),
          animate('200ms', style({ height: '*', 'opacity': 1 }))]),

        transition(':leave',
          [style({ height: '*', 'opacity': 1 }),
          animate('200ms', style({ height: '0px', 'opacity': 0 }))])
      ]), trigger(
        'AnimationWidth',
        [
          transition(':enter',
            [style({ opacity: 0 }),
            animate('200ms', style({ 'opacity': 1 }))]),

          transition(':leave',
            [style({ 'opacity': 1 }),
            animate('200ms', style({ 'opacity': 0 }))])
        ])
  ]
})
export class PaymentPage {
  accident: any = '';
  meetingSelect: any = ''
  countryName: any = '';
  chooseCountry: boolean = false;
  GuestArray: any = [];
  textGuest: any = '';
  timeTour: any = '';
  count: any = 0;
  Trip_cost: any = 0;
  Tax: any = 0;
  total_price: any = 0;
  totalP: any = 0;
  order_id: any = '';
  agreeST: boolean = false;
  rememberCard: boolean = false;
  // cvvCode: any = '123';
  // dateEXP: any = '11/2020';
  // nameCard: any = 'Omise Team';
  // typeCard: any = '';
  // cardNumber: any = '4111111111111111';
  hotelname: any = '';
  cvvCode: any = '';
  dateEXP: any = '';
  nameCard: any = '';
  typeCard: any = '';
  cardNumber: any = '';
  firstName: any = '';
  lastName: any = '';
  email: any = '';
  phoneCode: any = '';
  mobileNumber: any = '';
  countryST: boolean = false;
  paymentSegment: any = '1';
  sendMessageST: boolean = false;
  additionST: boolean = false;
  pepleArray: any = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  meetingLocation: any = [];
  meetingST: boolean = false;
  mainSegment: any = "1";
  dateTrip: any = '';
  guest: any = [];
  guserArray: any = [];
  guestSend: any = [];
  //ตัวแปร ปฏิทิน
  showCalendar: boolean = false;
  mlist = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  date: any = [];
  countday: any = 1;
  // dataget: any = { time: [{ date: "2019-10-21 00:00:00", qly: 20, balance: 20 }, { date: "2019-10-22 00:00:00", qly: 20, balance: 20 }, { date: "2019-10-23 00:00:00", qly: 20, balance: 20 }, { date: "2019-11-21 00:00:00", qly: 20, balance: 20 }, { date: "2020-11-21 00:00:00", qly: 20, balance: 20 },] }
  dataget: any = JSON.parse(JSON.stringify(this.navParams.get('data')));
  date_select: any = '';
  // ตัวแปร ปรฏิทิน

  countries: any = [];
  phones: any = [];
  stockText: any = "";
  stock: any = "";



  constructor(public modalCtrl: ModalController, public popoverCtrl: PopoverController, public appAvailability: AppAvailability, public appBrowser: InAppBrowser, public serviceFactoryThread: ServiceFactoryThread, private gd: GlobalDataService, public navCtrl: NavController, public navParams: NavParams) {
    console.log(this.dataget);
    // paymentSegment
    if(this.dataget.type_pay.length < 2){
      this.paymentSegment = this.dataget.type_pay[0].type;
    }

    this.timeTour = this.dataget.timeable[0].timeable_time + ' - ' + this.dataget.timeable[this.dataget.timeable.length - 1].timeable_time;

    let countries = { "BD": "Bangladesh", "BE": "Belgium", "BF": "Burkina Faso", "BG": "Bulgaria", "BA": "Bosnia and Herzegovina", "BB": "Barbados", "WF": "Wallis and Futuna", "BL": "Saint Barthelemy", "BM": "Bermuda", "BN": "Brunei", "BO": "Bolivia", "BH": "Bahrain", "BI": "Burundi", "BJ": "Benin", "BT": "Bhutan", "JM": "Jamaica", "BV": "Bouvet Island", "BW": "Botswana", "WS": "Samoa", "BQ": "Bonaire, Saint Eustatius and Saba ", "BR": "Brazil", "BS": "Bahamas", "JE": "Jersey", "BY": "Belarus", "BZ": "Belize", "RU": "Russia", "RW": "Rwanda", "RS": "Serbia", "TL": "East Timor", "RE": "Reunion", "TM": "Turkmenistan", "TJ": "Tajikistan", "RO": "Romania", "TK": "Tokelau", "GW": "Guinea-Bissau", "GU": "Guam", "GT": "Guatemala", "GS": "South Georgia and the South Sandwich Islands", "GR": "Greece", "GQ": "Equatorial Guinea", "GP": "Guadeloupe", "JP": "Japan", "GY": "Guyana", "GG": "Guernsey", "GF": "French Guiana", "GE": "Georgia", "GD": "Grenada", "GB": "United Kingdom", "GA": "Gabon", "SV": "El Salvador", "GN": "Guinea", "GM": "Gambia", "GL": "Greenland", "GI": "Gibraltar", "GH": "Ghana", "OM": "Oman", "TN": "Tunisia", "JO": "Jordan", "HR": "Croatia", "HT": "Haiti", "HU": "Hungary", "HK": "Hong Kong", "HN": "Honduras", "HM": "Heard Island and McDonald Islands", "VE": "Venezuela", "PR": "Puerto Rico", "PS": "Palestinian Territory", "PW": "Palau", "PT": "Portugal", "SJ": "Svalbard and Jan Mayen", "PY": "Paraguay", "IQ": "Iraq", "PA": "Panama", "PF": "French Polynesia", "PG": "Papua New Guinea", "PE": "Peru", "PK": "Pakistan", "PH": "Philippines", "PN": "Pitcairn", "PL": "Poland", "PM": "Saint Pierre and Miquelon", "ZM": "Zambia", "EH": "Western Sahara", "EE": "Estonia", "EG": "Egypt", "ZA": "South Africa", "EC": "Ecuador", "IT": "Italy", "VN": "Vietnam", "SB": "Solomon Islands", "ET": "Ethiopia", "SO": "Somalia", "ZW": "Zimbabwe", "SA": "Saudi Arabia", "ES": "Spain", "ER": "Eritrea", "ME": "Montenegro", "MD": "Moldova", "MG": "Madagascar", "MF": "Saint Martin", "MA": "Morocco", "MC": "Monaco", "UZ": "Uzbekistan", "MM": "Myanmar", "ML": "Mali", "MO": "Macao", "MN": "Mongolia", "MH": "Marshall Islands", "MK": "Macedonia", "MU": "Mauritius", "MT": "Malta", "MW": "Malawi", "MV": "Maldives", "MQ": "Martinique", "MP": "Northern Mariana Islands", "MS": "Montserrat", "MR": "Mauritania", "IM": "Isle of Man", "UG": "Uganda", "TZ": "Tanzania", "MY": "Malaysia", "MX": "Mexico", "IL": "Israel", "FR": "France", "IO": "British Indian Ocean Territory", "SH": "Saint Helena", "FI": "Finland", "FJ": "Fiji", "FK": "Falkland Islands", "FM": "Micronesia", "FO": "Faroe Islands", "NI": "Nicaragua", "NL": "Netherlands", "NO": "Norway", "NA": "Namibia", "VU": "Vanuatu", "NC": "New Caledonia", "NE": "Niger", "NF": "Norfolk Island", "NG": "Nigeria", "NZ": "New Zealand", "NP": "Nepal", "NR": "Nauru", "NU": "Niue", "CK": "Cook Islands", "XK": "Kosovo", "CI": "Ivory Coast", "CH": "Switzerland", "CO": "Colombia", "CN": "China", "CM": "Cameroon", "CL": "Chile", "CC": "Cocos Islands", "CA": "Canada", "CG": "Republic of the Congo", "CF": "Central African Republic", "CD": "Democratic Republic of the Congo", "CZ": "Czech Republic", "CY": "Cyprus", "CX": "Christmas Island", "CR": "Costa Rica", "CW": "Curacao", "CV": "Cape Verde", "CU": "Cuba", "SZ": "Swaziland", "SY": "Syria", "SX": "Sint Maarten", "KG": "Kyrgyzstan", "KE": "Kenya", "SS": "South Sudan", "SR": "Suriname", "KI": "Kiribati", "KH": "Cambodia", "KN": "Saint Kitts and Nevis", "KM": "Comoros", "ST": "Sao Tome and Principe", "SK": "Slovakia", "KR": "South Korea", "SI": "Slovenia", "KP": "North Korea", "KW": "Kuwait", "SN": "Senegal", "SM": "San Marino", "SL": "Sierra Leone", "SC": "Seychelles", "KZ": "Kazakhstan", "KY": "Cayman Islands", "SG": "Singapore", "SE": "Sweden", "SD": "Sudan", "DO": "Dominican Republic", "DM": "Dominica", "DJ": "Djibouti", "DK": "Denmark", "VG": "British Virgin Islands", "DE": "Germany", "YE": "Yemen", "DZ": "Algeria", "US": "United States", "UY": "Uruguay", "YT": "Mayotte", "UM": "United States Minor Outlying Islands", "LB": "Lebanon", "LC": "Saint Lucia", "LA": "Laos", "TV": "Tuvalu", "TW": "Taiwan", "TT": "Trinidad and Tobago", "TR": "Turkey", "LK": "Sri Lanka", "LI": "Liechtenstein", "LV": "Latvia", "TO": "Tonga", "LT": "Lithuania", "LU": "Luxembourg", "LR": "Liberia", "LS": "Lesotho", "TH": "Thailand", "TF": "French Southern Territories", "TG": "Togo", "TD": "Chad", "TC": "Turks and Caicos Islands", "LY": "Libya", "VA": "Vatican", "VC": "Saint Vincent and the Grenadines", "AE": "United Arab Emirates", "AD": "Andorra", "AG": "Antigua and Barbuda", "AF": "Afghanistan", "AI": "Anguilla", "VI": "U.S. Virgin Islands", "IS": "Iceland", "IR": "Iran", "AM": "Armenia", "AL": "Albania", "AO": "Angola", "AQ": "Antarctica", "AS": "American Samoa", "AR": "Argentina", "AU": "Australia", "AT": "Austria", "AW": "Aruba", "IN": "India", "AX": "Aland Islands", "AZ": "Azerbaijan", "IE": "Ireland", "ID": "Indonesia", "UA": "Ukraine", "QA": "Qatar", "MZ": "Mozambique" };
    var phones = { "1": "UM", "7": "KZ", "20": "EG", "27": "ZA", "30": "GR", "31": "NL", "32": "BE", "33": "FR", "34": "ES", "36": "HU", "39": "IT", "40": "RO", "41": "CH", "43": "AT", "44": "GB", "45": "DK", "46": "SE", "47": "NO", "48": "PL", "49": "DE", "51": "PE", "52": "MX", "53": "CU", "54": "AR", "55": "BR", "56": "CL", "57": "CO", "58": "VE", "60": "MY", "61": "AU", "62": "ID", "63": "PH", "64": "NZ", "65": "SG", "66": "TH", "81": "JP", "82": "KR", "84": "VN", "86": "CN", "90": "TR", "91": "IN", "92": "PK", "93": "AF", "94": "LK", "95": "MM", "98": "IR", "211": "SS", "212": "MA", "213": "DZ", "216": "TN", "218": "LY", "220": "GM", "221": "SN", "222": "MR", "223": "ML", "224": "GN", "225": "CI", "226": "BF", "227": "NE", "228": "TG", "229": "BJ", "230": "MU", "231": "LR", "232": "SL", "233": "GH", "234": "NG", "235": "TD", "236": "CF", "237": "CM", "238": "CV", "239": "ST", "240": "GQ", "241": "GA", "242": "CG", "243": "CD", "244": "AO", "245": "GW", "246": "IO", "248": "SC", "249": "SD", "250": "RW", "251": "ET", "252": "SO", "253": "DJ", "254": "KE", "255": "TZ", "256": "UG", "257": "BI", "258": "MZ", "260": "ZM", "261": "MG", "262": "YT", "263": "ZW", "264": "NA", "265": "MW", "266": "LS", "267": "BW", "268": "SZ", "269": "KM", "290": "SH", "291": "ER", "297": "AW", "298": "FO", "299": "GL", "350": "GI", "351": "PT", "352": "LU", "353": "IE", "354": "IS", "355": "AL", "356": "MT", "357": "CY", "358": "FI", "359": "BG", "370": "LT", "371": "LV", "372": "EE", "373": "MD", "374": "AM", "375": "BY", "376": "AD", "377": "MC", "378": "SM", "379": "VA", "380": "UA", "381": "RS", "382": "ME", "385": "HR", "386": "SI", "387": "BA", "389": "MK", "420": "CZ", "421": "SK", "423": "LI", "500": "FK", "501": "BZ", "502": "GT", "503": "SV", "504": "HN", "505": "NI", "506": "CR", "507": "PA", "508": "PM", "509": "HT", "590": "MF", "591": "BO", "592": "GY", "593": "EC", "594": "GF", "595": "PY", "596": "MQ", "597": "SR", "598": "UY", "599": "SX", "670": "TL", "672": "NF", "673": "BN", "674": "NR", "675": "PG", "676": "TO", "677": "SB", "678": "VU", "679": "FJ", "680": "PW", "681": "WF", "682": "CK", "683": "NU", "685": "WS", "686": "KI", "687": "NC", "688": "TV", "689": "PF", "690": "TK", "691": "FM", "692": "MH", "850": "KP", "852": "HK", "853": "MO", "855": "KH", "856": "LA", "870": "PN", "880": "BD", "886": "TW", "960": "MV", "961": "LB", "962": "JO", "963": "SY", "964": "IQ", "965": "KW", "966": "SA", "967": "YE", "968": "OM", "970": "PS", "971": "AE", "972": "IL", "973": "BH", "974": "QA", "975": "BT", "976": "MN", "977": "NP", "992": "TJ", "993": "TM", "994": "AZ", "995": "GE", "996": "KG", "998": "UZ", "1246": "BB", "1441": "BM", "1876": "JM", "": "AQ", "1242": "BS", "441534": "JE", "1671": "GU", "441481": "GG", "1473": "GD", "1829": "DO", "1787": "PR", "1939": "PR", "1670": "MP", "1664": "MS", "441624": "IM", "1869": "KN", "1345": "KY", "1809": "DO", "1767": "DM", "1284": "VG", "1758": "LC", "1868": "TT", "1649": "TC", "1784": "VC", "1268": "AG", "1264": "AI", "1340": "VI", "1684": "AS", "35818": "AX" }
    for (var property1 in phones) {
      this.phones.push({
        key: phones[property1],
        code: property1,
      })
    }

    setTimeout(() => {
      for (var property1 in countries) {
        let PhoneCode = '';
        if (this.phones.filter(el => el.key == property1).length > 0) {
          PhoneCode = this.phones.filter(el => el.key == property1)[0].code;
        }
        this.countries.push({
          shotCountry: property1,
          fullCountry: countries[property1],
          phoneCode: PhoneCode
        })
      }
      this.countries.sort(function (a, b) {
        if (a.fullCountry < b.fullCountry) { return -1; }
        if (a.fullCountry > b.fullCountry) { return 1; }
        return 0;
      })
    }, 1000);

    // let array = [];
    // console.log(this.dataget["time"]);
    // console.log(this.dataget["time"][0]['date']);
    // console.log(this.dataget["time"][0]['date'].split(' ')[0]);
    let date = new Date(this.dataget["time"][0]['date'].replace(' ', 'T'));
    this.date_select = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    let currentDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    console.log(date, this.date_select, currentDate);

    this.dataget["time"].forEach(element => {
      let newDate = new Date(element['date'].replace(' ', 'T'));
      // console.log(newDate);
      if (newDate >= currentDate) {
        // console.log("newDate >= currentDate");
        // console.log(this.date.map((el) => el.years).indexOf(newDate.getFullYear()));
        if (this.date.map((el) => el.years).indexOf(newDate.getFullYear()) != '-1') {
          let years = this.date.filter(el => el.years == newDate.getFullYear())[0].month;
          // console.log(years);

          if (years.filter(el => el.month == newDate.getMonth()).length != 0) {
            years.filter(el => el.month == newDate.getMonth())[0].days.push(newDate.getDate());
          } else {
            this.date.filter(el => el.years == newDate.getFullYear())[0]['month'].push({ month: newDate.getMonth(), days: [newDate.getDate()] })
          }
        } else {
          // console.log('else');
          this.date.push({
            years: newDate.getFullYear(),
            month: [{
              month: newDate.getMonth(),
              days: [newDate.getDate()]
            }]
          })
        }

      }
    });
    // setTimeout(() => {
      // console.log(this.date);
      // console.log(this.date[0].month.month);
    // }, 200);

  }

  goProfile(image) {
    this.gd.nextpage(this.navCtrl, 'ProfilePage', { 'data': image })
  }
  presentPopover(myEvent) {
    $(".share").removeClass('share');
    $("body").addClass('rightMenu');
    let popover = this.popoverCtrl.create(MenuRightComponent, { navCtrl: this.navCtrl });
    popover.present({
      ev: myEvent
    });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentNewPage');
    // this.paymentCard();
  }

  test() {
    console.log('test');
    console.log(this.meetingSelect);
  }

  getType() {
    this.typeCard = this.GetCardType();
    const self = this;
    let chIbn = this.cardNumber.split(' ').join('');
    if (chIbn.length > 0) {
      chIbn = chIbn.match(new RegExp('.{1,4}', 'g')).join(' ');
    }
    this.cardNumber = chIbn;
  }
  GetCardType() {
    // var number = $('page-payment:last #card-number').val().toString();
    var number = this.cardNumber.toString();
    // visa
    var re = new RegExp("^4");
    if (number.match(re) != null)
      return "Visa";

    re = new RegExp("^5[1-5]");
    if (number.match(re) != null)
      return "MasterCard";

    // JCB
    re = new RegExp("^35(2[89]|[3-8][0-9])");
    if (number.match(re) != null)
      return "JCB";

    return "";
  }

  onDaySelect(event) {
    $('page-payment:last .this-month').removeClass('select');
    let fulldate = event['year'] + '-' + ('0' + (event['month'] + 1)).slice(-2) + "-" + ('0' + (event['date'])).slice(-2);
    // console.log(fulldate);
    let datasend = {
      "packet_id": this.dataget.packet_id,
      "packet_date": fulldate
    };
    this.serviceFactoryThread.ServiceThread('check_stock', datasend, 'POST').then(data => {
      if (data["res_code"] == '00') {
        let res = data["res_result"];
        if (this.dataget.tour_private == 1 && (res.balance != res.qly)) {
          this.gd.toast("Cannot select the desired date because another customer has already booked");
          this.stockText = "";
          this.stock = "";
          this.date_select = "";
          this.dateTrip = "";
        } else {
          this.stockText = "( Balance : " + res.balance + " seat )";
          this.stock = res.balance;
          this.date_select = new Date(event['year'], event['month'], event['date']);
          this.dateTrip = this.mlist[this.date_select.getMonth()] + ' ' + this.date_select.getDate() + ',' + this.date_select.getFullYear();
          this.close();
        }
      } else {
        this.close();
      }
    })

    // this.choose_date = this.date_select;
  }
  onMonthSelect(event) {
    setTimeout(() => {
      $('page-payment:last .this-month').addClass('not-this-month current');
      $('page-payment:last .not-this-month').removeClass('this-month select');
      this.bookingDate(event['month'], event['year']);
    }, 100);
  }
  bookingDate(month, year) {
    // console.log(month, year);
    // console.log(this.date);

    let nowYear = this.date.filter(el => el.years == year);
    console.log(nowYear);
    if (nowYear.length > 0) {
      let nowMonth = nowYear[0].month.filter(el => el.month == month);
      // console.log(nowMonth);
      if (nowMonth.length > 0) {
        // console.log('month > 1');
        nowMonth[0]['days'].forEach(element => {
          // console.log(element);

          if (new Date(year + '-' + (nowMonth[0].month + 1) + '-' + element) > new Date()) {
            $($('page-payment:last .current')[element - 1]).removeClass('not-this-month select');
            $($('page-payment:last .current')[element - 1]).addClass('this-month');
            let timeCheck = this.mlist[month] + ' ' + element + ',' + year
            if (this.dateTrip == timeCheck) {
              $($('page-payment:last .current')[element - 1]).addClass('select');
            }
          }
        });
      }
    }
  }
  swiftCalendar(type) {
    this.showCalendar = !type;
    let currentdate = new Date();
    setTimeout(() => {
      $('page-payment:last .this-month').addClass('not-this-month current');
      $('page-payment:last .not-this-month').removeClass('this-month select');
      this.bookingDate(currentdate.getMonth(), currentdate.getFullYear());
    }, 100);
  }
  openSelect(data) {
    if (this.dateTrip != '') {
      if (!data.price_st) {
        this.close();
      }
      data.price_st = !data.price_st;
    } else {
      this.gd.toast("Please select a date to book.");
    }
  }
  selectPeple(data, num) {
    // console.log(this.dataget.package_price);
    let total = 0;
    let tex = 0;
    let cos = 0;
    let peple = 0;
    let totals = 0;
    if (this.stock >= num) {
      data.num_of_peple = num;
      this.dataget.package_price.forEach((element, i) => {
        cos += (element.price * element.num_of_peple);
        total += (element.price * element.num_of_peple);
        peple += element.num_of_peple;
      });
    }
    // console.log(this.stock, peple, num);

    if (this.stock >= peple && this.stock >= num) {
      this.close();
      this.total_price = 0;
      this.totalP = 0;
      this.textGuest = "";
      this.GuestArray = [];
      this.Tax = 0;

      if (peple < this.dataget.tour_less && this.dataget.tour_private == 1) {
        cos += this.dataget.tour_extra_price;
        total += this.dataget.tour_extra_price;
      }
      this.dataget.package_price.forEach((element, index) => {
        // price_name: "เด็ก", price: 250, num_of_peple:
        if (this.GuestArray.length == 0) {
          this.guestSend = element.price_name + ' ' + element.num_of_peple;
        } else {
          this.guestSend = this.guestSend + ', ' + element.price_name + ' ' + element.num_of_peple;
        }
        if (element.num_of_peple > 0) {
          if (this.GuestArray.map((el) => el.name).indexOf(element.price_name) == -1) {
            if (this.GuestArray.length == 0) {
              this.textGuest = element.price_name + ' ' + element.num_of_peple;
            } else {
              this.textGuest = this.textGuest + ', ' + element.price_name + ' ' + element.num_of_peple;
            }
            this.GuestArray.push(
              {
                name: element.price_name,
                text: 'THB ' + element.price + ' X ' + element.num_of_peple + ' ' + element.price_name,
                price: 'THB ' + (element.price * element.num_of_peple)
              }
            )
          } else {
            this.GuestArray.filter(el => el.name == element.price_name)[0].text = 'THB ' + element.price + ' X ' + element.num_of_peple + ' ' + element.price_name;
            this.GuestArray.filter(el => el.name == element.price_name)[0].price = 'THB ' + (element.price * element.num_of_peple);
          }
        }
      });
      if (this.meetingLocation.meet_tyep == 3) {
        cos += this.meetingLocation.meet_price;
        total += this.meetingLocation.meet_price;
      }
      if(this.dataget.accident.accident_chooser == true){
        cos += this.dataget.accident.accident_price;
        total += this.dataget.accident.accident_price;
      }
      if (this.textGuest != "") {
        tex = (total * 0.07);
        totals = total + tex;
        this.Trip_cost = cos.toFixed(2);
        this.Tax = tex.toFixed(2);
        this.total_price = totals.toFixed(2);
        this.totalP = peple;
      }
    } else {
      this.gd.toast("Sorry, there aren't enough seats.")
    }
    // console.log(this.guestSend);
  }
  openMeeting() {
    if (!this.meetingST) {
      this.close();
    }
    this.meetingST = !this.meetingST;
  }
  selectMeeting(data) {
    // console.log(data);
    // console.log(this.Trip_cost);
    // console.log(this.Tax);
    // console.log(this.total_price);
    if (data.meet_tyep == 3 && this.meetingLocation.id_meet != data.id_meet) {
      this.Trip_cost = parseInt(this.Trip_cost) + parseInt(data.meet_price);
      this.Tax = parseInt(this.Trip_cost) * 0.07;
      this.total_price = this.Trip_cost + this.Tax;
    } else if (data.meet_tyep != 3 && this.meetingLocation.id_meet != data.id_meet && this.meetingLocation.length != 0) {
      if (this.meetingLocation.meet_price >= 0) {
        this.Trip_cost = this.Trip_cost - this.meetingLocation.meet_price;
        this.Tax = parseInt(this.Trip_cost) * 0.07;
        this.total_price = this.Trip_cost + this.Tax;
      }
    }
    this.Trip_cost = parseInt(this.Trip_cost).toFixed(2);
    this.Tax = parseInt(this.Tax).toFixed(2);
    this.total_price = parseInt(this.total_price).toFixed(2);
    this.meetingLocation = data;
    // console.log(this.meetingLocation);

    this.close();
  }
  openCountry() {
    if (!this.countryST) {
      this.close();
    }
    this.countryST = !this.countryST;
  }
  selectCountry(data) {
    // console.log(data);
    this.phoneCode = '+' + data.phoneCode;
    this.close();
  }
  chooserCountry() {
    if (!this.chooseCountry) {
      this.close();
    }
    this.chooseCountry = !this.chooseCountry;
  }
  ChoosersCountry(data) {
    this.countryName = data.fullCountry
    this.close();
  }
  close() {
    this.meetingST = false;
    this.countryST = false;
    this.chooseCountry = false;
    this.showCalendar = false;
    this.dataget.package_price.forEach(element => {
      element.price_st = false;
    });
  }
  BookingPayment(type) {
    let totalGuest = 0;
    this.dataget.package_price.forEach(element => {
      totalGuest += parseInt(element.num_of_peple);
    });
    // console.log(this.dataget.packet_condition, this.additionST);

    // if ((this.dataget.packet_condition != '' && this.additionST) || (this.dataget.packet_condition == '')) {
    // console.log(this.dateTrip, totalGuest, this.meetingLocation.id_meet);
    if (this.dateTrip != '' && totalGuest > 0 && this.meetingLocation.id_meet != undefined) {
      if (this.hotelname == "" && this.meetingLocation.meet_tyep == '4') {
        this.gd.toast("Please enter hotel name.");
      } else {
        if (type == "2") {
          this.mainSegment = type;
        } else if (type == "3") {
          this.send_payment();
        }
      }

    } else {
      this.gd.toast("Please complete all information.");
    }
    // } else {
    //   this.gd.toast("Please accept additional services");
    // }
  }
  updateAccident(data){
    console.log(data);
    if(data.accident_chooser == true){
      this.Trip_cost = parseInt(this.Trip_cost) + parseInt(data.accident_price);
      this.Tax = parseInt(this.Trip_cost) * 0.07;
      this.total_price = this.Trip_cost + this.Tax;
    }else{
      this.Trip_cost = this.Trip_cost - data.accident_price;
      this.Tax = parseInt(this.Trip_cost) * 0.07;
      this.total_price = this.Trip_cost + this.Tax;
    }
    this.Trip_cost = parseInt(this.Trip_cost).toFixed(2);
    this.Tax = parseInt(this.Tax).toFixed(2);
    this.total_price = parseInt(this.total_price).toFixed(2);
  }
  send_payment() {

    if (this.firstName == '' && this.lastName == '') {
      this.gd.toast('Please enter first name and last name');
    } else if (this.email == '') {
      this.gd.toast('Please enter your email');
    } else if (this.phoneCode == '') {
      this.gd.toast('Please select international calling code');
    } else if (this.mobileNumber == '') {
      this.gd.toast('Please enter your phone number');
    } else if (this.countryName == '') {
      this.gd.toast('Please enter your country');
    } else if (this.agreeST == false) {
      this.gd.toast('Please accept the terms');
    } else if (this.paymentSegment == '1' && this.cardNumber == '') {
      this.gd.toast('Please enter your cardNumber');
    } else if (this.paymentSegment == '1' && this.nameCard == '') {
      this.gd.toast('Please enter your nameCard');
    } else if (this.paymentSegment == '1' && this.dateEXP == '') {
      this.gd.toast('Please enter your dateEXP');
    } else if (this.paymentSegment == '1' && this.cvvCode == '') {
      this.gd.toast('Please enter your cvvCode');
    } else if (this.paymentSegment == '1' && this.cvvCode.split(' ').join('').length < 3) {
      this.gd.toast('Please enter your cvvCode min 3');
    } else if (this.paymentSegment == '1' && this.cardNumber.split(' ').join('').length < 16) {
      this.gd.toast('Please enter your cardNumber min 16');
    } else {
      let type_pay = '';
      if (this.paymentSegment == '1') {
        type_pay = '1';
      } else {
        type_pay = '2';
      }
      let datasend = {
        // "user_id": this.gd.userProfile.user_id,
        "user_id": this.gd.userProfile.user_id,
        "packet_id": this.dataget.packet_id,
        "packet_qly": this.totalP,
        "packet_peple": this.textGuest,
        "packet_total_price": this.total_price,
        "packet_cos_priec": this.Trip_cost,
        "packet_tax_priec": this.Tax,
        "packet_date_select": this.dateTrip,
        "fullname": this.firstName + ' ' + this.lastName,
        "email": this.email,
        "type_tel": this.phoneCode,
        "tel": this.phoneCode + this.mobileNumber,
        "country": this.countryName,
        "type_pament": type_pay,
        "hotelName": this.hotelname,
        "id_meet": this.meetingLocation.id_meet,
        "accident_chooser": '',
      }
      if (this.dataget.accident != '') {
        let st = '1';
        if (this.dataget.accident.accident_chooser == true) {
          st = '0';
        }
        datasend.accident_chooser = st;
      }
      // console.log(datasend);
      if (this.order_id == '') {
        this.serviceFactoryThread.ServiceThread('payment', datasend, 'POST').then(data => {
          if (data["res_code"] == '00') {
            this.order_id = data["res_result"]["orderID"];
            this.get_payment();
          } else if (data["res_code"] == '01') {
            this.gd.toast('Sorry, tickets sold out temporarily.');
          }
        });
      } else {
        this.get_payment();
      }
    }
  }
  get_payment() {
    if (this.paymentSegment == '1') {
      this.paymentCard();
    } else {
      this.getlinkpaypal();
    }
  }
  getlinkpaypal() {
    let datasend = {
      'detail': this.dataget.packet_name,
      'qty': '1',
      'order_no': this.order_id,
      "price": this.total_price
    }
    // console.log(datasend);
    this.serviceFactoryThread.ServiceThread('get_paypal', datasend, 'POST').then(data => {
      // console.log(data["res_result"]);
      if (data["res_result"]["status"] == 0) {
        if (data["res_result"]['url'] != null) {

          // this.loaddingS.dismiss();
          let pathapp = data["res_result"]["url"].toString();
          const browser = this.appBrowser.create(pathapp, '_blank', 'location=yes,enableViewportScale=yes');
          browser.on('loadstop').subscribe(event => {
            // console.log(event);
            browser.insertCSS({ code: "body{color: red;" });
            if (event.url.includes("update_payment")) {
              browser.close();
            }
          });
          browser.on('exit').subscribe(event => {
            // console.log(event);
            this.checkPayment();
          }, err => {
            // console.error(err);
          });
        } else if (this.count < 5) {
          this.count++;
          this.getlinkpaypal();
        } else {
          // this.loaddingS.dismiss();
          this.gd.toast("server error, try again");
        }
      } else {
        // this.loaddingS.dismiss();
        // this.navCtrl.popToRoot();
        // this.gd.nextpage(this.navCtrl, 'MyticketPage', { 'data': 'status' });
      }
    });
  }
  paymentCard() {
    let t = this;
    let date = this.dateEXP.split("-");
    let card = {
      "name": this.nameCard,
      "number": this.cardNumber.split(' ').join(''),
      "expiration_month": date[1],
      "expiration_year": date[0],
      "security_code": this.cvvCode
    };
    // console.log(card);
    this.serviceFactoryThread.ServiceThread('Create_Token',card,'POST').then(data => {
      if(data["res_code"] == "00"){
        let app;
        let pathapp;
        pathapp = "https://myadventureearth.com/api/omise/services/checkout.php?omiseToken=" +
        data["res_text"] + "&order_id=" + this.order_id + "&Time=" + new Date() + "&user_id=" + this.gd.userProfile.user_id + "&price=" + this.total_price + "&platform=app";
        const browser = t.appBrowser.create(pathapp, '_blank', 'location=yes,enableViewportScale=yes');
        browser.on('loadstop').subscribe(event => {
          // console.log(event);
          browser.insertCSS({ code: "body{color: red;" });
          if (event.url.includes("payment_status")) {
            setTimeout(() => {
              browser.close();
            }, 1000);
          }
        });
        browser.on('exit').subscribe(event => {
          console.log(event);
          t.checkPayment();
        }, err => {
          console.error(err);
        });
        
      }else{
        this.gd.toast(data["res_text"])
      }
      
    })
    // Omise.createToken("card", card, function (statusCode, response) {
    //   // console.log(statusCode, response.id, response);
    //   if (response.object != "error") {
    //     // setTimeout(() => {
    //     //   t.checkPayment();
    //     // }, 30000);
    //     let app;
    //     let pathapp;
    //     pathapp = "https://adventureearth.co/api/omise/services/checkout.php?omiseToken=" +
    //       response.id + "&order_id=" + t.order_id + "&Time=" + new Date() + "&user_id=" + this.gd.userProfile.user_id + "&price=" + t.total_price + "&platform=app";
    //     // t.appBrowser.create(pathapp, '_system');
    //     // t.appAvailability.check(app)
    //     //   .then(
    //     //     (yes: boolean) => { console.log(app + ' is available'); this.appBrowser.create('AdventureEarth://', '_system', 'location=no'); },
    //     //     (no: boolean) => { console.log(app + ' is NOT available'); this.appBrowser.create(pathapp, '_system'); }
    //     //   );
    //     const browser = t.appBrowser.create(pathapp, '_blank', 'location=yes,enableViewportScale=yes');
    //     browser.on('loadstop').subscribe(event => {
    //       // console.log(event);
    //       browser.insertCSS({ code: "body{color: red;" });
    //       if (event.url.includes("payment_status")) {
    //         setTimeout(() => {
    //           browser.close();
    //         }, 1000);
    //       }
    //     });
    //     browser.on('exit').subscribe(event => {
    //       console.log(event);
    //       t.checkPayment();
    //     }, err => {
    //       console.error(err);
    //     });
    //   } else {
    //     t.gd.toast("" + response.message);
    //   }
    // });

  }
  checkPayment() {
    this.serviceFactoryThread.ServiceThread('check_payment_st', { order_id: this.order_id }, "POST").then(data => {
      // console.log(data);
      if (data["res_code"] == "00") {
        if (data["res_result"] == "1") {
          this.gd.toast('Payment completed');
          this.mainSegment = 3;
          setTimeout(() => {
            new QRCode(document.getElementById("qrcodeFrames"), this.order_id);
          }, 200);
        } else if (data["res_result"] == "2") {
          this.gd.toast('Payment failed Please try again');
        } else if (data["res_result"] == "0") {
          this.gd.toast("You haven't payment Please try again");
        }
      }
    })
  }
  imageTo() {
    let data = JSON.parse(JSON.stringify(this.dataget));
    data.booking_code_order = this.order_id;
    data.Booking_Guest = this.textGuest;
    // console.log(data, this.meetingLocation);

    let modalbirthday = this.modalCtrl.create('SaveImagePage', { data: data, meeting: this.meetingLocation });
    modalbirthday.onDidDismiss(data => {
      // console.log(data);
    });
    modalbirthday.present();

  }
}
