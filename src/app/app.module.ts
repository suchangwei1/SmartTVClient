import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';
import {HttpModule} from '@angular/http';
import {AppVersion} from "@ionic-native/app-version";
import {File} from '@ionic-native/file';
import {Transfer, TransferObject} from '@ionic-native/transfer';
import {InAppBrowser} from '@ionic-native/in-app-browser';
import {AndroidPermissions} from '@ionic-native/android-permissions';
import {AppMinimize} from "@ionic-native/app-minimize";
import {PhotoLibrary} from "@ionic-native/photo-library";
import {IonicImageViewerModule} from 'ionic-img-viewer';

import {MyApp} from './app.component';
import {LoginPage} from "../pages/login/login";
import {HomePage} from '../pages/home/home';
import {PatrolPage} from '../pages/patrol/patrol';
import {ReportPage} from '../pages/report/report';
import {VideoPage} from '../pages/video/video';
import {PersonsManegePage} from '../pages/personsManege/personsManege';
import {ReportView} from '../pages/reportView/reportView';
import {VideoViewPage} from '../pages/videoView/videoView';
import {NoticeListPage} from '../pages/notice/list/noticeList';
import {VideoFilePage} from "../pages/videoFile/videoFile";

import {facdHeaderComponent} from '../pages/facdHeader/facdHeader';

import {StorageProvider} from '../providers/storage-provider';
import {ReportService} from '../providers/report.service';
import {PatrolService} from '../providers/patrol.service';
import {HomeService} from '../providers/home.service'
import {VideoService} from '../providers/video.service'
import {PersonsManegeService} from '../providers/personsManege.service'
import {LoginService} from "../providers/login.service";

import {CommonAction} from '../providers/commonAction.service';
import {UpdateService} from '../providers/update.service'

import {SomeDirective} from '../pages/patrol/directive';
import {HomeDirective} from '../pages/home/homeDirective';




@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    HomePage,
    PatrolPage,
    ReportPage,
    VideoPage,
    PersonsManegePage,
    ReportView,
    VideoViewPage,
    VideoFilePage,
    NoticeListPage,
    facdHeaderComponent,
    HomeDirective,
    SomeDirective
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicImageViewerModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    HomePage,
    PatrolPage,
    ReportPage,
    VideoPage,
    PersonsManegePage,
    ReportView,
    VideoViewPage,
    VideoFilePage,
    NoticeListPage,

  ],
  providers: [
    StatusBar,
    SplashScreen,
    ReportService,
    StorageProvider,
    AppMinimize,
    PhotoLibrary,
    PatrolService,
    HomeService,
    VideoService,
    CommonAction,
    AppVersion, File, Transfer, TransferObject, InAppBrowser, AndroidPermissions,
    UpdateService,
    PersonsManegeService,
    LoginService,
    {provide: ErrorHandler, useClass: IonicErrorHandler},

  ]
})
export class AppModule {
}
