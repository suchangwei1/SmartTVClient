/// <reference path="../../declarations.d.ts"/>
import {Component, OnInit} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {CommonAction} from '../../providers/commonAction.service';
import {PersonsManegeService} from '../../providers/personsManege.service';

//护路员管理
@Component({
  selector: 'personsManege-home',
  templateUrl: 'personsManege.html'
})
export class PersonsManegePage implements OnInit {
  sendCountData: any;
  sendScoreData: any;
  flag = true;
  buttonName = '点击查看：护路员信息报送统计表';
  nowtime: any = Date.now();  //获取当前时间
  month: any;
  typeNum = new Array();

  constructor(private pmService: PersonsManegeService, private commonAction: CommonAction, private nav: NavController, private navParams: NavParams) {
  }

  ngOnInit(): void {
    setInterval(() => {  //设置定时器，隔1秒刷新一次，好实时监控时间
      this.nowtime = Date.now();   //Date里面自带方法
    }, 1000);
    new CalculateWindowSize();
    new personsManegePage();
    this.pmService.getReportTable().then(data => this.sendCountData = data.obj);
    this.pmService.getSendScoreTable().then(data => this.sendScoreData = data.obj);
    this.initType();
  }

  initType() {
    this.month = new Array(12);
    console.log(this.month);
    var arrTemp = ["巡防里程","信息工作", "基建维护", "日常表现", " 管理员 评 分", "总分"];
    for (let i = 0; i < 12; i++) {
      for (let j = 0; j < 6; j++) {
        this.typeNum.push(arrTemp[j]);
      }
    }
    console.log(this.typeNum);
  }
  sum_Distance(item){
    if (item) {
      return item.sumDistance;
    } else {
      return "/";
    }
  }
  sum_send(item) {
    if (item) {
      return item.verify_send_score + item.send_score;
    } else {
      return "/";
    }
  }

  sum_mark(item) {
    if (item) {
      return item.verify_mark_score + item.mark_score;
    } else {
      return "/";
    }
  }

  daily_score(item) {
    if (item) {
      return item.daily_score;
    } else {
      return "/";
    }
  }

  manager_score(item) {
    if (item) {
      return item.manager_score;
    } else {
      return "/";
    }
  }

  sum_score(item) {
    if (item) {
      return item.verify_send_score + item.send_score + item.verify_mark_score + item.mark_score + item.daily_score + item.manager_score;
    } else {
      return "/";
    }

  }

  back() {
    //调用mouseleave滚动公告，防止公告不滚动
    var myMarquee = <HTMLDivElement>document.querySelector('#myMarquee');
    new mouseleave(myMarquee);

    this.nav.pop();
    //this.commonAction.backHome();
  }
}
