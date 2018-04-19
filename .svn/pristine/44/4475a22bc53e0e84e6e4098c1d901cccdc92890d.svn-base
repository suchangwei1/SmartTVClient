/// <reference path="../../declarations.d.ts"/>
import {Component, OnInit} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

//头部样式组件
@Component({
  selector: 'facdHeader',
  templateUrl: 'facdHeader.html'
})

export class facdHeaderComponent implements OnInit  {

  nowtime:any=Date.now();  //获取当前时间

  constructor(public nav: NavController,private navParams:NavParams) {}

  ngOnInit(): void {

    setInterval(()=>{  //设置定时器，隔1秒刷新一次时间
      this.nowtime=Date.now();
    },1000);

    //new CalculateWindowSize();

  }

}
