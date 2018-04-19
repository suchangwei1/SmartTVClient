"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var app_commonSet_1 = require("../app/app.commonSet");
require("rxjs/add/operator/toPromise");
//信息上报
var ReportService = (function () {
    function ReportService(http) {
        this.http = http;
        this.baseUrl = app_commonSet_1.BaseUrl;
        this.headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded,charset=UTF-8' });
    }
    //上报信息列表 --按时间分页 "assets/data/reportlist.json" this.baseUrl+"/smart/getReportList"
    ReportService.prototype.reportList = function (startDate, endDate) {
        var params = new http_1.URLSearchParams();
        params.set('token', app_commonSet_1.TOKEN);
        params.set('startDate', startDate);
        params.set('endDate', endDate);
        return this.http.post(this.baseUrl + "/smart/getReportList", { headers: this.headers }, { params: params }).toPromise()
            .then(function (response) { return response.json(); }).catch(this.handleError);
    };
    //上报信息列表 --按记录数分页  http://localhost:8080/smart/getReportList2?page=2&rows=10
    ReportService.prototype.reportListByPage = function (beginid, rows, sendType) {
        var params = new http_1.URLSearchParams();
        params.set('token', app_commonSet_1.TOKEN);
        params.set('beginid', beginid);
        params.set('rows', rows + '');
        params.set('sendType', sendType);
        return this.http.post(this.baseUrl + "/smart/getReportList2", { headers: this.headers }, { params: params }).toPromise()
            .then(function (response) { return response.json(); }).catch(this.handleError);
    };
    //上报信息详细页 "assets/data/reportView.json"  this.baseUrl+"/smart/getReportDetail"
    ReportService.prototype.eventView = function (uuid) {
        var params = new http_1.URLSearchParams();
        params.set('token', app_commonSet_1.TOKEN);
        params.set('uuid', uuid);
        return this.http.post(this.baseUrl + "/smart/getReportDetail", { headers: this.headers }, { params: params }).toPromise()
            .then(function (response) { return response.json(); }).catch(this.handleError);
    };
    //异常处理
    ReportService.prototype.handleError = function (error) {
        console.error('An error occurred', error); // for demo purposes only   error.message || error
        return Promise.reject(error.message || error);
    };
    return ReportService;
}());
ReportService = __decorate([
    core_1.Injectable()
], ReportService);
exports.ReportService = ReportService;
