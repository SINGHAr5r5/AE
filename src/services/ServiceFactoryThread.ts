import { Injectable, } from '@angular/core';
import { LoadingController, Platform, AlertController } from 'ionic-angular';
import { HttpParams } from '@angular/common/http';
import { ServiceHttp } from './ServiceHttp';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Geolocation } from '@ionic-native/geolocation';
import { Storage } from '@ionic/storage';
import { LocationAccuracy } from '@ionic-native/location-accuracy';


@Injectable()

export class ServiceFactoryThread {
    loadder: any;
    count: any = 0;
    status: boolean = true;
    stLoad: boolean = true;
    user_api_key: string = '';
    chkcount: any = 0;
    STLogin: boolean = false;
    LoadMoreLimit: any = 20;
    // userlocation: any = { 'lat': '13.908251799999999', 'long': '100.5566265' };
    statusLoad:boolean = true;
    userlocation: any = { 'lat': '', 'long': '' };

    constructor(private storage: Storage, private alertCtrl: AlertController, private diagnostic: Diagnostic, public geolocation: Geolocation, public sh: ServiceHttp, public loadingCtrl: LoadingController, public platform: Platform, ) {
        this.loadder = this.loadingCtrl.create({
            spinner: 'hide',
            content: `
            <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
              `,
        });
    }

    Chk_Open_GPS() {
        return new Promise((resolve, reject) => {
            if (this.platform.is('cordova')) {
                this.diagnostic.isLocationEnabled().then(data => {
                    if (data == false) {
                        let alert = this.alertCtrl.create({
                            title: 'Your location can not be determined.',
                            message: "Please turn on GPS.",
                            buttons: [
                                {
                                    text: 'OK',
                                    role: 'OK',
                                    handler: () => {
                                        this.chkcount = 0;
                                    }
                                }
                            ]
                        });
                        if (this.chkcount == 0) {
                            alert.present();
                            this.chkcount = 1;
                        }
                    }
                    this.status = data;
                    resolve(data);
                });
            }
            resolve(true);
        });
    }

    // Get_Current_Location
    GCL() {
        console.log('Get_Current_Location');
        return new Promise(resolve => {
            this.Chk_Open_GPS().then(data => {
                if (data == true) {
                    console.log('test-*-*-');
                    
                    this.geolocation.getCurrentPosition().then((position) => {
                        console.log(position);
                        
                        let dataSend = {
                            'lat': position["coords"]["latitude"],
                            'long': position["coords"]["longitude"]
                        };
                        this.userlocation = dataSend;
                        // this.userlocation = { 'lat': '', 'long': '' };
                        // if (this.STLogin) {
                            this.ServiceThread('savelocation', dataSend, 'POST').then(data => { });
                        // }
                        resolve(position);
                    }, (err) => {
                       console.error(err);                                         
                    });
                }
            })
        });
    }
    loading_present(url) {
        console.log(url);
        
        if (this.count == 0 && this.statusLoad) {
            this.loading_dismiss();
            this.loadder = this.loadingCtrl.create({
                spinner: 'hide',
                content: `<div class="lds-ring"><div></div><div></div><div></div><div></div></div>`,
            });
            this.loadder.present();
            this.statusLoad = false;
            // this.loading_dismiss();
        }
        this.count++;
        console.log(url + ' loading_present -> ' + this.count);
    }
    loading_dismiss() {
        let interval = setInterval(() => {
            if (this.count == 0) {
                try {
                    this.loadder.dismissAll();
                    this.statusLoad = true;
                } catch (error) {
                    console.log(error);
                }
                clearInterval(interval);
            }
        }, 1000);
    }
    Check_Count(url) {
        console.log(url + 'count -> ' + this.count);
        
        if (this.count > 0) {
            this.count--;
        } else {
            this.count = 0;
        }
    }

    ServiceThread(url, request, method) {
        this.sh.user_api_key = this.user_api_key;
        if (url != 'addroom' && url != 'GetFollow' && url != 'deleteComment' && url != 'saveComment' && url != 'sendnoti' && url != 'Datafeed' && url != 'like' && url != 'bookmark' && url != 'Chack_following' && url != 'photo_me' && url != 'followme' && url != 'same' && url != 'indefollowing') {
            this.Chk_Open_GPS();
        }
        if (this.status == true || url == 'get_booking' || url == 'nearLocation' || url == 'photos_google' || url == 'check_room' || url == 'addroom' || url == 'GetFollow' || url == 'sendnoti' || url == 'Datafeed' || url == 'like' || url == 'bookmark' || url == 'Chack_following' || url == 'photo_me' || url == 'followme' || url == 'same' || url == 'indefollowing') {
            if (url != 'countCoconut' && url != 'updatePhotoResize' && url != 'get_noti' && url != 'hideStatus' && url != 'get_packet' && url != 'get_booking' && url != "deleteComment" && url != "saveComment" && url != "imgComment" && url != "check_version" && url != "country" && url != "feeling" && url != "TypeLocation" && url != "feelingTx" && url != "travel" 
            && url != "tag" && url != "checkEmail" && url != "aroundmap" && url != "Tourist" && url != "Attractions" && url != "Datafeed" && url != 'ChkEmail' && url != 'log' && url != 'messageroom' && url != 'indefollowing' && url != 'photos_google' && url != 'nameLocation' && url != 'savelocation' && url != 'getAuto' && url != 'Same' && url != 'sendnoti' 
            && url != "Delectmessageroom" && url != 'photo_me' && url != 'like' && url != 'bookmark' && url != 'Chack_following' && url != 'get_album_photo') {
                this.loading_present(url);
            }
            if (url == 'Tourist' && this.stLoad == true || url == 'Attractions' && this.stLoad == true || url == "Datafeed" && this.stLoad == true) {
                this.loading_present(url);
            }
            // this.count++;
            if (method == 'GET') {
                return new Promise(resolve => {
                    this.sh.request(url, {}, { loading: false }, method).subscribe(response => {
                        setTimeout(() => {
                            if (url != 'get_noti' && url != 'hideStatus' && url != 'get_packet' && url != 'get_booking' && url != "deleteComment" && url != "saveComment" && url != "imgComment" && url != "check_version" && url != "country" && url != "feeling" && url != "TypeLocation" && url != "feelingTx" && url != "travel" && url != "tag" && url != "checkEmail" && url != "aroundmap" && url != "Tourist" && url != "Attractions" && url != "Datafeed" && url != 'ChkEmail' && url != 'log' && url != 'messageroom' && url != 'indefollowing' && url != 'photos_google' && url != 'nameLocation' && url != 'savelocation' && url != 'getAuto' && url != 'Same' && url != 'savelocation' && url != 'sendnoti' && url != "Delectmessageroom" && url != 'photo_me' && url != 'like' && url != 'bookmark' && url != 'Chack_following') {
                                this.Check_Count(url);
                                console.log(url);
                                
                            }
                            if (url == 'Tourist' && this.stLoad == true || url == 'Attractions' && this.stLoad == true || url == "Datafeed" && this.stLoad == true) {
                                this.Check_Count(url);
                                console.log(url);
                                this.stLoad = false;
                            }
                            // this.Check_Count();
                        }, 500);
                        resolve(response);
                    });
                });
            } else {
                let Params = new HttpParams({
                    fromObject: request
                });

                return new Promise((resolve, reject) => {
                    this.sh.request(url, request, { loading: false }, method).subscribe(response => {
                        resolve(response);
                        setTimeout(() => {
                            // console.log(url, url != 'get_noti' && url != 'hideStatus' && url != 'get_packet' && url != 'get_booking' && url != "deleteComment" && url != "saveComment" && url != "imgComment" && url != "check_version" && url != "country" && url != "feeling" && url != "TypeLocation" && url != "feelingTx" && url != "travel" && url != "tag" && url != "checkEmail" && url != "aroundmap" && url != "Tourist" && url != "Attractions" && url != "Datafeed" && url != 'ChkEmail' && url != 'log' && url != 'messageroom' && url != 'indefollowing' && url != 'photos_google' && url != 'nameLocation' && url != 'savelocation' && url != 'getAuto' && url != 'Same' && url != 'savelocation' && url != 'sendnoti' && url != "Delectmessageroom" && url != 'photo_me' && url != 'like' && url != 'bookmark' && url != 'Chack_following');
                            
                            if (url != 'updatePhotoResize' && url != 'get_noti' && url != 'hideStatus' && url != 'get_packet' && url != 'get_booking' && url != "deleteComment" && url != "saveComment" && url != "imgComment" && url != "check_version" && url != "country" && url != "feeling" && url != "TypeLocation" && url != "feelingTx" && url != "travel" && url != "tag" && url != "checkEmail" && url != "aroundmap" && url != "Tourist" && url != "Attractions" && url != "Datafeed" && url != 'ChkEmail' && url != 'log' && url != 'messageroom' && url != 'indefollowing' && url != 'photos_google' && url != 'nameLocation' && url != 'savelocation' && url != 'getAuto' && url != 'Same' && url != 'savelocation' && url != 'sendnoti' && url != "Delectmessageroom" && url != 'photo_me' && url != 'like' && url != 'bookmark' && url != 'Chack_following') {
                                this.Check_Count(url);
                            }
                            if (url == 'Tourist' && this.stLoad == true || url == 'Attractions' && this.stLoad == true || url == "Datafeed" && this.stLoad == true) {
                                this.Check_Count(url);
                                this.stLoad = false;
                            }
                        }, 500);
                    });
                });
            }
        }
    }
}