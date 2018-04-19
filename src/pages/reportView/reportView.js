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
var app_commonSet_1 = require("../../app/app.commonSet");
//信息上报详细页
var ReportView = (function () {
    function ReportView(LoadCtrl, nav, params, reportService) {
        this.LoadCtrl = LoadCtrl;
        this.nav = nav;
        this.params = params;
        this.reportService = reportService;
        this.fileLength = 0;
        this.baseUrl = app_commonSet_1.BaseUrl;
    }
    ReportView.prototype.ngOnInit = function () {
        //调用自定义js
        new CalculateWindowSize();
        new initPopover();
        //获取父页面传过来的参数
        this.reportId = this.params.get('reportId');
        this.type = this.params.get('type');
        this.getModelData(this.reportId);
    };
    //返回上一页
    ReportView.prototype.back = function () {
        this.nav.pop();
    };
    //根据reportId获取详细页内容
    ReportView.prototype.getModelData = function (reportId) {
        var _this = this;
        this.reportService.eventView(reportId).then(function (data) {
            if (data.success) {
                _this.modelDate = data.obj;
                if (_this.modelDate) {
                    _this.firstFile = _this.modelDate.files.pop(); //取出第一个文件并移除
                    _this.fileLength = _this.modelDate.files.length;
                    _this.contentText = _this.modelDate.contentText;
                    _this.title = _this.modelDate.title;
                    _this.eventTime = _this.modelDate.eventTime;
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
    return ReportView;
}());
ReportView = __decorate([
    core_1.Component({
        selector: 'reportView-page',
        templateUrl: 'reportView.html'
    })
], ReportView);
exports.ReportView = ReportView;
