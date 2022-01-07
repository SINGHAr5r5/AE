import { Component,NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Platform } from 'ionic-angular';
import { ServiceFactoryThread } from '../../services/ServiceFactoryThread';
import { Geolocation } from '@ionic-native/geolocation';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { GlobalDataService } from '../../services/globaldata.service';
import * as $ from 'jquery'
/**
 * Generated class for the ModelPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var getmap: any;

@IonicPage()
@Component({
  selector: 'page-model',
  templateUrl: 'model.html',
})
export class ModelPage {
  items: Array<string>;
  aroundmap:any;
  search:string = '';
  MyLocation:any;

  constructor(private gd: GlobalDataService,public platform: Platform,public navParams: NavParams,private locationAccuracy: LocationAccuracy,public viewCtrl: ViewController, public geolocation: Geolocation,public serviceFactoryThread: ServiceFactoryThread,private zone: NgZone) {
    

    // geolocation.getCurrentPosition().then((position) => {
    //   // console.log(position['coords']['latitude']);
    //   // console.log(position['coords']['longitude']);
    //   // console.log('---------------------------------');

   
    // }, (err) => {
    //   // console.log(err);
    //   // console.log("position");
    // });
    console.log(this.navParams.get('Latitude'));
    console.log(this.navParams.get('Longitude'));
    // console.log('*******');
    
    
    if (this.navParams.get('Latitude')!="" && this.navParams.get('Longitude')!="" && this.navParams.get('Latitude') && this.navParams.get('Longitude') ) {
              let data = {
                'latitude': this.navParams.get('Latitude') ,
                'longitude': this.navParams.get('Longitude')
              }
              console.log('if');
              
              this.serviceFactoryThread.ServiceThread('aroundmap', data, 'POST')
              .then(data => {
                if (data['res_code'] == '00') {
                  // console.log(data['res_result']);
                  this.aroundmap = data['res_result'];
                } else {
                  // console.log(data['res_text']);
                }
              });
              this.MyLocation = {  'place_location': {  'lat' :this.navParams.get('Latitude'),'lng': this.navParams.get('Longitude') },
                  'place_name': 'Current Location'
              }
    }else{
      console.log('else');
      
        if (this.platform.is('cordova')) {
          this.locationAccuracy.canRequest().then((canRequest: boolean) => {
            if(canRequest) {
              this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
                () => this.fnaroundmap(),
                error => console.log('Error requesting location permissions', error)
              );
            }else{
              this.fnaroundmap();
            }
          });
        }else{
              this.fnaroundmap();
        }
    }
  
    // this.fnaroundmap();




//  if (serviceFactoryThread.chkMap == 0) {
//   serviceFactoryThread.chkMap = 1;
  setTimeout(() => {
    getmap(serviceFactoryThread.userlocation);
    $('#pac-input').on('keydown', function(e) {
      if (e.which == 13) {
          e.preventDefault();
      }
    });
    $('#pac-input').change(function(t) {
      console.log("22");
      console.log(t);
      
      setTimeout(() => {
        try {
        let str =$('#latlong')[0]['value'];
        console.log(str);
        
        let val = str.split("/");
        let data ={};
        data['place_name']=val[0];
        data['place_location']={};
        data['place_location']['lat']=val[1];
        data['place_location']['lng']=val[2];
        viewCtrl.dismiss(data);
        } catch (error) {
          
        }
      }, 500);
  })
  }, 500);

//  }
      


 
  }

  fnaroundmap(){
      // if (this.gd.stGPS) {
          let data = {
            'latitude': this.serviceFactoryThread.userlocation['lat'],
            'longitude': this.serviceFactoryThread.userlocation['long']
          }
    
          this.serviceFactoryThread.ServiceThread('aroundmap', data, 'POST')
          .then(data => {
            if (data['res_code'] == '00') {
              // console.log(data['res_result']);
              this.aroundmap = data['res_result'];
            } else {
              // console.log(data['res_text']);
            }
          });
          this.MyLocation = {  'place_location': {  'lat' :this.serviceFactoryThread.userlocation['lat'],'lng': this.serviceFactoryThread.userlocation['long'] },
          'place_name': 'Current Location'
          }
      // }
    // this.serviceFactoryThread.Getlocation().then(position => {
    //   if (position) {
    //       // console.log(position);
    //       let data = {
    //         'latitude': position['coords']['latitude'],
    //         'longitude': position['coords']['longitude']
    //       }
    
    //       this.serviceFactoryThread.ServiceThread('aroundmap', data, 'POST')
    //       .then(data => {
    //         if (data['res_code'] == '00') {
    //           // console.log(data['res_result']);
    //           this.aroundmap = data['res_result'];
    //         } else {
    //           // console.log(data['res_text']);
    //         }
    //       });
    //       this.MyLocation = {  'place_location': {  'lat' :position['coords']['latitude'],'lng': position['coords']['longitude'] },
    //       'place_name': 'My Location'
    //       }
    //   }
    // });
  }

  ngOnInit() {
    this.setItems();
  }

  setItems() {
    this.items = ['Orange', 'Banana', 'Pear', 'Tomato', 'Grape', 'Apple', 'Cherries', 'Cranberries', 'Raspberries', 'Strawberries', 'Watermelon'];
  }

  filterItems(ev: any) {
    
    this.setItems();
    let val = ev.target.value;
    // console.log(val);
    
    if (val && val.trim() !== '') {
      this.items = this.items.filter(function (item) {
        return item.toLowerCase().includes(val.toLowerCase());
      });
    }
  }

  onKey() { // without type info
    // $('.search').keypress(function(e){
    //     if (e.which == 13) {
    //       e.preventDefault();
    //     }
    // });
    this.search = $('.search').val()+'';

    if($('.search').val()==""){
      $('.pac-container').css('display', 'none !important');
    }else{
      $('.pac-container').css('display', 'inherit !important');
    }
  }

  

  select(data,i){
        // console.log(data);
        data['index'] = i;
        this.viewCtrl.dismiss(data);
        console.log(data);
        

  }

  dismiss() {
    this.viewCtrl.dismiss({'place_name':''});
  }

}
