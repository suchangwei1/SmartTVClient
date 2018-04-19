/// <reference path="../../declarations.d.ts"/>
import {Component, OnInit, ViewChild,} from '@angular/core';
import {
  Events,
  NavController,
  AlertController,
  Platform,
  LoadingController,
  Keyboard,
  ToastController
} from 'ionic-angular';
import {PatrolPage} from '../patrol/patrol';
import {ReportPage} from '../report/report';
import {VideoPage} from '../video/video';
import {PersonsManegePage} from '../personsManege/personsManege';
import {HomeService} from '../../providers/home.service'
import {UpdateService} from '../../providers/update.service'
import {SomeDirective} from '../patrol/directive';
import {AppVersion} from "@ionic-native/app-version";
import {LoginService} from "../../providers/login.service";
import {NoticeListPage} from "../notice/list/noticeList";
import {AppMinimize} from "@ionic-native/app-minimize";


@Component({
  selector: 'home-page',
  templateUrl: 'home.html',
})

export class HomePage implements OnInit {

  data: any;
  timer: any;
  tvVersion: string;
  user: any;
  @ViewChild(SomeDirective) vc: SomeDirective;

  constructor(private loginService: LoginService,
              private appVersion: AppVersion,
              private appMinimize: AppMinimize,
              private keyboard: Keyboard,
              private loadCtrl: LoadingController,
              private toastCtrl: ToastController,
              private events: Events,
              private alertCtrl: AlertController,
              private platform: Platform,
              private navCtrl: NavController,
              private homeService: HomeService,
              private updateService: UpdateService) {

    //监听返回操作
    this.platform.registerBackButtonAction(() => {
      if (this.keyboard.isOpen()) {
        this.keyboard.close();
        return
      }
      if (this.navCtrl.canGoBack()) {
        this.navCtrl.pop();
      } else {
        this.appMinimize.minimize();
      }
    }, 1);

  }

  ngOnInit(): void {
    new CalculateWindowSize();
    //this.showVersion();//显示版本号
    this.getNotice();//获取通知公告

    this.timer = setInterval(() => {  //设置定时器，隔10秒获取一次通知公告
      console.log("定时器获取通知公告！");
      this.getNotice();
    }, 1000 * 10);
    this.events.subscribe('notice:read', (uuid) =>
      this.readNotice(uuid)
    );
    //获取当前登陆用户
    this.user = this.loginService.getLoginUser();
  }

  //选择页面
  choosePage(path) {
    if (path == 'patrolPage') {
      this.navCtrl.push(PatrolPage);
    } else if (path == 'reportPage') {
      this.navCtrl.push(ReportPage);
    } else if (path == 'videoPage') {
      this.navCtrl.push(VideoPage);
    } else if (path == 'personsManegePage') {
      this.navCtrl.push(PersonsManegePage);
    } else {
      this.navCtrl.pop();
    }
  }

  //获取通知公告
  getNotice() {
    this.homeService.getNotice().then(data => {
      if (data.success) {
        this.data = data.obj;
      } else {
        var loading = this.loadCtrl.create({
          spinner: "dots",
          content: data.msg,
          duration: 1000
        });
        loading.present();
      }
    });

  }

  noticeHistoryPage() {
    this.navCtrl.push(NoticeListPage);
  }

  //通知公告详情
  eventView(item) {

    var isSign = false;
    //检查是否已签收
    this.homeService.checkSign(item.uuid).then(data => {
      if (data.success) {
        if (data.obj.sign == 1) {
          isSign = true;
        } else {
          isSign = false;
        }

        var contenHtml = '<div id="NewsDetails" class="layout-wrapper">' +
          ' <div class="layout-container">' +
          ' <div class="news-container">' +
          ' <div class="title">' +
          ' <strong>公告</strong> ' +
          '<h3 style="text-align: center;color: red;"> ' + item.title + ' </h3> ' +
          '</div> <div class="content"><p style="color: red;font-size: 20px"> ' + item.info + ' </p><hr /> ' +
          '<h5 class="align-center"><strong>' + item.publisher + '</strong></h5> ' +
          '<h6 class="align-center"><strong>' + item.showTime + ' </strong></h6> ';
        if (!isSign) {
          contenHtml += '<input type="button" id="sign" style="background-color:#53e822;margin-left: 45%;" value="确认签收"/> ';
        } else {
          contenHtml += '<h5 class="align-center" style="background-color:#f7f6ef6e;" >已签收</h5> ';
          contenHtml += '<h6><strong>反馈内容：</strong>' + data.obj.feedback + ' </h6>';
        }
        contenHtml += '<input type="hidden" id="notice_id" value=' + item.uuid + ' ></div> </div> </div> </div>';
        new showNews(contenHtml);
        //打开后直接标记为已读
        this.events.publish('notice:read', item.uuid);

        var self = this;
        //先判断元素是否存在
        if (document.getElementById('sign')) {
          //监听签收按钮
          document.getElementById('sign').onclick = function () {
            self.feedBack(item.uuid);
          };
        }

      }
    });
  }

  feedBack(uuid) {
    var contenHtml = '<div id="NewsDetails" class="layout-wrapper">' +
      ' <div class="layout-container">' +
      ' <div class="news-container">' +
      '请填写反馈信息：<div id="feedback" contenteditable="true" style="width: 100%;height: 140px;border: 1px dashed #000;width:100%;margin-top:10px;"></div>' +
      '<input type="button" id="submit" style="margin-left: 40%;width: 90px;height: 35px;background-color:#53e822" value="提交"/> ' +
      '</div> </div> </div>';

    new showFeedBack(contenHtml);

    var self = this;

    var self = this;
    document.getElementById('submit').onclick = function () {
      var feedback = document.getElementById('feedback').innerHTML;
      console.log(feedback);
      self.sign(uuid, feedback);
    }

  }

  sign(uuid, feedback) {
    this.homeService.Sign(uuid, feedback).then(data => {
      if (data.success) {
        //关闭窗口
        console.log("关闭窗口");
        new closeNews();
        let toast = this.toastCtrl.create({
          message: "签收成功",
          duration: 1000,
          position: 'bottom'
        });
        toast.present();
        //this.isSign = true;
      } else {
        let toast = this.toastCtrl.create({
          message: "系统异常",
          duration: 1000,
          position: 'bottom'
        });
        toast.present();
      }
    });
  }


  //通知公告标记为已读
  readNotice(uuid: string) {
    this.homeService.readnotice(uuid).then(
      this.getNotice() //获取通知公告
      //this.nav.(HomePage)
    );
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

  //更新应用
  update() {
    this.updateService.getNewVersionNumber().then(data => {
        console.log(data);
        if (data.success == true) {
          var versionInfo = data.obj;

          if (versionInfo.appstatus) {
            this.updateService.detectionUpgrade(versionInfo);
          } else {
            var loading = this.loadCtrl.create({
              spinner: "dots",
              content: "暂无更新",
              duration: 1000
            });
            loading.present();
          }
          // if (versionInfo.pluginstatus) {
          //   this.updateService.updateVlcApp(versionInfo)
          // }
        } else {
          var loading = this.loadCtrl.create({
            spinner: "dots",
            content: data.msg,
            duration: 1000
          });
          loading.present();
        }
      }
    );
  }

  showVersion() {
    this.appVersion.getVersionNumber().then(ver => this.tvVersion = ver);
  }

}
