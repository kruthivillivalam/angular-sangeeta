import {Component} from '@angular/core';
import {CookieService} from 'angular2-cookie/core';
import {AuthService} from 'angular2-social-login';
import {LocalStorageService} from 'angular-2-local-storage';
import {SpinnerService} from '../common/spinner.service';
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
import {UserRequestManager} from '../../providers/user-request-manager';
import {VALIDATIONERROR, COMMONTEXT} from 'app/app.constants';
import {IsLogin} from '../../providers/is-login';

@Component({
    selector: 'forgotPassword',
    template: require('./forgotPassword.component.html'),
    styleUrls: ['./forgotPassword.component.scss']
})
export class ForgotPasswordComponent {
    validationError: any;
    commonTxtContentLogin: any;
    message: string;
    public login: any = [];
    public sub: any;
    public remember: any;
    public invalidCredentials: boolean;
    public navigateTo: string;
    public restaurantData: any;
    public invalidEmail: any;
    public emailReq: any;
    constructor(public _auth: AuthService,
                public localStorage: LocalStorageService,
                public userRequestManager: UserRequestManager,
                public spinnerService: SpinnerService,
                public router: Router,
                public islogin: IsLogin) {

        this.validationError = VALIDATIONERROR;
        this.commonTxtContentLogin = COMMONTEXT;
        this.navigateTo = this.userRequestManager.getRedirectPath() ? this.userRequestManager.getRedirectPath() : '';
    }

    forgotPassword() {
        if (this.login.email) {
          let reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
          if (reg.test(this.login.email) == false)
        {
            console.log('Invalid Email Address');
            this.invalidEmail = true;
            return false;
        }

            this.sendMail(this.login.email);
            console.log('Valid Email Address');
            return true;
        }
        else {
          this.emailReq = true;
        }
    }

    sendMail (email) {
      console.log("Email :" + email);
      let newObj = {
        email: email,
        apicall:1
      }
      this.userRequestManager.set('resetPassword', JSON.stringify(newObj))
      .then(data => {
        this.router.navigate(['resetPassword']);
        console.log('Mail sent')
      }, error => {
        console.log('Error occured')
      });
    }

}
