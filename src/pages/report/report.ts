/// <reference path="../../declarations.d.ts"/>
import {Component, OnInit} from '@angular/core';
import {NavController, LoadingController} from 'ionic-angular';
import {ReportService} from '../../providers/report.service';
import {ReportView} from '../reportView/reportView';
import {DAYS, ROWS} from '../../app/app.commonSet';

@Component({
  selector: 'report-page',
  templateUrl: 'report.html'
})
export class ReportPage implements OnInit {

  data: any[];  //上报信息
  Month: number;
  Day: number;
  startDate: string;
  endDate: string;

  days = DAYS;
  page = 1;
  rows = ROWS;
  sendType = '';//事件类型标识
  typeLabel = '全部事件';//事件类型名称
  pageCount: number;  //总记录数

  lastEvents: any; //当前页最后一天记录的json
  lastEvents_bak: any[]; //当前页最后一天记录的json数组备份
  lastReport_time: any;//当前页最后一天记录的时间

  lastReport: any; //当前页最后一条记录
  beginid: string;//当前页最后一条记录的id(即分页开始的前一条id)-分页使用

  myloadingText = "拼命加载中请稍后...";
  myloadingTime = 2000;

  constructor(public loadCtrl: LoadingController, private nav: NavController, private reportService: ReportService) {
  }

  ngOnInit(): void {
    new CalculateWindowSize();
    this.getNowDate();

    //获取信息上报列表-by日期
    //this.startDate = this.commonAction.getRangeDate(new Date()+'',this.days);
    //this.endDate = this.commonAction.getRangeDate(new Date()+'');
    //this.getReportLsit(this.startDate,this.endDate);

    //获取信息上报列表-by数据
    this.getReportLsit('', this.rows, this.sendType);

    //loading.onDidDismiss(()=>{ console.log("Dismissed loading"); });
    //自定义获取div滚动刷新
    var self = this;
    document.getElementById('listview').onscroll = function () {
      console.log("scrolling------------");
      var element = document.getElementById('listview');
      console.log(element.scrollHeight - element.scrollTop);
      console.log(element.clientHeight);
      if (element.scrollHeight - element.scrollTop === element.clientHeight) {
        self.doInfinite2()
      }
    };
  }
  //刷新按钮
  refresh(){
    var loading = this.loadCtrl.create({
      spinner: "dots",
      content: "刷新中请稍后...",
      duration: 1000
    });
    loading.present();
    this.getReportLsit('', this.rows, this.sendType);
    var element = document.getElementById('listview');
    element.scrollTop = 0;
  }


  //根据事件类型返回样式名称，显示不同样式
  color(typename): any {
    var color = {'基础设施': 'green', '涉外事件': 'blue', '突发事件': 'red', '走私事件': 'orange', '边境动态': 'yellow', '其他': 'black'};
    return 'mess-items ' + color[typename];
  }
  //截取内容
  shortContent(content){
    if(content.length>19){
      return content.substring(0,19)+"...";
    }else{
      return content;
    }
  }
  //分类筛选
  chooseType(type) {
    var typeName = {'-1': '全部事件', '0': '基础设施', '1': '涉外事件', '2': '走私事件', '3': '突发事件', '4': '边境动态', '5': '其他'};
    this.typeLabel = typeName[type];
    if (type == '-1') {
      this.sendType = '';
    } else {
      this.sendType = type;
    }
    var element = document.getElementById('listview');
    element.scrollTop = 0;
    this.getReportLsit('', this.rows, this.sendType);
  }

  back() {
    //调用mouseleave滚动公告，防止公告不滚动
    var myMarquee = <HTMLDivElement>document.querySelector('#myMarquee');
    new mouseleave(myMarquee);

    this.nav.pop();
    //this.commonAction.backHome();
  }

  //获取当前 月-日
  getNowDate() {
    var myDate = new Date();
    this.Month = myDate.getMonth(); //获取当前月份(0-11,0代表1月)
    this.Day = myDate.getDate(); //获取当前日(1-31)
  }

  //获取信息上报列表
  getReportLsit(beginid: string, rows: number, sendType: string) {
    //按时间分页查询
    // this.reportService.reportList(startDate,endDate).then(data => {
    //   this.data= data.obj;
    // });

    //按记录数分页查询  beginid-列表起始ID(为空则查询查新最新记录) rows-每页记录数
    this.reportService.reportListByPage(beginid, rows, sendType).then(data => {
      if (data.success) {
        this.data = data.obj.data;
        //获取最后一组记录的时间、最后一条数据的id
        this.getLastInfo(this.data);
      }
    });

  }

  //查看详情页
  eventView(uuid, type) {
    //模态窗口
    //let modal = this.modalCtrl.create(ReportViewModel,{reportId:id});
    //modal.present();

    //直接跳转页面
    this.nav.push(ReportView, {reportId: uuid, type: type});
  }


  //上拉刷新-监听-监听的是 ion-content 组件 （效果不满意，废弃）
  doInfinite(infiniteScroll) {
    setTimeout(() => {
      // this.endDate = this.commonAction.getRangeDate(this.startDate,-1);
      // this.startDate = this.commonAction.getRangeDate(this.endDate,this.days);
      // console.log(this.startDate);
      // console.log(this.endDate);
      //
      // this.reportService.reportList(this.startDate,this.endDate).then(data => {
      //   let obj = data.obj;
      //   for (let i = 0; i < obj.length; i++) {
      //     this.data.push( obj[i] );
      //   }
      console.log("分页参数：" + this.beginid + "," + this.rows);
      this.reportService.reportListByPage(this.beginid, this.rows, this.sendType).then(data => {
        if (data.success) {
          let obj = data.obj.data;
          console.log("开始获取数据obj：");
          console.log(data.obj.data);
          //深拷贝数组(新旧数组互不影响)
          let obj_bak = obj.concat();
          //删除并返回数组的第一个元素
          let firstEvents = obj_bak.shift();
          //获取第一个元素中的时间
          let firstEvents_time = firstEvents.eventTime;
          console.log('firstEvents_time' + firstEvents_time);
          //判断旧最后一组与新数据第一组的时间是否相同
          if (this.lastReport_time == firstEvents_time) {
            console.log("分组时间相同");
            //先移除旧数据最后一组，并取出
            var oldEvents = this.data.pop();
            console.log("先移除旧数据最后一组，并取出oldEvents：");
            console.log(oldEvents);
            //合并新旧数据
            oldEvents.events = oldEvents.events.concat(firstEvents.events);
            console.log("合并最后一组+第一组数据oldEvents：");
            console.log(oldEvents);
            //将合并后的数据追加到末尾
            this.data.push(oldEvents);
            console.log("将合并后的数据追加到末尾data：");
            console.log(this.data);

            //再追加新数据(不包含第一组数据)
            console.log("追加剩余数据(不包含第一组数据)obj_bak：");
            console.log(obj_bak);
            for (let i = 0; i < obj_bak.length; i++) {
              this.data.push(obj_bak[i]);
            }
            console.log("追加完成data：");
            console.log(this.data);
          } else {
            console.log("分组时间不同");
            for (let i = 0; i < obj.length; i++) {
              this.data.push(obj[i]);
            }
          }

          //获取最后一组记录的时间、最后一条数据的id
          this.getLastInfo(obj);
        } else {
          this.myloadingText = "已到达尾页!";
          this.myloadingTime = 500;
        }

      });
      infiniteScroll.complete();
    }, this.myloadingTime);
  }

  //上拉刷新-监听-自定义-监听DIV
  doInfinite2() {
    console.log("分页参数：" + this.beginid + "," + this.rows);
    this.reportService.reportListByPage(this.beginid, this.rows, this.sendType).then(data => {
      console.log(data.success);
      if (data.success) {

        var getDataLoading = this.loadCtrl.create({
          spinner: "dots",
          content: `正在加载中请稍后...`,
          duration: 3000
        });
        getDataLoading.present();

        let obj = data.obj.data;
        console.log("开始获取数据obj：");
        console.log(data.obj.data);
        //深拷贝数组(新旧数组互不影响)
        let obj_bak = obj.concat();
        //删除并返回数组的第一个元素
        let firstEvents = obj_bak.shift();
        //获取第一个元素中的时间
        let firstEvents_time = firstEvents.eventTime;
        console.log('firstEvents_time' + firstEvents_time);
        //判断旧最后一组与新数据第一组的时间是否相同
        if (this.lastReport_time == firstEvents_time) {
          console.log("分组时间相同");
          //先移除旧数据最后一组，并取出
          var oldEvents = this.data.pop();
          console.log("先移除旧数据最后一组，并取出oldEvents：");
          console.log(oldEvents);
          //合并新旧数据
          oldEvents.events = oldEvents.events.concat(firstEvents.events);
          console.log("合并最后一组+第一组数据oldEvents：");
          console.log(oldEvents);
          //将合并后的数据追加到末尾
          this.data.push(oldEvents);
          console.log("将合并后的数据追加到末尾data：");
          console.log(this.data);

          //再追加新数据(不包含第一组数据)
          console.log("追加剩余数据(不包含第一组数据)obj_bak：");
          console.log(obj_bak);
          for (let i = 0; i < obj_bak.length; i++) {
            this.data.push(obj_bak[i]);
          }
          console.log("追加完成data：");
          console.log(this.data);
        } else {
          console.log("分组时间不同");
          for (let i = 0; i < obj.length; i++) {
            this.data.push(obj[i]);
          }
        }

        //获取最后一组记录的时间、最后一条数据的id
        this.getLastInfo(obj);
        getDataLoading.dismiss();
      } else {
        var noDataLoading = this.loadCtrl.create({
          spinner: "dots",
          content: `已到达尾页！`,
          duration: 500
        });
        noDataLoading.present();
        //getDataLoading.present();
        //this.noDataLoading.onDidDismiss(()=>{ console.log("Dismissed loading"); });
      }
    });

  }

  //获取最后一组记录的时间、最后一条数据的id
  getLastInfo(data) {
    //深拷贝数组(新旧数组互不影响)
    var data_bak = data.concat();
    //先获取最后一组数据
    this.lastEvents = data_bak.pop();
    console.log(this.lastEvents);
    if (!this.lastEvents) {
      return;
    }
    //获取最后一组数据中的时间
    this.lastReport_time = this.lastEvents.eventTime;
    console.log('lastReport_time:' + this.lastReport_time);

    //备份最后一组数据
    this.lastEvents_bak = this.lastEvents.events.concat();
    //获取最后一组数据中的最后一条数据
    this.lastReport = this.lastEvents_bak.pop();

    //获取最后一条数据的id
    if (this.lastReport) {
      this.beginid = this.lastReport.id;
      console.log("beginid:" + this.beginid);
    }

  }

}
