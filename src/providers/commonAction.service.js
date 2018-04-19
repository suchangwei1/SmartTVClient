"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var home_1 = require("../pages/home/home");
//工具类服务
var CommonAction = (function () {
    function CommonAction(app) {
        this.app = app;
        this.nav = app.getActiveNav();
    }
    //返回首页
    CommonAction.prototype.backHome = function () {
        this.nav.push(home_1.HomePage);
    };
    //数组去重
    CommonAction.prototype.unique = function (arr) {
        arr.sort();
        var newArr = [arr[0]];
        for (var i = 1, len = arr.length; i < len; i++) {
            if (arr[i] !== newArr[newArr.length - 1]) {
                newArr.push(arr[i]);
            }
        }
        return newArr;
    };
    //求数组并集
    CommonAction.prototype.union_array = function (a, b) {
        for (var i = 0, j = 0, ci, r = {}, c = []; ci = a[i++] || b[j++];) {
            if (r[ci])
                continue;
            r[ci] = 1;
            c.push(ci);
        }
        return c;
    };
    //求数组差集
    CommonAction.prototype.minus_array = function (arr1, arr2) {
        var arr3 = [];
        for (var i = 0; i < arr1.length; i++) {
            var flag = true;
            for (var j = 0; j < arr2.length; j++) {
                if (arr2[j] == arr1[i]) {
                    flag = false;
                }
            }
            if (flag) {
                arr3.push(arr1[i]);
            }
        }
        return arr3;
    };
    //求数组交集
    CommonAction.prototype.intersect_array = function (arr1, arr2) {
        var ai = 0, bi = 0;
        var arr3 = new Array();
        while (ai < arr1.length && bi < arr2.length) {
            if (arr1[ai] < arr2[bi]) {
                ai++;
            }
            else if (arr1[ai] > arr2[bi]) {
                bi++;
            }
            else {
                arr3.push(arr1[ai]);
                ai++;
                bi++;
            }
        }
        return arr3;
    };
    //日期工具类
    CommonAction.prototype.getRangeDate = function (time, range) {
        var formatDate = function (time) {
            // 格式化日期
            var Dates = new Date(time);
            var year = Dates.getFullYear();
            var month = (Dates.getMonth() + 1) < 10 ? '0' + (Dates.getMonth() + 1) : (Dates.getMonth() + 1);
            var day = Dates.getDate() < 10 ? '0' + Dates.getDate() : Dates.getDate();
            return year + '-' + month + '-' + day;
        };
        if (range) {
            if (range < 0) {
                var i = Math.abs(range);
                return formatDate(new Date(time).getTime() + (-1000 * 3600 * 24 * i));
            }
            else {
                var i = range;
                return formatDate(new Date(time).getTime() + (1000 * 3600 * 24 * i));
            }
        }
        else {
            return formatDate(time);
        }
    };
    return CommonAction;
}());
CommonAction = __decorate([
    core_1.Injectable()
], CommonAction);
exports.CommonAction = CommonAction;
