import {Injectable} from '@angular/core'
import {Http, URLSearchParams, Headers} from '@angular/http';
import {BaseUrl} from '../app/app.commonSet'
import {LoginService} from "./login.service";
import 'rxjs/add/operator/toPromise';


//护路员管理
@Injectable()
export class PersonsManegeService {

  constructor(private http: Http, private loginService: LoginService) {
  }

  baseUrl = BaseUrl;
  private headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded,charset=UTF-8'});

  //获取上报信息统计报表
  getReportTable(): any {
    let params = new URLSearchParams();
    let token = this.loginService.getLoginUser().token;
    params.set('token', token);
    return this.http.post(this.baseUrl + "/smart/report", {headers: this.headers}, {params: params}).toPromise()
      .then(response => response.json()).catch(this.handleError);
  }
  //获取绩效考核统计报表
  getSendScoreTable(): any {
    let params = new URLSearchParams();
    let token = this.loginService.getLoginUser().token;
    params.set('token', token);
    return this.http.post(this.baseUrl + "/smart/sendScoreTable", {headers: this.headers}, {params: params}).toPromise()
      .then(response => response.json()).catch(this.handleError);
  }


  //异常处理
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only   error.message || error
    return Promise.reject(error.message || error);
  }

}
