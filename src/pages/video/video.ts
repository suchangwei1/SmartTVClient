/// <reference path="../../declarations.d.ts"/>
/// <reference path="../../../plugins/cordova-plugin-video-push/types/index.d.ts"/>
import {Component, OnInit, ElementRef} from '@angular/core';
import {
  NavController, NavParams, ViewController, AlertController, LoadingController,
  ToastController
} from 'ionic-angular';
import {VideoService} from '../../providers/video.service';
import {VideoFilePage} from "../videoFile/videoFile";

//declare var VideoPlayer; //选择系统内的播放器播放
declare var VlcPlayer;  //指定自定义vlc播放器播放
@Component({
  selector: 'video-page',
  templateUrl: 'video.html'
})
export class VideoPage implements OnInit {

  htmlEl: HTMLElement;
  data: any;
  swiper: any;
  showMyVideo = "hideMyVideo";
  currentStyles = {'display': 'none'};
  timer: any;
  fullScreenFlag = false;
  videoInfo: any;
  //checkVideoOpenTimer:any;
  constructor(private toastCtrl: ToastController,
              public LoadCtrl: LoadingController,
              private params: NavParams,
              private el: ElementRef,
              private videoService: VideoService,
              private nav: NavController) {
    this.htmlEl = el.nativeElement;
  }

  ngOnInit(): void {
    new CalculateWindowSize();
    this.getPeopleOnline();

    //this.timer = setInterval(()=>{  //设置定时器，隔10秒获取一次
    // console.log("定时器获取巡防巡防人员列表！");
    // this.getPeopleOnline();
    // },1000*10);

    this.fullScreenFlag = this.params.get('fullScreenFlag');
  }

  //获取所有巡防人员列表
  getPeopleOnline() {
    var dataLoading = this.LoadCtrl.create({
      spinner: "dots",
      content: `正在刷新中,请稍后...`,
      duration: 1000
    });
    dataLoading.present();
    this.videoService.getPeopleOnline().then(data => {
      dataLoading.dismiss();
      console.log(data);
      if (data.success) {
        console.log(this.data);
        this.data = data.obj;
        if (this.data.length > 0) {
          this.initSwiper();
        } else {

          var loading = this.LoadCtrl.create({
            spinner: "dots",
            content: `当前无人在巡防...`,
            duration: 1000
          });
          loading.present();
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

  //使用第三方js 加载视频直播列表滑动效果
  initSwiper() {
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
      mousewheelControl: true,  //鼠标滑轮
      //grabCursor: true,  //鼠标手形状
      effect: "coverflow",
      coverflow: {
        rotate: 10,
        stretch: 0,
        depth: 50,
        modifier: 2,
        slideShadows: false   //阴影
      }
    });
  }
  //打开视频文件列表页面
  downList() {
    this.nav.push(VideoFilePage);
  }
  //打开视频页面
  showVideo(item) {
    console.log(item);
    this.videoService.setPeopleVideoOpen(item.patrolid, item.uid).then(data => {
      var loading = this.LoadCtrl.create({
        spinner: "dots",
        content: data.msg,
        duration: 1000
      });
      if (data.success) {
        this.videoInfo = data.obj;

        if (this.videoInfo && this.videoInfo != null) {
          //对方已经开启了直播
          //this.play(this.videoInfo.liveurl);
          this.play(this.videoInfo.liveurl, this.videoInfo.tvUrl);
        } else {
          //对方还未开启直播，服务器端直接请求开启，开启定时器检测对方是否开启
          this.checkVideoOpen(item)
          loading.present();
        }
      } else {
        loading.present();
      }
    });
  }

  //定时器获取当前人直播状态
  checkVideoOpen(item) {
    var checkVideoOpenTimer = setInterval(() => {  //设置定时器，隔2秒获取一次
      console.log("定时器获取当前人直播状态！");
      this.videoService.checkVideoOpen(item.patrolid, item.uid).then(data => {
        console.log(data);
        if (data.success) {
          var videoInfoTemp = data.obj;
          if (videoInfoTemp) {
            //对方已经开启了直播,弹出提示，并关闭定时器
            let toast = this.toastCtrl.create({
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
  }

  back() {
    //调用mouseleave滚动公告，防止公告不滚动
    var myMarquee = <HTMLDivElement>document.querySelector('#myMarquee');
    new mouseleave(myMarquee);

    this.nav.pop();

    if (this.fullScreenFlag) {
      new fullScreen();
      new hideHeader();
    }
    //this.commonAction.backHome();
  }

  //播放视频
  play(phoneUrl, tvUrl) {
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


    if (typeof(VlcPlayer) != 'undefined') {
      //指定自定义vlc播放器播放
      //VlcPlayer.playByVlc(url);
      //调用视频插件开启直播，监听返回值,tvUrl为推流地址，phoneUrl为播放地址
      VideoPush.SendInfo(tvUrl, phoneUrl, "SmartTVClient", (res) => {
        console.log('1调用视频结束:', res);
      }, (err) => {
        console.log(err);
      });

    } else {
      var loading = this.LoadCtrl.create({
        spinner: "dots",
        content: `该设备不暂支持播放视频！`,
        duration: 1000
      });
      loading.present();
    }
  }

  //发起直播通知
  setPeopleVideoOpen(patrolid, receiveId) {
    this.videoService.setPeopleVideoOpen(patrolid, receiveId).then(data => {
    });
  }

  //转文字
  showStatus(liveStatus) {
    var status = {'0': '直播请求中', '1': '正在直播', '2': '直播关闭', '3': '直播中断', '4': '未开直播'};
    return status[liveStatus];
  }

  //点击轨迹标识，跳转
  flyToPeople(i) {
    for (var j = 0; j < this.data.length; j++) {
      if (j == i) {
        this.data[j]["show"] = true;
      } else {
        this.data[j]["show"] = false;
      }
    }
    this.swiper.slideTo(i, 1000, false);
  }
}
