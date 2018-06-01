import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { AuthService } from "angular2-social-login";
// import { TwitterService } from 'ng2-twitter';
import { SpinnerService } from '../common/spinner.service';
import * as moment from "moment";
import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';
//providers
import { IsLogin } from '../../providers/is-login';
import { SocialLogin } from '../../providers/social-login';
import { UserRequestManager } from '../../providers/user-request-manager';
import { REGISTERPAGE, VALIDATIONERROR, COMMONTEXT } from 'app/app.constants';
import { DialogService } from "ng2-bootstrap-modal";
import { AlertComponent } from '../common/alert.component';
@Component({
  selector: 'register',
  template: require('./register.component.html'),
})
export class RegisterComponent  {
  regTextContent: any;
  regValidationError: any;
  commonTxtContentReg: any;
  public color3:any;
  public emailNotFound = false;
  public mobileNotFound = false;
  public childheader:any=false;
  public user: any=[];
  public calender: any=[];
  public days: any=[];
  public sub: any;
  public signUpType: string;
  public suburbData: any=[];
  public suburbsByCountry: any=[];
  public dataService: any;
  months:any=['January','February','March','April','May','June','July','August','September','Octomber','November','December'];
  public years:any=[];

  result = '';
  public countryData: any;
  public stateData: any;
  public setAlert: any;
  public bgColor: any;
  constructor(
    public localStorage: LocalStorageService,
    public userRequestManager: UserRequestManager,
    public _auth: AuthService,
    private completerService: CompleterService,
    // public twitter: TwitterService,
    public socialLogin: SocialLogin,
    public router: Router,
    public spinnerService: SpinnerService,
    public islogin: IsLogin,
    private dialogService:DialogService,
  ) {
      this.regTextContent = REGISTERPAGE;
      this.regValidationError = VALIDATIONERROR;
      this.commonTxtContentReg = COMMONTEXT;
      const startYear: number = parseInt(moment().subtract(100, 'years').format('YYYY').toString(), 10);
      const currentYear: number = parseInt(moment().format('YYYY').toString(), 10);

      for (let q = startYear; q <= currentYear; q++) {
          this.years.push(q);
      }
      for(let i = 1; i <= 31; i++){
        this.days.push(i);
      }

      localStorage.set('childheader',false);
      this.getCountryData();
  }
  /*Function for submitting data for signup in API*/
  customSignUp(data){
    this.signUpType = 'C';
    this.signUp(data);
  }

  signUp(data){

    let finalDate = '';
    let tempDay = '';
    let tempMonth = '';
    let tempYear = '';

    if(data.days && data.month && data.year) {
      tempDay = data.days;
      tempMonth = data.month+1;
      tempYear = data.year;
      finalDate = moment(tempMonth+'-'+tempDay+'-'+tempYear).format('YYYY-MM-DD');
    } else {
      finalDate = '';
    }

    let signUpData = {
      'provider': data.provider,
      'provider_id': data.provider_id,
      'email':data.email,
      'firstName':data.firstName,
      'lastName':data.lastName,
      'password':data.password,
      'status':1,
      'confirmed':1,
      'mobile':data.mobile,
      'dob':finalDate,
      'cust_addr1':data.cust_addr1,
      'cust_addr2':data.cust_addr2,
      'city':data.city,
      'country_id':data.country,
      'state_id':this.user.state_id,
      'postcode':data.pincode,
      'suburb':data.suburb,
      'loginType': this.signUpType,
      'agree': true,
    };
     console.log("GOING TO SIGN UP ->>>> signUpData DATA"+JSON.stringify(signUpData));
     return new Promise(resolve => {
        this.userRequestManager.set('signup',signUpData).then(data => {
          this.spinnerService.hide('registerLoading');
          var alldata = JSON.parse(JSON.stringify(data));
          if(JSON.stringify(data).indexOf('Customer already exists.Please log in') > -1){
            this.dialogService.addDialog(AlertComponent, {title: 'Alert!', message: 'Customer already exists.Please log in'});
            this.setAlert = 'solid 1px red';
            this.bgColor = '#F78181';
            //alert('Customer already exists.Please log in');
            this.logout();
            //this.router.navigate(['login']);
          }
          if(alldata.status == 1){
            alert('Successfully Signed Up and Automatically Logged In');
            this.localStorage.set('userData',alldata.data);
            this.islogin.loggedIn('Logged In');
            this.router.navigate(['home']);
          }
        }, error => {
          this.spinnerService.hide('registerLoading');
        });
   });
  }

  logout(){
    localStorage.clear();
    sessionStorage.clear();
    this.deleteAllCookies();
    this._auth.logout().subscribe(
      (data)=>{
        //console.log("SOCIAL LOGOUT",data);
      // return a boolean value.
      })
  }

   deleteAllCookies() {
      var cookies = document.cookie.split(";");

      for (var i = 0; i < cookies.length; i++) {
          var cookie = cookies[i];
          var eqPos = cookie.indexOf("=");
          var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
          document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
  }
/*Function for registring user through social platforms*/
// getHomeTimeline(){
//     this.twitter.get(
//       'https://api.twitter.com/1.1/statuses/home_timeline.json',
//       {
//         count: 5
//       },
//       {
//         consumerKey: 'YfdzyGbb00ODR8ubja9XaJ8KJ',
//         consumerSecret: 'CkRFkpde5gVe2enaEdVRs7n33ZPS55cQHPyMZOLBa2h125ZnEJ'
//       },
//       {
//         token: '3119428682-ozq0xYW9r3Xld2YZXMtJj2Na484RmXKd4cws2L4',
//         tokenSecret: 'tOYhgC8AqFr0innwVXLLUxHP5Fu6EunbxDnvxViOkvEcc'
//       }
//     ).subscribe((res)=>{
//         this.result = res.json()
//         .map(tweet =>
//           console.log(tweet.text)
//         );
//     });
//   }

// Email Validation API Call
verifyEmail(usrForm) {
  this.spinnerService.show('registerLoading');
  this.userRequestManager.emailVerification(usrForm.email).then((data) => {
    //console.log('EMAIL VERIFY RESPONSE',data);
    if(data['is_valid'] !== true &&  data['mailbox_verification'] !== 'true' ){
      this.emailNotFound = true;
      this.spinnerService.hide('registerLoading');
    } else {
      this.emailNotFound = false;
      this.verifyMobile(usrForm);
    }
  }, (error) =>{
    //console.log('EMAIL VERIFY ERROR',error);
    this.emailNotFound = true;
    this.spinnerService.hide('registerLoading');
  });
}

// Phone Validation API Call
  verifyMobile(usrForm) {
    this.userRequestManager.phoneVerification(usrForm.mobile).then((data) => {
      //console.log('MOBILE VERIFY RESPONSE',data);
      if(JSON.stringify(data).indexOf('was not found') !== -1){
        this.mobileNotFound = true;
        this.spinnerService.hide('registerLoading');
      } else{
        this.mobileNotFound = false;
        this.customSignUp(usrForm);
      }
    }, (error) =>{
      //console.log('MOBILE VERIFY ERROR',error);
      this.mobileNotFound = true;
      this.spinnerService.hide('registerLoading');
    });
  }

  /*Function for registring user through Facebook*/
  fbSignUp() {
    this.signUpType = 'S';
    this.spinnerService.show('registerLoading');
    this.socialLogin.loginWithFacebook().then((data) => {
      //console.log('FBLOGIN SUCCESS->>>', data);
      this.signUp(data);
    },
    (error) => {
      //console.log('FBLOGIN FAILURE->>>', error);
      this.spinnerService.hide('registerLoading');
    });
  }

  /*Function for registring user through google plus*/
  googleSignUp() {
    this.signUpType = 'S';
    this.spinnerService.show('registerLoading');
    this.socialLogin.loginWithGoogle().then((data) => {
      //console.log('GLOGIN SUCCESS->>>', data);
      this.signUp(data);
    },
    (error) => {
      //console.log('GLOGIN FAILURE->>>', error);
      this.spinnerService.hide('registerLoading');
    });;
  }

  /*Function for getting country data from API*/
  getCountryData () {
    //console.log("Country Method");
    return new Promise(resolve => {
      this.userRequestManager.get('CountryList')
      .then(data => {
        var alldata = JSON.parse(JSON.stringify(data));
        //console.log('alldata for country list',alldata);
        if(alldata.status == 1){
          this.countryData=alldata.data;
          this.user.country= "1";
          this.getSuburbsByCountry(this.user.country)
        }
      })
    })
  }

  /*Function for getting state data from API*/
  getStateData (value) {
    //console.log('value'+JSON.stringify(this.user.country));
    let url = '';
    return new Promise(resolve => {
      url = 'StateList?country_id='+this.user.country;
      this.userRequestManager.get(url)
      .then(data => {
        var alldata = JSON.parse(JSON.stringify(data));
        //console.log('alldata for state list'+JSON.stringify(alldata));
        if(alldata.status == 1){
          this.stateData=alldata.data;
        } else {
          this.user.state = '';
          this.stateData=[];
        }
        //console.log('this.stateData',this.stateData);
      },function(err){
        //console.log('err',err);
        this.user.state = '';
        this.stateData=[];
      }).catch((ex) => {
        this.user.state = '';
        this.stateData=[];
      })

    })
  }

  getSuburbsByCountry (id) {
    console.log("id :"+JSON.stringify(id));
    // this.suburbData = [];
    return new Promise(resolve => {
      this.userRequestManager.get('getSuburbsByCountry/'+id)
      .then(data => {
        var alldata = JSON.parse(JSON.stringify(data));
        //console.log('alldata for suburb country list'+JSON.stringify(alldata));
        if(alldata.status == 1){
          this.suburbsByCountry=alldata.data.states;
          for(var i=0; i<this.suburbsByCountry.length;i++) {
            for(var j=0; j<this.suburbsByCountry[i].suburbs.length;j++) {
              this.suburbData.push({
                'suburb_id':this.suburbsByCountry[i].suburbs[j].suburb_id,
                'suburb_name':this.suburbsByCountry[i].suburbs[j].suburb_name,
                'postal_code':this.suburbsByCountry[i].suburbs[j].postal_code,
                'state_id':this.suburbsByCountry[i].state_id,
                'state_name':this.suburbsByCountry[i].state_name,
              });
            }
            this.dataService =  this.completerService.local(this.suburbData, 'suburb_name','suburb_name');
          }
        }
      })
    })
  }

  getPostalcode(selected: CompleterItem) {
    if(selected != null) {
      //console.log('id of selected value',selected);
      if(selected.originalObject != '') {
        let suberbObj = selected.originalObject;
        let postalObj = suberbObj.postal_code;
        this.user.pincode = postalObj.postal_code;
        this.user.state = suberbObj.state_name;
        this.user.state_id = suberbObj.state_id
        console.log("selected.originalObject : "+JSON.stringify(selected.originalObject));
        /*this.addAddress.postalCode = selected.originalObject.postal_code.postal_code;
        this.addAddress.state = selected.originalObject.state_id;
		    this.addAddress.stateName = selected.originalObject.state_name;
        this.localStorage.set('statePostalCode', selected.originalObject);*/
      }
    }
  }
}
