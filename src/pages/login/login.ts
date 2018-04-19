/// <reference path="../../declarations.d.ts"/>
import {Component, OnInit} from '@angular/core';
import {NavController, AlertController, Platform, LoadingController, ToastController} from 'ionic-angular';

import {StorageProvider} from "../../providers/storage-provider";
import {LoginService} from "../../providers/login.service";
import {HomePage} from "../home/home";

@Component({
  selector: 'login-page',
  templateUrl: 'login.html',
})

export class LoginPage implements OnInit {

  userName: any;
  userPassword: any;
  user:any;

  constructor(private toastCtrl: ToastController,
              private storageProvider: StorageProvider,
              private loadCtrl: LoadingController,
              private alertCtrl: AlertController,
              private platform: Platform,
              private navCtrl: NavController,
              private loginService: LoginService) {

  }

  ngOnInit(): void {
    new CalculateWindowSize();
    if (this.storageProvider.read("userName")) {
      this.userName = this.storageProvider.read("userName") + "";
      this.userPassword = this.storageProvider.read("userPassword") + "";
    }
  }

  forgotten() {
    let toast = this.toastCtrl.create({
      message: "请联系管理员：0771-5528079",
      duration: 3000,
      position: 'bottom',
      dismissOnPageChange: true
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();

  }

  //登陆
  onSubmit(): void {
    //验证登陆
    var loading = this.loadCtrl.create({
      content: '正在登陆系统...'
    });
    loading.present();
    this.loginService.login(this.userName, this.userPassword).then(data => {
      loading.dismiss();
      if (data.success) {
        this.user = data.obj;
        this.storageProvider.write("userName",this.userName);
        this.storageProvider.write("userPassword",this.userPassword);
        this.loginService.setLoginUser(this.user);
        this.navCtrl.setRoot(HomePage);
      } else {
        let alert = this.alertCtrl.create({
          title: "信息",
          message: data.msg,
          buttons: [
            {
              text: "确定",
              handler: () => {
              }
            }
          ]
        });
        alert.present();
      }
    });
  }


  //退出应用
  showConfirm() {
    let alert = this.alertCtrl.create({
      title: '提示',
      message: '是否退出应用？',
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          handler: () => {

          }
        },
        {
          text: '确定',
          handler: () => {
            this.platform.exitApp();
          }
        }
      ]
    });
    alert.present();
  }

}
