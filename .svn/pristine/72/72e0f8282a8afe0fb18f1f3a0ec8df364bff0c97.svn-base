"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="../../declarations.d.ts"/>
/// <reference path="../../../plugins/cordova-plugin-video-push/types/index.d.ts"/>
var core_1 = require("@angular/core");
var VideoPage = (function () {
    //checkVideoOpenTimer:any;
    function VideoPage(toastCtrl, LoadCtrl, params, el, alertCtrl, viewCtrl, videoService, commonAction, nav) {
        this.toastCtrl = toastCtrl;
        this.LoadCtrl = LoadCtrl;
        this.params = params;
        this.el = el;
        this.alertCtrl = alertCtrl;
        this.viewCtrl = viewCtrl;
        this.videoService = videoService;
        this.commonAction = commonAction;
        this.nav = nav;
        this.showMyVideo = "hideMyVideo";
        this.currentStyles = { 'display': 'none' };
        this.fullScreenFlag = false;
        this.htmlEl = el.nativeElement;
    }
    VideoPage.prototype.ngOnInit = function () {
        new CalculateWindowSize();
        this.getPeopleOnline();
        //this.timer = setInterval(()=>{  //设置定时器，隔10秒获取一次
        // console.log("定时器获取巡防巡防人员列表！");
        // this.getPeopleOnline();
        // },1000*10);
        this.fullScreenFlag = this.params.get('fullScreenFlag');
    };
    //获取所有巡防人员列表
    VideoPage.prototype.getPeopleOnline = function () {
        var _this = this;
        var dataLoading = this.LoadCtrl.create({
            spinner: "dots",
            content: "\u6B63\u5728\u5237\u65B0\u4E2D,\u8BF7\u7A0D\u540E...",
            duration: 1000
        });
        dataLoading.present();
        this.videoService.getPeopleOnline().then(function (data) {
            dataLoading.dismiss();
            console.log(data);
            if (data.success) {
                console.log(_this.data);
                _this.data = data.obj;
                if (_this.data.length > 0) {
                    _this.initSwiper();
                }
                else {
                    var loading = _this.LoadCtrl.create({
                        spinner: "dots",
                        content: "\u5F53\u524D\u65E0\u4EBA\u5728\u5DE1\u9632...",
                        duration: 1000
                    });
                    loading.present();
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
    //使用第三方js 加载视频直播列表滑动效果
    VideoPage.prototype.initSwiper = function () {
        //先移除swiper再添加;
        console.log(this.swiper);
        if (this.swiper) {
            this.swiper.destroy(false);
        }
        this.swiper = new Swiper('.swiper-container', {
            pagination: '.swiper-pagination',
            observer: true,
            scrollbar: '.swiper-scrollbar',
            scrollbarHide: false,
            slidesPerView: 5,
            // slidesPerView: 'auto',
            // loopedSlides:1,
            //loopAdditionalSlides : 1,
            centeredSlides: true,
            spaceBetween: 30,
            //autoplay: 1000,
            //loop: true,
            keyboardControl: true,
            visibilityFullFit: true,
            mousewheelControl: true,
            //grabCursor: true,  //鼠标手形状
            effect: "coverflow",
            coverflow: {
                rotate: 10,
                stretch: 0,
                depth: 50,
                modifier: 2,
                slideShadows: false //阴影
            }
        });
    };
    //打开视频页面
    VideoPage.prototype.showVideo = function (item) {
        var _this = this;
        console.log(item);
        this.videoService.setPeopleVideoOpen(item.patrolid, item.uid).then(function (data) {
            var loading = _this.LoadCtrl.create({
                spinner: "dots",
                content: data.msg,
                duration: 1000
            });
            if (data.success) {
                _this.videoInfo = data.obj;
                if (_this.videoInfo && _this.videoInfo != null) {
                    //对方已经开启了直播
                    //this.play(this.videoInfo.liveurl);
                    _this.play(_this.videoInfo.liveurl, _this.videoInfo.tvUrl);
                }
                else {
                    //对方还未开启直播，服务器端直接请求开启，开启定时器检测对方是否开启
                    _this.checkVideoOpen(item);
                    loading.present();
                }
            }
            else {
                loading.present();
            }
        });
    };
    //定时器获取当前人直播状态
    VideoPage.prototype.checkVideoOpen = function (item) {
        var _this = this;
        var checkVideoOpenTimer = setInterval(function () {
            console.log("定时器获取当前人直播状态！");
            _this.videoService.checkVideoOpen(item.patrolid, item.uid).then(function (data) {
                console.log(data);
                if (data.success) {
                    var videoInfoTemp = data.obj;
                    if (videoInfoTemp) {
                        //对方已经开启了直播,弹出提示，并关闭定时器
                        var toast = _this.toastCtrl.create({
                            message: "对方直播已经开启",
                            duration: 2000,
                            position: 'bottom'
                        });
                        toast.present();
                        console.log("对方已经开启了直播,弹出提示，并关闭定时器");
                        if (checkVideoOpenTimer) {
                            clearInterval(checkVideoOpenTimer);
                        }
                    }
                }
            });
        }, 2000);
    };
    VideoPage.prototype.back = function () {
        //调用mouseleave滚动公告，防止公告不滚动
        var myMarquee = document.querySelector('#myMarquee');
        new mouseleave(myMarquee);
        this.nav.pop();
        if (this.fullScreenFlag) {
            new fullScreen();
            new hideHeader();
        }
        //this.commonAction.backHome();
    };
    //播放视频
    VideoPage.prototype.play = function (phoneUrl, tvUrl) {
        //console.log(url);
        //选择系统内的播放器播放
        // if(typeof(VideoPlayer)!= 'undefined'){
        //   VideoPlayer.play(url);
        // }else{
        //   var loading = this.LoadCtrl.create({
        //     spinner:"dots",
        //     content:`该设备不暂支持播放视频！`,
        //     duration:1000
        //   });
        //   loading.present();
        // }
        if (typeof (VlcPlayer) != 'undefined') {
            //指定自定义vlc播放器播放
            //VlcPlayer.playByVlc(url);
            //调用视频插件开启直播，监听返回值,tvUrl为推流地址，phoneUrl为播放地址
            VideoPush.SendInfo(tvUrl, phoneUrl, "SmartTVClient", function (res) {
                console.log('调用视频结束:', res);
                //触发关闭直播，发送请求到服务器端，修改直播状态
                //alert(res);
            }, function (err) {
                console.log(err);
            });
        }
        else {
            var loading = this.LoadCtrl.create({
                spinner: "dots",
                content: "\u8BE5\u8BBE\u5907\u4E0D\u6682\u652F\u6301\u64AD\u653E\u89C6\u9891\uFF01",
                duration: 1000
            });
            loading.present();
        }
    };
    //发起直播通知
    VideoPage.prototype.setPeopleVideoOpen = function (patrolid, receiveId) {
        this.videoService.setPeopleVideoOpen(patrolid, receiveId).then(function (data) {
        });
    };
    //转文字
    VideoPage.prototype.showStatus = function (liveStatus) {
        var status = { '0': '直播请求中', '1': '正在直播', '2': '直播关闭', '3': '直播中断', '4': '未开直播' };
        return status[liveStatus];
    };
    return VideoPage;
}());
VideoPage = __decorate([
    core_1.Component({
        selector: 'video-page',
        templateUrl: 'video.html'
    })
], VideoPage);
exports.VideoPage = VideoPage;
