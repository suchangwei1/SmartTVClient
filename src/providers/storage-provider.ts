import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';

/*
 Generated class for the StorageService provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class StorageProvider {

  constructor() {
  }

  write(key: string, value: any) {
    if (value) {
      value = JSON.stringify(value);
    }
    localStorage.setItem(key, value);
  }

  read<T>(key: string): T {
    let value: string = localStorage.getItem(key);

    if (value && value != "undefined" && value != "null") {
      return <T>JSON.parse(value);
    }

    return null;
  }

  remove(key: string) {
    localStorage.removeItem(key);
  }

  clear() {
    localStorage.clear();
  }

}
