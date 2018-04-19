import {Injectable} from '@angular/core'
import {Http, URLSearchParams, Headers} from '@angular/http';
import {BaseUrl} from '../app/app.commonSet'
import 'rxjs/add/operator/toPromise';

//登陆
@Injectable()
export class LoginService {

  constructor(private http: Http) {
  }

  user: any;
  baseUrl = BaseUrl;
  private headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded,charset=UTF-8'});
  //获取通知公告  assets/data/notice.json
  login(userName, userPassword): any {
    let params = new URLSearchParams();
    params.set('userName', userName);
    params.set('userPassword', userPassword);
    return this.http.post(this.baseUrl + "/smart/loginByTV", {headers: this.headers}, {params: params}).toPromise()
      .then(response => response.json()).catch(this.handleError);
  }

  setLoginUser(user: any) {
    this.user = user;
  }

  getLoginUser(): any {
    console.log("获取当前用户",this.user);
    return this.user;
  }

  //异常处理
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only   error.message || error
    return Promise.reject(error.message || error);
  }

}
