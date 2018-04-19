/// <reference path="../../../declarations.d.ts"/>
import {Component, OnInit} from '@angular/core';
import {NavController, LoadingController, ToastController, AlertController} from 'ionic-angular';
import {HomeService} from "../../../providers/home.service";

@Component({
  selector: 'noticeList',
  templateUrl: 'noticeList.html',
})

export class NoticeListPage implements OnInit {

  notice_history: any[];
  fromid: any;

  constructor(private loadCtrl: LoadingController,
              private homeService: HomeService,
              private toastCtrl: ToastController,
              private alertCtrl: AlertController,
              private navCtrl: NavController) {

  }

  ngOnInit(): void {
    new CalculateWindowSize();
    this.noticeHistory();
    //自定义获取div滚动刷新
    var self = this;
    document.getElementById('listview').onscroll = function () {
      console.log("scrolling------------");
      var element = document.getElementById('listview');
      console.log(element.scrollHeight - element.scrollTop);
      console.log(element.clientHeight);
      if (element.scrollHeight - element.scrollTop === element.clientHeight) {
        self.doInfinite()
      }
    };

  }

  noticeHistory() {
    this.homeService.getNoticeHistory().then(data => {
      if (data.success) {
        this.notice_history = data.obj;
        this.fromid = data.msg;
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

  refresh() {
    var loading = this.loadCtrl.create({
      spinner: "dots",
      content: "刷新中请稍后...",
      duration: 1000
    });
    loading.present();
    this.noticeHistory();
    var element = document.getElementById('listview');
    element.scrollTop = 0;
  }


  doInfinite() {
    if (this.fromid == null) {
      var loading = this.loadCtrl.create({
        spinner: "dots",
        content: "已到达尾页！",
        duration: 1000
      });
      loading.present();
    } else {
      this.homeService.getNoticeHistory(this.fromid).then(data => {
        if (data.success) {
          var obj = data.obj;
          for (let i = 0; i < obj.length; i++) {
            this.notice_history.push(obj[i]);
          }
          this.fromid = data.msg;
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

  }

  formatDate(now) {
    let d = new Date(now);
    let year = d.getFullYear();
    let month = d.getMonth() + 1;
    let date = d.getDate();
    let hour = d.getHours();
    let minute = d.getMinutes();
    let second = d.getSeconds();
    let minutes = '';
    let seconds = '';
    if (minute < 10) {
      minutes = '0' + minute
    } else {
      minutes = '' + minute;
    }
    if (second < 10) {
      seconds = '0' + second
    } else {
      seconds = '' + second;
    }
    return year + "-" + month + "-" + date + "   " + hour + ":" + minutes + ":" + seconds;
  }

  infoDetail(info: string): string {
    let description = info;
    description = description.replace(/(\n)/g, "");
    description = description.replace(/(\t)/g, "");
    description = description.replace(/(\r)/g, "");
    description = description.replace(/<\/?[^>]*>/g, "");
    description = description.replace(/\s*/g, "");
    return description;
  }

  showDetail(item) {

    var isSign = false;
    //检查是否已签收
    this.homeService.checkSign(item.uuid).then(data => {
      if (data.success) {
        if (data.obj.sign == 1) {
          isSign = true;
        } else {
          isSign = false;
        }

        //通知公告详情
        var info = this.infoDetail(item.info);
        var contenHtml = '<div id="NewsDetails" class="layout-wrapper">' +
          ' <div class="layout-container">' +
          ' <div class="news-container">' +
          ' <div class="title">' +
          ' <strong>公告</strong> ' +
          '<h3 style="text-align: center;color: red"> ' + item.title + ' </h3> ' +
          '</div> <div class="content"><p style="color: red;font-size: 20px"> ' + info + ' </p><hr /> ' +
          '<h5 class="align-center"><strong>' + item.publisher + '</strong></h5> ' +
          '<h6 class="align-center"><strong>' + item.show_time + ' </strong></h6> ';
        if (!isSign) {
          contenHtml += '<input type="button" id="sign" style="background-color:#53e822;margin-left: 45%;" value="确认签收"/> ';
        } else {
          contenHtml += '<h5 class="align-center" style="background-color:#f7f6ef6e;" >已签收</h5> ';
          contenHtml += '<h6><strong>反馈内容：</strong>' + data.obj.feedback + ' </h6>';
        }
        contenHtml += '<input type="hidden" id="notice_id" value=' + item.uuid + ' ></div> </div> </div> </div>';

        new showNews(contenHtml);

        var self = this;
        //先判断元素是否存在
        if (document.getElementById('sign')) {
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

  back() {
    //调用mouseleave滚动公告，防止公告不滚动
    var myMarquee = <HTMLDivElement>document.querySelector('#myMarquee');
    new mouseleave(myMarquee);

    this.navCtrl.pop();
  }
}
