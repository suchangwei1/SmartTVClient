/// <reference path="../../declarations.d.ts"/>
import {Component, OnInit, ElementRef} from '@angular/core';
import {
  NavController, NavParams, ViewController, AlertController, LoadingController,
  ToastController
} from 'ionic-angular';
import {VideoService} from '../../providers/video.service';
import {PhotoLibrary} from "../../../node_modules/@ionic-native/photo-library/index";
import {AndroidPermissions} from "../../../node_modules/@ionic-native/android-permissions/index";

@Component({
  selector: 'videoFile-page',
  templateUrl: 'videoFile.html'
})
export class VideoFilePage implements OnInit {

  htmlEl: HTMLElement;
  data: any;
  timer: any;
  fullScreenFlag = false;
  constructor(private toastCtrl: ToastController,
              public LoadCtrl: LoadingController,
              private params: NavParams,
              private el: ElementRef,
              public alertCtrl: AlertController,
              private videoService: VideoService,
              private photoLibrary: PhotoLibrary,
              private androidPermissions: AndroidPermissions,
              private nav: NavController) {
    this.htmlEl = el.nativeElement;
  }

  ngOnInit(): void {
    new CalculateWindowSize();
    this.getVideoFileByDay();
  }

  getVideoFileByDay(){
    this.videoService.getVideoFileByDay().then(data=>{
      this.data = data.obj;
    });
  }

  back() {
    this.nav.pop();
  }

  alertVideoAsk(url) {
    let confirm = this.alertCtrl.create({
      title: '保存文件',
      message: '是否保存本次实时视频文件?',
      buttons: [
        {
          text: '取消',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: '保存',
          handler: () => {
            console.log('Agree clicked');
            //  "http://gxbhf.sirbox.cn:30258/live/2017/12/25/RNNN3PN9.flv"
            this.saveVideo(url);
          }
        }
      ]
    });
    confirm.present();
  }

  saveVideo(url) {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then((result) => {
      if (!result.hasPermission) {
        return this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE);
      } else {
        return Promise.resolve({hasPermission: true});
      }
    }).then((hasPermission) => {
      if (hasPermission) {
		  var loading = this.LoadCtrl.create({
          spinner: "dots",
          content: `正在缓存...`,
          duration: 1000
        });
        loading.present();
        this.photoLibrary.saveVideo(url, 'video').then((res) => {
          console.log(res);
			let toast = this.toastCtrl.create({
            message: "文件下载完成",
            duration: 1000,
            position: 'bottom'
          });
          toast.present();
        }).catch(e => {
          console.log(e);
          let toast = this.toastCtrl.create({
            message: "存储异常",
            duration: 1000,
            position: 'bottom'
          });
          toast.present();
        });
      }else{
        let toast = this.toastCtrl.create({
          message: "无存储权限",
          duration: 1000,
          position: 'bottom'
        });
        toast.present();
      }
    }).catch(err => {
      console.log(err);
      let toast = this.toastCtrl.create({
        message: "存储异常",
        duration: 1000,
        position: 'bottom'
      });
      toast.present();
    })
  }
}
