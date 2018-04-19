import {Injectable} from '@angular/core';
import {Http, URLSearchParams, Headers} from '@angular/http';
import {Platform, AlertController} from 'ionic-angular';
import {AppVersion} from '@ionic-native/app-version';
import {File} from '@ionic-native/file';
import {Transfer, TransferObject} from '@ionic-native/transfer';
import {InAppBrowser} from '@ionic-native/in-app-browser';
import {VlcVersion} from '../app/app.commonSet';
import {BaseUrl} from '../app/app.commonSet'
import {LoginService} from "./login.service";

//app升级
@Injectable()
export class UpdateService {

  baseUrl = BaseUrl;
  tvVersion = '0.0.1';
  new_version: string;
  pluginversion: string;
  apk_url: string;
  vlc_apk_url: string;

  private headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded,charset=UTF-8'});

  constructor(private http: Http,
              private platform: Platform,
              private alertCtrl: AlertController,
              private transfer: Transfer,
              private appVersion: AppVersion,
              private file: File,
              private inAppBrowser: InAppBrowser,
              private loginService:LoginService) {
  }

  /**
   * 升级客户端 app
   */
  detectionUpgrade(versionInfo) {
    //这里连接后台获取app最新版本号,然后与当前app版本号(this.getVersionNumber())对比
    //版本号不一样就升级,不需要升级就return
    console.log(versionInfo);
    this.new_version = versionInfo.appversion;
    this.apk_url = versionInfo.appurl;
    this.getVersionNumber().then(v => {
      console.log(this.new_version + "--" + v + this.apk_url);
      if (this.new_version == v) {
        this.alertCtrl.create({
          title: '提示',
          subTitle: '当前已是最新版!',
          buttons: [{text: '确定'}]
        }).present();
        return;
      }

      this.alertCtrl.create({
        title: '升级',
        subTitle: '发现新版本,是否立即升级？',
        buttons: [{text: '取消'},
          {
            text: '确定',
            handler: () => {
              //检测vlc播放器是否需要升级
              this.updateVlcApp(versionInfo);
              //升级客户端
              this.downloadApp();
            }
          }
        ]
      }).present();

    });
  }


  /**
   * 下载安装 客户端 app
   */
  downloadApp() {
    if (this.isAndroid()) {
      let myalert = this.alertCtrl.create({
        title: '客户端下载进度：0%',
        enableBackdropDismiss: false,
        buttons: ['后台下载']
      });
      myalert.present();
      const fileTransfer: TransferObject = this.transfer.create();
      // externalRootDirectory
      // externalApplicationStorageDirectory
      const apk = this.file.externalApplicationStorageDirectory + 'SmartTVClient.apk'; //apk保存的目录
      console.log(fileTransfer + "," + apk + "");
      fileTransfer.download(this.apk_url, apk).then(() => {
        console.log("进来了");
        window['install'].install(apk.replace('file://', ''));
      });
      fileTransfer.onProgress((event: ProgressEvent) => {

        let num = Math.floor(event.loaded / event.total * 100);

        if (num === 100) {
          myalert.dismiss();
        } else {
          let title = document.getElementsByClassName('alert-title')[0];
          title && (title.innerHTML = '客户端下载进度：' + num + '%');
        }
      });
    }
  }

  /**
   * 升级vlc app
   */
  updateVlcApp(versionInfo) {
    //版本号不一样就升级,不需要升级就return
    console.log(versionInfo);
    this.pluginversion = versionInfo.pluginversion;
    this.vlc_apk_url = versionInfo.pluginurl;
    if (this.pluginversion == VlcVersion || !versionInfo.pluginstatus) {
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
  }

  /**
   * 下载安装 vlc app
   */
  downloadAVlcApp() {
    if (this.isAndroid()) {
      // let myalert = this.alertCtrl.create({
      //   title: '插件下载进度：0%',
      //   enableBackdropDismiss: false,
      //   buttons: ['后台下载']
      // });
      // myalert.present();
      const fileTransfer: TransferObject = this.transfer.create();
      const apk = this.file.externalApplicationStorageDirectory + 'vlc.apk'; //apk保存的目录
      console.log(fileTransfer + "," + apk + "");
      fileTransfer.download(this.vlc_apk_url, apk).then(() => {
        window['install'].install(apk.replace('file://', ''));
      });
      fileTransfer.onProgress((event: ProgressEvent) => {
        // let num = Math.floor(event.loaded / event.total * 100);
        // if (num === 100) {
        //   myalert.dismiss();
        // } else {
        //   let title = document.getElementsByClassName('alert-title')[0];
        //   title && (title.innerHTML = '插件下载进度：' + num + '%');
        // }
      });
    }
  }

  /**
   * 通过浏览器打开url
   */
  openUrlByBrowser(url: string): void {
    this.inAppBrowser.create(url, '_system');
  }

  /**
   * 是否真机环境
   * @return {boolean}
   */
  isMobile(): boolean {
    return this.platform.is('mobile') && !this.platform.is('mobileweb');
  }

  /**
   * 是否android真机环境
   * @return {boolean}
   */
  isAndroid(): boolean {
    return this.isMobile() && this.platform.is('android');
  }

  /**
   * 是否ios真机环境
   * @return {boolean}
   */
  isIos(): boolean {
    return this.isMobile() && (this.platform.is('ios') || this.platform.is('ipad') || this.platform.is('iphone'));
  }

  /**
   * 获得app版本号,如0.01
   * @description  对应/config.xml中version的值
   * @returns {Promise<string>}
   */
  getVersionNumber(): Promise<string> {
    return new Promise((resolve) => {
      this.appVersion.getVersionNumber().then((value: string) => {
        resolve(value);
      }).catch(err => {
        console.log('getVersionNumber:' + err);
      });
    });
  }

  //获取最新版本号
  getNewVersionNumber(): any {
    let params = new URLSearchParams();
    let token = this.loginService.getLoginUser().token;
    params.set('token', token);
    params.set('type', "TV");
    return this.http.post(this.baseUrl + '/smart/checkVersionByType', {headers: this.headers}, {params: params}).toPromise().then(response => response.json()).catch(this.handleError);
  }

  //异常处理
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only   error.message || error
    return Promise.reject(error.message || error);
  }
}
