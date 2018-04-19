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
//护路员管理
var PersonsManegePage = (function () {
    function PersonsManegePage(pmService, commonAction, nav, navParams) {
        this.pmService = pmService;
        this.commonAction = commonAction;
        this.nav = nav;
        this.navParams = navParams;
        this.flag = true;
        this.buttonName = '点击查看：护边员信息报送统计表';
        this.nowtime = Date.now(); //获取当前时间
        this.typeNum = new Array();
    }
    PersonsManegePage.prototype.ngOnInit = function () {
        var _this = this;
        setInterval(function () {
            _this.nowtime = Date.now(); //Date里面自带方法
        }, 1000);
        new CalculateWindowSize();
        new personsManegePage();
        this.pmService.getReportTable().then(function (data) { return _this.sendCountData = data.obj; });
        this.pmService.getSendScoreTable().then(function (data) { return _this.sendScoreData = data.obj; });
        this.initType();
    };
    PersonsManegePage.prototype.initType = function () {
        this.month = new Array(12);
        console.log(this.month);
        var arrTemp = ["信息工作", "基建维护", "日常表现", " 管理员 评 分", "总分"];
        for (var i = 0; i < 12; i++) {
            for (var j = 0; j < 5; j++) {
                this.typeNum.push(arrTemp[j]);
            }
        }
        console.log(this.typeNum);
    };
    PersonsManegePage.prototype.sum_send = function (item) {
        if (item) {
            return item.verify_send_score + item.send_score;
        }
        else {
            return "/";
        }
    };
    PersonsManegePage.prototype.sum_mark = function (item) {
        if (item) {
            return item.verify_mark_score + item.mark_score;
        }
        else {
            return "/";
        }
    };
    PersonsManegePage.prototype.daily_score = function (item) {
        if (item) {
            return item.daily_score;
        }
        else {
            return "/";
        }
    };
    PersonsManegePage.prototype.manager_score = function (item) {
        if (item) {
            return item.manager_score;
        }
        else {
            return "/";
        }
    };
    PersonsManegePage.prototype.sum_score = function (item) {
        if (item) {
            return item.verify_send_score + item.send_score + item.verify_mark_score + item.mark_score + item.daily_score + item.manager_score;
        }
        else {
            return "/";
        }
    };
    PersonsManegePage.prototype.back = function () {
        //调用mouseleave滚动公告，防止公告不滚动
        var myMarquee = document.querySelector('#myMarquee');
        new mouseleave(myMarquee);
        this.nav.pop();
        //this.commonAction.backHome();
    };
    return PersonsManegePage;
}());
PersonsManegePage = __decorate([
    core_1.Component({
        selector: 'personsManege-home',
        templateUrl: 'personsManege.html'
    })
], PersonsManegePage);
exports.PersonsManegePage = PersonsManegePage;
