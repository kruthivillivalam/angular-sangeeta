import { Component } from '@angular/core';
import {CookieService} from 'angular2-cookie/core';
import { AuthService } from "angular2-social-login";
import { LocalStorageService } from 'angular-2-local-storage';
import { SpinnerService } from '../common/spinner.service';
import {
    Router,
    // import as RouterEvent to avoid confusion with the DOM Event
    Event as RouterEvent,
    NavigationStart,
    NavigationEnd,
    NavigationCancel,
    NavigationError
} from '@angular/router';

//providers
import { UserRequestManager } from '../../providers/user-request-manager';
import { VALIDATIONERROR, COMMONTEXT } from 'app/app.constants';
import { IsLogin } from '../../providers/is-login';

@Component({
  selector: 'resetPassword',
  template: require('./resetPassword.component.html'),
  styleUrls: ['./resetPassword.component.scss']
})
export class ResetPasswordComponent  {
  textContent: any;
  validationError: any;
  commonTxtContentLogin: any;
  message: string;
  public resetPass= {email: '', password: '', confirmPassword:''};
  public sub:any;
  public remember:any;
  public invalidCredentials: boolean;
  public navigateTo: string;
  public restaurantData: any;
  public passNotMatched: any;
  constructor(public _auth: AuthService,
              public localStorage: LocalStorageService,
              public userRequestManager: UserRequestManager,
              private _cookieService: CookieService,
              public router: Router,
              public spinnerService: SpinnerService,
              public islogin: IsLogin) {

    this.validationError = VALIDATIONERROR;
    this.commonTxtContentLogin = COMMONTEXT;
    this.restaurantData = JSON.parse(JSON.stringify(this.localStorage.get('restaurantData')));
    this.navigateTo = this.userRequestManager.getRedirectPath() ? this.userRequestManager.getRedirectPath() : '';
  }

    resetPassword() {
      this.passNotMatched = '';
      if (this.resetPass.password === this.resetPass.confirmPassword) {
        console.log("Password Matched")
      }
      else {
        this.passNotMatched = true;
      }
    }


}
