import {Injectable} from '@angular/core'
import {Http, URLSearchParams, Headers} from '@angular/http';
import {BaseUrl} from '../app/app.commonSet'
import {LoginService} from "./login.service";
import 'rxjs/add/operator/toPromise';


//实时视频
@Injectable()
export class VideoService {

  constructor(private http: Http,private loginService:LoginService) {
  }

  baseUrl = BaseUrl;
  private headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded,charset=UTF-8'});

  //获取当前在线的巡防人员
  getPeopleOnline(): any {
    let params = new URLSearchParams();
    let token = this.loginService.getLoginUser().token;
    params.set('token', token);
    return this.http.post(this.baseUrl + "/smart/peopleonline", {headers: this.headers}, {params: params}).toPromise()
      .then(response => response.json()).catch(this.handleError);
  }

  //请求巡防人员开启直播
  setPeopleVideoOpen(patrolid: string, receiveId: string): any {
    let params = new URLSearchParams();
    let token = this.loginService.getLoginUser().token;
    params.set('token', token);
    params.set('patrolid', patrolid);
    params.set('receiveId', receiveId);
    return this.http.post(this.baseUrl + "/smart/onlineLive", {headers: this.headers}, {params: params}).toPromise()
      .then(response => response.json()).catch(this.handleError);
  }

  //查询单人直播状态
  checkVideoOpen(patrolid: string, receiveId: string): any {
    let params = new URLSearchParams();
    let token = this.loginService.getLoginUser().token;
    params.set('token', token);
    params.set('patrolid', patrolid);
    params.set('receiveId', receiveId);
    return this.http.post(this.baseUrl + "/smart/onlineLiveToOne", {headers: this.headers}, {params: params}).toPromise()
      .then(response => response.json()).catch(this.handleError);
  }


  //获取当日所有直播的视频文件信息
  getVideoFileByDay(): any {
    let params = new URLSearchParams();
    let token = this.loginService.getLoginUser().token;
    params.set('token', token);
    return this.http.post(this.baseUrl + "/smart/videoFileByDay", {headers: this.headers}, {params: params}).toPromise()
      .then(response => response.json()).catch(this.handleError);
  }

  //异常处理
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only   error.message || error
    return Promise.reject(error.message || error);
  }

}
