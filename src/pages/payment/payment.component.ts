import { Component, OnInit, ViewChild, ChangeDetectorRef, Renderer } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import {
  Router,
  ActivatedRoute,
  // import as RouterEvent to avoid confusion with the DOM Event
  Event as RouterEvent,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
} from '@angular/router';
import 'rxjs/add/operator/pairwise';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/delay';
import * as moment from 'moment';
import { DialogService } from 'ng2-bootstrap-modal';
import * as _ from 'lodash';
import { DirectionsRenderer } from '@ngui/map';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { SpinnerService } from '../common/spinner.service';

//providers
import { UserRequestManager } from '../../providers/user-request-manager';
import { IsLogin } from '../../providers/is-login';

//modal components
import { AlertComponent } from '../common/alert.component';
import { AddressComponent } from '../cart/address.component';

//constants
import { ISADAPTIVE } from '../../app/app.constants';

@Component({
  selector: 'payments',
  template: require('./payment.component.html'),
  styleUrls: ['./payment.component.scss']
  // directives: [ExperimentDetailComponent]
})
export class PaymentComponent implements OnInit {
  public offerItemUnitPrice: any;
  public usertempData: any;
  public freeItems: any = [];
  public paymentMethod: any = [];
  public currentTab: any;
  public userStoredData: any;
  public resData: any;
  public myOrderData: any;
  public myCart: any;
  public itemTotal = 0;
  public subtotal = 0;
  public taxtotal = 0;
  public grandTotal: any = 0;
  public itemTotalArr: any = [];
  public deliveryAddress: any;
  public billingAddress: any;
  public deliType: any;
  public promptMessage: any = {};
  public accessTokenFromPaypal: any;
  public urls: any;
  public paymentId: any;
  public finalPayerId: any;
  public paykey: any;
  public showMessage: any;
  public guest_customer_mobile: any;
  public guest_customer_email: any;
  public token: any = null;
  public current_year: number;
  public cartDetails: any;
  public cartItems: any = [];
  public deliveryCharge: number;
  public offerArray: any = [];
  public selectedOffer: any;
  public OfferAmount = 0;
  public appliedCoupon: any;
  public appliedCouponCode: string;
  public couponArray: any = [];
  public appliedLoyaltyPoint: number;
  public availableLoyaltyPoint: number;
  public dollarValueOfLoyaltyPoint = 0;
  public customerPointObj: any;
  public redeemedPoints = 0;
  public couponAmount = 0;
  public selectedCoupon: any;
  public freeItemId: any;
  public commissionPercent = 0;
  public offerItemPrice: any;
  public hideOtherMethod: boolean;
  public pSelected:boolean = false;
  public payKeyId: any;
  // public paypal = require('../../../node_modules/paypal-rest-sdk');
  constructor(
  public localStorage: LocalStorageService,
  public userRequestManager: UserRequestManager,
  public router: Router,
  public activatedRoute: ActivatedRoute,
  private cdr: ChangeDetectorRef,
  private renderer: Renderer,
  private dialogService: DialogService,
  public islogin: IsLogin,
  public http: Http,
  public spinnerService: SpinnerService,
) {
  this.hideOtherMethod = true;
  this.cartDetails = this.localStorage.get('cartDetails');
  this.cartItems = this.cartDetails.cartItems;
  this.subtotal = this.cartDetails.totalCartAmount;
  this.taxtotal = this.cartDetails.totalTaxAmount;
  this.deliveryCharge = this.cartDetails.totalDeliveryCharge;
  this.grandTotal = this.subtotal + this.taxtotal + this.deliveryCharge;
  this.couponArray = this.localStorage.get('eligibleCoupons') ? this.localStorage.get('eligibleCoupons') : [];
  this.customerPointObj = this.localStorage.get('customerPoints') ? this.localStorage.get('customerPoints') : {};
  this.availableLoyaltyPoint = this.customerPointObj.customer_point_balance ? this.customerPointObj.customer_point_balance : 0;
  // TODO: Get this offerArray from saveOrder API call (Ask Sangetha which service exactly) and complete the functionality applyOffer();
  // Check the end of file to find the apply offer function. offerType === 'I' need to be handled properly
  //console.log('SID OFFER ARRAY : '+JSON.stringify(JSON.parse(JSON.stringify(this.localStorage.get('offerArray')))));
  //this.offerArray = JSON.parse(JSON.stringify(this.localStorage.get('restaurantData'))).offers;// GET IT FROM SERVICE CALL
  //console.log('this.offerArray : ' +JSON.stringify(this.offerArray));
}

ngOnInit() {

  console.log('inside payment constructor');
  //this.islogin.isLoggedIn();
  this.currentTab = 'tab1';

  if (this.localStorage.get('cartData') != null || this.localStorage.get('cartData') != undefined) {
    this.myCart = JSON.parse(JSON.stringify(this.localStorage.get('cartData')));
  }

  this.current_year = new Date().getFullYear();
  var uid = '';
  this.token = this.localStorage.get('userToken') ? this.localStorage.get('userToken') : '';
  if (this.localStorage.get('userData') != null || this.localStorage.get('userData') != undefined) {
    this.userStoredData = JSON.parse(JSON.stringify(this.localStorage.get('userData')));
    //console.log('this.userStoredData',this.userStoredData);
    this.resData = JSON.parse(JSON.stringify(this.localStorage.get('restaurantData')));

    if (this.localStorage.get('deliveryAddress') != null || this.localStorage.get('deliveryAddress') != undefined) {
      this.deliveryAddress = JSON.parse(JSON.stringify(this.localStorage.get('deliveryAddress')));
      //console.log('this.deliveryAddress',this.deliveryAddress);
    }
    if (this.localStorage.get('billingAddress') != null || this.localStorage.get('billingAddress') != undefined) {
      this.billingAddress = JSON.parse(JSON.stringify(this.localStorage.get('billingAddress')));
      //console.log('this.billingAddress',this.billingAddress);
    }

    if (this.localStorage.get('deliType') != null || this.localStorage.get('deliType') != undefined) {
      var storedDelType = JSON.parse(JSON.stringify(this.localStorage.get('deliType')));

      if (storedDelType == 'tk') {
        this.deliType = 'Takeaway';
      }else if (storedDelType == 'de') {
        this.deliType = 'Delivery';
      } else {
        this.deliType = 'Dine In';
      }
    }
  }
  else {
    if (this.localStorage.get('deliveryAddress') != null || this.localStorage.get('deliveryAddress') != undefined) {
      this.deliveryAddress = JSON.parse(JSON.stringify(this.localStorage.get('deliveryAddress')));
      //console.log('this.deliveryAddress',this.deliveryAddress);
    }
    if (this.localStorage.get('billingAddress') != null || this.localStorage.get('billingAddress') != undefined) {
      this.billingAddress = JSON.parse(JSON.stringify(this.localStorage.get('billingAddress')));
      //console.log('this.billingAddress',this.billingAddress);
    }
    if (this.localStorage.get('guest_customer_email') != null || this.localStorage.get('guest_customer_email') != undefined) {
      this.guest_customer_email = JSON.parse(JSON.stringify(this.localStorage.get('guest_customer_email')));
    }
    if (this.localStorage.get('guest_customer_mobile') != null || this.localStorage.get('guest_customer_mobile') != undefined) {
      this.guest_customer_mobile = JSON.parse(JSON.stringify(this.localStorage.get('guest_customer_mobile')));
    }
    if (this.localStorage.get('deliType') != null || this.localStorage.get('deliType') != undefined) {
      var storedDelType = JSON.parse(JSON.stringify(this.localStorage.get('deliType')));

      if (storedDelType == 'tk') {
        this.deliType = 'Takeaway';
      }else if (storedDelType == 'de') {
        this.deliType = 'Delivery';
      } else {
        this.deliType = 'Dine In';
      }
    }
  }
  this.getOffers();
  // The following lines of code fetches the payKey from redirect URL and checks the payment details
  // If success then calls handlePayPalPaymentConfirmation()
  var adaptiveURL = window.location.href;
  console.log("adaptiveURL : "+adaptiveURL);
  if (adaptiveURL.indexOf('?payKey=') != -1) {
    // this.spinnerService.show('homePageSpinner');
    var tempPayKeyId = adaptiveURL.split('?payKey=');
    var payKeyId = tempPayKeyId[1];
    this.payKeyId = payKeyId;
    var Paypal = require('paypal-adaptive');
    var paypalSdk = new Paypal({
      userId: 'sekar.nagarajan_api1.bartertechnologies.onmicrosoft.com',
      password: 'B9U7TE3YWXZTZFUX',
      signature: 'A3bGH27SxpA5baY.y3vROHFTc9tZAlNdAVbhowIrfLeZJQjhHqwhh-kz',
      sandbox: true //defaults to false
    });
    var params = {
      payKey: payKeyId
    };
    const currentCtx = this;
    // The paypal API for getting payment details using paykey
    paypalSdk.paymentDetails(params, function (err, response) {
      if (err) {
        console.log(err);
        currentCtx.showMessage = 'payment not done due to some technical problem, you can try with other payment method.';
        currentCtx.spinnerService.hide('homePageSpinner');
      } else {
        // payments details for this payKey, transactionId or trackingId
        console.log('response for paymentdetails', response);
        if (response && response.status && response.status === 'COMPLETED') {
          currentCtx.handlePayPalPaymentConfirmation(payKeyId);
        } else {
          currentCtx.showAlert('Order Not Confirmed', 'Order not confirmed.If you have charged for this order it will be refunded');
        }
      }
    });
  }
}

// Function which make the paypal onlinepayment api call params ready, called just before opening paypal website
savePayPalPaymentData() {
  var sendPayPalData = {};
  sendPayPalData['token'] = this.token;
  //sendPayPalData['merchOrderId']= this.myCart.merchOrderId;
  sendPayPalData['paymentMethodName'] = 'paypal';
  sendPayPalData['merchant_Id'] = this.myCart.merchant_Id;
  if (this.localStorage.get('deliType') != null || this.localStorage.get('deliType') != undefined) {
    sendPayPalData['deliType'] = this.localStorage.get('deliType');
  }
  if (this.localStorage.get('cartData') != undefined || this.localStorage.get('cartData') != null) {
    let myCartData = JSON.parse(JSON.stringify(this.localStorage.get('cartData')));
    sendPayPalData['order_id'] = myCartData.merchOrderId;
  }
  sendPayPalData['gateway_token'] = null;
  sendPayPalData['gateway_payment_status'] = 'COMPLETED';
  sendPayPalData['offerId'] = this.selectedOffer ? this.selectedOffer.id : '';
  sendPayPalData['totalOfferAmt'] = this.OfferAmount;
  sendPayPalData['couponId'] = this.selectedCoupon && this.selectedCoupon.coupons && this.selectedCoupon.coupons.id ? this.selectedCoupon.coupons.id : '';
  sendPayPalData['totalCouponAmt'] = this.couponAmount ? this.couponAmount : 0;
  sendPayPalData['points_used'] = this.redeemedPoints ? this.redeemedPoints : 0;
  sendPayPalData['point_redeem_amt'] = this.dollarValueOfLoyaltyPoint ? this.dollarValueOfLoyaltyPoint : 0;
  sendPayPalData['totalGrossAmount'] = this.subtotal ? this.subtotal : 0;
  sendPayPalData['totalPayableAmount'] = this.grandTotal ? Math.round(Number(this.grandTotal)) : 0;
  sendPayPalData['offervalue_free_item_id'] = this.freeItemId ? this.freeItemId : '';
  sendPayPalData['gatewayName'] = 'paypal';
  sendPayPalData['commission_amt'] = this.commissionPercent;
  this.localStorage.set('payPalPayLoad', sendPayPalData);
}

// Function which handles PAYPAL redirection and showing payment confirmation screen
handlePayPalPaymentConfirmation(payKey) {
  var payPalPayLoad = JSON.parse(JSON.stringify(this.localStorage.get('payPalPayLoad')));
  payPalPayLoad['gateway_txn_id'] = payKey;
  this.userRequestManager.set('onlinePayments', payPalPayLoad)
  .then(data => {
    this.spinnerService.hide('homePageSpinner');
    var alldata = JSON.parse(JSON.stringify(data));
    if (alldata.status == 1) {
      alldata['data']['OrderDetails']['taxtotal'] = this.taxtotal;
      this.localStorage.set('OrderDetailsData', alldata);
      //console.log('alldata',alldata);
      this.showMessage = 'payment done Successfully.'
      this.router.navigate(['confirmorder']);
    } else {
      this.showAlert('Failed', 'Order not placed, something went wrong');
    }
  }, error => {
    this.spinnerService.hide('homePageSpinner');
    this.spinnerService.hide('homePageSpinner');
    console.log('OnlinePayment API FAILED', error);
    this.spinnerService.hide('homePageSpinner');
    this.showAlert('Order Not Confirmed', 'Order not confirmed.If you have charged for this order it will be refunded');
  });
}

//Function which is called on Credit/Debit card button click (Stripe payment widget)
openCheckout() {
  var ctx = this;
  var amount = Math.round(Number(this.grandTotal * 100));
  var fee = Math.round(Number(this.grandTotal));
  var handler = (<any>window).StripeCheckout.configure({
    key: 'pk_test_HQcvhQfP6gImSm0PUpGA1xSf',
    locale: 'auto',
    token: function (token: any) {
      // You can access the token ID with `token.id`.
      // Get the token ID to your server-side code for use.
      console.log('Stripe Token', token);
      ctx.triggerOnlinePayment(token.id);
      // ctx.userRequestManager.stripeCreateChargeWithFee('acct_1BqHlfLRBpgXSQ4E', amount, fee, token.id).then(data => {
      //   console.log('CHARGE CREATION SUCCESS', data);
      // }, error => {
      //   console.log('CHARGE CREATION ERROR', error);
      // });
    }
  });
  // The actual function which opens Stripe Widget
  handler.open({
    name: 'Order Point',
    description: 'Payment Widget',
    amount: Math.round(Number(this.grandTotal * 100))
  });

}

getOffers() {
  this.offerArray = JSON.parse(JSON.stringify(this.localStorage.get('offerArray')));
}


ngAfterContentInit() {
  this.getPaymentMethod();
}

// Once the stripe token is generated this function is called to trigger the online payment API call
triggerOnlinePayment(stripeToken) {
  this.spinnerService.show('homePageSpinner');
  var sendStripeData = {};
  sendStripeData['token'] = this.token;
  //sendStripeData['merchOrderId']= this.myCart.merchOrderId;
  sendStripeData['paymentMethodName'] = 'card';
  sendStripeData['gateway_txn_id'] = stripeToken;
  sendStripeData['merchant_Id'] = this.myCart.merchant_Id;
  if (this.localStorage.get('deliType') != null || this.localStorage.get('deliType') != undefined) {
    sendStripeData['deliType'] = this.localStorage.get('deliType');
  }
  if (this.localStorage.get('cartData') != undefined || this.localStorage.get('cartData') != null) {
    let myCartData = JSON.parse(JSON.stringify(this.localStorage.get('cartData')));
    sendStripeData['order_id'] = myCartData.merchOrderId;
  }
  sendStripeData['offerId'] = this.selectedOffer ? this.selectedOffer.id : '';
  sendStripeData['totalOfferAmt'] = this.OfferAmount;
  sendStripeData['couponId'] = this.selectedCoupon && this.selectedCoupon.coupons && this.selectedCoupon.coupons.id ? this.selectedCoupon.coupons.id : '';
  sendStripeData['totalCouponAmt'] = this.couponAmount ? this.couponAmount : 0;
  sendStripeData['points_used'] = this.redeemedPoints ? this.redeemedPoints : 0;
  sendStripeData['point_redeem_amt'] = this.dollarValueOfLoyaltyPoint ? this.dollarValueOfLoyaltyPoint : 0;
  sendStripeData['totalGrossAmount'] = this.subtotal ? this.subtotal : 0;
  sendStripeData['totalPayableAmount'] = this.grandTotal ? Math.round(Number(this.grandTotal)) : 0;
  sendStripeData['offervalue_free_item_id'] = this.freeItemId ? this.freeItemId : '';
  sendStripeData['gatewayName'] = 'stripe';
  sendStripeData['gateway_token'] = null;
  sendStripeData['gateway_payment_status'] = 'PENDING';
  sendStripeData['commission_amt'] = '';
  console.log("sendStripeData "+JSON.stringify(sendStripeData));
  return new Promise(resolve => {
    this.userRequestManager.set('onlinePayments', sendStripeData)
    .then(data => {
      this.spinnerService.hide('homePageSpinner');
      var alldata = JSON.parse(JSON.stringify(data));
      if (alldata.status == 1) {
        alldata['data']['OrderDetails']['taxtotal'] = this.taxtotal;
        this.localStorage.set('OrderDetailsData', alldata);
        //console.log('alldata',alldata);
        this.showMessage = 'payment done Successfully.'
        this.router.navigate(['confirmorder']);
      } else {
        this.showAlert('Failed', 'Order not placed, something went wrong');
      }
    }, error => {
      this.showAlert('Failed', 'Order not placed, something went wrong');
      console.log('OnlinePayment API FAILED', error);
      this.spinnerService.hide('homePageSpinner');
    });
  });
}

/*Function for getting payment method from API*/
getPaymentMethod() {
  return new Promise(resolve => {
    this.userRequestManager.get('getPaymentMethods')
    .then(data => {
      var alldata = JSON.parse(JSON.stringify(data));
      if (alldata.status == 1) {
        var paymentMethod = alldata.data;
        paymentMethod.forEach(data => {
          this.paymentMethod.push(data)
        });
        //console.log('this.paymentMethod',this.paymentMethod);

        //console.log('this.grandTotal',parseFloat(this.grandTotal).toFixed(2));
        let total = this.grandTotal;
        //console.log('this.deliveryAddress',this.deliveryAddress);
        let delAddress = this.deliveryAddress;
        let logedinUserData = this.userStoredData;

      }
    })
  })
}

/*Function for checking which tab is active*/
checkTab(id) {
  //console.log('event.target.attributes.id',event.target.attributes.id);
  this.currentTab = (<HTMLInputElement>document.getElementById('tab' + id)).id;
  if (this.currentTab == 'tab1') {
    var resetForm = (<HTMLFormElement>document.getElementById('paymentForm'));
    resetForm.reset();
  }
}

onSubmitCOD() {
  console.log("onSubmitCOD");
  this.pSelected = true;
  this.spinnerService.show('homePageSpinner');
  var sendCODData = {};
  sendCODData['token'] = this.token;
  //sendCODData['merchOrderId']= this.myCart.merchOrderId;
  sendCODData['paymentMethodName'] = 'Cash On Delivery';
  sendCODData['merchant_Id'] = this.myCart.merchant_Id;
  if (this.localStorage.get('deliType') != null || this.localStorage.get('deliType') != undefined) {
    sendCODData['deliType'] = this.localStorage.get('deliType');
  }
  if (this.localStorage.get('cartData') != undefined || this.localStorage.get('cartData') != null) {
    let myCartData = JSON.parse(JSON.stringify(this.localStorage.get('cartData')));
    sendCODData['order_id'] = myCartData.merchOrderId;
  }
  sendCODData['offerId'] = this.selectedOffer ? this.selectedOffer.id : '';
  sendCODData['totalOfferAmt'] = this.OfferAmount;
  sendCODData['couponId'] = this.selectedCoupon && this.selectedCoupon.coupons && this.selectedCoupon.coupons.id ? this.selectedCoupon.coupons.id : '';
  sendCODData['totalCouponAmt'] = this.couponAmount ? this.couponAmount : 0;
  sendCODData['points_used'] = this.redeemedPoints ? this.redeemedPoints : 0;
  sendCODData['point_redeem_amt'] = this.dollarValueOfLoyaltyPoint ? this.dollarValueOfLoyaltyPoint : 0;
  sendCODData['totalGrossAmount'] = this.subtotal ? this.subtotal : 0;
  sendCODData['totalPayableAmount'] = this.grandTotal ? Math.round(Number(this.grandTotal)) : 0;
  sendCODData['offervalue_free_item_id'] = this.freeItemId ? this.freeItemId : '';
  sendCODData['gatewayName'] = 'cod';
  sendCODData['gateway_token'] = null;
  sendCODData['gateway_payment_status'] = 'PENDING';
  sendCODData['gateway_txn_id'] = '';
  sendCODData['commission_amt'] = '';
  console.log("sendCODData : "+JSON.stringify(sendCODData));
  return new Promise(resolve => {
    this.userRequestManager.set('onlinePayments', sendCODData)
    .then(data => {
      this.spinnerService.hide('homePageSpinner');
      var alldata = JSON.parse(JSON.stringify(data));
      if (alldata.status == 1) {
        alldata['data']['OrderDetails']['taxtotal'] = this.taxtotal;
        this.localStorage.set('OrderDetailsData', alldata);
        //console.log('alldata',alldata);
        this.showMessage = 'payment done Successfully.'
        this.router.navigate(['confirmorder']);
      } else {
        this.showAlert('Failed', 'Order not placed, something went wrong');
      }
    }, error => {
      console.log('OnlinePayment API FAILED', error);
      this.spinnerService.hide('homePageSpinner');
    });
  });
}
/*Function for submitting payment*/
onSubmit(formData) {
  //.log('data',formData);

  this.getAccessToken()
  .then(data => {
    //console.log('data',data);
    var alldata = JSON.parse(JSON.stringify(data));
    this.accessTokenFromPaypal = alldata.access_token;
    this.localStorage.set('accessTokenFromPaypal', this.accessTokenFromPaypal);
    var app_id = alldata.app_id;
  }, error => {
    console.log('Error');
  })
}

/*function for paymentThroughpaypal*/
paymentThroughpaypal(accessTokenFromPaypal) {
  let logedinUserData = this.userStoredData;
  let delAddress = this.deliveryAddress;
  let total = Math.round(Number(this.grandTotal));

  let url = 'https://api.sandbox.paypal.com/v1/payments/payment';
  let headers = new Headers({
    'Accept': 'application/json',
    'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.accessTokenFromPaypal
  });
  let options = new RequestOptions({ headers: headers });
  var sendData = {
    'intent': 'sale',
    'payer': {
      'payment_method': 'paypal',
    },
    'transactions': [
      {
        'amount': { 'total': total, 'currency': 'AUD' },
        // 'item_list':{
        //   'shipping_address': {
        //     'recipient_name': logedinUserData.firstName+' '+logedinUserData.lastName,
        //     'line1': delAddress.addressline1,
        //     'line2': delAddress.addressline2,
        //     'city': 'Sydney',
        //     'country_code': delAddress.countryCode,
        //     'postal_code': delAddress.postcode,
        //     'phone': logedinUserData.mobile,
        //     'state': delAddress.statecode
        //   },
        // }
      }
    ],
    'redirect_urls': {

      'return_url': 'http://orderpoint.azurewebsites.net/payment',
      'cancel_url': 'http://orderpoint.azurewebsites.net/payment'
      //'return_url': 'http://localhost:4021/payment',
      //'cancel_url': 'http://localhost:4021/payment'
    }
  };
  return new Promise((resolve, reject) => {
    this.http.post(url, sendData, options)
    .map(res => res.json())
    .subscribe(data => {
      console.log(data);
      resolve(data);
    }, function (error) {
      console.log('Error happened' + error);
      this.showAlert('Payment Failed', 'Payment Failed due to some technical issues');
      // if(error.name == 'INTERNAL_SERVICE_ERROR') this.showMessage = error.message;
      reject(error);
    });
  });
}

/*Function for adaptive payment for paypal express checkout*/
paymentExpress() {
  this.pSelected = true;
  this.spinnerService.show('homePageSpinner');
  if (ISADAPTIVE) {
    // API call to fetch commision amount that needs to be charged from each restaurant
    this.userRequestManager.getCommissionSlab('getCommissionPercentage', this.myCart.merchant_Id, this.grandTotal).then(data => {
      console.log('COMMISSION PERCENT', data['data']['commissionPercent']);
      if (data['data'] && data['data']['commissionPercent']) {
        this.commissionPercent = data['data']['commissionPercent'];
      } else {
        this.commissionPercent = 0;
      }
      this.savePayPalPaymentData();
      let logedinUserData = this.userStoredData;
      let delAddress = this.deliveryAddress;
      let total = Math.round(Number(this.grandTotal));
      var tempPaykey = '';
      const commissionAmnt = this.grandTotal * (this.commissionPercent / 100);
      console.log('coming');
      var Paypal = require('paypal-adaptive');
      // console.log('coming1');
      // var paypalSdk = new Paypal({
      //   userId:    'johnnyharpertesting-facilitator1_api1.gmail.com',
      //   password:  'RAV2L4277TTGZUHM',
      //   signature: 'AFcWxV21C7fd0v3bYYYRCpSSRl31AH2.DQm3iBmJOA4.27ePrrNwvQv.',
      //   sandbox:   true //defaults to false
      // });
      console.log('coming1');
      var paypalSdk = new Paypal({
        userId: 'sekar.nagarajan_api1.bartertechnologies.onmicrosoft.com',
        password: 'B9U7TE3YWXZTZFUX',
        signature: 'A3bGH27SxpA5baY.y3vROHFTc9tZAlNdAVbhowIrfLeZJQjhHqwhh-kz',
        sandbox: true //defaults to false
      });
      console.log('coming2');
      var payload = {
        requestEnvelope: {
          errorLanguage: 'en_US'
        },
        actionType: 'PAY',
        currencyCode: 'USD',
        feesPayer: 'EACHRECEIVER',
        memo: 'Chained payment example',
        cancelUrl: 'http://enduserstaging.azurewebsites.net/payment',
        returnUrl: 'http://enduserstaging.azurewebsites.net/payment?payKey=${payKey}',
        //cancelUrl:      'http://localhost:4021/payment',
        //returnUrl:      'http://localhost:4021/payment?payKey=${payKey}',
        receiverList: {
          receiver: [
            {
              email: 'sekar.nagarajan@bartertechnologies.onmicrosoft.com',
              amount: Math.round(Number(this.grandTotal)),
              primary: 'true'
            },
            {
              email: 'barterOrderpoint-facilitator@gmail.com',
              amount: commissionAmnt > 0 ? Math.round(Number(commissionAmnt)) : 1,
              primary: 'false'
            }
          ]
        }
        // receiverList: {
        //     receiver: [
        //         {
        //             email:  'johnnyharpertesting-facilitator1@gmail.com',
        //             amount: '100.00',
        //             primary:'true'
        //         },
        //         {
        //             email:  'orderpoint-buyer@gmail.com',
        //             amount: '10.00',
        //             primary:'false'
        //         }
        //     ]
        // }
      };
      console.log('coming3');
      var ctx = this;
      paypalSdk.pay(payload, function (err, response) {
        if (err) {
          ctx.spinnerService.hide('homePageSpinner');
          console.log('Adaptive Payment Error', err);
          ctx.showAlert('Payment Failed', 'Payment Failed due to some technical issues');
        } else if (response.error && response.error[0] && response.error[0].message) {
          ctx.spinnerService.hide('homePageSpinner');
          console.log('Adaptive Payment Error', err);
          ctx.showAlert('Payment Failed', response.error[0].message);
        } else {
          // Response will have the original Paypal API response
          ctx.spinnerService.hide('homePageSpinner');
          console.log('Adaptive Payment Succ', response);
          // But also a paymentApprovalUrl, so you can redirect the sender to checkout easily
          console.log('Redirect to %s', response.paymentApprovalUrl);
          window.open(response.paymentApprovalUrl, '_self');
        }
      });
      console.log('coming4');
    }, error => {
      this.spinnerService.hide('homePageSpinner');
      this.showAlert('Payment Failed', 'Payment Failed due to some technical issues');
    });
  } else {
    console.log('comgin here');

    this.getAccessToken()
    .then(data => {
      console.log('data', data);
      var alldata = JSON.parse(JSON.stringify(data));
      this.accessTokenFromPaypal = alldata.access_token;
      this.localStorage.set('accessTokenFromPaypal', this.accessTokenFromPaypal);
      var app_id = alldata.app_id;

      let logedinUserData = this.userStoredData;
      let delAddress = this.deliveryAddress;
      let total = this.grandTotal;

      this.paymentThroughpaypal(this.accessTokenFromPaypal).then(paymentData => {
        this.spinnerService.hide('homePageSpinner');
        var allpaymentData = JSON.parse(JSON.stringify(paymentData));

        console.log('allpaymentData', allpaymentData);
        let redirectURL = '';
        if (allpaymentData != undefined) {
          for (let i = 0; i < allpaymentData.links.length; i++) {
            if (allpaymentData.links[i].rel == 'approval_url') {
              redirectURL = allpaymentData.links[i].href;
            }
          }
        }
        console.log('redirectURL', redirectURL);
        window.open(redirectURL, '_self');

      }).catch(err => {
        this.spinnerService.hide('homePageSpinner');
        console.log('Error callback', err); // This will NOT be called
        this.showMessage = 'payment not done due to some technical problem, you can try with other payment method.'
      })

    }, error => {
      console.log(error);
      this.spinnerService.hide('homePageSpinner');
    });
  }
}

/*Function for actually submitting records to API using POST method*/
getAccessToken() {
  //var basicAuthString = btoa('ARwdZ7CgySYIn1Pxh9QAn6GhBaGoQ8diuZo0fOf0i4GHMi8CiclQ4iDgkIjf8F85gQ0CnOPI3IEyiN6L:EFiubrQqOjAKG2mRn1ivvYgy5E66xAvhV5oQmC_BIQdVQYRqP25Addmyb5MuxYcIs1KPudkcVKwShzVw');
  var basicAuthString = btoa('AdJ9kN4SloVSOS3yC2T5iSWKOy_0VXX3im5LCqVI-WhWQdrbwyz2wpfG-l9JjW1sNM9Pkl_RiBZu_5yt:EJnzbFk2I5StWjnkQ0hxVf-tyYGn7ejggihT05kDrCDtFRzdhaUO05kqhdXNM4PFmL0GZXgAd1ilWjZ6');
  let url = 'https://api.sandbox.paypal.com/v1/oauth2/token';
  let headers = new Headers({
    'Accept': 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Basic ' + basicAuthString
  });
  let options = new RequestOptions({ headers: headers });
  //  options['data']='grant_type=client_credentials';

  let data = {};
  console.log('url', url);
  console.log('data', data);

  data = 'grant_type=client_credentials';
  return new Promise((resolve, reject) => {
    this.http.post(url, data, options)
    .map(res => res.json())
    .subscribe(data => {
      console.log(data);
      resolve(data);
    }, function (error) {
      console.log('Error happened' + error);
      reject(error);
    });
  });
}

/*Function for execute the payment using paypal menthod*/
paypalExecutePayment(paymentId, payerId, accessToken) {

  console.log('cinnb');

  let logedinUserData = this.userStoredData;
  let delAddress = this.deliveryAddress;
  let total = this.grandTotal;

  let url = 'https://api.sandbox.paypal.com/v1/payments/payment/' + paymentId + '/execute';
  console.log('url', url);
  let headers = new Headers({
    'Accept': 'application/json',
    'Content-Type': 'application/json', 'Authorization': 'Bearer ' + accessToken
  });
  let options = new RequestOptions({ headers: headers });
  var sendData = {
    'payer_id': payerId
  };
  return new Promise((resolve, reject) => {
    this.http.post(url, sendData, options)
    .map(res => res.json())
    .subscribe(data => {
      console.log(data);
      resolve(data);
    }, function (error) {
      console.log('Error happened' + error);
      this.showAlert('Payment Failed', 'Payment Failed due to some technical issues');
      reject(error);
    });
  });

}

/*Function for displaying modal popup on click on comment icons*/
showPrompt(title, note) {
  this.dialogService.addDialog(AddressComponent, {
    title: title,
    note: note,
  })
  .subscribe((message) => {
    console.log('message', message);
    if (message != undefined) {
      if (message.address != undefined) {
        this.deliveryAddress = message.address;
      } else {
        this.deliveryAddress = message;
      }

    } else {
      this.deliveryAddress = {};
    }
    console.log('this.promptMessage', this.deliveryAddress);
  });
}

showAlert(title, msg) {
  this.dialogService.addDialog(AlertComponent, { title: title, message: msg });
}

// Offer Calculation
applyOffer(offer) {
this.freeItemId = '';
if (this.selectedCoupon) {
  this.selectedCoupon = null;
  this.appliedCoupon = null;
  this.appliedCouponCode = '';
  this.couponAmount = 0;
  this.showAlert('Coupon Removed', 'Applied coupon will be removed If u are selecting or changing offer after applying coupon');
}
this.selectedOffer = offer.offers;
this.OfferAmount = 0;
let offerAmnt = 0;
this.freeItems = [];
const cartData = JSON.parse(JSON.stringify(this.localStorage.get('cartDetails')));
this.cartItems = cartData.cartItems;
let totalCartAmnt = cartData.totalCartAmount + cartData.totalTaxAmount + cartData.totalDeliveryCharge;
console.log('Offer ->', this.selectedOffer);
if (offer.offers.OfferType === 'F') {
  offerAmnt = parseFloat(Number(offer.offers.Offervalue).toFixed(2));
  totalCartAmnt = totalCartAmnt - offerAmnt;
  this.OfferAmount = offerAmnt;
}
if (offer.offers.OfferType === 'P') {
  offerAmnt = totalCartAmnt * ((parseFloat(Number(offer.offers.Offervalue).toFixed(2))) / 100);
  totalCartAmnt = totalCartAmnt - offerAmnt;
  this.OfferAmount = offerAmnt;
}
if (offer.offers.OfferType === 'I') {
  // TODO: ADD FREE ITEM TO CART. GET THE FREE ITEM DETAILS AFTER API CHANGE
  if (offer.offers.free_item.length > 0) {
  offer.offers.free_item.forEach(element => {
    const newObj = {
      itemIdx: this.cartItems.length + 1,
      itemPrice: element.menuItems[0].unitPrice,
      quantity: 1,
      menuItem: element.menuItems[0],
    };
    this.offerItemPrice = element.menuItems[0].unitPrice;
    this.OfferAmount = this.offerItemPrice;
    this.freeItemId = element.menuItems[0] && element.menuItems[0].menuItemId ? element.menuItems[0].menuItemId : '';
    this.freeItems.push(newObj);
  });
}
}
this.grandTotal = totalCartAmnt;
}

//redirect to login
redirectToLogin() {
this.userRequestManager.setRedirectPath('payment');
this.router.navigate(['login']);
}

//apply coupon function
applyCoupon() {
let couponValue = 0;
let totalInvoiceAmnt = this.grandTotal + this.couponAmount;
if (this.appliedCoupon) {
  console.log('appliedCoupon', this.appliedCoupon);
  if (this.appliedCoupon.coupons.couponType
    && this.appliedCoupon.coupons.couponType === 'P'
    && this.appliedCoupon.coupons.rule_PurchaseAmt
    && totalInvoiceAmnt > parseFloat(this.appliedCoupon.coupons.rule_PurchaseAmt)) {
      couponValue = totalInvoiceAmnt * ((parseFloat(Number(this.appliedCoupon.coupons.couponvalue).toFixed(2))) / 100);
      this.couponAmount = couponValue;
      this.grandTotal = totalInvoiceAmnt - couponValue;
      this.selectedCoupon = this.appliedCoupon;
      this.showAlert('Coupon Applied', this.appliedCoupon.coupons.couponcode + '-' + this.appliedCoupon.coupons.couponName + ': Applied');
    } else if (this.appliedCoupon.coupons.couponType
      && this.appliedCoupon.coupons.couponType === 'F'
      && this.appliedCoupon.coupons.rule_PurchaseAmt
      && totalInvoiceAmnt > parseFloat(this.appliedCoupon.coupons.rule_PurchaseAmt)) {
        couponValue = parseFloat(Number(this.appliedCoupon.coupons.couponvalue).toFixed(2));
        this.couponAmount = couponValue;
        this.grandTotal = totalInvoiceAmnt - couponValue;
        this.selectedCoupon = this.appliedCoupon;
        this.showAlert('Coupon Applied', this.appliedCoupon.coupons.couponcode + '-' + this.appliedCoupon.coupons.couponName + ': Applied');
      } else {
        this.showAlert('Coupon Not Applied', 'Your total purchase amount doest not satisfy the minimum purchase condition $' + this.appliedCoupon.coupons.rule_PurchaseAmt);
        this.appliedCoupon = null;
        this.appliedCouponCode = '';
      }

    } else {
      this.showAlert('Enter Coupon Code', 'Please enter coupon code');
    }
  }

  applyLoyaltyPoints() {
    this.dollarValueOfLoyaltyPoint = 0;
    console.log('loyalty point obj', this.customerPointObj);
    if (!this.appliedLoyaltyPoint) {
      this.showAlert('Enter Loyalty Points', 'Please enter loyalty point');
    } else if (isNaN(this.appliedLoyaltyPoint)) {
      this.showAlert('Invalid Points', 'Please enter only numbers');
    } else if (this.grandTotal < parseFloat(this.customerPointObj.point_setup.apply_point_overAmount)) {
      this.showAlert('Sorry Points Not Applied!', 'Your total invoice amount is less than the minimum invoice amount required for redeeming: Minimum bill amount should be $ ' + this.customerPointObj.point_setup.apply_point_overAmount);
    } else if (this.appliedLoyaltyPoint > this.customerPointObj.customer_point_balance) {
      this.showAlert('Insufficient Points', 'You do not have ' + this.appliedLoyaltyPoint + ' points to redeem');
    } else if (this.appliedLoyaltyPoint < parseFloat(this.customerPointObj.point_setup.minPointUse)) {
      this.showAlert('Sorry Points Not Applied!', 'You should apply minimum of ' + this.customerPointObj.point_setup.minPointUse + ' points to redeem');
    } else if (this.appliedLoyaltyPoint > parseFloat(this.customerPointObj.point_setup.maxPointuse)) {
      this.showAlert('Sorry Points Not Applied!', 'You can apply a maximum of ' + this.customerPointObj.point_setup.maxPointuse + ' points');
    } else {
      this.dollarValueOfLoyaltyPoint = this.customerPointObj.customer_point_balance / this.appliedLoyaltyPoint;
      this.customerPointObj.customer_point_balance = this.customerPointObj.customer_point_balance - this.appliedLoyaltyPoint;
      this.availableLoyaltyPoint = this.availableLoyaltyPoint - this.appliedLoyaltyPoint;
      this.grandTotal = this.grandTotal - this.dollarValueOfLoyaltyPoint;
      this.redeemedPoints = this.appliedLoyaltyPoint;
    }
  }


  togglePaymentMethodVisibility(method) {
    console.log(method);
    this.pSelected = true;
    if (method == 'Credit Card') {
      this.hideOtherMethod = true;
    } else {
      this.hideOtherMethod = false;
    }
  }

  availableAsAMethod(method) {
    var exists = false;
    this.paymentMethod.forEach(paymentItem => {
      if (paymentItem.method_name == method) {
        exists = true;
      }
    });
    return exists;
  }
}
