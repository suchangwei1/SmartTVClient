import {Injectable} from '@angular/core'
import {HomePage} from '../pages/home/home';
import {NavController, App} from 'ionic-angular';

//工具类服务
@Injectable()
export class CommonAction {

  private nav: NavController;

  constructor(private app: App) {
    this.nav = app.getActiveNav();
  }

  //返回首页
  backHome() {
    this.nav.push(HomePage);
  }

  //数组去重
  unique(arr) {
    arr.sort();
    var newArr = [arr[0]];
    for (var i = 1, len = arr.length; i < len; i++) {
      if (arr[i] !== newArr[newArr.length - 1]) {
        newArr.push(arr[i]);
      }
    }
    return newArr;
  }

  //求数组并集
  union_array(a, b) {
    for (var i = 0, j = 0, ci, r = {}, c = []; ci = a[i++] || b[j++];) {
      if (r[ci]) continue;
      r[ci] = 1;
      c.push(ci);
    }
    return c;
  }

  //求数组差集
  minus_array(arr1, arr2) {
    var arr3 = [];
    for (var i = 0; i < arr1.length; i++) {
      var flag = true;
      for (var j = 0; j < arr2.length; j++) {
        if (arr2[j] == arr1[i]) {
          flag = false;
        }
      }
      if (flag) {
        arr3.push(arr1[i]);
      }
    }
    return arr3;
  }

  //求数组交集
  intersect_array(arr1, arr2) {
    var ai = 0, bi = 0;
    var arr3 = new Array();
    while (ai < arr1.length && bi < arr2.length) {
      if (arr1[ai] < arr2[bi]) {
        ai++;
      }
      else if (arr1[ai] > arr2[bi]) {
        bi++;
      }
      else /* they're equal */
      {
        arr3.push(arr1[ai]);
        ai++;
        bi++;
      }
    }
    return arr3;
  }

  //日期工具类
  getRangeDate(time: string, range?: number): any {

    const formatDate = (time: any) => {
      // 格式化日期
      const Dates = new Date(time);
      const year: number = Dates.getFullYear();
      const month: any = ( Dates.getMonth() + 1 ) < 10 ? '0' + ( Dates.getMonth() + 1 ) : ( Dates.getMonth() + 1 );
      const day: any = Dates.getDate() < 10 ? '0' + Dates.getDate() : Dates.getDate();
      return year + '-' + month + '-' + day;
    };

    if (range) {
      if (range < 0) {
        let i = Math.abs(range);
        return formatDate(new Date(time).getTime() + ( -1000 * 3600 * 24 * i ));
      } else {
        let i = range;
        return formatDate(new Date(time).getTime() + ( 1000 * 3600 * 24 * i ));
      }
    } else {
      return formatDate(time);
    }
  }

}
