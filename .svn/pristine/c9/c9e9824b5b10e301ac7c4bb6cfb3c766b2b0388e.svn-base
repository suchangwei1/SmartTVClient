/// <reference path="../../declarations.d.ts"/>
import {Component, OnInit} from '@angular/core';
import {NavController, NavParams, LoadingController,ToastController} from 'ionic-angular';
import {ReportService} from '../../providers/report.service';
import {BaseUrl} from '../../app/app.commonSet';
import {AndroidPermissions} from "@ionic-native/android-permissions";
import {PhotoLibrary} from "@ionic-native/photo-library";

//信息上报详细页
@Component({
  selector: 'reportView-page',
  templateUrl: 'reportView.html'
})
export class ReportView implements OnInit {
  reportId: string;
  type: string;
  modelDate: any;
  firstFile: any;
  fileLength = 0;
  baseUrl = BaseUrl;
  contentText: any;
  title: any;
  eventTime: any;

  constructor(private LoadCtrl: LoadingController,
              private toastCtrl: ToastController,
              private nav: NavController,
              private params: NavParams,
              private reportService: ReportService,
              private photoLibrary: PhotoLibrary,
              private androidPermissions: AndroidPermissions) {
  }

  ngOnInit(): void {
    //调用自定义js
    new CalculateWindowSize();
    new initPopover();

    //获取父页面传过来的参数
    this.reportId = this.params.get('reportId');
    this.type = this.params.get('type');

    this.getModelData(this.reportId);
  }

  //返回上一页
  back() {
    this.nav.pop();
  }

  //根据reportId获取详细页内容
  getModelData(reportId) {
    this.reportService.eventView(reportId).then(data => {
      if (data.success) {
        this.modelDate = data.obj;
        if (this.modelDate) {
          this.firstFile = this.modelDate.files.pop();//取出第一个文件并移除
          this.fileLength = this.modelDate.files.length;
          this.contentText = this.modelDate.contentText;
          this.title = this.modelDate.title;
          this.eventTime = this.modelDate.eventTime
        }
      } else {
        var loading = this.LoadCtrl.create({
          spinner: "dots",
          content: data.msg,
          duration: 1000
        });
        loading.present();
      }
    });
  }


  download(e) {
    var fileUrls = new Array();
    if (this.firstFile) {
      if(this.firstFile.fileType=1){
        fileUrls.push(this.firstFile.fileUrl);
      }

    }

    var files = this.modelDate.files;
    for (let i = 0; i < files.length; i++) {
      if(files[i].fileType=1) {
        fileUrls.push(files[i].fileUrl);
      }
    }

    for (let j = 0; j < fileUrls.length; j++) {
      this.saveImage(fileUrls[j]);
    }

    let toast = this.toastCtrl.create({
      message: "保存完成",
      duration: 1000,
      position: 'bottom'
    });
    toast.present();
  }

  saveImage(url: string) {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then((result) => {
      if (!result.hasPermission) {
        return this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE);
      } else {
        return Promise.resolve({hasPermission: true});
      }
    }).then((hasPermission) => {
      if (hasPermission) {
        this.photoLibrary.saveImage(url, 'images').then((res) => {
          console.log(res);
        }).catch(e => {
          console.log(e);
          let toast = this.toastCtrl.create({
            message: "无存储权限",
            duration: 1000,
            position: 'bottom'
          });
          toast.present();
        });
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
