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
var directive_1 = require("./directive");
var rxjs_1 = require("rxjs");
var app_commonSet_1 = require("../../app/app.commonSet");
var PatrolPage = (function () {
    function PatrolPage(toastCtrl, LoadCtrl, videoService, reportService, element, commonAction, patrolService, nav, navParams) {
        this.toastCtrl = toastCtrl;
        this.LoadCtrl = LoadCtrl;
        this.videoService = videoService;
        this.reportService = reportService;
        this.element = element;
        this.commonAction = commonAction;
        this.patrolService = patrolService;
        this.nav = nav;
        this.navParams = navParams;
        this.fullScreenFlag = false;
        this.baseUrl = app_commonSet_1.BaseUrl;
        this.data_uuid = []; //所有巡防人员UUID
        this.uuid_now = []; //正在巡防的巡防人员UUID
        this.uuid_add = []; //新开始巡防的巡防人员UUID
        this.uuid_del = []; //结束巡防的巡防人员UUID
        this.peopleMap_now = []; //正在巡防的巡防人员
        this.peopleMap_add = []; //新增的巡防人员
        this.peopleMap_del = []; //结束巡防的巡防人员
        this.fileLength = 0;
        this.mapMarkEntity = []; //所有界碑
        this.personEntity = []; //所有巡防人员
        this.roadEntity = []; //所有巡防路线
        this.had_roadEntity = []; //已巡防的路线
        this.lineColorMap = new Map(); //装载  巡防人员：巡防路线颜色
        this.evntLabel = "全部事件"; //下拉选项默认值
    }
    PatrolPage.prototype.ngOnInit = function () {
        //调用js计算屏幕大小
        new CalculateWindowSize();
        new initPopover();
        new showHeader();
        this.initMap(); //先加载地图
        this.getPeoples(); //获取巡防实时数据
        this.initStaticEntity(); //加载静态数据，边界、界碑等
    };
    PatrolPage.prototype.ngAfterViewInit = function () {
    };
    //地图全屏按钮
    PatrolPage.prototype.fullScreen = function () {
        if (this.fullScreenFlag) {
            new CalculateWindowSize();
            new showHeader();
            this.fullScreenFlag = false;
        }
        else {
            new fullScreen();
            new hideHeader();
            this.fullScreenFlag = true;
        }
    };
    //地图初始化后，获取巡防人员数据
    PatrolPage.prototype.getPeoples = function () {
        var _this = this;
        this.patrolService.getPeoples().then(function (data) {
            if (_this.data) {
                //先存储旧数据
                var old_map = {};
                for (var i = 0; i < _this.data.length; i++) {
                    old_map[_this.data[i].uuid] = _this.data[i];
                }
            }
            //获取新数据
            _this.data = data.obj;
            if (_this.data) {
                var uuid = []; //新获取到的uuid
                //var map_uuid_patrolid = {};
                var new_map = {};
                //新数据处理
                for (var i = 0; i < _this.data.length; i++) {
                    console.log(_this.data[i].uuid);
                    uuid.push(_this.data[i].uuid);
                    new_map[_this.data[i].uuid] = _this.data[i];
                }
                //先去重
                // uuid = this.commonAction.unique(uuid);
                // this.data_uuid = this.commonAction.unique(this.data_uuid);
                console.log("data_uuid:" + _this.data_uuid);
                console.log("uuid:" + uuid);
                var union_array = _this.commonAction.union_array(_this.data_uuid, uuid); //求并集
                _this.uuid_now = _this.commonAction.intersect_array(_this.data_uuid, uuid); //求交集-即正在巡防的人员
                _this.uuid_add = _this.commonAction.minus_array(union_array, _this.data_uuid); //求差集-即新增巡防的人员
                _this.uuid_del = _this.commonAction.minus_array(union_array, uuid); //求差集-即退出巡防的人员
                //执行完后，更新data_uuid为最新的数据
                _this.data_uuid = uuid;
                console.log("并集：" + union_array);
                //得到交集，装载正在巡防人员entity
                console.log("交集：" + _this.uuid_now);
                _this.peopleMap_now = [];
                for (var i = 0; i < _this.uuid_now.length; i++) {
                    _this.peopleMap_now.push(new_map[_this.uuid_now[i]]);
                }
                console.log("正在巡防map_now：" + _this.peopleMap_now);
                //得到差集，装载新增巡防人员entity
                console.log("新增：" + _this.uuid_add);
                _this.peopleMap_add = [];
                for (var i = 0; i < _this.uuid_add.length; i++) {
                    _this.peopleMap_add.push(new_map[_this.uuid_add[i]]);
                }
                console.log("新增map_add：" + _this.peopleMap_add);
                //删除 做法与前面的做法有区别，只装载
                // var uuid_patrolid = {};
                // uuid_patrolid['uuid']=this.data[i].uuid;
                // uuid_patrolid['patrolid']=this.data[i].patrolid;
                // map_uuid_patrolid[this.data[i].uuid]=uuid_patrolid;
                console.log("删除：" + _this.uuid_del);
                _this.peopleMap_del = [];
                for (var i = 0; i < _this.uuid_del.length; i++) {
                    _this.peopleMap_del.push(old_map[_this.uuid_del[i]]);
                }
                console.log("删除map_del：" + _this.peopleMap_del);
                //执行 刷新地图实体
                _this.doUpdateEntity();
            }
        });
    };
    PatrolPage.prototype.back = function () {
        if (this.timer) {
            clearInterval(this.timer);
        }
        console.log("返回，关闭实时刷新");
        //调用mouseleave滚动公告，防止公告不滚动
        var myMarquee = document.querySelector('#myMarquee');
        new mouseleave(myMarquee);
        this.nav.pop();
        new showHeader(); //显示头部
        //this.commonAction.backHome();
    };
    //打开个人信息详情页
    PatrolPage.prototype.showPatrolinfo = function (entityId) {
        var _this = this;
        //alert("打开，走ts");
        this.evntLabel = "全部事件"; //下拉选项默认值
        //数据拆分
        var entityInfo = entityId.split("*");
        console.log("信息上报：" + entityInfo[0] + "," + entityInfo[1] + "," + entityInfo[2]);
        //存全局变量
        this.uuid = entityInfo[1];
        this.patrolid = entityInfo[2];
        //请求服务器数据
        this.patrolService.getReportById(this.uuid, this.patrolid).then(function (data) {
            //基本信息
            _this.patroldata = data.obj;
            //上报信息列表
            _this.infolist = data.obj.infolist;
            _this.infolist_bak = data.obj.infolist;
            //显示个人巡防数据、上报信息
            new showPatrolinfo();
        });
    };
    //关闭个人信息详情页
    PatrolPage.prototype.closePatrolinfo = function () {
        //alert("关闭，走ts");
        new closePatrolinfo();
    };
    //个人详情页的观看直播按钮
    PatrolPage.prototype.showVideoPage = function (patrolid, uuid) {
        console.log(patrolid + ',' + uuid);
        this.checkVidelStatus(patrolid, uuid);
        //this.nav.push(VideoPage, {reportId: this.uuid, patrolid: this.patrolid, fullScreenFlag: this.fullScreenFlag});
    };
    PatrolPage.prototype.videoPage = function (entityId) {
        //跳转到视频直播页面*巡防人员冒泡窗口的观看直播按钮
        var entityInfo = entityId.split("*");
        console.log("信息上报：" + entityInfo[0] + "," + entityInfo[1] + "," + entityInfo[2]);
        var uuid = entityInfo[1];
        var patrolid = entityInfo[2];
        // this.nav.push(VideoPage, {reportId: uuid, patrolid: patrolid, fullScreenFlag: this.fullScreenFlag});
        this.checkVidelStatus(patrolid, uuid);
    };
    //请求直播
    PatrolPage.prototype.checkVidelStatus = function (patrolid, uuid) {
        var _this = this;
        //请求直播状态，开始观看直播
        this.videoService.setPeopleVideoOpen(patrolid, uuid).then(function (data) {
            var loading = _this.LoadCtrl.create({
                spinner: "dots",
                content: data.msg,
                duration: 1000
            });
            if (data.success) {
                _this.videoInfo = data.obj;
                if (_this.videoInfo && _this.videoInfo != null) {
                    _this.play(_this.videoInfo.liveurl, _this.videoInfo.tvUrl);
                }
                else {
                    //对方还未开启直播，服务器端直接请求开启，开启定时器检测对方是否开启
                    _this.checkVideoOpen(patrolid, uuid);
                    loading.present();
                }
            }
            else {
                loading.present();
            }
        });
    };
    //定时器获取直播状态
    PatrolPage.prototype.checkVideoOpen = function (patrolid, uuid) {
        var _this = this;
        var checkVideoOpenTimer = setInterval(function () {
            console.log("定时器获取当前人直播状态！");
            _this.videoService.checkVideoOpen(patrolid, uuid).then(function (data) {
                console.log(data);
                if (data.success) {
                    var videoInfoTemp = data.obj;
                    if (videoInfoTemp) {
                        //对方已经开启了直播,弹出提示，并关闭定时器
                        var toast = _this.toastCtrl.create({
                            message: "对方直播已经开启",
                            duration: 2000,
                            position: 'bottom'
                        });
                        toast.present();
                        console.log("对方已经开启了直播,弹出提示，并关闭定时器");
                        if (checkVideoOpenTimer) {
                            clearInterval(checkVideoOpenTimer);
                        }
                    }
                }
            });
        }, 2000);
    };
    //推流，并用vlc观看直播
    PatrolPage.prototype.play = function (phoneUrl, tvUrl) {
        //console.log(url);
        //选择系统内的播放器播放
        // if(typeof(VideoPlayer)!= 'undefined'){
        //   VideoPlayer.play(url);
        // }else{
        //   var loading = this.LoadCtrl.create({
        //     spinner:"dots",
        //     content:`该设备不暂支持播放视频！`,
        //     duration:1000
        //   });
        //   loading.present();
        // }
        //指定自定义vlc播放器播放
        if (typeof (VideoPush) != 'undefined') {
            //VlcPlayer.playByVlc(url);
            //调用视频插件开启直播，监听返回值,tvUrl为推流地址，phoneUrl为播放地址
            VideoPush.SendInfo(tvUrl, phoneUrl, "SmartTVClient", function (res) {
                console.log('调用视频结束:', res);
                //触发关闭直播，发送请求到服务器端，修改直播状态
                //alert(res);
            }, function (err) {
                console.log(err);
            });
        }
        else {
            var loading = this.LoadCtrl.create({
                spinner: "dots",
                content: "\u8BE5\u8BBE\u5907\u4E0D\u6682\u652F\u6301\u64AD\u653E\u89C6\u9891\uFF01",
                duration: 1000
            });
            loading.present();
        }
    };
    //跳转到信息上报详细页面
    PatrolPage.prototype.reportViewPage = function (uuid) {
        var _this = this;
        //直接跳转页面
        //this.nav.push(ReportView,{reportId:id});
        console.log(uuid);
        this.reportService.eventView(uuid).then(function (data) {
            _this.modelDate = data.obj;
            if (_this.modelDate) {
                _this.firstFile = _this.modelDate.files.pop(); //取出第一个文件并移除
                _this.fileLength = _this.modelDate.files.length;
            }
        });
        //弹出页面
        new showMessDetailes();
    };
    //根据类型判断事件窗口颜色     0-基础设施；1-涉外事件；2-走私事件；3-突发事件
    PatrolPage.prototype.color = function (typename) {
        var color = { '0': 'green', '1': 'blue', '2': 'orange', '3': 'red' };
        return 'mess-items show-mess-detailes ' + color[typename];
    };
    //分类显示事件列表  0-基础设施；1-涉外事件；2-走私事件；3-突发事件
    PatrolPage.prototype.changeEvent = function (type) {
        if (this.infolist_bak) {
            var infolist_0 = [];
            var infolist_1 = [];
            var infolist_2 = [];
            var infolist_3 = [];
            var list = this.infolist_bak;
            for (var i = 0; i < list.length; i++) {
                switch (list[i].send_info_type) {
                    case 0:
                        infolist_0.push(list[i]);
                        break;
                    case 1:
                        infolist_1.push(list[i]);
                        break;
                    case 2:
                        infolist_2.push(list[i]);
                        break;
                    case 3:
                        infolist_3.push(list[i]);
                        break;
                }
            }
            console.log(infolist_0);
            console.log(infolist_1);
            console.log(infolist_2);
            console.log(infolist_3);
            switch (type) {
                case 0:
                    this.infolist = infolist_0;
                    this.evntLabel = "基础设施";
                    break;
                case 1:
                    this.infolist = infolist_1;
                    this.evntLabel = "涉外事件";
                    break;
                case 2:
                    this.infolist = infolist_2;
                    this.evntLabel = "走私事件";
                    break;
                case 3:
                    this.infolist = infolist_3;
                    this.evntLabel = "突发事件";
                    break;
                default:
                    this.infolist = this.infolist_bak;
                    this.evntLabel = "全部事件";
            }
        }
    };
    //根据类型判断事件名称   0-基础设施；1-涉外事件；2-走私事件；3-突发事件
    PatrolPage.prototype.typeToName = function (send_info_type) {
        var map = { '0': '基础设施', '1': '涉外事件', '2': '走私事件', '3': '突发事件' };
        return map[send_info_type];
    };
    //控制界碑显示
    PatrolPage.prototype.showMapMark = function () {
        var mapMarks = this.mapMarkEntity;
        this.checkbox_showMapMark = document.querySelector('#showMapMark');
        if (this.checkbox_showMapMark.getAttribute('value') == '1') {
            for (var k = 0; k < mapMarks.length; k++) {
                mapMarks[k].show = true;
            }
            this.checkbox_showMapMark.setAttribute('value', '0');
        }
        else {
            for (var k = 0; k < mapMarks.length; k++) {
                mapMarks[k].show = false;
            }
            this.checkbox_showMapMark.setAttribute('value', '1');
        }
    };
    //控制边界显示
    PatrolPage.prototype.showMapLine = function () {
        var mapLine = this.lineEntity;
        this.checkbox_showMapLine = document.querySelector('#showMapLine');
        console.log(this.checkbox_showMapLine);
        if (this.checkbox_showMapLine.getAttribute('value') == '1') {
            mapLine.show = true;
            this.checkbox_showMapLine.setAttribute('value', '0');
        }
        else {
            mapLine.show = false;
            this.checkbox_showMapLine.setAttribute('value', '1');
        }
    };
    //控制实时刷新
    PatrolPage.prototype.autoFresh = function () {
        var _this = this;
        this.checkbox_autoFresh = document.querySelector('#autoFresh');
        if (this.checkbox_autoFresh.getAttribute('value') == '1') {
            this.timer = setInterval(function () {
                console.log("开启实时刷新，5s刷新一次");
                _this.getPeoples();
            }, 1000 * 5);
            this.checkbox_autoFresh.setAttribute('value', '0');
        }
        else {
            if (this.timer) {
                clearInterval(this.timer);
            }
            console.log("关闭实时刷新");
            this.checkbox_autoFresh.setAttribute('value', '1');
        }
    };
    //刷新 地图实体
    PatrolPage.prototype.doUpdateEntity = function () {
        //新增巡防人员
        this.initDynamicEntity_add(this.peopleMap_add);
        //移除巡防人员
        this.initDynamicEntity_del(this.peopleMap_del);
        //更新巡防人员
        this.initDynamicEntity_update(this.peopleMap_now);
        //更新颜色标识
        this.showLineColor();
    };
    //初始化地图
    PatrolPage.prototype.initMap = function () {
        //BingMapApi key
        Cesium.BingMapsApi.defaultKey = "J6oHjfVD1h4EB0imMAEt~2ojF_8N_GXKSntrzgp70uA~AtCDJ0Zg6BNbhbUPyWmFEwBFraxXY24rXtQ63kVAesKlmcGOMUBgDXSmIS8LIZKv";
        //全球影像地图服务
        this.viewer = new Cesium.Viewer("cesiumContainer", {
            animation: false,
            baseLayerPicker: false,
            //geocoder: true, //是否显示地名查找控件,默认true
            timeline: false,
            sceneModePicker: true,
            navigationHelpButton: false,
            infoBox: true,
            fullscreenButton: false,
            sceneMode: Cesium.SceneMode.SCENE2D,
        });
        this.viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
            url: "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles",
            //url: "http://www.mapgx.com/ime-server/rest/tdtgx_img/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles",
            layer: "tdtBasicLayer",
            style: "default",
            format: "image/jpeg",
            tileMatrixSetID: "GoogleMapsCompatible",
            show: false
        }));
        //默认cesium地图
        // this.viewer = new Cesium.Viewer('cesiumContainer',{
        //   animation:false, //动画控制，默认true
        //   timeline:false,//时间线,默认true
        //   sceneMode:Cesium.SceneMode.SCENE2D,
        // } );
        //全球影像中文注记服务
        this.viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
            url: "http://t0.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg",
            layer: "tdtAnnoLayer",
            style: "default",
            format: "image/jpeg",
            tileMatrixSetID: "GoogleMapsCompatible",
            show: false
        }));
        this.viewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(app_commonSet_1.LONGITUDE, app_commonSet_1.LATITUDE, app_commonSet_1.HEIGHT),
            orientation: {
                heading: 0.0,
                pitch: -Cesium.Math.PI_OVER_TWO,
                roll: 0.0
            }
        });
        //设置HOME按钮定位到中国
        Cesium.Rectangle.MAX_VALUE = Cesium.Rectangle.fromDegrees(65, -10, 145, 70);
        Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(65, -10, 145, 70);
        // let mylongitude = 106.85417175292945;
        // let mylatitude = 22.34499936506692;
        // let myheight = 202078.132840822502;
        // Cesium.Rectangle.MAX_VALUE = Cesium.Cartesian3.fromDegrees(mylongitude, mylatitude, myheight);
        // Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Cartesian3.fromDegrees(mylongitude, mylatitude, myheight);
        //取消双击事件
        this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        //隐藏Cesium信息
        this.viewer.bottomContainer.style.display = "none";
        //alert("initMap");
        //初始化map的时候,给entity添加点击事件的监听
        //调用接口-气泡窗口
        var handler3D = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        var setViewer = this.viewer;
        handler3D.setInputAction(function (movement) {
            //点击弹出气泡窗口
            var pick = setViewer.scene.pick(movement.position);
            if (pick && pick.id) {
                //判断点击的元素是不是巡防人员
                console.log(pick.id);
                //点击的是巡防人员
                if (pick.id._type.lastIndexOf("person") > -1) {
                    console.log("点击巡防人员：" + pick.id._id);
                    var cartographic = Cesium.Cartographic.fromCartesian(pick.id._position._value); //世界坐标转地理坐标（弧度）
                    var point = [cartographic.longitude / Math.PI * 180, cartographic.latitude / Math.PI * 180]; //地理坐标（弧度）转经纬度坐标
                    var destination = Cesium.Cartesian3.fromDegrees(point[0], point[1] + 0.0055, 4000.0);
                    var content = pick.id._description._value;
                    var css = { 'width': '400px' };
                    var obj = { position: movement.position, destination: destination, content: content, css: css };
                    setViewer.infoWindow(setViewer, obj);
                }
                else if (pick.id._type.lastIndexOf("mapMark") > -1) {
                    //点击的是界碑
                    console.log("点击界碑：" + pick.id._id);
                    var cartographic = Cesium.Cartographic.fromCartesian(pick.id._position._value); //世界坐标转地理坐标（弧度）
                    var point = [cartographic.longitude / Math.PI * 180, cartographic.latitude / Math.PI * 180]; //地理坐标（弧度）转经纬度坐标
                    var destination = Cesium.Cartesian3.fromDegrees(point[0], point[1] + 0.0055, 4000.0);
                    var content = pick.id._description._value;
                    var css = { 'width': '400px' };
                    var obj = { position: movement.position, destination: destination, content: content, css: css };
                    setViewer.infoWindow(setViewer, obj);
                }
                else {
                    //其他，不显示冒泡
                    new hideInfoBox();
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        var self = this;
        //监听entity点击事件
        this.viewer.selectedEntityChanged.addEventListener(function (entity) {
            // Check if an entity with a point color was selected.
            if (Cesium.defined(entity)) {
                if (entity.type.lastIndexOf("person") > -1) {
                    console.log("监听infobox中的按钮点击事件：" + entity.id);
                    rxjs_1.Observable.interval(1000).take(1).subscribe(function () {
                        this.reportBtn = document.querySelector('#reportbtn');
                        this.reportBtnEvent = rxjs_1.Observable.fromEvent(this.reportBtn, 'click');
                        this.reportBtnEvent.subscribe(function (x) {
                            self.showPatrolinfo(entity._id);
                        });
                        this.videoBtn = document.querySelector('#videobtn');
                        this.videoBtnEvent = rxjs_1.Observable.fromEvent(this.videoBtn, 'click');
                        this.videoBtnEvent.subscribe(function (x) {
                            self.videoPage(entity._id);
                        });
                    });
                }
            }
            else {
                //隐藏 个人巡防信息两侧数据
                new closePatrolinfo();
            }
        });
    };
    //静态数据
    PatrolPage.prototype.initStaticEntity = function () {
        var _this = this;
        var map_line = "map_line";
        this.patrolService.getMapLine(map_line).then(function (data) {
            if (data.success) {
                var lineStr = data.obj.value;
                var mapLine_str = lineStr.split(",");
                var mapLine_int = [];
                for (var i = 0; i < mapLine_str.length; i++) {
                    mapLine_int.push(Number(mapLine_str[i]));
                }
                console.log(mapLine_int);
                //加载龙州县区域线
                _this.lineEntity = _this.viewer.entities.add({
                    type: "line",
                    polyline: {
                        positions: Cesium.Cartesian3.fromDegreesArray(mapLine_int),
                        width: 3,
                        material: Cesium.Color.BLUE
                    }
                });
            }
        });
        var china_line = "china_line";
        this.patrolService.getMapLine(china_line).then(function (data) {
            if (data.success) {
                var lineStr = data.obj.value;
                var chinaLine_str = lineStr.split(",");
                var chinaLine_int = [];
                for (var i = 0; i < chinaLine_str.length; i++) {
                    chinaLine_int.push(Number(chinaLine_str[i]));
                }
                console.log(chinaLine_int);
                //加载中国边境线-靠近龙州部分
                _this.china_lineEntity = _this.viewer.entities.add({
                    type: "line",
                    polyline: {
                        positions: Cesium.Cartesian3.fromDegreesArray(chinaLine_int),
                        width: 5,
                        material: new Cesium.PolylineDashMaterialProperty({
                            color: Cesium.Color.RED
                        })
                    }
                });
            }
        });
        //viewer.zoomTo(viewer.entities);
        //加载界碑
        this.patrolService.getMapMark().then(function (data) {
            var mapMarks = data.obj;
            for (var j = 0; j < mapMarks.length; j++) {
                var pinBuilder = new Cesium.PinBuilder();
                var mapMark = _this.viewer.entities.add({
                    id: "mapMark*" + mapMarks[j].id,
                    type: "mapMark",
                    position: Cesium.Cartesian3.fromDegrees(mapMarks[j].longitude, mapMarks[j].latitude),
                    show: false,
                    label: {
                        text: mapMarks[j].name,
                        font: '14pt monospace',
                        verticalOrigin: Cesium.VerticalOrigin.TOP
                    },
                    billboard: {
                        image: 'assets/img/jb.png',
                        width: 40,
                        height: 50,
                        pixelOffset: new Cesium.Cartesian2(0, -25)
                    }
                });
                mapMark.description =
                    '<div style="border-radius:10px ;padding:10px 10px;background-color: white;display: block;box-sizing: content-box;position: relative;" ><div class="maps-tips"> ' +
                        '<div class="row"> <div class="col-xs-5" style="float:left;width:30%"> ' +
                        '<h6 class="margin-0px align-center">' +
                        '<img alt="" src="' + mapMarks[j].icon + '" onerror="mapMarkImgOnError(this)"  width="100px" height="100px" />' +
                        '</h6> <h5 class="align-center">' + mapMarks[j].name + '</h5> ' +
                        '</div> <div class="col-xs-7" style="float:rigth; width:60%">' +
                        '<p>界碑位置：<br />' + mapMarks[j].longitude + '，' + mapMarks[j].latitude + '</p> ' +
                        '</div> </div> <hr /> ' +
                        '</div></div>';
                //存所有界碑
                _this.mapMarkEntity.push(mapMark);
            }
        });
    };
    //动态数据渲染到地图上-add
    PatrolPage.prototype.initDynamicEntity_add = function (data) {
        console.log("新增巡防人员begin...");
        var d = data;
        //for循环开始
        for (var i = 0; i < d.length; i++) {
            //alert(d[i].name+"="+d[i].longitude+","+d[i].latitude);
            //显示巡防人员位置
            var person = this.viewer.entities.add({
                id: "person*" + d[i].uuid + "*" + d[i].patrolid,
                type: "person",
                position: Cesium.Cartesian3.fromDegrees(d[i].longitude, d[i].latitude),
                billboard: {
                    image: 'assets/img/u406.png',
                    width: 33,
                    height: 50,
                    pixelOffset: new Cesium.Cartesian2(0, -25)
                },
                label: {
                    text: d[i].name,
                    font: '14pt monospace',
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    outlineWidth: 2,
                    verticalOrigin: Cesium.VerticalOrigin.TOP,
                    pixelOffset: new Cesium.Cartesian2(0, 10)
                }
            });
            person.description =
                '<div style="border-radius:10px ;padding:10px 10px;background-color: white;display: block;box-sizing: content-box;position: relative;" ><div class="maps-tips"> ' +
                    '<div class="row" > <div class="col-xs-5" style="float:left;width:30%">  ' +
                    '<h6 class="margin-0px align-center">' +
                    '<img alt="" src="' + d[i].icon + '" onerror="personImgOnError(this)" width="100px" height="100px"/>' +
                    '</h6> <h5 class="align-center">' + d[i].name + '</h5> ' +
                    '</div> <div class="col-xs-7" style="float:rigth; width:60%"><input type="hidden" id="entityId" value="' + d[i].uuid + '"> <p>巡防路段：' + d[i].roadname + '</p> ' +
                    '<p>巡防距离：' + d[i].totaldistance + 'KM</p> <p>已巡防　：' + d[i].patroldistance + 'KM</p> ' +
                    '<p>实时位置：<br />' + d[i].longitude + '，' + d[i].latitude + '</p> ' +
                    '</div> </div> <hr /> ' +
                    '<h6 class="margin-0px align-center"> ' +
                    '<a class="btn btn-success" id="reportbtn"><i class="glyphicon glyphicon-comment"></i>信息上报(' + d[i].reportcount + ')</a> ' +
                    '<a class="btn btn-danger" id="videobtn"><i class="glyphicon glyphicon-facetime-video"></i> 视频回传</a> </h6> ' +
                    '</div></div>';
            //存所有巡防人员
            this.personEntity.push(person);
            //显示个人巡防路线
            var roadinfo = d[i].roadinfo;
            var roadinfo_positionsArray = [];
            for (var a = 0; a < roadinfo.length; a++) {
                roadinfo_positionsArray.push(roadinfo[a].longitude);
                roadinfo_positionsArray.push(roadinfo[a].latitude);
            }
            if (roadinfo_positionsArray.length > 0) {
                var raod = this.viewer.entities.add({
                    id: "road*" + d[i].uuid + "*" + d[i].patrolid,
                    type: "road",
                    polyline: {
                        positions: Cesium.Cartesian3.fromDegreesArray(roadinfo_positionsArray),
                        width: 5,
                        material: Cesium.Color.BLUE
                    }
                });
                //存个人巡防路线
                this.roadEntity.push(raod);
            }
            //显示个人已经巡防的路线
            var patrolinfo = d[i].patrolinfo;
            var patrolinfo_positionsArray = [];
            for (var b = 0; b < patrolinfo.length; b++) {
                patrolinfo_positionsArray.push(patrolinfo[b].longitude);
                patrolinfo_positionsArray.push(patrolinfo[b].latitude);
            }
            var myMaterial = Cesium.Color.fromRandom({ alpha: 0.9 });
            var red = Cesium.Color.floatToByte(myMaterial.red);
            var green = Cesium.Color.floatToByte(myMaterial.green);
            var blue = Cesium.Color.floatToByte(myMaterial.blue);
            var myColor = { "red": red, "green": green, "blue": blue };
            if (patrolinfo_positionsArray.length > 0) {
                var patrolinfo = this.viewer.entities.add({
                    id: "had_road*" + d[i].uuid + "*" + d[i].patrolid,
                    type: "had_road",
                    polyline: {
                        positions: Cesium.Cartesian3.fromDegreesArray(patrolinfo_positionsArray),
                        width: 5,
                        // material : Cesium.Color.AQUA
                        material: myMaterial
                    }
                });
                //存个人已经巡防的路线
                this.had_roadEntity.push(patrolinfo);
            }
            //装载 巡防人实体ID：路线颜色map
            var tempMap = { "name": d[i].name, "color": myColor };
            this.lineColorMap.set("person*" + d[i].uuid + "*" + d[i].patrolid, tempMap);
        }
        console.log("颜色", this.lineColorMap);
        console.log("新增巡防人员end...");
        //for循环结束
    };
    //动态数据渲染到地图上-update
    PatrolPage.prototype.initDynamicEntity_update = function (data) {
        console.log("更新巡防人员begin...");
        var d = data;
        //for循环开始
        for (var i = 0; i < d.length; i++) {
            //更新巡防人员坐标
            var id = 'person*' + d[i].uuid + '*' + d[i].patrolid;
            var person = this.viewer.entities.getById(id);
            person.position = Cesium.Cartesian3.fromDegrees(d[i].longitude, d[i].latitude);
            person.description =
                '<div style="border-radius:10px ;padding:10px 10px;background-color: white;display: block;box-sizing: content-box;position: relative;" ><div class="maps-tips"> ' +
                    '<div class="row" > <div class="col-xs-5" style="float:left;width:30%">  ' +
                    '<h6 class="margin-0px align-center">' +
                    '<img alt="" src="' + d[i].icon + '" onerror="personImgOnError(this)" width="100px" height="100px"/>' +
                    '</h6> <h5 class="align-center">' + d[i].name + '</h5> ' +
                    '</div> <div class="col-xs-7" style="float:rigth; width:60%"><input type="hidden" id="entityId" value="' + d[i].uuid + '"> <p>巡防路段：' + d[i].roadname + '</p> ' +
                    '<p>巡防距离：' + d[i].totaldistance + 'KM</p> <p>已巡防　：' + d[i].patroldistance + 'KM</p> ' +
                    '<p>实时位置：<br />' + d[i].longitude + '，' + d[i].latitude + '</p> ' +
                    '</div> </div> <hr /> ' +
                    '<h6 class="margin-0px align-center"> ' +
                    '<a class="btn btn-success" id="reportbtn"><i class="glyphicon glyphicon-comment"></i>信息上报(' + d[i].reportcount + ')</a> ' +
                    '<a class="btn btn-danger" id="videobtn"><i class="glyphicon glyphicon-facetime-video"></i> 视频回传</a> </h6> ' +
                    '</div></div>';
            //更新已巡防路线
            var roadid = "had_road*" + d[i].uuid + '*' + d[i].patrolid;
            var patrolinfo = d[i].patrolinfo;
            var patrolinfo_positionsArray = [];
            for (var b = 0; b < patrolinfo.length; b++) {
                patrolinfo_positionsArray.push(patrolinfo[b].longitude);
                patrolinfo_positionsArray.push(patrolinfo[b].latitude);
            }
            if (patrolinfo_positionsArray.length > 0) {
                var patrolinfo = this.viewer.entities.getById(roadid);
                console.log(patrolinfo);
                //console.log(patrolinfo_positionsArray);
                patrolinfo.polyline.positions = Cesium.Cartesian3.fromDegreesArray(patrolinfo_positionsArray);
            }
        }
        console.log("更新巡防人员end...");
    };
    //动态数据渲染到地图上-del
    PatrolPage.prototype.initDynamicEntity_del = function (data) {
        console.log("删除巡防人员begin...");
        var d = data;
        //for循环开始
        for (var i = 0; i < d.length; i++) {
            //alert(d[i].name+"="+d[i].longitude+","+d[i].latitude);
            //移除巡防人员
            var id = 'person*' + d[i].uuid + '*' + d[i].patrolid;
            var person = this.viewer.entities.getById(id);
            this.viewer.entities.remove(person);
            //移除个人巡防路线
            var roadid = "road*" + d[i].uuid + '*' + d[i].patrolid;
            var road = this.viewer.entities.getById(roadid);
            this.viewer.entities.remove(road);
            //移除已巡防路线
            var had_roadid = 'had_road*' + d[i].uuid + '*' + d[i].patrolid;
            var had_road = this.viewer.entities.getById(had_roadid);
            this.viewer.entities.remove(had_road);
            //移除颜色标识
            this.lineColorMap.delete(id);
        }
        //for循环结束
        console.log("删除巡防人员end...");
    };
    //显示轨迹标识
    PatrolPage.prototype.showLineColor = function () {
        var self = this;
        //先清空数组
        self.lineColorList = [];
        this.lineColorMap.forEach(function (value, index, array) {
            self.lineColorList.push(value);
        });
        console.log("颜色标识列表：", this.lineColorList);
    };
    return PatrolPage;
}());
__decorate([
    core_1.ViewChild(directive_1.SomeDirective)
], PatrolPage.prototype, "vc", void 0);
PatrolPage = __decorate([
    core_1.Component({
        selector: 'patrol-page',
        templateUrl: 'patrol.html'
    })
], PatrolPage);
exports.PatrolPage = PatrolPage;
