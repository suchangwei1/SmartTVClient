import {Injectable} from '@angular/core'
import {Http, URLSearchParams, Headers} from '@angular/http';
import {BaseUrl} from '../app/app.commonSet'
import {LoginService} from "./login.service";
import 'rxjs/add/operator/toPromise';


//巡防管理
@Injectable()
export class PatrolService {

  constructor(private http: Http, private loginService: LoginService) {
  }

  baseUrl = BaseUrl;
  private headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded,charset=UTF-8'});
  //获取当前正在巡防的所有人员  assets/data/patrol.json
  getPeoples(): any {
    let params = new URLSearchParams();                     //传递参数
    let token = this.loginService.getLoginUser().token;
    params.set('token', token);
    return this.http.post(this.baseUrl + "/smart/watchman", {headers: this.headers}, {params: params}).toPromise()
      .then(response => response.json()).catch(this.handleError);
  }

  //获取界碑信息
  getMapMark(): any {
    let params = new URLSearchParams();                     //传递参数
    let token = this.loginService.getLoginUser().token;
    params.set('token', token);
    return this.http.post(this.baseUrl + "/smart/mapmark", {headers: this.headers}, {params: params}).toPromise()
      .then(response => response.json()).catch(this.handleError);
  }

  //获取巡防人员上报列表 by ID assets/data/personReportlist.json
  getReportById(uuid: string, patrolid: string): any {
    let params = new URLSearchParams();
    params.set('uuid', uuid);
    params.set('pid', patrolid);
    let token = this.loginService.getLoginUser().token;
    params.set('token', token);
    return this.http.post(this.baseUrl + "/smart/personsendlist", {headers: this.headers}, {params: params}).toPromise()
      .then(response => response.json()).catch(this.handleError);
  }

  //获取龙州县边境坐标
  getMapLine(key:string): any {
    let params = new URLSearchParams();
    params.set('selKey', key);
    let token = this.loginService.getLoginUser().token;
    params.set('token', token);
    return this.http.post(this.baseUrl + "/smart/QueryConfig", {headers: this.headers}, {params: params}).toPromise()
      .then(response => response.json()).catch(this.handleError);
  }

  //异常处理
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only   error.message || error
    return Promise.reject(error.message || error);
  }

}
