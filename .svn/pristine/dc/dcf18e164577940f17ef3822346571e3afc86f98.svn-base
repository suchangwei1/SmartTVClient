import {Injectable} from '@angular/core'
import {Http, URLSearchParams, Headers} from '@angular/http';
import {BaseUrl} from '../app/app.commonSet'
import {LoginService} from "./login.service";
import 'rxjs/add/operator/toPromise';

//首页
@Injectable()
export class HomeService {

  constructor(private http: Http,private loginService:LoginService) {
  }

  baseUrl = BaseUrl;
  private headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded,charset=UTF-8'});
  //获取通知公告
  getNotice(): any {
    let params = new URLSearchParams();
    let token = this.loginService.getLoginUser().token;
    params.set('token', token);
    return this.http.post(this.baseUrl + "/smart/getnotice", {headers: this.headers}, {params: params}).toPromise()
      .then(response => response.json()).catch(this.handleError);
  }
  //获取历史通知公告
  getNoticeHistory(fromid?:any): any {
    let params = new URLSearchParams();
    let token = this.loginService.getLoginUser().token;
    params.set('token', token);
    params.set('fromid', fromid);
    return this.http.post(this.baseUrl + "/smart/noticeHistory", {headers: this.headers}, {params: params}).toPromise()
      .then(response => response.json()).catch(this.handleError);
  }

  //通知公告标记已读
  readnotice(uuid: string): any {
    let params = new URLSearchParams();
    let token = this.loginService.getLoginUser().token;
    params.set('token', token);
    params.set('uuid', uuid);
    return this.http.post(this.baseUrl + "/smart/readnotice", {headers: this.headers}, {params: params}).toPromise()
      .then(response => response.json()).catch(this.handleError);
  }

  //签收
  Sign(uuid,feedback): any {
    let token = this.loginService.getLoginUser().token;
    let params = new URLSearchParams();
    params.set('uuid', uuid);
    params.set('token',token);
    params.set('feedback',feedback);
    return this.http.post(this.baseUrl + "/smart/sign", {headers: this.headers}, {params: params}).toPromise().then(
      response => response.json()
    ).catch(this.handleError);
  }

  //检查是否已签收
  checkSign(uuid): any {
    let token = this.loginService.getLoginUser().token;
    let params = new URLSearchParams();
    params.set('uuid', uuid);
    params.set('token', token);
    return this.http.post(this.baseUrl + "/smart/checkSign", {headers: this.headers}, {params: params}).toPromise().then(
      response => response.json()
    ).catch(this.handleError);
  }


  //异常处理
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only   error.message || error
    return Promise.reject(error.message || error);
  }

}
