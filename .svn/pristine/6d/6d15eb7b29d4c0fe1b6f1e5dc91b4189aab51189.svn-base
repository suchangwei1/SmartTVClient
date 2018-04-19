"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="../../declarations.d.ts"/>
var core_1 = require("@angular/core");
var patrol_1 = require("../patrol/patrol");
var report_1 = require("../report/report");
var video_1 = require("../video/video");
var personsManege_1 = require("../personsManege/personsManege");
var directive_1 = require("../patrol/directive");
var HomePage = (function () {
    function HomePage(appVersion, LoadCtrl, events, alertCtrl, platform, nav, navParams, modalCtrl, homeService, updateService) {
        this.appVersion = appVersion;
        this.LoadCtrl = LoadCtrl;
        this.events = events;
        this.alertCtrl = alertCtrl;
        this.platform = platform;
        this.nav = nav;
        this.navParams = navParams;
        this.modalCtrl = modalCtrl;
        this.homeService = homeService;
        this.updateService = updateService;
    }
    HomePage.prototype.ngOnInit = function () {
        var _this = this;
        new CalculateWindowSize();
        //this.showVersion();//显示版本号
        this.getNotice(); //获取通知公告
        this.timer = setInterval(function () {
            console.log("定时器获取通知公告！");
            _this.getNotice();
        }, 1000 * 10);
        this.events.subscribe('notice:read', function (id) {
            return _this.readNotice(id);
        });
    };
    //选择页面
    HomePage.prototype.choosePage = function (path) {
        if (path == 'patrolPage') {
            this.nav.push(patrol_1.PatrolPage);
        }
        else if (path == 'reportPage') {
            this.nav.push(report_1.ReportPage);
        }
        else if (path == 'videoPage') {
            this.nav.push(video_1.VideoPage);
        }
        else if (path == 'personsManegePage') {
            this.nav.push(personsManege_1.PersonsManegePage);
        }
        else {
            this.nav.pop();
        }
    };
    //获取通知公告
    HomePage.prototype.getNotice = function () {
        var _this = this;
        this.homeService.getNotice().then(function (data) {
            if (data.success) {
                _this.data = data.obj;
                console.log(_this.data);
                if (_this.data.length > 0) {
                    _this.notice_title = _this.data.title;
                    //转义html标签
                    var div = document.createElement("div");
                    div.innerHTML = _this.data.info;
                    _this.notice_info = div.innerText;
                    //this.notice_info=this.data.info;
                    _this.notice_publisher = _this.data.publisher;
                    _this.notice_ctime = _this.data.createTime;
                    _this.notice_id = _this.data.id;
                }
            }
            else {
                var loading = _this.LoadCtrl.create({
                    spinner: "dots",
                    content: data.msg,
                    duration: 1000
                });
                loading.present();
            }
        });
    };
    //通知公告详情
    HomePage.prototype.eventView = function (data) {
        //模态窗口
        // let modal = this.modalCtrl.create(NoticeViewModel,{title:data.title,info:data.info,author:data.author,createTime:data.createTime,id:data.id});
        // modal.present();
        var contenHtml = '<div id="NewsDetails" class="layout-wrapper">' +
            ' <div class="layout-container">' +
            ' <div class="news-container">' +
            ' <div class="title">' +
            ' <strong>公告</strong> ' +
            '<h3 style="text-align: center;"> ' + data.title + ' </h3> ' +
            '</div> <div class="content"> ' + data.info + ' <hr /> ' +
            '<h5 class="align-center"><strong>' + data.publisher + '</strong></h5> ' +
            '<h6 class="align-center"><strong>' + data.showTime + ' </strong></h6> ' +
            '<input type="hidden" id="notice_id" value=' + data.id + ' ></div> </div> </div> </div>';
        new showNews(contenHtml);
        this.events.publish('notice:read', data.id);
        // //监听"标记为已读"按钮
        // this.readNoticeBtn = <HTMLDivElement>document.querySelector('.layui-layer.layui-layer-page.layout-news-domain.layer-anim-02');
        // // var notice_id = <HTMLDivElement>document.querySelector('#notice_id');
        // this.readNoticeBtn = this.readNoticeBtn.querySelector('#readNotice');
        // console.log(this.readNoticeBtn);
        // console.log(this.notice_id);
        // this.readNoticeBtnEvent = Observable.fromEvent(this.readNoticeBtn, 'click');
        // this.readNoticeBtnEvent.subscribe(x => {
        //   self.readNotice(this.notice_id);
        //   //alert(notice_id.getAttribute("value"));
        //   new closeNews();
        // });
    };
    //通知公告标记为已读
    HomePage.prototype.readNotice = function (id) {
        this.homeService.readnotice(id).then(this.getNotice() //获取通知公告
        //this.nav.(HomePage)
        );
    };
    //退出应用
    HomePage.prototype.showConfirm = function () {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: '提示',
            message: '是否退出应用？',
            buttons: [
                {
                    text: '取消',
                    role: 'cancel',
                    handler: function () {
                    }
                },
                {
                    text: '确定',
                    handler: function () {
                        _this.platform.exitApp();
                    }
                }
            ]
        });
        alert.present();
    };
    //更新应用
    HomePage.prototype.update = function () {
        var _this = this;
        this.updateService.getNewVersionNumber().then(function (data) {
            console.log(data);
            if (data.success == true) {
                var versionInfo = data.obj;
                if (versionInfo.appstatus) {
                    _this.updateService.detectionUpgrade(versionInfo);
                }
                else {
                    var loading = _this.LoadCtrl.create({
                        spinner: "dots",
                        content: "暂无更新",
                        duration: 1000
                    });
                    loading.present();
                }
                // if (versionInfo.pluginstatus) {
                //   this.updateService.updateVlcApp(versionInfo)
                // }
            }
            else {
                var loading = _this.LoadCtrl.create({
                    spinner: "dots",
                    content: data.msg,
                    duration: 1000
                });
                loading.present();
            }
        });
    };
    HomePage.prototype.showVersion = function () {
        var _this = this;
        this.appVersion.getVersionNumber().then(function (ver) { return _this.tvVersion = ver; });
    };
    return HomePage;
}());
__decorate([
    core_1.ViewChild(directive_1.SomeDirective)
], HomePage.prototype, "vc", void 0);
HomePage = __decorate([
    core_1.Component({
        selector: 'home-page',
        templateUrl: 'home.html',
    })
], HomePage);
exports.HomePage = HomePage;
