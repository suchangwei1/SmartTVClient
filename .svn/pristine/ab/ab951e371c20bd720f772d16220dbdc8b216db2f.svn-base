import { Component } from '@angular/core';
import { Platform, ToastController, IonicApp } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from '../pages/login/login';
import {AndroidPermissions} from "@ionic-native/android-permissions";
declare var screen :any;     //定义全局变量
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = LoginPage;

  constructor(private androidPermissions: AndroidPermissions, public platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public ionicApp: IonicApp, public toastCtrl: ToastController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
        success => console.log("已授权WRITE_EXTERNAL_STORAGE"),
        err => this.androidPermissions.requestPermissions(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
      );
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(
        success => console.log("已授权READ_EXTERNAL_STORAGE"),
        err => this.androidPermissions.requestPermissions(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
      );

    });

  }
}
