import { Injectable, } from '@angular/core';
import { ServiceFactoryThread } from './ServiceFactoryThread';
import { ToastController, Platform, PopoverController, ActionSheetController, App, Events, AlertController } from 'ionic-angular';
import { Location } from '@angular/common';
import * as firebase from 'Firebase';
import * as $ from 'jquery'
import 'firebase/auth';
import 'firebase/firestore';
import { Facebook } from '@ionic-native/facebook';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Clipboard } from '@ionic-native/clipboard';
import { Geolocation } from '@ionic-native/geolocation';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Push, PushOptions, PushObject } from '@ionic-native/push';
import { AnalyticsFirebase } from '@ionic-native/analytics-firebase';

declare var swal;
declare var Framework7: any;

@Injectable()

export class GlobalDataService {
    version: string = "20201020";
    update_ver: string = '26';

    BASE_URL: string = "https://myadventureearth.com/";
    showbtn: any = 0;
    userProfile: any = [];
    numLoadmore: any = 0;
    Recent: any;
    myTag: any;
    ChekNetWork: boolean = true;
    status: boolean = true;
    feelingTx: any;
    key: string;
    platformtype: string;
    bufferRatio: number;
    platformNum: any;
    statusDataInput: any;
    checkmenu3: number = 0;
    stCamera: boolean = true;
    navtab: any;
    sumNoti: any = 0;
    likeUser: any = [];
    idUserComment: any = [];
    notiAll: any = [];
    notiBase: any = 0;
    roomchat: any = [];
    countService: any = 0;
    goDetail: boolean = true;
    chatinterval: any;
    hlighligh: any;
    hlighligh_Status: any;
    feeling: any;
    posthighlight: any = [];
    Country: any;
    clickGo: boolean = true;
    travel: any;
    tag: any;
    exploreTag: any = [];
    statusChooserCamera: any = 0;
    photoAll: any = [];
    feelingNew: any;
    newFeedFeeling: any = [];
    TypeLocation: any;
    newFeedPlace: any = [];
    chooserShare: any = "";
    oldPage: any = '';
    albumAll: any = [];
    newFeedTextSearch: any = "";
    chatKeyLog: any = "";

    //show Facebook button
    isShowFacebook: boolean = false;


    constructor(private analyticsFirebase: AnalyticsFirebase, public alertCtrl: AlertController, public events: Events, private app: App, private push: Push, public iab: InAppBrowser, public geolocation: Geolocation, public actionSheetCtrl: ActionSheetController, private clipboard: Clipboard, private sharingVar: SocialSharing, public popoverCtrl: PopoverController, private fb: Facebook, private location: Location, public platform: Platform, public toastCtrl: ToastController, private SFT: ServiceFactoryThread,) {
        SFT.GCL().then(data => { console.log(data) });
        if (platform.is('ios')) {
            this.platformtype = "ios";
            this.bufferRatio = 5;
            this.platformNum = 2;
        } else {
            this.platformtype = "android";
            this.bufferRatio = 5;
            this.platformNum = 1;
        }
        setInterval(() => {
            SFT.GCL().then(data => { console.log(data) });
        }, 60000);
        this.chatinterval = setInterval(() => {
            this.chat()
        }, 300000);
        platform.ready().then(() => {
            let t = this;
            SFT.ServiceThread('check_version', { 'version': this.version, 'update': this.update_ver, 'paltform': this.platformNum }, 'POST').then(data => {
                this.isShowFacebook = (data['res_result'][0]['status_btn'] == 0)? false : true;
                if (data['res_code'] == '01') {
                    swal({
                        title: "",
                        text: "Upgrade available for application",
                        type: "warning",
                        showCancelButton: false,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Update",
                        closeOnConfirm: false,
                        closeOnCancel: false
                    },
                        function (isConfirm) {
                            try {
                                // window.open(data['res_result'][0]['url'], '_system');
                                // console.log(`url is `, data['res_result'][0]['url']);
                                t.iab.create(data['res_result'][0]['url'], '_system');
                            } catch (error) {
                                console.error(error);

                            }

                        });
                }
            });

            const options: PushOptions = {
                android: {
                    senderID: '145451048347',
                    sound: true
                },
                ios: {
                    badge: false,
                    sound: true,
                    alert: true,
                    clearBadge: true,
                    fcmSandbox: false,

                }
            };
            const pushObject: PushObject = this.push.init(options);
            let nav = this.app.getActiveNav();

            // const channel = new firebase.notifications.Android.Channel('test-channel', 'Test Channel', firebase.notifications.Android.Importance.Max)
            // .setDescription('My apps test channel');
            // firebase.notifications().android.createChannel(channel);
            console.log(platform);

            if (platform.is('cordova')) {
                console.log('cordova');

                this.push.createChannel({
                    id: "testchannel1",
                    description: "My first test channel",
                    importance: 3
                }).then(() => console.log('Channel created'));
            }

            pushObject.on('registration').subscribe((registration: any) => {
                console.log(registration);

                this.key = registration['registrationId'];
                if (this.key != undefined) {
                    this.regisNoti();
                }
                this.alertCtrl.create({
                    title: 'Logged Out',
                    message: registration['registrationId'],
                });

                console.log('Device registered', registration)
            });
            this.app.viewDidEnter.subscribe((evt) => {
                setTimeout(() => {
                    console.log('changePage');
                    if (this.oldPage != this.location.path()) {
                        this.analyticsFirebase.setCurrentScreen(this.location.path())
                            .then(() => console.log('View successfully tracked'))
                            .catch(err => console.log('Error tracking view:', err));
                        // this.googleAnalyticsService.trackPagesHandler(this.location.path());
                        this.oldPage = this.location.path();
                    }
                }, 1000);
            });

            pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));


            pushObject.on('notification').subscribe((data: any) => {
                // this.version = '555585';
                this.events.publish('logNoti', data);
                let path = this.location.path().split('/');
                console.log('---------------------------- Notification ----------------------------');
                console.log(data);
                console.log('---------------------------- Notification ----------------------------');

                if (data.additionalData['coldstart']) {
                    // alert(JSON.parse(data["additionalData"]));
                    console.log('notification coldstart', data.additionalData);
                    let dataSend
                    let typeNoti
                    if (platform.is('ios')) {
                        typeNoti = JSON.parse(data["additionalData"]['gcm.notification.moreData']).typeNoti;
                        dataSend = {
                            data: JSON.parse(data["additionalData"]['gcm.notification.moreData']),
                            key: JSON.parse(data["additionalData"]['gcm.notification.moreData']).key,
                            imguser: JSON.parse(data["additionalData"]['gcm.notification.moreData']).imguser
                        }
                        setTimeout(() => {
                            if (typeNoti == "comment") {
                                this.events.publish('notilike', JSON.parse(data["additionalData"]['gcm.notification.moreData']));
                            } else if (typeNoti == "like") {
                                this.events.publish('notilike', JSON.parse(data["additionalData"]['gcm.notification.moreData']));
                            } else if (typeNoti == "follow") {
                                this.events.publish('notifollow', JSON.parse(data["additionalData"]['gcm.notification.moreData']));
                            } else if (typeNoti == "chat") {
                                this.events.publish('chat', dataSend);
                                console.log(`%c ios chat coldstart`, `color:green`);

                            }
                        }, 5000);
                    } else {
                        typeNoti = data["additionalData"]["moreData"]['typeNoti'];
                        setTimeout(() => {
                            if (typeNoti == "comment") {
                                this.events.publish('notilike', data["additionalData"]["moreData"]);
                            } else if (typeNoti == "like") {
                                this.events.publish('notilike', data["additionalData"]["moreData"]);
                            } else if (typeNoti == 'follow') {
                                this.events.publish('notifollow', data["additionalData"]["moreData"]);
                            } else if (typeNoti == 'chat') {
                                dataSend = {
                                    data: data["additionalData"]["moreData"],
                                    key: data["additionalData"]['moreData']['key'],
                                    imguser: data["additionalData"]['data']['imguser']
                                }
                                this.events.publish('chat', dataSend);
                                console.log(`%c android chat coldstart`, `color:green`);


                            }
                        }, 5000);
                    }

                } else if (data.additionalData['foreground']) {
                    // alert(JSON.parse(data["additionalData"]['gcm.notification.data']).typeNoti);
                    console.log('notification foreground', data.additionalData);

                    this.chat().then(data => {
                        // this.sumNoti = data;
                    });
                    let t = this;
                    if (platform.is('ios')) {
                        // alert(JSON.stringify(data["title"]));
                        if (JSON.parse(data["additionalData"]['gcm.notification.moreData']).typeNoti == "comment") {
                            this.get_noti('new');
                            console.log('ios push notification data', data);
                            console.log('ios push notification message', data.message);
                            console.log('ios JSON Data', JSON.parse(data["additionalData"]['gcm.notification.moreData']));
                            let app = new Framework7();
                            var notificationCallbackOnClose = app.notification.create({
                                icon: '<i class=" iconPHY2"></i>',
                                title: 'Adventure Earth - Thailand',
                                titleRightText: 'now',
                                // text: "<b>" + data["title"] + "</b> Comment Your Post.",
                                text: "<b>" + data.message + "</b>",
                                closeOnClick: true,
                                closeTimeout: 10000,
                                on: {
                                    click: function () {
                                        t.events.publish('notilike', JSON.parse(data["additionalData"]['gcm.notification.moreData']));
                                    },
                                },
                            });
                            notificationCallbackOnClose.open();

                        } else if (JSON.parse(data["additionalData"]['gcm.notification.moreData']).typeNoti == "like") {
                            this.get_noti('new');
                            let app = new Framework7();
                            var notificationCallbackOnClose = app.notification.create({
                                icon: '<i class=" iconPHY2"></i>',
                                title: 'Adventure Earth - Thailand',
                                titleRightText: 'now',
                                text: "<b>" + data["title"] + "</b> Like Your Post.",
                                closeOnClick: true,
                                closeTimeout: 10000,
                                on: {
                                    click: function () {
                                        t.events.publish('notilike', JSON.parse(data["additionalData"]['gcm.notification.moreData']));
                                    },
                                },
                            });
                            notificationCallbackOnClose.open();
                        } else if (JSON.parse(data["additionalData"]['gcm.notification.moreData']).typeNoti == "follow") {
                            this.get_noti('new');
                            let app = new Framework7();
                            var notificationCallbackOnClose = app.notification.create({
                                icon: '<i class=" iconPHY2"></i>',
                                title: 'Adventure Earth - Thailand',
                                titleRightText: 'now',
                                text: "<b>" + data["title"] + "</b> Followers Your.",
                                closeOnClick: true,
                                closeTimeout: 10000,
                                on: {
                                    click: function () {
                                        t.events.publish('notifollow', JSON.parse(data["additionalData"]['gcm.notification.moreData']));
                                    },
                                },
                            });
                            notificationCallbackOnClose.open();
                        } else if (JSON.parse(data["additionalData"]['gcm.notification.moreData']).typeNoti == "buyPacket") {
                            this.get_noti('new');
                            let app = new Framework7();
                            var notificationCallbackOnClose = app.notification.create({
                                icon: '<i class=" iconPHY2"></i>',
                                title: 'Adventure Earth - Thailand',
                                titleRightText: 'now',
                                text: "<b>" + data["title"] + "</b> buy your tour.",
                                closeOnClick: true,
                                closeTimeout: 10000,
                                on: {
                                    click: function () {
                                        t.events.publish('notifollow', JSON.parse(data["additionalData"]['gcm.notification.moreData']));
                                    }
                                },
                            });
                            notificationCallbackOnClose.open();
                        } else if (JSON.parse(data["additionalData"]['gcm.notification.moreData']).typeNoti == "chat") {
                            let app = new Framework7();
                            var notificationCallbackOnClose = app.notification.create({
                                icon: '<i class=" iconPHY2"></i>',
                                title: 'Adventure Earth - Thailand',
                                titleRightText: 'now',
                                text: "<b>" + data["title"] + "</b> Sent you a message.",
                                closeOnClick: true,
                                closeTimeout: 10000,
                                on: {
                                    click: function () {
                                        let datasend = {
                                            data: JSON.parse(data["additionalData"]['gcm.notification.moreData']),
                                            key: JSON.parse(data["additionalData"]['gcm.notification.moreData']).key,
                                            imguser: JSON.parse(data["additionalData"]['gcm.notification.moreData']).imguser
                                        }
                                        t.events.publish('chat', datasend);
                                        console.log(`%c ios chat foreground`, `color:green`);

                                    }
                                },
                            });
                            if (path[(path.length) - 1] != 'chat' && this.chatKeyLog != JSON.parse(data["additionalData"]['gcm.notification.moreData']).key) {
                                notificationCallbackOnClose.open();
                                this.get_noti('new');
                            }
                        }
                    } else {
                        if (data["additionalData"]["moreData"]['typeNoti'] == "comment") {
                            this.get_noti('new');
                            let app = new Framework7();
                            console.log('android push notification data', data);
                            console.log('android push notification message', data.message);
                            console.log('android JSON Data', JSON.parse(data["additionalData"]['gcm.notification.moreData']));
                            var notificationCallbackOnClose = app.notification.create({
                                icon: '<i class=" iconPHY2"></i>',
                                title: 'Adventure Earth - Thailand',
                                titleRightText: 'now',
                                text: "<b>" + data.message + "</b>",
                                closeOnClick: true,
                                closeTimeout: 10000,
                                on: {
                                    click: function () {
                                        t.events.publish('notilike', data["additionalData"]["moreData"]);
                                    },
                                },
                            });
                            notificationCallbackOnClose.open();
                        } else if (data["additionalData"]["moreData"]['typeNoti'] == "like") {
                            this.get_noti('new');
                            let app = new Framework7();
                            var notificationCallbackOnClose = app.notification.create({
                                icon: '<i class=" iconPHY2"></i>',
                                title: 'Adventure Earth - Thailand',
                                titleRightText: 'now',
                                text: "<b>" + data["title"] + "</b> Like Your Post.",
                                closeOnClick: true,
                                closeTimeout: 10000,
                                on: {
                                    click: function () {
                                        t.events.publish('notilike', data["additionalData"]["moreData"]);
                                    },
                                },
                            });
                            notificationCallbackOnClose.open();
                        } else if (data["additionalData"]["moreData"]['typeNoti'] == "follow") {
                            this.get_noti('new');
                            let app = new Framework7();
                            var notificationCallbackOnClose = app.notification.create({
                                icon: '<i class=" iconPHY2"></i>',
                                title: 'Adventure Earth - Thailand',
                                titleRightText: 'now',
                                text: "<b>" + data["title"] + "</b> Followers Your.",
                                closeOnClick: true,
                                closeTimeout: 10000,
                                on: {
                                    click: function () {
                                        t.events.publish('notifollow', data["additionalData"]["moreData"]);
                                    },
                                },
                            });
                            notificationCallbackOnClose.open();
                        } else if (data["additionalData"]["moreData"]['typeNoti'] == "buyPacket") {
                            this.get_noti('new');
                            let app = new Framework7();
                            var notificationCallbackOnClose = app.notification.create({
                                icon: '<i class=" iconPHY2"></i>',
                                title: 'Adventure Earth - Thailand',
                                titleRightText: 'now',
                                text: "<b>" + data["title"] + "</b> Followers Your.",
                                closeOnClick: true,
                                closeTimeout: 10000,
                                on: {
                                    click: function () {
                                        t.events.publish('notifollow', data["additionalData"]["moreData"]);
                                    },
                                },
                            });
                            notificationCallbackOnClose.open();
                        } else if (data["additionalData"]["moreData"]['typeNoti'] == "chat") {
                            let app = new Framework7();
                            // let t = this;
                            var notificationCallbackOnClose = app.notification.create({
                                icon: '<i class=" iconPHY2"></i>',
                                title: 'Adventure Earth - Thailand',
                                titleRightText: 'now',
                                text: "<b>" + data["title"] + "</b> Sent you a message.",
                                closeOnClick: true,
                                closeTimeout: 10000,
                                on: {
                                    click: function () {
                                        let datasend = {
                                            data: data["additionalData"]["moreData"],
                                            key: data["additionalData"]['moreData']['key'],
                                            imguser: data["additionalData"]['moreData']['imguser']
                                        }
                                        t.events.publish('chat', datasend);
                                        console.log(`%c android chat foreground`, `color:green`);

                                    },
                                },
                            });
                            if (path[(path.length) - 1] != 'chat' && this.chatKeyLog != data["additionalData"]['moreData']['key']) {
                                notificationCallbackOnClose.open();
                                this.get_noti('new');
                            }
                        }
                    }
                } else {
                    console.log('notification not coldstart and foreground', data.additionalData);
                    this.chat().then(data => {
                        // this.sumNoti = data;
                    });
                    let datasend
                    let typeNoti
                    // this.get_noti('new');
                    if (platform.is('ios')) {
                        typeNoti = JSON.parse(data["additionalData"]['gcm.notification.moreData']).typeNoti;
                        datasend = {
                            data: JSON.parse(data["additionalData"]['gcm.notification.moreData']),
                            key: JSON.parse(data["additionalData"]['gcm.notification.moreData']).key,
                            imguser: JSON.parse(data["additionalData"]['gcm.notification.moreData']).imguser
                        }
                        if (typeNoti == "comment") {
                            this.events.publish('notilike', JSON.parse(data["additionalData"]['gcm.notification.moreData']));
                        } else if (typeNoti == "like") {
                            this.events.publish('notilike', JSON.parse(data["additionalData"]['gcm.notification.moreData']));
                        } else if (typeNoti == "follow") {
                            this.events.publish('notifollow', JSON.parse(data["additionalData"]['gcm.notification.moreData']));
                        } else if (typeNoti == "chat") {
                            this.events.publish('chat', datasend);
                            console.log(`%c ios chat else`, `color:green`);

                        }
                    } else {
                        typeNoti = data["additionalData"]["moreData"]['typeNoti'];
                        if (typeNoti == 'comment') {
                            this.events.publish('notilike', data["additionalData"]["moreData"]);
                        } else if (typeNoti == 'like') {
                            this.events.publish('notilike', data["additionalData"]["moreData"]);
                        } else if (typeNoti == 'follow') {
                            this.events.publish('notifollow', data["additionalData"]["moreData"]);
                        } else if (typeNoti == 'chat') {
                            datasend = {
                                data: data["additionalData"]["moreData"],
                                key: data["additionalData"]['moreData']['key'],
                                imguser: data["additionalData"]['moreData']['imguser']
                            }
                            this.events.publish('chat', datasend);
                            console.log(`%c android chat else`, `color:green`);

                        }
                    }

                }



            });
        })
        let backButtonPressedOnceToExit;
        this.platform.registerBackButtonAction((e) => {
            let nav = this.app.getActiveNav();
            let path = this.location.path().split('/');
            // // console.log(path);
            // // console.log(this.location.path().split('/tabs/tab-3'));
            if (path[(path.length) - 1] == 'chat') {
                // // console.log("chatttttttttttttt");
                $('#footer').show();
                $('.tabbar').show().css('display', 'flex');
                $('#sendmessage').css('display', 'none');
                nav.pop();
            } else if (this.location.path() == '/login') {
                if (backButtonPressedOnceToExit) {
                    this.platform.exitApp();
                } else {
                    backButtonPressedOnceToExit = true;
                    this.toast("Press back button again to exit");
                    setTimeout(function () {
                        backButtonPressedOnceToExit = false;
                    }, 2000);
                }

            } else if (this.location.path() == '/tabs/home/newsfeed' || this.location.path() == '/tabs/connect-with-traveler/traveler' || this.location.path() == '/tabs/what-to-do/bookings' || this.location.path() == '/tabs/share-your-freedom/camera') {
                // // console.log($('ion-tab[aria-hidden="false"] page-newsfeed'));

                if ($('ion-tab[aria-hidden="false"] page-newsfeed').length > 1) {
                    nav.pop();
                } else {
                    if (backButtonPressedOnceToExit) {
                        this.platform.exitApp();
                    } else {
                        backButtonPressedOnceToExit = true;
                        this.toast("Press back button again to exit");
                        setTimeout(function () {
                            backButtonPressedOnceToExit = false;
                        }, 2000);
                    }
                }
            } else if (this.location.path() == '/tabs/tab-2/camera') {
                $('ion-backdrop').click();
                // this.storage.get('tab').then((val) => {
                //   // console.log(val);
                //   nav.parent.select(Number(val));
                // });
            } else {
                nav.pop();
            }
        })
        SFT.ServiceThread('feeling', {}, 'GET')
            .then(data => {
                if (data['res_code'] == '00') {
                    this.feeling = data['res_result'];
                    // // console.log(this.feeling);
                } else {
                    // console.log(data['res_text']);
                }
            });
            SFT.ServiceThread('hlighligh', {}, 'GET')
            .then(data => {
                if (data['res_code'] == '00') {
                    this.hlighligh = data['res_result'];
                    // // console.log(this.feeling);
                } else {
                    // console.log(data['res_text']);
                }
            });
        SFT.ServiceThread('country', {}, 'GET')
            .then(data => {
                if (data['res_code'] == '00') {
                    this.Country = data['res_result'];
                } else {
                    // console.log(data['res_text']);
                    // this.toast(data['res_text'])
                }
            });
        SFT.ServiceThread('travel', {}, 'GET')
            .then(data => {
                if (data['res_code'] == '00') {
                    this.travel = data['res_result'];
                    // // console.log(this.travel);
                } else {
                    // console.log(data['res_text']);
                }
            });
        SFT.ServiceThread('tag', {}, 'GET')
            .then(data => {
                if (data['res_code'] == '00') {
                    this.tag = data['res_result'];
                    // // console.log(this.travel);
                } else {
                    // console.log(data['res_text']);
                }
            });
        SFT.ServiceThread('feelingTx', {}, 'GET')
            .then(data => {
                if (data['res_code'] == '00') {
                    this.feelingTx = data['res_result'];
                    this.feelingNew = data['res_result'];
                    this.newFeedFeeling = data['res_resultNew'];
                    this.newFeedFeeling.push({ feeling_tx_id: "All", feeling_tx_name: "All" });
                } else {
                    // console.log(data['res_text']);
                }
            });
        SFT.ServiceThread('TypeLocation', {}, 'GET')
            .then(data => {
                if (data['res_code'] == '00') {
                    this.TypeLocation = data['res_result'];
                    this.newFeedPlace = data['res_resultNew'];
                    this.newFeedPlace.push({ TypeLocation_id: 'All', TypeLocation_name: "All" });

                    // // console.log(this.TypeLocation);
                } else {
                    // console.log(data['res_text']);
                }
            });
    }

    notiShow(data) {
        let t = this;
        let app = new Framework7();
        var notificationCallbackOnClose = app.notification.create({
            icon: '<i class=" iconPHY2"></i>',
            title: 'Adventure Earth - Thailand',
            titleRightText: 'now',
            text: "<b>" + data["title"] + "</b> Sent you a message.",
            closeOnClick: true,
            closeTimeout: 10000,
            on: {
                click: function () {
                    let datasend = {
                        data: data,
                        key: data.key,
                        imguser: data.imguser
                    }
                    t.events.publish('chat', datasend);
                }
            },
        });
        // if (path[(path.length) - 1] != 'chat' && this.chatKeyLog != JSON.parse(data["additionalData"]['gcm.notification.moreData']).key) {
        notificationCallbackOnClose.open();
        // }
    }

    get_noti(type) {
        console.log(type);
        console.log(this.userProfile["user_id"]);
        if (type == "new") {
            this.notiAll = [];
            this.numLoadmore = 0;
            this.notiBase = 0;
        }
        if (this.userProfile["user_id"] != undefined) {
            let datasend = {
                'user_id': this.userProfile["user_id"],
                'widthphone': $('ng-component').width(),
                'lat': '',
                'lng': '',
                'numLoad': this.numLoadmore,
            }
            this.SFT.ServiceThread("get_noti", datasend, "POST").then(data => {
                // console.log(data);
                if (data["res_code"] == '00') {
                    this.numLoadmore++;
                    // console.log(this.notiAll);
                    data["res_result"].forEach(element => {
                        // console.log(element);
                        // console.log(this.notiAll.map((el) => el.noti_id).indexOf(element["noti_id"]));
                        if (this.notiAll.map((el) => el.noti_id).indexOf(element["noti_id"]) == -1) {
                            // console.log(element);
                            if (element["noti_read_all"] == '0') {
                                this.notiBase++;
                                console.log(this.notiBase);
                                this.sumNoti = parseInt(this.notiBase) //count notification
                            }
                            // if (type == "new") {
                            // this.notiAll.unship(element);
                            // } else {
                            this.notiAll.push(element);
                            // }
                        }
                    });
                }
            })
            // console.log(datasend);
        }
    }
    convertToDataURLviaCanvas(url, outputFormat) {
        return new Promise((resolve, reject) => {
            let img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = () => {
                let canvas = <HTMLCanvasElement>document.createElement('CANVAS'),
                    ctx = canvas.getContext('2d'),
                    dataURL;
                canvas.height = img.height;
                canvas.width = img.width;
                ctx.drawImage(img, 0, 0);
                dataURL = canvas.toDataURL(outputFormat);
                resolve(dataURL);
                canvas = null;
            };
            img.src = url;
        });
    }
    openChooserApp() {
        return new Promise((resolve, reject) => {
            let actionSheet = this.actionSheetCtrl.create({
                title: 'Choose Application',
                enableBackdropDismiss: false,
                buttons: [
                    // {
                    //     text: 'Camera',
                    //     cssClass: "setting_img",
                    //     handler: () => {
                    //         // this.takePicture();
                    //         resolve(1);
                    //     }
                    // },
                    {
                        text: 'Library',
                        cssClass: "setting_img",
                        handler: () => {
                            // this.libraryImage();
                            resolve(2);
                        }
                    },
                    {
                        text: 'Video',
                        cssClass: "setting_img",
                        handler: () => {
                            // this.libraryImage();
                            resolve(3);
                        }
                    },
                    {
                        text: 'Cancel',
                        role: 'cancel',
                        handler: () => {
                            console.log('Cancel clicked');
                            resolve(4);
                        }
                    }
                ]
            });
            actionSheet.present();
        });
    }
    nextpage(navCtrl, page, data) {
        console.log(data);
        if (this.ChekNetWork) {
            // this.gpsLocation();
            setTimeout(() => {
                if (this.status == true) {
                    navCtrl.push(page, data, { animate: true, direction: 'forward', isNavRoot: true });
                    navCtrl.swipeBackEnabled = false;
                }
            }, 10);
        } else {
            this.toast('Connection failure, please try again later');
        }
    }

    nextrootpage(navCtrl, page, data) {
        console.log(data);
        if (this.ChekNetWork) {
            // this.gpsLocation();
            setTimeout(() => {
                if (this.status == true) {
                    navCtrl.setRoot(page, data, { animate: true, direction: 'forward', isNavRoot: true });
                    navCtrl.swipeBackEnabled = true;
                }
            }, 10);

        } else {
            this.toast('Connection failure, please try again later');
        }
    }

    toast(text) {
        // // console.log(text);
        let toast = this.toastCtrl.create({
            message: text,
            duration: 3000,
            position: 'top'
        });
        toast.present()
    }
    regisLogout() {
        this.SFT.ServiceThread('userLogout', { device_uuid: this.key }, 'POST')
            .then(data => {
                if (data['res_code'] == '00') {
                    this.feelingTx = data['res_result'];
                } else {
                    // console.log(data['res_text']);
                }
            })
    }
    regisNoti() {
        console.log(this.key);
        this.SFT.ServiceThread('regisnoti', { device_uuid: this.key, device_platform: this.platformtype }, 'POST')
            .then(data => {
                if (data['res_code'] == '00') {
                    this.feelingTx = data['res_result'];
                } else {
                    // console.log(data['res_text']);
                }
            })
    }
    selectData(data) {

        this.SFT.ServiceThread('TAGExplore', { 'user_id': 78 }, 'POST')
            .then(data => {
                if (data['res_code'] == '00') {
                    this.myTag = data['res_result'];
                }
            });
        this.SFT.ServiceThread('Recent', { 'user_id': data['user_id'] }, 'POST')
            .then(data => {
                if (data['res_code'] == '00') {
                    this.Recent = data['res_result'];
                }
            });
        this.SFT.ServiceThread('follow', { 'user_id': data['user_id'] }, 'POST')
            .then(data => {
                if (data['res_code'] == '00') {
                    this.userProfile['followers'] = data['res_result'][0]['followers'];
                    this.userProfile['following'] = data['res_result'][0]['following'];
                }
            });

    }
    saveLog(activity, data) {
        // // console.log(data);
        setTimeout(() => {


            let dataFeeling;
            let page = this.location.path().split('/');

            if (activity == 'fillter') {
                console.log(data);
                data["filter"] = data["filter"].trim();


                if (data["filter"] == 'feeling') {
                    dataFeeling = {
                        'user_id': this.userProfile["user_id"],
                        'page': page[page.length - 1],
                        'activity': activity,
                        'detail': data["filter"],
                        'feelings': data["datapage_id"]
                    }
                } else if (data["filter"] == 'places') {
                    dataFeeling = {
                        'user_id': this.userProfile["user_id"],
                        'page': page[page.length - 1],
                        'activity': activity,
                        'detail': data["filter"],
                        'places': data["datapage_id"]
                    }
                } else if (data["filter"] == 'Following') {
                    dataFeeling = {
                        'user_id': this.userProfile["user_id"],
                        'page': page[page.length - 1],
                        'activity': activity,
                        'detail': data["filter"]
                    }
                } else if (data["filter"] == 'preference') {
                    dataFeeling = {
                        'user_id': this.userProfile["user_id"],
                        'page': page[page.length - 1],
                        'activity': activity,
                        'detail': data["filter"],
                        'feeling': data["datapage_id"]
                    }
                } else if (data["filter"] == 'My Current Location' || data["filter"] == 'Destination') {
                    dataFeeling = {
                        'user_id': this.userProfile["user_id"],
                        'page': page[page.length - 1],
                        'activity': activity,
                        'detail': data["filter"],
                        'location': data["datapage_id"]
                    }
                }
            } else if (activity == 'Go' || activity == 'shear') {
                dataFeeling = {
                    'user_id': this.userProfile["user_id"],
                    'page': page[page.length - 1],
                    'activity': activity,
                    'postID': data["photo_id"],
                    'caption': data["photo_caption"],
                    'places': data["TypeLocation_id"],
                    'feelings': data["feeling_id"],
                    'location': data["photo_la"] + "," + data["photo_long"],
                    'province': data["photo_province"],
                }
            } else if (activity == 'share') {
                dataFeeling = {
                    'user_id': this.userProfile["user_id"],
                    'page': data["photo_id"],
                    'user': data["user_id"],
                    'activity': activity,
                    'caption': data["photo_caption"],
                    'places': data["TypeLocation_id"],
                    'feelings': data["feeling_id"],
                    'location': data["photo_la"] + "," + data["photo_long"],
                    'province': data["photo_province"],
                    'detail': data["shareType"]
                }
            }
            this.SFT.ServiceThread('log', dataFeeling, 'POST')
                .then(data => {
                    if (data['res_code'] == '00') {
                        // // console.log(data);
                    } else {
                        // console.log(data['res_text']);
                    }
                });
        }, 1000);
    }
    startExternalMap(data) {
        console.log(data);

        if (this.platformtype == 'ios') {
            let actionSheet = this.actionSheetCtrl.create({
                buttons: [
                    {
                        text: 'Open in Google Maps',
                        cssClass: "setting_img",
                        handler: () => {
                            this.geolocation.getCurrentPosition().then((position) => {
                                // window.open('https://www.google.com/maps/?daddr=' + data.latitude + ',' + data.longitude, '_system');
                                this.iab.create('https://www.google.com/maps/?daddr=' + data.latitude + ',' + data.longitude, '_system');
                            }, (err) => {
                            });
                        }
                    }, {
                        text: 'Open in Maps',
                        cssClass: "setting_img",
                        handler: () => {
                            this.geolocation.getCurrentPosition().then((position) => {
                                this.iab.create('maps://?q=' + data.name + '&saddr=' + position.coords.latitude + ',' + position.coords.longitude + '&daddr=' + data.latitude + ',' + data.longitude, '_system');
                            }, (err) => {
                            });
                        }
                    },
                    {
                        text: 'Cancel',
                        role: 'cancel',
                        handler: () => {
                            console.log('Cancel clicked');
                        }
                    }
                ]
            });
            actionSheet.present();
        } else {
            this.geolocation.getCurrentPosition().then((position) => {
                // window.open('geo://' + position.coords.latitude + ',' + position.coords.longitude + '?q=' + data.latitude + ',' + data.longitude + '(' + data.name + ')', '_system');
                this.iab.create('geo://' + position.coords.latitude + ',' + position.coords.longitude + '?q=' + data.latitude + ',' + data.longitude + '(' + data.name + ')', '_system');
            }, (err) => {
            });
        }
    }
    chat() {
        return new Promise((resolve, reject) => {
            this.SFT.ServiceThread('messageroom', {}, 'POST').then(data => {
                this.roomchat = [];
                if (data['res_code'] == '00') {
                    this.roomchat = data['res_result'];
                    let sum = 0;
                    for (let index = 0; index < this.roomchat.length; index++) {
                        firebase.database().ref('chatrooms/' + this.roomchat[index]['room_name'] + '/chats').once('value', resp => {
                            let keyChat = snapshotToArray(resp);
                            this.roomchat[index]['message'] = keyChat;
                            keyChat = keyChat.filter(message => message.status === '0' && message.id === this.roomchat[index]['user_id']);
                            this.roomchat[index]['noread'] = keyChat.length;
                            // sum += keyChat.length;
                            if (this.roomchat.length - 1 === index) {
                                this.countService++;
                                resolve(sum);
                            }
                        });
                    }
                    console.log(this.roomchat);

                } else {
                    resolve(0);
                }
            });
        });
    }
    getFollow(UID) {
        this.SFT.ServiceThread('GetFollow', { user_id: UID }, 'POST')
            .then(data => {
                if (data['res_code'] == '00') {
                    this.userProfile["followers"] = data["res_result"]["followers"];
                    this.userProfile["following"] = data["res_result"]["following"];
                }
            });
    }
    presentPopover(myEvent, data) {
        // console.log(`data before share`,data);
        $('body').addClass('rightMenu');
        $('body').addClass('share');
        let popover = this.popoverCtrl.create('SocialsharingPage');
        popover.present({
            ev: myEvent
        });
        popover.onDidDismiss(id => {
            // // console.log(id);
            $('body').removeClass('share');
            if (id == 1) {
                this.facebookShare(data);
            } else if (id == 2) {
                this.Message(data);
            } else if (id == 3) {
                this.Twitter(data);
            } else if (id == 4) {
                this.Line(data);
            } else if (id == 5) {
                this.Email(data);
            } else if (id == 6) {
                this.MessageFB(data);
            }
            // this.facebookShare();
        })
    }
    facebookShare(data) {
        var dataT = {
            method: "feed",
            href: data['linkshared'],
            caption: "Such caption, very feed."
        }
        this.fb.showDialog(dataT).then(() => {
            // console.log("Success");
            data["shareType"] = 'facebook';
            this.saveLog('share', data);
        }).catch((err) => {
            this.toast('No results were found for Application');
            console.log(err);
        });
    }
    Message(data) {
        this.sharingVar.shareViaSMS(data['linkshared'], "").then(() => {
            // console.log("shareViaSMS: Success");
            data["shareType"] = 'Message';
            this.saveLog('share', data);
        }).catch((err) => {
            // console.log(err);
            console.error("shareViaSMS: failed");
        });
    }
    MessageFB(data) {
        // console.log('messageFB');
        if (this.platformtype == 'ios') {
            var datat = {
                method: "send",
                link: data['linkshared']
            }

            this.fb.showDialog(datat).then(() => {
                // console.log("Success");
                data["shareType"] = 'MessageFB';
                this.saveLog('share', data);
            }).catch((err) => {
                this.toast('No results were found for Application');
                // console.log(err);
            });
        } else {
            this.sharingVar.shareVia('com.facebook.orca', 'The message', null, null, data['linkshared']).then(() => {
                // console.log("Success");
                data["shareType"] = 'MessageFB';
                this.saveLog('share', data);
            }).catch((err) => {
                this.toast('No results were found for Application');
                // console.log(err);
            });
        }
    }
    Twitter(data) {
        this.sharingVar.shareViaTwitter("", "", data['linkshared']).then(() => {
            data["shareType"] = 'Twitter';
            this.saveLog('share', data);
        }).catch((err) => {
            this.toast('No results were found for Application');
            console.error("shareViaTwitter: failed");
        })

    }

    Line(data) {
        this.clipboard.copy(data['linkshared']).then(() => {
            this.toast('clipboard copy: Success');
        }).catch((err) => {
            this.toast('clipboard copy: failed');
            console.error("clipboard copy: failed");
        });
    }


    Email(data) {
        this.sharingVar.shareViaEmail(data['linkshared'], '', [], null, null, null).then(() => {
        }).catch((err) => {
        })

    }
    sendNoti(room, id, message, username, data) {
        return new Promise(resolve => {
            // console.log(data);
            this.SFT.ServiceThread('sendnoti', { user_id: data.user_id, roomID: room, member_id: id, message: message, username: username, data: JSON.stringify(data) }, 'POST')
                // this.serviceFactoryThread.ServiceThread('sendnoti', { roomID: room, member_id: id, message: message, username: username}, 'POST')
                .then(data => {
                    resolve(data['res_code']);
                    if (data['res_code'] == '00') {
                        this.feelingTx = data['res_result'];
                    } else {
                        // console.log(data['res_text']);
                    }
                });
        });
    }
    ValidateEmail(mail) {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
            return (true)
        }
        return (false)
    }
    checklength(valus, Nlength) {
        console.log(valus, Nlength);

        if (valus.length >= Nlength) {
            return true;
        }
        return (false)
    }
}
export const snapshotToArray = snapshot => {
    let returnArr = [];
    snapshot.forEach(childSnapshot => {
        let item = childSnapshot.val();
        item.key = childSnapshot.key;
        returnArr.push(item);
    });

    return returnArr;
};