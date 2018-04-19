/// <reference path="../../declarations.d.ts"/>
import {Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {NavController, LoadingController, ToastController} from 'ionic-angular';
import {BaseUrl, LONGITUDE, LATITUDE, HEIGHT} from '../../app/app.commonSet'
import {PatrolService} from '../../providers/patrol.service';
import {CommonAction} from '../../providers/commonAction.service';
import {ReportService} from '../../providers/report.service';
import {VideoService} from "../../providers/video.service";
import {LoginService} from "../../providers/login.service";

import {SomeDirective} from './directive';
import {Observable} from 'rxjs'


declare var VlcPlayer;  //指定自定义vlc播放器播放
@Component({
  selector: 'patrol-page',
  templateUrl: 'patrol.html'
})
export class PatrolPage implements OnInit,AfterViewInit {

  fullScreenFlag = false;

  baseUrl = BaseUrl;

  data: any; //巡防人员基础数据
  data_bak: any; //巡防人员基础数据-备份
  data_uuid: any[] = []; //所有巡防人员UUID

  uuid_now: any[] = []; //正在巡防的巡防人员UUID
  uuid_add: any[] = []; //新开始巡防的巡防人员UUID
  uuid_del: any[] = []; //结束巡防的巡防人员UUID

  peopleMap_now: any[] = [];//正在巡防的巡防人员
  peopleMap_add: any[] = [];//新增的巡防人员
  peopleMap_del: any[] = [];//结束巡防的巡防人员

  modelDate: any; //上报信息详细页数据

  firstFile: any;//第一个附件对象
  fileLength = 0;

  patroldata: any;  //巡防人员基本信息
  infolist: any; //巡防人员上报数据列表
  infolist_bak: any;
  viewer: any;

  reportBtn: any;//信息上报按钮
  reportBtnEvent: any;//信息上报按钮点击事件

  videoBtn: any;//观看直播按钮
  videoBtnEvent: any;//观看直播按钮点击事件

  uuid: string;  //巡防人员UUID
  patrolid: string;  //单次巡防ID

  mapMarkEntity = [];  //所有界碑
  personEntity = [];  //所有巡防人员
  roadEntity = [];  //所有巡防路线
  had_roadEntity = [];//已巡防的路线
  lineEntity: any;//龙州县区域线
  china_lineEntity: any;//国界线之龙州区域
  lineColorMap = new Map();//装载  巡防人员：巡防路线颜色
  lineColorList: any;
  videoInfo: any;

  checkbox_showMapMark: any;  //显示界碑选框
  checkbox_showMapLine: any;  //显示边界选框
  checkbox_autoFresh: any; //自动刷新选框
  timer: any;//定时器

  user: any;//当前登陆用户

  evntLabel = "全部事件"; //下拉选项默认值
  @ViewChild(SomeDirective) vc: SomeDirective;

  constructor(private toastCtrl: ToastController,
              public LoadCtrl: LoadingController,
              private videoService: VideoService,
              private reportService: ReportService,
              private commonAction: CommonAction,
              private patrolService: PatrolService,
              private loginService: LoginService,
              private nav: NavController) {
  }

  ngOnInit(): void {

    //调用js计算屏幕大小
    new CalculateWindowSize();
    new initPopover();
    new showHeader();

    //获取当前登陆用户
    this.user = this.loginService.getLoginUser();
    this.initMap();//先加载地图
    this.getPeoples(); //获取巡防实时数据
    this.initStaticEntity(); //加载静态数据，边界、界碑等

  }

  ngAfterViewInit(): void {

  }

  //地图全屏按钮
  fullScreen() {
    if (this.fullScreenFlag) {
      new CalculateWindowSize();
      new showHeader();
      this.fullScreenFlag = false;
    } else {
      new fullScreen();
      new hideHeader();
      this.fullScreenFlag = true;
    }

  }

  //地图初始化后，获取巡防人员数据
  getPeoples() {
    this.patrolService.getPeoples().then(data => {
      if (this.data) {
        //先存储旧数据
        var old_map = {};
        for (var i = 0; i < this.data.length; i++) {
          old_map[this.data[i].uuid] = this.data[i];
        }
      }

      //获取新数据
      this.data = data.obj;
      if (this.data) {
        var uuid = [];//新获取到的uuid
        //var map_uuid_patrolid = {};
        var new_map = {};
        //新数据处理
        for (var i = 0; i < this.data.length; i++) {
          console.log(this.data[i].uuid);
          uuid.push(this.data[i].uuid);
          new_map[this.data[i].uuid] = this.data[i];
        }

        //先去重
        // uuid = this.commonAction.unique(uuid);
        // this.data_uuid = this.commonAction.unique(this.data_uuid);
        console.log("data_uuid:" + this.data_uuid);
        console.log("uuid:" + uuid);
        var union_array = this.commonAction.union_array(this.data_uuid, uuid);//求并集
        this.uuid_now = this.commonAction.intersect_array(this.data_uuid, uuid);//求交集-即正在巡防的人员
        this.uuid_add = this.commonAction.minus_array(union_array, this.data_uuid);//求差集-即新增巡防的人员
        this.uuid_del = this.commonAction.minus_array(union_array, uuid);//求差集-即退出巡防的人员
        //执行完后，更新data_uuid为最新的数据
        this.data_uuid = uuid;

        console.log("并集：" + union_array);

        //得到交集，装载正在巡防人员entity
        console.log("交集：" + this.uuid_now);
        this.peopleMap_now = [];
        for (var i = 0; i < this.uuid_now.length; i++) {
          this.peopleMap_now.push(new_map[this.uuid_now[i]]);
        }
        console.log("正在巡防map_now：" + this.peopleMap_now);

        //得到差集，装载新增巡防人员entity
        console.log("新增：" + this.uuid_add);
        this.peopleMap_add = [];
        for (var i = 0; i < this.uuid_add.length; i++) {
          this.peopleMap_add.push(new_map[this.uuid_add[i]]);
        }
        console.log("新增map_add：" + this.peopleMap_add);

        //删除 做法与前面的做法有区别，只装载
        // var uuid_patrolid = {};
        // uuid_patrolid['uuid']=this.data[i].uuid;
        // uuid_patrolid['patrolid']=this.data[i].patrolid;
        // map_uuid_patrolid[this.data[i].uuid]=uuid_patrolid;
        console.log("删除：" + this.uuid_del);
        this.peopleMap_del = [];
        for (var i = 0; i < this.uuid_del.length; i++) {
          this.peopleMap_del.push(old_map[this.uuid_del[i]]);
        }
        console.log("删除map_del：" + this.peopleMap_del);
        //执行 刷新地图实体
        this.doUpdateEntity();
      }
    });
  }

  back() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    console.log("返回，关闭实时刷新");

    //调用mouseleave滚动公告，防止公告不滚动
    var myMarquee = <HTMLDivElement>document.querySelector('#myMarquee');
    new mouseleave(myMarquee);

    this.nav.pop();
    new showHeader();//显示头部
    //this.commonAction.backHome();
  }

  //打开个人信息详情页
  showPatrolinfo(entityId: string) {
    //alert("打开，走ts");
    this.evntLabel = "全部事件"; //下拉选项默认值
    //数据拆分
    var entityInfo = entityId.split("*");
    console.log("信息上报：" + entityInfo[0] + "," + entityInfo[1] + "," + entityInfo[2]);
    //存全局变量
    this.uuid = entityInfo[1];
    this.patrolid = entityInfo[2];
    //请求服务器数据
    this.patrolService.getReportById(this.uuid, this.patrolid).then(data => {
      //基本信息
      this.patroldata = data.obj;
      //上报信息列表
      this.infolist = data.obj.infolist;
      this.infolist_bak = data.obj.infolist;
      //显示个人巡防数据、上报信息
      new showPatrolinfo();

    });
  }

  //关闭个人信息详情页
  closePatrolinfo() {
    //alert("关闭，走ts");
    new closePatrolinfo();
  }

  //个人详情页的观看直播按钮
  showVideoPage(patrolid: string, uuid: string) {
    console.log(patrolid + ',' + uuid);
    this.checkVidelStatus(patrolid, uuid);
    //this.nav.push(VideoPage, {reportId: this.uuid, patrolid: this.patrolid, fullScreenFlag: this.fullScreenFlag});
  }

  videoPage(entityId) {
    //跳转到视频直播页面*巡防人员冒泡窗口的观看直播按钮
    var entityInfo = entityId.split("*");
    console.log("信息上报：" + entityInfo[0] + "," + entityInfo[1] + "," + entityInfo[2]);
    var uuid = entityInfo[1];
    var patrolid = entityInfo[2];
    // this.nav.push(VideoPage, {reportId: uuid, patrolid: patrolid, fullScreenFlag: this.fullScreenFlag});
    this.checkVidelStatus(patrolid, uuid);
  }

  //请求直播
  checkVidelStatus(patrolid: string, uuid: string) {
    //请求直播状态，开始观看直播
    this.videoService.setPeopleVideoOpen(patrolid, uuid).then(data => {
      var loading = this.LoadCtrl.create({
        spinner: "dots",
        content: data.msg,
        duration: 1000
      });
      if (data.success) {
        this.videoInfo = data.obj;
        if (this.videoInfo && this.videoInfo != null) {
          this.play(this.videoInfo.liveurl, this.videoInfo.tvUrl);
        } else {
          //对方还未开启直播，服务器端直接请求开启，开启定时器检测对方是否开启
          this.checkVideoOpen(patrolid, uuid);
          loading.present();
        }
      } else {
        loading.present();
      }
    });
  }

  //定时器获取直播状态
  checkVideoOpen(patrolid: string, uuid: string) {
    var checkVideoOpenTimer = setInterval(() => {  //设置定时器，隔2秒获取一次
      console.log("定时器获取当前人直播状态！");
      this.videoService.checkVideoOpen(patrolid, uuid).then(data => {
        console.log(data);
        if (data.success) {
          var videoInfoTemp = data.obj;
          if (videoInfoTemp) {
            //对方已经开启了直播,弹出提示，并关闭定时器
            let toast = this.toastCtrl.create({
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
  }

  //推流，并用vlc观看直播
  play(phoneUrl, tvUrl) {
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
    if (typeof(VideoPush) != 'undefined') {
      //VlcPlayer.playByVlc(url);

      //调用视频插件开启直播，监听返回值,tvUrl为推流地址，phoneUrl为播放地址
      VideoPush.SendInfo(tvUrl, phoneUrl, "SmartTVClient", (res) => {
        console.log('调用视频结束:', res);
        //触发关闭直播，发送请求到服务器端，修改直播状态
        //alert(res);
      }, (err) => {
        console.log(err);
      });

    } else {
      var loading = this.LoadCtrl.create({
        spinner: "dots",
        content: `该设备不暂支持播放视频！`,
        duration: 1000
      });
      loading.present();
    }
  }

  //跳转到信息上报详细页面
  reportViewPage(uuid) {
    //直接跳转页面
    //this.nav.push(ReportView,{reportId:id});
    console.log(uuid);
    this.reportService.eventView(uuid).then(data => {
      this.modelDate = data.obj;
      if (this.modelDate) {
        this.firstFile = this.modelDate.files.pop();//取出第一个文件并移除
        this.fileLength = this.modelDate.files.length;
      }
    });
    //弹出页面
    new showMessDetailes();
  }

  //根据类型判断事件窗口颜色     0-基础设施；1-涉外事件；2-走私事件；3-突发事件
  color(typename): any {
    var color = {'0': 'green', '1': 'blue', '2': 'orange', '3': 'red','4': 'yellow','5': 'black'};
    return 'mess-items show-mess-detailes ' + color[typename];
  }

  //分类显示事件列表  0-基础设施；1-涉外事件；2-走私事件；3-突发事件；4-边境动态；5-其他
  changeEvent(type) {
    if (this.infolist_bak) {

      var infolist_0 = [];
      var infolist_1 = [];
      var infolist_2 = [];
      var infolist_3 = [];
      var infolist_4 = [];
      var infolist_5 = [];

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
          case 4:
            infolist_4.push(list[i]);
            break;
          case 5:
            infolist_5.push(list[i]);
            break;
        }
      }
      console.log(infolist_0,infolist_1,infolist_2,infolist_3,infolist_4,infolist_5);
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
        case 4:
          this.infolist = infolist_4;
          this.evntLabel = "边境动态";
          break;
        case 5:
          this.infolist = infolist_5;
          this.evntLabel = "其他";
          break;
        default:
          this.infolist = this.infolist_bak;
          this.evntLabel = "全部事件";
      }

    }

  }

  //根据类型判断事件名称   0-基础设施；1-涉外事件；2-走私事件；3-突发事件
  typeToName(send_info_type): any {
    var map = {'0': '基础设施', '1': '涉外事件', '2': '走私事件', '3': '突发事件','4': '边境动态','5': '其他'};
    return map[send_info_type];
  }

  //控制界碑显示
  showMapMark() {
    var mapMarks = this.mapMarkEntity;
    this.checkbox_showMapMark = <HTMLDivElement>document.querySelector('#showMapMark');
    if (this.checkbox_showMapMark.getAttribute('value') == '1') {
      for (var k = 0; k < mapMarks.length; k++) {
        mapMarks[k].show = true;
      }
      this.checkbox_showMapMark.setAttribute('value', '0');
    } else {
      for (var k = 0; k < mapMarks.length; k++) {
        mapMarks[k].show = false;
      }
      this.checkbox_showMapMark.setAttribute('value', '1');
    }

  }

  //控制边界显示
  showMapLine() {
    var mapLine = this.lineEntity;
    this.checkbox_showMapLine = <HTMLDivElement>document.querySelector('#showMapLine');
    console.log(this.checkbox_showMapLine);
    if (this.checkbox_showMapLine.getAttribute('value') == '1') {
      mapLine.show = true;
      this.checkbox_showMapLine.setAttribute('value', '0');
    } else {
      mapLine.show = false;
      this.checkbox_showMapLine.setAttribute('value', '1');
    }
  }

  //控制实时刷新
  autoFresh() {
    this.checkbox_autoFresh = <HTMLDivElement>document.querySelector('#autoFresh');
    if (this.checkbox_autoFresh.getAttribute('value') == '1') {
      this.timer = setInterval(() => {  //5秒刷新一次，获取巡防实时信息
        console.log("开启实时刷新，5s刷新一次");
        this.getPeoples();
      }, 1000 * 5);

      this.checkbox_autoFresh.setAttribute('value', '0');
    } else {
      if (this.timer) {
        clearInterval(this.timer);
      }
      console.log("关闭实时刷新");
      this.checkbox_autoFresh.setAttribute('value', '1');
    }

  }

  //刷新 地图实体
  doUpdateEntity() {
    //新增巡防人员
    this.initDynamicEntity_add(this.peopleMap_add);
    //移除巡防人员
    this.initDynamicEntity_del(this.peopleMap_del);
    //更新巡防人员
    this.initDynamicEntity_update(this.peopleMap_now);
    //更新颜色标识
    this.showLineColor();

  }

  //初始化地图
  initMap() {

    //BingMapApi key
    Cesium.BingMapsApi.defaultKey = "J6oHjfVD1h4EB0imMAEt~2ojF_8N_GXKSntrzgp70uA~AtCDJ0Zg6BNbhbUPyWmFEwBFraxXY24rXtQ63kVAesKlmcGOMUBgDXSmIS8LIZKv";

    //全球影像地图服务
    this.viewer = new Cesium.Viewer("cesiumContainer", {
      animation: false,  //是否显示动画控件
      baseLayerPicker: false, //是否显示图层选择控件
      //geocoder: true, //是否显示地名查找控件,默认true
      timeline: false, //是否显示时间线控件
      sceneModePicker: true, //是否显示投影方式控件
      navigationHelpButton: false, //是否显示帮助信息控件
      infoBox: true,  //是否显示点击要素之后显示的信息
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

    var view_longitude = this.user.longitude
    var view_latitude = this.user.latitude
    this.viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(view_longitude,view_latitude, HEIGHT),
      orientation: {
        heading: 0.0,
        pitch: -Cesium.Math.PI_OVER_TWO,
        roll: 0.0
      }
    });
    //设置HOME按钮定位到中国
    Cesium.Rectangle.MAX_VALUE = Cesium.Rectangle.fromDegrees(65, -10, 145, 70);
    //设置HOME按钮定位到广西
    //Cesium.Rectangle.MAX_VALUE = Cesium.Cartesian3.fromDegrees(110, 23, 2000000.0);
    //Cesium.Rectangle.MAX_VALUE = Cesium.Rectangle.fromDegrees(98, 18, 128, 26);
    //Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(98, 18, 128, 26);

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
      if (pick && pick.id) {//选中某模型
        //判断点击的元素是不是巡防人员
        console.log(pick.id);
        //点击的是巡防人员
        if (pick.id._type.lastIndexOf("person") > -1) {
          console.log("点击巡防人员：" + pick.id._id);
          var cartographic = Cesium.Cartographic.fromCartesian(pick.id._position._value);//世界坐标转地理坐标（弧度）
          var point = [cartographic.longitude / Math.PI * 180, cartographic.latitude / Math.PI * 180];//地理坐标（弧度）转经纬度坐标
          var destination = Cesium.Cartesian3.fromDegrees(point[0], point[1] + 0.0055, 4000.0);
          var content = pick.id._description._value;
          var css = {'width': '400px'};
          var obj = {position: movement.position, destination: destination, content: content, css: css};
          setViewer.infoWindow(setViewer, obj);
        } else if (pick.id._type.lastIndexOf("mapMark") > -1) {
          //点击的是界碑
          console.log("点击界碑：" + pick.id._id);
          var cartographic = Cesium.Cartographic.fromCartesian(pick.id._position._value);//世界坐标转地理坐标（弧度）
          var point = [cartographic.longitude / Math.PI * 180, cartographic.latitude / Math.PI * 180];//地理坐标（弧度）转经纬度坐标
          var destination = Cesium.Cartesian3.fromDegrees(point[0], point[1] + 0.0055, 4000.0);
          var content = pick.id._description._value;
          var css = {'width': '400px'};
          var obj = {position: movement.position, destination: destination, content: content, css: css};
          setViewer.infoWindow(setViewer, obj);
        } else {
          //其他，不显示冒泡
          new hideInfoBox();
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    let self = this;
    //监听entity点击事件
    this.viewer.selectedEntityChanged.addEventListener(function (entity) {
      // Check if an entity with a point color was selected.
      if (Cesium.defined(entity)) {
        if (entity.type.lastIndexOf("person") > -1) {
          console.log("监听infobox中的按钮点击事件：" + entity.id);
          Observable.interval(1000).take(1).subscribe(function () {
            this.reportBtn = <HTMLDivElement>document.querySelector('#reportbtn');
            this.reportBtnEvent = Observable.fromEvent(this.reportBtn, 'click');
            this.reportBtnEvent.subscribe(x => {
                self.showPatrolinfo(entity._id);
              }
            );

            this.videoBtn = <HTMLDivElement>document.querySelector('#videobtn');
            this.videoBtnEvent = Observable.fromEvent(this.videoBtn, 'click');
            this.videoBtnEvent.subscribe(x => {
                self.videoPage(entity._id);
              }
            );

          });
        }
      } else {
        //隐藏 个人巡防信息两侧数据
        new closePatrolinfo();
      }
    });


  }

  //静态数据
  initStaticEntity() {
    // var map_line = "map_line";
    // this.patrolService.getMapLine(map_line).then(data => {
    //   if (data.success) {
    //     var lineStr = data.obj.value;
    //     var mapLine_str = lineStr.split(",");
    //     var mapLine_int = [];
    //     for (var i = 0; i < mapLine_str.length; i++) {
    //       mapLine_int.push(Number(mapLine_str[i]));
    //     }
    //     console.log(mapLine_int);
    //     //加载龙州县区域线
    //     this.lineEntity = this.viewer.entities.add({
    //       type: "line",
    //       polyline: {
    //         positions: Cesium.Cartesian3.fromDegreesArray(mapLine_int),
    //         width: 3,
    //         material: Cesium.Color.BLUE
    //       }
    //     });
    //   }
    // });

    var lineStr = this.user.mapline;
    var mapLine_str = lineStr.split(",");
    var mapLine_int = [];
    for (var i = 0; i < mapLine_str.length; i++) {
      mapLine_int.push(Number(mapLine_str[i]));
    }
    console.log(mapLine_int);
    //加载区县的区域线
    this.lineEntity = this.viewer.entities.add({
      type: "line",
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArray(mapLine_int),
        width: 3,
        material: Cesium.Color.BLUE
      }
    });

    var china_line = "china_line";
    this.patrolService.getMapLine(china_line).then(data => {
      if (data.success) {
        var lineStr = data.obj.value;
        var chinaLine_str = lineStr.split(",");
        var chinaLine_int = [];
        for (var i = 0; i < chinaLine_str.length; i++) {
          chinaLine_int.push(Number(chinaLine_str[i]));
        }
        console.log(chinaLine_int);
        //加载中国边境线-靠近龙州部分
        this.china_lineEntity = this.viewer.entities.add({
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
    this.patrolService.getMapMark().then(data => {
      var mapMarks = data.obj;
      for (var j = 0; j < mapMarks.length; j++) {
        //var pinBuilder = new Cesium.PinBuilder();
        var mapMark = this.viewer.entities.add({
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
        this.mapMarkEntity.push(mapMark);
      }
    });

  }

  //动态数据渲染到地图上-add
  initDynamicEntity_add(data: any) {
    console.log("新增巡防人员begin...")
    var d = data;

    //for循环开始
    for (let i = 0; i < d.length; i++) {
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
        '<p>巡防路距离：' + d[i].totaldistance + 'KM</p> <p>本月已巡防：' + d[i].sumDistance + 'KM</p> ' +
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

      var myMaterial = Cesium.Color.fromRandom({alpha: 0.9});

      var red = Cesium.Color.floatToByte(myMaterial.red);
      var green = Cesium.Color.floatToByte(myMaterial.green);
      var blue = Cesium.Color.floatToByte(myMaterial.blue);
      var myColor = {"red": red, "green": green, "blue": blue};

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

      //装载 巡防人实体ID：路线颜色map，当前坐标，
      var tempMap = {"name": d[i].name, "color": myColor , "longitude": d[i].longitude , "latitude": d[i].latitude};
      this.lineColorMap.set("person*" + d[i].uuid + "*" + d[i].patrolid, tempMap);
    }
    console.log("颜色", this.lineColorMap);
    console.log("新增巡防人员end...");
    //for循环结束
  }

  //动态数据渲染到地图上-update
  initDynamicEntity_update(data: any) {
    console.log("更新巡防人员begin...");
    var d = data;
    //for循环开始

    for (let i = 0; i < d.length; i++) {
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
  }

  //动态数据渲染到地图上-del
  initDynamicEntity_del(data: any) {
    console.log("删除巡防人员begin...");
    var d = data;
    //for循环开始
    for (let i = 0; i < d.length; i++) {
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
  }

  //显示轨迹标识
  showLineColor() {
    var self = this;
    //先清空数组
    self.lineColorList = [];
    this.lineColorMap.forEach(function (value, index, array) {
      self.lineColorList.push(value);
    })
    console.log("颜色标识列表：", this.lineColorList);
  }
  //点击轨迹标识，跳转
  flyToPeople(i,longitude,latitude){
    for(var j=0;j<this.lineColorList.length;j++) {
      if (j==i) {
        this.lineColorList[j]["show"] = true;
      } else {
        this.lineColorList[j]["show"] = false;
      }
    }

    console.log("跳转",longitude,latitude);
    var destination = Cesium.Cartesian3.fromDegrees(longitude, latitude + 0.0055, 4000.0);
    //跳转某个地方
    this.viewer.camera.flyTo({
      destination : destination
    });
  }
}
