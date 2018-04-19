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
var reportView_1 = require("../reportView/reportView");
var app_commonSet_1 = require("../../app/app.commonSet");
var ReportPage = (function () {
    function ReportPage(LoadCtrl, commonAction, nav, navParams, modalCtrl, reportService) {
        this.LoadCtrl = LoadCtrl;
        this.commonAction = commonAction;
        this.nav = nav;
        this.navParams = navParams;
        this.modalCtrl = modalCtrl;
        this.reportService = reportService;
        this.days = app_commonSet_1.DAYS;
        this.page = 1;
        this.rows = app_commonSet_1.ROWS;
        this.sendType = ''; //事件类型标识
        this.typeLabel = '全部事件'; //事件类型名称
        this.myloadingText = "拼命加载中请稍后...";
        this.myloadingTime = 2000;
    }
    ReportPage.prototype.ngOnInit = function () {
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
                self.doInfinite2();
            }
        };
    };
    //根据事件类型返回样式名称，显示不同样式
    ReportPage.prototype.color = function (typename) {
        var color = { '基础设施': 'green', '涉外事件': 'blue', '突发事件': 'red', '走私事件': 'orange' };
        return 'mess-items ' + color[typename];
    };
    //截取内容
    ReportPage.prototype.shortContent = function (content) {
        if (content.length > 19) {
            return content.substring(0, 19) + "...";
        }
        else {
            return content;
        }
    };
    //分类筛选
    ReportPage.prototype.chooseType = function (type) {
        var typeName = { '-1': '全部事件', '0': '基础设施', '1': '涉外事件', '2': '走私事件', '3': '突发事件' };
        this.typeLabel = typeName[type];
        if (type == '-1') {
            this.sendType = '';
        }
        else {
            this.sendType = type;
        }
        var element = document.getElementById('listview');
        element.scrollTop = 0;
        this.getReportLsit('', this.rows, this.sendType);
    };
    ReportPage.prototype.back = function () {
        //调用mouseleave滚动公告，防止公告不滚动
        var myMarquee = document.querySelector('#myMarquee');
        new mouseleave(myMarquee);
        this.nav.pop();
        //this.commonAction.backHome();
    };
    //获取当前 月-日
    ReportPage.prototype.getNowDate = function () {
        var myDate = new Date();
        this.Month = myDate.getMonth(); //获取当前月份(0-11,0代表1月)
        this.Day = myDate.getDate(); //获取当前日(1-31)
    };
    //获取信息上报列表
    ReportPage.prototype.getReportLsit = function (beginid, rows, sendType) {
        //按时间分页查询
        // this.reportService.reportList(startDate,endDate).then(data => {
        //   this.data= data.obj;
        // });
        var _this = this;
        //按记录数分页查询  beginid-列表起始ID(为空则查询查新最新记录) rows-每页记录数
        this.reportService.reportListByPage(beginid, rows, sendType).then(function (data) {
            if (data.success) {
                _this.data = data.obj.data;
                //获取最后一组记录的时间、最后一条数据的id
                _this.getLastInfo(_this.data);
            }
        });
    };
    //查看详情页
    ReportPage.prototype.eventView = function (uuid, type) {
        //模态窗口
        //let modal = this.modalCtrl.create(ReportViewModel,{reportId:id});
        //modal.present();
        //直接跳转页面
        this.nav.push(reportView_1.ReportView, { reportId: uuid, type: type });
    };
    //上拉刷新-监听-监听的是 ion-content 组件 （效果不满意，废弃）
    ReportPage.prototype.doInfinite = function (infiniteScroll) {
        var _this = this;
        setTimeout(function () {
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
            console.log("分页参数：" + _this.beginid + "," + _this.rows);
            _this.reportService.reportListByPage(_this.beginid, _this.rows, _this.sendType).then(function (data) {
                if (data.success) {
                    var obj = data.obj.data;
                    console.log("开始获取数据obj：");
                    console.log(data.obj.data);
                    //深拷贝数组(新旧数组互不影响)
                    var obj_bak = obj.concat();
                    //删除并返回数组的第一个元素
                    var firstEvents = obj_bak.shift();
                    //获取第一个元素中的时间
                    var firstEvents_time = firstEvents.eventTime;
                    console.log('firstEvents_time' + firstEvents_time);
                    //判断旧最后一组与新数据第一组的时间是否相同
                    if (_this.lastReport_time == firstEvents_time) {
                        console.log("分组时间相同");
                        //先移除旧数据最后一组，并取出
                        var oldEvents = _this.data.pop();
                        console.log("先移除旧数据最后一组，并取出oldEvents：");
                        console.log(oldEvents);
                        //合并新旧数据
                        oldEvents.events = oldEvents.events.concat(firstEvents.events);
                        console.log("合并最后一组+第一组数据oldEvents：");
                        console.log(oldEvents);
                        //将合并后的数据追加到末尾
                        _this.data.push(oldEvents);
                        console.log("将合并后的数据追加到末尾data：");
                        console.log(_this.data);
                        //再追加新数据(不包含第一组数据)
                        console.log("追加剩余数据(不包含第一组数据)obj_bak：");
                        console.log(obj_bak);
                        for (var i = 0; i < obj_bak.length; i++) {
                            _this.data.push(obj_bak[i]);
                        }
                        console.log("追加完成data：");
                        console.log(_this.data);
                    }
                    else {
                        console.log("分组时间不同");
                        for (var i = 0; i < obj.length; i++) {
                            _this.data.push(obj[i]);
                        }
                    }
                    //获取最后一组记录的时间、最后一条数据的id
                    _this.getLastInfo(obj);
                }
                else {
                    _this.myloadingText = "已到达尾页!";
                    _this.myloadingTime = 500;
                }
            });
            infiniteScroll.complete();
        }, this.myloadingTime);
    };
    //上拉刷新-监听-自定义-监听DIV
    ReportPage.prototype.doInfinite2 = function () {
        var _this = this;
        console.log("分页参数：" + this.beginid + "," + this.rows);
        this.reportService.reportListByPage(this.beginid, this.rows, this.sendType).then(function (data) {
            console.log(data.success);
            if (data.success) {
                var getDataLoading = _this.LoadCtrl.create({
                    spinner: "dots",
                    content: "\u6B63\u5728\u52A0\u8F7D\u4E2D\u8BF7\u7A0D\u540E...",
                    duration: 3000
                });
                getDataLoading.present();
                var obj = data.obj.data;
                console.log("开始获取数据obj：");
                console.log(data.obj.data);
                //深拷贝数组(新旧数组互不影响)
                var obj_bak = obj.concat();
                //删除并返回数组的第一个元素
                var firstEvents = obj_bak.shift();
                //获取第一个元素中的时间
                var firstEvents_time = firstEvents.eventTime;
                console.log('firstEvents_time' + firstEvents_time);
                //判断旧最后一组与新数据第一组的时间是否相同
                if (_this.lastReport_time == firstEvents_time) {
                    console.log("分组时间相同");
                    //先移除旧数据最后一组，并取出
                    var oldEvents = _this.data.pop();
                    console.log("先移除旧数据最后一组，并取出oldEvents：");
                    console.log(oldEvents);
                    //合并新旧数据
                    oldEvents.events = oldEvents.events.concat(firstEvents.events);
                    console.log("合并最后一组+第一组数据oldEvents：");
                    console.log(oldEvents);
                    //将合并后的数据追加到末尾
                    _this.data.push(oldEvents);
                    console.log("将合并后的数据追加到末尾data：");
                    console.log(_this.data);
                    //再追加新数据(不包含第一组数据)
                    console.log("追加剩余数据(不包含第一组数据)obj_bak：");
                    console.log(obj_bak);
                    for (var i = 0; i < obj_bak.length; i++) {
                        _this.data.push(obj_bak[i]);
                    }
                    console.log("追加完成data：");
                    console.log(_this.data);
                }
                else {
                    console.log("分组时间不同");
                    for (var i = 0; i < obj.length; i++) {
                        _this.data.push(obj[i]);
                    }
                }
                //获取最后一组记录的时间、最后一条数据的id
                _this.getLastInfo(obj);
                getDataLoading.dismiss();
            }
            else {
                var noDataLoading = _this.LoadCtrl.create({
                    spinner: "dots",
                    content: "\u5DF2\u5230\u8FBE\u5C3E\u9875\uFF01",
                    duration: 500
                });
                noDataLoading.present();
                //getDataLoading.present();
                //this.noDataLoading.onDidDismiss(()=>{ console.log("Dismissed loading"); });
            }
        });
    };
    //获取最后一组记录的时间、最后一条数据的id
    ReportPage.prototype.getLastInfo = function (data) {
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
    };
    return ReportPage;
}());
ReportPage = __decorate([
    core_1.Component({
        selector: 'report-page',
        templateUrl: 'report.html'
    })
], ReportPage);
exports.ReportPage = ReportPage;
