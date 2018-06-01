import {Injectable} from '@angular/core';
import {Http, Response,RequestOptions,Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from "rxjs";
import { LocalStorageService } from 'angular-2-local-storage';

@Injectable()
export class UserRequestManager {
  public instance:any;
  public api_endpoint:any;



    constructor(public localStorege:LocalStorageService,public http: Http) {

      this.instance='http://192.168.0.107:8000/';
      //this.instance='http://192.168.43.70:8000/';
      //this.instance='http://orderpointdev.azurewebsites.net/';
      this.api_endpoint="api/v1/";
    }
    //get(api,data){
    get(api){
      let url= this.instance+this.api_endpoint+api;
      //let body = JSON.stringify(data);
      //let headers = new Headers({ "Content-Type": "application/json"});
      //let options = new RequestOptions({ headers: headers });

      return new Promise((resolve,reject) => {
        //this.http.get(url,data,options)
        this.http.get(url)
        .map(res => res.json())
        .subscribe(data => {
          console.log(data);
          resolve(data);
        },function(error) {
          console.log("Error happened" + error);
          reject(error);
        });
      });
    }
  //   getAll() {
  //  }
   set(api,data){
     let url= this.instance+this.api_endpoint+api;
     let headers = new Headers({ "Content-Type": "application/json"});
     let options = new RequestOptions({ headers: headers });

     console.log('url',url);
     console.log('data',data);

     return new Promise((resolve,reject) => {
      this.http.post(url,data,options)
      .map(res => res.json())
      .subscribe(data=>{
        console.log(data);
        resolve(data);
      },function(error) {
         console.log("Error happened" + error);
         reject(data);
       });
    });
    }
    // setHeader(boole){
    //   this.childheader=boole;
    // }
}
