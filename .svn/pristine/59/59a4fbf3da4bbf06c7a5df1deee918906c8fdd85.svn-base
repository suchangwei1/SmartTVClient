import {Component, OnInit} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {VideoService} from '../../providers/video.service';
import {CommonAction} from '../../providers/commonAction.service';
import {HomePage} from "../home/home";

//视频回传页面-废弃   视频直播界面直接由自定义vlc播放器打开
@Component({
  selector: 'videoView-page',
  templateUrl: 'videoView.html'
})
export class VideoViewPage implements OnInit {

  nowtime: any = Date.now();  //获取当前时间
  data: any;
  rtmpUrl: any;
  m3u8Url: any;

  constructor(private params: NavParams, private videoService: VideoService, private commonAction: CommonAction, private nav: NavController, private navParams: NavParams) {
  }

  ngOnInit(): void {
    this.rtmpUrl = this.params.get('rtmpUrl');
    this.m3u8Url = this.params.get('m3u8Url');

    new CalculateWindowSize();

  }

  back() {
    this.nav.pop();
    //this.commonAction.backHome();
  }

  backHome() {
    this.nav.setRoot(HomePage);

  }

}
