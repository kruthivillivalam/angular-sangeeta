import {Injectable} from '@angular/core';
import {Http, Response,RequestOptions, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from "rxjs";
import { LocalStorageService } from 'angular-2-local-storage';
import { THRIDPARTYAPI } from '../app/app.constants';
import { Body } from '@angular/http/src/body';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class UserRequestManager {
  public redirectPath: string;
  public thirdPartyAPIs: any;
  public instance:any;
  public api_endpoint:any;
  public cartItem: any;
  public serviceInfodata: any;
  public updatedCartItem: any;
  public deliveryType: any;
  private addToCartTrigger = new Subject<any>();
  private orderTypeChangeTrigger = new Subject<any>();
  private restaurantInfoData = new Subject<any>();
  private galleryData = new Subject<any>();
  constructor(public localStorage:LocalStorageService,public http: Http) {
    // this.instance='https://orderpointAdminStaging.azurewebsites.net/';
    this.instance = 'https://adminstaging.azurewebsites.net/';
    //this.instance='https://orderpointadminqa.azurewebsites.net/';
    this.thirdPartyAPIs = THRIDPARTYAPI;
    this.api_endpoint="api/v1/";
  }

  /*Function for actually fetching records from API using GET method*/
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
        resolve(data);
      },function(error) {
        console.log("Error happened" + error);
        resolve(error);
      });
    });
  }

/*Function for actually submitting records to API using POST method*/
 set(api,data){
   let url= this.instance+this.api_endpoint+api;
   let headers = new Headers({ "Content-Type": "application/json"});
   let options = new RequestOptions({ headers: headers });

   console.log('url',url);
   console.log('data',data);

   return new Promise((resolve,reject) => {
    this.http.post(url,data,options)
    .map(res => res.json())
    .subscribe(data => {
	if (data.data && data.data.token && data.data.token !== 'Token is missing') {
        this.localStorage.set('userToken', data.data.token);
      }
      resolve(data);
    }, function(error) {
      // TO DO HANDLE TOKEN EXPIRATION
       console.log("Error happened" + error);
       reject(error);
     });
   });
  }

  // API call to fectch restaurant reviews
  getRestaurantReviews(api, merchId) {
    let apiURL = this.instance + this.api_endpoint + api + '?merchantId=' + merchId;
    //'https://orderpointdev.azurewebsites.net/api/v1/getReviewList' + '?merchantId=' + this.merchantID;
    return new Promise((resolve,reject) => {
      this.http.get(apiURL)
      .map(res => res.json())
      .subscribe(data => {
        resolve(data);
      }, function(error) {
         console.log('Error happened' + error);
         resolve(error);
      });
    });
  }

  // API call to fetch commision amount that needs to be charged from each restaurant
  getCommissionSlab(api, merchId, grossAmnt) {
    let apiURL = this.instance + this.api_endpoint + api + '?merchantId=' + merchId;
    //'https://orderpointdev.azurewebsites.net/api/v1/getReviewList' + '?merchantId=' + this.merchantID;
    return new Promise((resolve,reject) => {
      this.http.get(apiURL)
      .map(res => res.json())
      .subscribe(data => {
        resolve(data);
      }, function(error) {
         console.log('Error happened' + error);
         resolve(error);
      });
    });
  }

  // Twilio Phone Number Verification Implementation
  phoneVerification(mob) {
    const phoneVerifyURL = this.thirdPartyAPIs.TWILIO_PHONE_NO_LOOKUP + mob + '?Type=carrier';
    const AccountSid = 'AC317c2808c530aede7f37e5c328dcffe1';
    const AuthToken = '35fd426b334bb4741d95b7b68efdd47d';
    const headers = new Headers({ 'Authorization': 'Basic ' +  btoa(AccountSid + ':' + AuthToken) });
    const options = new RequestOptions({ headers: headers });

    return new Promise((resolve,reject) => {
      this.http.get(phoneVerifyURL, options)
      .map(res => res.json())
      .subscribe(data => {
        console.log('phone verification' + data);
        resolve(data);
      },function(error) {
        console.log('Error : ' + error);
        resolve(error);
      });
    });
  }

  // MailGun Email Verification Implementation
  emailVerification(email) {
    const emailVerifyURL = this.thirdPartyAPIs.MAILGUN_EMAIL_VALIDATION + email + '&api_key=' + this.thirdPartyAPIs.MAILGUN_KEY + '&mailbox_verification=true';
      return new Promise((resolve, reject) => {
      this.http.get(emailVerifyURL).toPromise().then((data) => {
        let resp = JSON.parse(JSON.stringify(data))._body;
        console.log('email verification _> ', JSON.parse(resp).mailbox_verification);
        resolve(JSON.parse(resp));
      }, (err) => {
        console.log('email verification error' + err);
        resolve(err);
      });
    });
  }

  // Microsoft Text Analysis API Implementation
  textSentimentAnalysis(textData) {
    const headers = new Headers({ 'Content-Type': 'application/json ',
                                'Ocp-Apim-Subscription-Key' : this.thirdPartyAPIs.MSFT_SUBSCR_KEY,
                  });
    const options = new RequestOptions({ headers: headers });
    const body = {
                    'documents': [
                      {
                        'language': 'EN',
                        'id' : '1',
                        'text': textData
                      }
                    ]
                  };
   return new Promise((resolve, reject) => {
    this.http.post(this.thirdPartyAPIs.MSFT_TEXT_ANALYSIS_API, body, options)
    .map(res => res.json())
    .subscribe(data => {
      console.log('Sentiment Data', data);
      resolve(data);
    }, function(error) {
       console.log('Error : ' + error);
       reject(error);
     });
   });
  }

// SET DELIVERY TYPE and sends and event for menu price change
  setOrderType(deliType) {
    this.deliveryType = deliType;
    this.orderTypeChangeTrigger.next({ type: deliType });
  }

// GET ORDER TYPE
  getOrderType() {
    return this.deliveryType;
  }

// An Observable which is used for order type change for changing menu price
  getOrderTypeChangeTrigger(): Observable<any> {
    return this.orderTypeChangeTrigger.asObservable();
  }

// Emits item added to cart event 
  setCartItem(cartObj) {
    this.cartItem = cartObj;
    console.log("CART ITEM",this.cartItem);
    this.addToCartTrigger.next({ status: 'added' });
  }
// Emits cart item updated event
  setUpatedCartItem(uCartObj) {
    this.updatedCartItem = uCartObj;
    console.log("UPD CART ITEM",this.updatedCartItem);
    this.addToCartTrigger.next({ status: 'updated' });
  }

  getCartItem() {
    return this.cartItem;
  }

  getUpatedCartItem() {
    return this.updatedCartItem;
  }
  // An observable for triggering event for items added to cart
  getAddToCartTrigger(): Observable<any> {
    return this.addToCartTrigger.asObservable();
  }
  getRestaurantInfoData(){
     return this.serviceInfodata;
  }
  getRestaurantServiceTrigger(): Observable<any> {
    return this.restaurantInfoData.asObservable();
  }
  setRestaurantInfoData(data) {
   this.serviceInfodata = data;
    this.restaurantInfoData.next();
  } 
  getGalleryData(){
      return this.galleryData;
  }
  getGalleryServiceTrigger(): Observable<any> {
    return this.galleryData.asObservable();
  }
  setGalleryData(data) {
    this.serviceInfodata = data;
    this.galleryData.next();
  }

// Function which validates cart amount (min cart value chk)
  cartAmountValidation(minOrderDetails, cartAmnt) {
    const deliveryType = this.localStorage.get('deliType');
    let validCartAmnt = true;
    let minAmnt = 0;
    let validCartObj = {
      valid: validCartAmnt,
      minimumAmount: minAmnt
    };
    if(minOrderDetails) {
      if (deliveryType === 'tk' && (cartAmnt < parseFloat(minOrderDetails[0].minimumAmt))) {
        validCartAmnt = false;
        minAmnt = minOrderDetails[0].minimumAmt;
      } else if ( deliveryType === 'de' && ( cartAmnt < parseFloat(minOrderDetails[1].minimumAmt))) {
        validCartAmnt = false;
        minAmnt = minOrderDetails[1].minimumAmt;
      } else {
        validCartAmnt = true;
      }
    }
    validCartObj = {
      valid: validCartAmnt,
      minimumAmount: minAmnt
    };
    return validCartObj;
  }

  setRedirectPath(pathParam) {
    this.redirectPath = pathParam;
  }

  getRedirectPath() {
    return this.redirectPath;
  }

  // Clears entire local storage
  resetData() {
    this.localStorage.clearAll();
  }

  // Clears cart related local storage
  resetCartData() {
    this.localStorage.remove('cartData');
    this.localStorage.remove('cartDetails');
    this.localStorage.remove('myCart');
    this.localStorage.remove('myOrders');
  }


  // Stripe API CALLS TO CREATE CHARGE
  stripeCreateChargeWithFee(accountID, amount, fee, payToken) {
    const url = this.thirdPartyAPIs.STRIPE_API + '?source=tok_visa_debit&amount=' + amount + '&currency=aud&application_fee=' + fee;
    const headers = new Headers({ 'Authorization': 'Bearer ' +  this.thirdPartyAPIs.STRIPE_API_KEY,
                                  'Content-Type' : 'application/x-www-form-urlencoded',
                                  'Stripe-Account' : accountID});
    const options = new RequestOptions({ headers: headers });
    return new Promise((resolve, reject) => {
     this.http.post(url, null, options )
     .map(res => res.json())
     .subscribe(data => {
       resolve(data);
     }, function(error) {
       // TO DO HANDLE TOKEN EXPIRATION
        console.log('Error happened' + error);
        reject(error);
      });
    });
   }

}


