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
import { SocialLogin } from '../../providers/social-login';
import { LOGINPAGE, VALIDATIONERROR, COMMONTEXT } from 'app/app.constants';
import { IsLogin } from '../../providers/is-login';
// import { FacebookService, LoginResponse,LoginOptions } from 'ngx-facebook';
// import { LoginOptions, UIResponse, UIParams, FBVideoComponent} from 'ng2-facebook-sdk';

@Component({
  selector: 'login',
  template: require('./login.component.html')
})
export class LoginComponent  {
  textContent: any;
  validationError: any;
  commonTxtContentLogin: any;
  message: string;
  public login:any=[];
  public sub:any;
  public remember:any;
  public invalidCredentials: boolean;
  public loginType: any;
  public navigateTo: string;
  public restaurantData: any;
  constructor(public _auth: AuthService,
              public localStorage:LocalStorageService,
              public userRequestManager:UserRequestManager,
              private _cookieService:CookieService,
              public socialLogin:SocialLogin,public router: Router,
              public spinnerService: SpinnerService,
              public islogin: IsLogin) {

    this.textContent = LOGINPAGE;
    this.validationError = VALIDATIONERROR;
    this.commonTxtContentLogin = COMMONTEXT;
    this.remember=_cookieService.get('remember')
    this.login.email=_cookieService.get('email');
    this.login.password=_cookieService.get('password');
    this.restaurantData = JSON.parse(JSON.stringify(this.localStorage.get('restaurantData')));
    this.navigateTo = this.userRequestManager.getRedirectPath() ? this.userRequestManager.getRedirectPath() : '';
    if (this.remember === true){
      console.log('coming...')
    }
    if((this.localStorage.get('userData') != null || this.localStorage.get('userData') != undefined) ) {
      this.router.navigate(['home']);
    }
  }

  ngOnInit () {
    this.invalidCredentials = false;
    console.log('this.localStorage.get(resDetail)',this.localStorage.get('resDetail'));
    if(!this.remember){
      this.login.email = "";
      this.login.password = "";
    }
  }

  /*Function for submitting information of login in API*/
  customLogin(data){
    this.loginType = 'C';
    this.spinnerService.show("loginSpinner");
    this.signInUser(data);
  }

  signInUser(data){
    data.token=this.localStorage.get('userToken');
    let loginPayLoad = {
      'email' : data.email,
      'password' : (data.password !== '') ? data.password : '',
      'loginType': this.loginType,
      'merchantId': (this.restaurantData && this.restaurantData.merchantid) ? this.restaurantData.merchantid : ''
    }
     return new Promise(resolve => {
       this.userRequestManager.set('login',loginPayLoad)
       .then(logindata => {
        
         let alldata = JSON.parse(JSON.stringify(logindata));
         if(alldata.status == 1){
           this.localStorage.set('userData',alldata.data);
           this.islogin.loggedIn('Logged In');
           if (alldata.data.eligible_coupons) {
            this.localStorage.set('eligibleCoupons', alldata.data.eligible_coupons);
          }
          if (alldata.data.eligible_customer_points) {
            this.localStorage.set('customerPoints', alldata.data.eligible_customer_points);
          }
           /** Remember me Cookie set   */
           if(this.remember == true){
             this._cookieService.put('email',data.email);
             this._cookieService.put('password',data.password);
             this._cookieService.put('remember',this.remember);
           }else {
             this._cookieService.put('email','');
             this._cookieService.put('password','');
             this._cookieService.put('remember','');
           }
          //  if(this.localStorage.get('resDetail') != null || this.localStorage.get('resDetail') != undefined) {
          //    this.router.navigate([this.localStorage.get('resDetail')]);
          //  }
          //  else  if(this.localStorage.get('submitlistinglink') != null || this.localStorage.get('submitlistinglink') != undefined) {
            
          //   //console.log('submitlistinglink',this.localStorage.get('submitlistinglink'));
          //   this.router.navigate([this.localStorage.get('submitlistinglink')]);
          // }
            this.spinnerService.hide("loginSpinner");
            if((this.localStorage.get('resDetail') != null || this.localStorage.get('resDetail') != undefined) && this.navigateTo == '' ) {
              this.router.navigate([this.localStorage.get('resDetail')]);
              this.userRequestManager.setRedirectPath('');
            } else if (this.navigateTo != '') {
              this.router.navigate([this.navigateTo]);
              this.userRequestManager.setRedirectPath('');
            } else {
              this.router.navigate(['home']);
              this.userRequestManager.setRedirectPath('');
            }
         }
       },
       (err) => {
        this.spinnerService.hide("loginSpinner");
          if (err.status === 401){
            this.invalidCredentials = true;
          }
       });
     });
  }

  /*Function for signup using google plus*/
  signIn(provider){
    console.log('hello')
    this.sub = this._auth.login(provider).subscribe(
      (data) => {
        console.log(data);
      }
    )
  }
  /*Function for logout using google plus*/
  logout(){
    this.islogin.loggedOut();
    this._auth.logout().subscribe(
      (data)=>{//return a boolean value.
      })
  }
  /*Function for signup using FB*/
  fbSignUp() {
    this.loginType = 'S';
    this.spinnerService.show('loginSpinner');
    this.socialLogin.loginWithFacebook().then((data) => {
      console.log("FBLOGIN SUCCESS->>>",data);
      this.signInUser(data);
    },
    (error) => {
      console.log("FBLOGIN FAILURE->>>",error);
      this.spinnerService.hide('loginSpinner');
    });
  }

  googleSignUp() {
    this.loginType = 'S';
    this.spinnerService.show('loginSpinner');
    this.socialLogin.loginWithGoogle().then((data) => {
      console.log("GLOGIN SUCCESS->>>",data);
      this.signInUser(data);
    },
    (error) => {
      console.log("GLOGIN FAILURE->>>",error);
      this.spinnerService.hide('loginSpinner');
    });;
  }

}
