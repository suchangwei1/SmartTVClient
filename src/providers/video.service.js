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
//实时视频
var VideoService = (function () {
    function VideoService(http) {
        this.http = http;
        this.baseUrl = app_commonSet_1.BaseUrl;
        this.headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded,charset=UTF-8' });
    }
    //获取当前在线的巡防人员
    VideoService.prototype.getPeopleOnline = function () {
        var params = new http_1.URLSearchParams();
        params.set('token', app_commonSet_1.TOKEN);
        return this.http.post(this.baseUrl + "/smart/peopleonline", { headers: this.headers }, { params: params }).toPromise()
            .then(function (response) { return response.json(); }).catch(this.handleError);
    };
    //请求巡防人员开启直播
    VideoService.prototype.setPeopleVideoOpen = function (patrolid, receiveId) {
        var params = new http_1.URLSearchParams();
        params.set('token', app_commonSet_1.TOKEN);
        params.set('patrolid', patrolid);
        params.set('receiveId', receiveId);
        return this.http.post(this.baseUrl + "/smart/onlineLive", { headers: this.headers }, { params: params }).toPromise()
            .then(function (response) { return response.json(); }).catch(this.handleError);
    };
    //查询单人直播状态
    VideoService.prototype.checkVideoOpen = function (patrolid, receiveId) {
        var params = new http_1.URLSearchParams();
        params.set('token', app_commonSet_1.TOKEN);
        params.set('patrolid', patrolid);
        params.set('receiveId', receiveId);
        return this.http.post(this.baseUrl + "/smart/onlineLiveToOne", { headers: this.headers }, { params: params }).toPromise()
            .then(function (response) { return response.json(); }).catch(this.handleError);
    };
    //异常处理
    VideoService.prototype.handleError = function (error) {
        console.error('An error occurred', error); // for demo purposes only   error.message || error
        return Promise.reject(error.message || error);
    };
    return VideoService;
}());
VideoService = __decorate([
    core_1.Injectable()
], VideoService);
exports.VideoService = VideoService;
