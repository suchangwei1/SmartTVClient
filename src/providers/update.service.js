"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var app_commonSet_1 = require("../app/app.commonSet");
var app_commonSet_2 = require("../app/app.commonSet");
//app升级
var UpdateService = (function () {
    function UpdateService(http, platform, alertCtrl, transfer, appVersion, file, inAppBrowser) {
        this.http = http;
        this.platform = platform;
        this.alertCtrl = alertCtrl;
        this.transfer = transfer;
        this.appVersion = appVersion;
        this.file = file;
        this.inAppBrowser = inAppBrowser;
        this.baseUrl = app_commonSet_2.BaseUrl;
        this.tvVersion = '0.0.1';
        this.headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded,charset=UTF-8' });
    }
    /**
     * 升级客户端 app
     */
    UpdateService.prototype.detectionUpgrade = function (versionInfo) {
        var _this = this;
        //这里连接后台获取app最新版本号,然后与当前app版本号(this.getVersionNumber())对比
        //版本号不一样就升级,不需要升级就return
        console.log(versionInfo);
        this.new_version = versionInfo.appversion;
        this.apk_url = versionInfo.appurl;
        this.getVersionNumber().then(function (v) {
            console.log(_this.new_version + "--" + v + _this.apk_url);
            if (_this.new_version == v) {
                _this.alertCtrl.create({
                    title: '提示',
                    subTitle: '当前已是最新版!',
                    buttons: [{ text: '确定' }]
                }).present();
                return;
            }
            _this.alertCtrl.create({
                title: '升级',
                subTitle: '发现新版本,是否立即升级？',
                buttons: [{ text: '取消' },
                    {
                        text: '确定',
                        handler: function () {
                            //检测vlc播放器是否需要升级
                            _this.updateVlcApp(versionInfo);
                            //升级客户端
                            _this.downloadApp();
                        }
                    }
                ]
            }).present();
        });
    };
    /**
     * 下载安装 客户端 app
     */
    UpdateService.prototype.downloadApp = function () {
        if (this.isAndroid()) {
            var myalert_1 = this.alertCtrl.create({
                title: '客户端下载进度：0%',
                enableBackdropDismiss: false,
                buttons: ['后台下载']
            });
            myalert_1.present();
            var fileTransfer = this.transfer.create();
            // externalRootDirectory
            // externalApplicationStorageDirectory
            var apk_1 = this.file.externalApplicationStorageDirectory + 'SmartTVClient.apk'; //apk保存的目录
            console.log(fileTransfer + "," + apk_1 + "");
            fileTransfer.download(this.apk_url, apk_1).then(function () {
                console.log("进来了");
                window['install'].install(apk_1.replace('file://', ''));
            });
            fileTransfer.onProgress(function (event) {
                var num = Math.floor(event.loaded / event.total * 100);
                if (num === 100) {
                    myalert_1.dismiss();
                }
                else {
                    var title = document.getElementsByClassName('alert-title')[0];
                    title && (title.innerHTML = '客户端下载进度：' + num + '%');
                }
            });
        }
    };
    /**
     * 升级vlc app
     */
    UpdateService.prototype.updateVlcApp = function (versionInfo) {
        //版本号不一样就升级,不需要升级就return
        console.log(versionInfo);
        this.pluginversion = versionInfo.pluginversion;
        this.vlc_apk_url = versionInfo.pluginurl;
        if (this.pluginversion == app_commonSet_1.VlcVersion || !versionInfo.pluginstatus) {
            // this.alertCtrl.create({
            //   title: '提示',
            //   subTitle: '当前插件已是最新版!',
            //   buttons: [{text: '确定'}]
            // }).present();
            return;
        }
        //this.alertCtrl.create({
        // title: '升级插件',
        // subTitle: '发现新版本插件,是否立即升级？',
        // buttons: [{text: '取消'},
        //   {
        //     text: '确定',
        //     handler: () => {
        //       this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
        //         success =>  this.downloadAVlcApp(),
        //         err => this.androidPermissions.requestPermissions(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
        //       );
        //       }
        //     }
        //   ]
        // }).present();
        this.downloadAVlcApp();
    };
    /**
     * 下载安装 vlc app
     */
    UpdateService.prototype.downloadAVlcApp = function () {
        if (this.isAndroid()) {
            // let myalert = this.alertCtrl.create({
            //   title: '插件下载进度：0%',
            //   enableBackdropDismiss: false,
            //   buttons: ['后台下载']
            // });
            // myalert.present();
            var fileTransfer = this.transfer.create();
            var apk_2 = this.file.externalApplicationStorageDirectory + 'vlc.apk'; //apk保存的目录
            console.log(fileTransfer + "," + apk_2 + "");
            fileTransfer.download(this.vlc_apk_url, apk_2).then(function () {
                window['install'].install(apk_2.replace('file://', ''));
            });
            fileTransfer.onProgress(function (event) {
                // let num = Math.floor(event.loaded / event.total * 100);
                // if (num === 100) {
                //   myalert.dismiss();
                // } else {
                //   let title = document.getElementsByClassName('alert-title')[0];
                //   title && (title.innerHTML = '插件下载进度：' + num + '%');
                // }
            });
        }
    };
    /**
     * 通过浏览器打开url
     */
    UpdateService.prototype.openUrlByBrowser = function (url) {
        this.inAppBrowser.create(url, '_system');
    };
    /**
     * 是否真机环境
     * @return {boolean}
     */
    UpdateService.prototype.isMobile = function () {
        return this.platform.is('mobile') && !this.platform.is('mobileweb');
    };
    /**
     * 是否android真机环境
     * @return {boolean}
     */
    UpdateService.prototype.isAndroid = function () {
        return this.isMobile() && this.platform.is('android');
    };
    /**
     * 是否ios真机环境
     * @return {boolean}
     */
    UpdateService.prototype.isIos = function () {
        return this.isMobile() && (this.platform.is('ios') || this.platform.is('ipad') || this.platform.is('iphone'));
    };
    /**
     * 获得app版本号,如0.01
     * @description  对应/config.xml中version的值
     * @returns {Promise<string>}
     */
    UpdateService.prototype.getVersionNumber = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.appVersion.getVersionNumber().then(function (value) {
                resolve(value);
            }).catch(function (err) {
                console.log('getVersionNumber:' + err);
            });
        });
    };
    //获取最新版本号
    UpdateService.prototype.getNewVersionNumber = function () {
        var params = new http_1.URLSearchParams();
        params.set('token', app_commonSet_2.TOKEN);
        return this.http.post(this.baseUrl + '/smart/checkVersion', { headers: this.headers }, { params: params }).toPromise().then(function (response) { return response.json(); }).catch(this.handleError);
    };
    //异常处理
    UpdateService.prototype.handleError = function (error) {
        console.error('An error occurred', error); // for demo purposes only   error.message || error
        return Promise.reject(error.message || error);
    };
    return UpdateService;
}());
UpdateService = __decorate([
    core_1.Injectable()
], UpdateService);
exports.UpdateService = UpdateService;
