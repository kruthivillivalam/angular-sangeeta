import {Injectable} from '@angular/core';
import {Http, Response,RequestOptions,Headers} from '@angular/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs';
import { AuthService } from 'angular2-social-login';
import { LocalStorageService } from 'angular-2-local-storage';
import { UserRequestManager } from './user-request-manager';
import { FacebookService, LoginResponse,LoginOptions } from 'ngx-facebook';

@Injectable()
export class SocialLogin {
  public instance:any;
  public sub:any;

    constructor(public _auth: AuthService,
      public localStorege:LocalStorageService,
      public userRequestManager:UserRequestManager,
      public fb: FacebookService,
      public http: Http,
      public router: Router) {
    }

    loginWithFacebook() {

      const loginOptions: LoginOptions = {
        enable_profile_selector: true,
        return_scopes: true,
        scope: 'public_profile,user_friends,email,pages_show_list'
      };

      return new Promise((resolve, reject) => {

        this.fb.login(loginOptions)
        .then((response: LoginResponse) => {
          this.fb.api('/' + response.authResponse.userID + '?fields=id,name,email,first_name,gender,last_name,middle_name,picture')
          .then(res => {
              let data = JSON.parse(JSON.stringify(res));
              let alldata = [];

                  alldata.push({
                    'provider':'Facebook',
                    'provider_id':response.authResponse.userID,
                    'token':response.authResponse.accessToken,
                    'loginType':'s',
                    'email':data.email,
                    'firstName':data.first_name,
                    'lastName':data.last_name,
                    'password':'',
                    'status':'1',
                    'confirmed':'1',
                    'mobile':'',
                    'dob':'',
                    'agree':true,
                    'cust_addr1':'',
                    'cust_addr2':'',
                    'city':'',
                    'country_id':'',
                    'days':'',
                    'postcode':'',
                    'state_id':'',
                    'suburb':''
                  });
                  resolve(alldata[0]);
          })
          .catch(error => {
            console.log(error);
            reject(error);
          });
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
      });
    }

    loginWithGoogle () {

      return new Promise((resolve,reject) => {
        this._auth.login('google').subscribe(
          (res) => {
            let response=JSON.parse(JSON.stringify(res));
            let string = response.name;
            string = string.split(" ");
            let stringArray = new Array();
            for(var i =0; i < string.length; i++){
              if(string[i] != ' ') {
                stringArray.push(string[i]);
              }
            }
            let alldata=[];
            alldata.push({
              'provider':response.provider,
              'provider_id':response.uid,
              'token':response.token,
              'loginType':'s',
              'email':response.email,
              'firstName':stringArray[0],
              'lastName':stringArray[1],
              'password':'',
              'status':'1',
              'confirmed':'1',
              'mobile':'',
              'dob':'',
              'agree':true,
              'cust_addr1':'',
              'cust_addr2':'',
              'city':'',
              'country_id':'',
              'days':'',
              'postcode':'',
              'state_id':'',
              'suburb':''
            });
            resolve(alldata[0]);
          }, (error) => {
            reject(error);
          });
      });
    }

}
