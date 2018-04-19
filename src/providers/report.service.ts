import {Injectable} from '@angular/core'
import {Http, Headers, URLSearchParams} from '@angular/http';
import {BaseUrl} from '../app/app.commonSet'
import {LoginService} from "./login.service";
import 'rxjs/add/operator/toPromise';


//信息上报
@Injectable()
export class ReportService {

  constructor(private http: Http,private loginService:LoginService) {
  }

  baseUrl = BaseUrl;
  private headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded,charset=UTF-8'});

  //上报信息列表 --按时间分页 "assets/data/reportlist.json" this.baseUrl+"/smart/getReportList"
  reportList(startDate: string, endDate: string): any {
    let params = new URLSearchParams();
    let token = this.loginService.getLoginUser().token;
    params.set('token', token);
    params.set('startDate', startDate);
    params.set('endDate', endDate);
    return this.http.post(this.baseUrl + "/smart/getReportList", {headers: this.headers}, {params: params}).toPromise()
      .then(response => response.json()).catch(this.handleError);
  }

  //上报信息列表 --按记录数分页  http://localhost:8080/smart/getReportList2?page=2&rows=10
  reportListByPage(beginid: string, rows: number, sendType: string): any {
    let params = new URLSearchParams();
    let token = this.loginService.getLoginUser().token;
    params.set('token', token);
    params.set('beginid', beginid);
    params.set('rows', rows + '');
    params.set('sendType', sendType);

    return this.http.post(this.baseUrl + "/smart/getReportList2", {headers: this.headers}, {params: params}).toPromise()
      .then(response => response.json()).catch(this.handleError);
  }

  //上报信息详细页 "assets/data/reportView.json"  this.baseUrl+"/smart/getReportDetail"
  eventView(uuid: string): any {
    let params = new URLSearchParams();
    let token = this.loginService.getLoginUser().token;
    params.set('token', token);
    params.set('uuid', uuid);
    return this.http.post(this.baseUrl + "/smart/getReportDetail", {headers: this.headers}, {params: params}).toPromise()
      .then(response => response.json()).catch(this.handleError);
  }

  //异常处理
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only   error.message || error
    return Promise.reject(error.message || error);
  }
}
