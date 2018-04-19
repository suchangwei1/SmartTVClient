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
var home_1 = require("../home/home");
var LoginPage = (function () {
    function LoginPage(toastCtrl, storageProvider, loadCtrl, alertCtrl, platform, navCtrl, loginService) {
        this.toastCtrl = toastCtrl;
        this.storageProvider = storageProvider;
        this.loadCtrl = loadCtrl;
        this.alertCtrl = alertCtrl;
        this.platform = platform;
        this.navCtrl = navCtrl;
        this.loginService = loginService;
    }
    LoginPage.prototype.ngOnInit = function () {
        new CalculateWindowSize();
        if (this.storageProvider.read("userName")) {
            this.userName = this.storageProvider.read("userName") + "";
        }
    };
    LoginPage.prototype.forgotten = function () {
        var toast = this.toastCtrl.create({
            message: "请联系管理员：0771-5528079",
            duration: 3000,
            position: 'bottom',
            dismissOnPageChange: true
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    //登陆
    LoginPage.prototype.onSubmit = function () {
        var _this = this;
        //验证登陆
        var loading = this.loadCtrl.create({
            content: '正在登陆系统...'
        });
        loading.present();
        this.loginService.login(this.userName, this.userPassword).then(function (data) {
            loading.dismiss();
            if (data.success) {
                _this.user = data.obj;
                _this.storageProvider.write("userName", data.obj.userName);
                _this.storageProvider.write("token", data.obj.token);
                _this.navCtrl.setRoot(home_1.HomePage);
            }
            else {
                var alert_1 = _this.alertCtrl.create({
                    title: "信息",
                    message: data.msg,
                    buttons: [
                        {
                            text: "确定",
                            handler: function () {
                            }
                        }
                    ]
                });
                alert_1.present();
            }
        });
    };
    //退出应用
    LoginPage.prototype.showConfirm = function () {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: '提示',
            message: '是否退出应用？',
            buttons: [
                {
                    text: '取消',
                    role: 'cancel',
                    handler: function () {
                    }
                },
                {
                    text: '确定',
                    handler: function () {
                        _this.platform.exitApp();
                    }
                }
            ]
        });
        alert.present();
    };
    return LoginPage;
}());
LoginPage = __decorate([
    core_1.Component({
        selector: 'login-page',
        templateUrl: 'login.html',
    })
], LoginPage);
exports.LoginPage = LoginPage;
