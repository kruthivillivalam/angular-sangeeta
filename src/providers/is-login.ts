import {Injectable} from '@angular/core';
import {Http, Response,RequestOptions,Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from "rxjs";
import { Subject } from 'rxjs/Subject';
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';

@Injectable()
export class IsLogin {
    public instance:any;
    public api_endpoint:any;
    private loginStatus = new Subject<any>();

    constructor(public localStorage:LocalStorageService,public http: Http, public router: Router) {
    }

    isLoggedIn() {
      if(this.localStorage.get('userData') == null || this.localStorage.get('userData') == undefined) {
         this.router.navigate(['login']);
      } else {
      }
    }

    loggedIn(message: string) {
      this.loginStatus.next({ status: message });
    }

    loggedOut() {
        this.loginStatus.next();
    }

    getLoggedInStatus(): Observable<any> {
        return this.loginStatus.asObservable();
    }
}
