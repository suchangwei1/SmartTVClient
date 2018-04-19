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
//护边员管理
var PersonsManegeService = (function () {
    function PersonsManegeService(http, storageProvider) {
        this.http = http;
        this.storageProvider = storageProvider;
        this.baseUrl = app_commonSet_1.BaseUrl;
        this.headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded,charset=UTF-8' });
    }
    //获取上报信息统计报表
    PersonsManegeService.prototype.getReportTable = function () {
        var params = new http_1.URLSearchParams();
        params.set('token', app_commonSet_1.TOKEN);
        return this.http.post(this.baseUrl + "/smart/report", { headers: this.headers }, { params: params }).toPromise()
            .then(function (response) { return response.json(); }).catch(this.handleError);
    };
    //获取绩效考核统计报表
    PersonsManegeService.prototype.getSendScoreTable = function () {
        var params = new http_1.URLSearchParams();
        params.set('token', app_commonSet_1.TOKEN);
        return this.http.post(this.baseUrl + "/smart/sendScoreTable", { headers: this.headers }, { params: params }).toPromise()
            .then(function (response) { return response.json(); }).catch(this.handleError);
    };
    //异常处理
    PersonsManegeService.prototype.handleError = function (error) {
        console.error('An error occurred', error); // for demo purposes only   error.message || error
        return Promise.reject(error.message || error);
    };
    return PersonsManegeService;
}());
PersonsManegeService = __decorate([
    core_1.Injectable()
], PersonsManegeService);
exports.PersonsManegeService = PersonsManegeService;
