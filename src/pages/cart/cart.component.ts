import {Component, OnInit,ViewChild,ChangeDetectorRef, Renderer} from '@angular/core';
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
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/delay';
import * as moment from "moment";
import { DialogService } from "ng2-bootstrap-modal";
import * as _ from 'lodash';
import { DirectionsRenderer } from '@ngui/map';
import { CompleterService, CompleterData, CompleterItem, CompleterCmp } from 'ng2-completer';
import { VALIDATIONERROR } from 'app/app.constants';
import { SpinnerService } from '../common/spinner.service';
import { DecimalPipe } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';
//providers
import { UserRequestManager } from '../../providers/user-request-manager';
import { IsLogin } from '../../providers/is-login';

import { AlertComponent } from '../common/alert.component';
import { AddressComponent } from './address.component';
import { DeliveryAddressComponent } from './delivery.address.component';

@Component({
  selector: 'cart',
  template: require('./cart.component.html')
})
export class CartComponent implements OnInit {
  cartTrigger: Subscription;
  cartValidationError: any;
  mobileNotFound = false;
  public id: number;
  private sub: any;
  public myCart:any=[];
  public myCartAllData:any=[];
  public finalSubTotal:any;
  public itemTotal:any=[];
  public subtotal:any=0;
  public taxtotal:any=0;
  public grandTotal:any=0;
  public subtotalCalories:any=0;
  public myCartForCalories:any=[];
  public promptMessage:any={};
  public promptMessagedelivery:any={};
  public countryData:any;
  public addAddress:any=[];
  public stateData:any=[];
  public suburbsByCountry:any=[];
  public suburbData:any=[];
  public itemTotalArr:any=[];
  public deliveryType:any=[];
  public deliType:any;
  public userStoredData:any;
  public cartData:any;
  public resData:any;
  public myCartData:any;
  public myOrderData:any;
  public billAddressChk:boolean;
  //    public usertype:any;
  public merchOrderId:any;
  public merchant_id:any;
  public orderType: string;
  public token:any=null;
  public cartItems: any=[];
  public totalItemPrice = 0;
  public addOnCostTotal = 0;
  public totalCartAmount = 0;
  public totalTaxAmnt = 0;
  public addOnCostPerItem = 0;
  public totalCalorie = 0;
  public calorieRequired: any;
  public taxArray: any=[];
  public myOrders: any=[];
  public heightCM: number;
  public weightKG: number;
  public age: number;
  public restaurantData: any;
  public orderId: number;
  public deliveryCharge = 0;
  public orderTimeDateObj: any;
  public userDetails: any;
  public mobileNo: any;
  public mobile: any;
  public email: any;
  //@ViewChild('billAddressChk') billAddressChk;
  //@ViewChild('email') email;
  //@ViewChild('mobile') mobile;
  constructor(
    public localStorage:LocalStorageService,
    public userRequestManager:UserRequestManager,
    public router : Router,
    public activatedRoute:ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer,
    private dialogService:DialogService,
    public islogin:IsLogin,
    public spinnerService: SpinnerService
  ) {
    this.cartValidationError = VALIDATIONERROR;
    this.token = this.localStorage.get('userToken') ? this.localStorage.get('userToken') :  '';
    if (this.token === "Token is missing") {
      this.token = '';
    }
    this.deliType = this.localStorage.get('deliType') ?  this.localStorage.get('deliType') : '';
    //const orderTimeDate  = this.localStorage.get('orderTimeDate') ?  this.localStorage.get('orderTimeDate') : '';
    this.orderTimeDateObj = this.localStorage.get('orderTimeDate');
    console.log('TOKEN->>>>>',this.token);
    this.cartItems = this.localStorage.get('myOrders');
    this.restaurantData = JSON.parse(JSON.stringify(this.localStorage.get('restaurantData')));
    this.getTotalCartAmount();
    this.prepareSaveOrderPayLoad();
    this.cartTrigger = this.userRequestManager.getAddToCartTrigger().subscribe(cartStat => {
      if(cartStat.status === 'added') {
        this.handleAddToCart();
      }
      if(cartStat.status === 'updated') {
        this.handleQtyUpdation();
      }
    });

    this.deliveryType.push({
      'name':'Takeaway',
      'value':'tk',
      'checked':true
    },{
      'name':'Delivery',
      'value':'de',
      'checked':false
    });
    if(this.localStorage.get('userData') !== null && this.localStorage.get('userData') !== undefined){
      let userDetals = JSON.parse(JSON.stringify(this.localStorage.get('userData')));
      this.mobile = userDetals.mobile;
      this.email = userDetals.email;
    }
    else {
      this.mobile = '';
      this.email = '';
    }
  }

  ngOnInit() {
    this.sub = this.activatedRoute.params.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number
    });
    //this.getMyOrderDetails(this.id);
    this.billAddressChk =true;
    if (this.localStorage.get('billAddressChk') != null || this.localStorage.get('billAddressChk') != undefined) {
      this.billAddressChk =this.localStorage.get('billAddressChk')
    }
    if (this.deliType === 'de') {
      this.orderType = 'Delivery';
    } else if (this.deliType === 'tk') {
      this.orderType = 'TakeAway';
      this.billAddressChk = false;
    } else if (this.deliType === 'di') {
      this.orderType = 'DineIn';
      this.billAddressChk = false;
    }
    console.log("this.orderType : "+this.orderType);
  }

  //Popup showing address entry
  showDeliveryAddressPrompt(title,note) {
  this.dialogService.addDialog(DeliveryAddressComponent)
  /*this.dialogService.addDialog(AddressComponent, {
  title: title,
  note: note,
  editable: true
})*/
.subscribe((message) => {
  if(message) {
    if (message.addressline1 !== null && message.addressline1 !== undefined) {
      let delAddress = JSON.parse(JSON.stringify(message));
      console.log("Message : " +JSON.stringify(delAddress));
      this.localStorage.set('billingAddress', message);
      if (delAddress.addressline1 || delAddress.addressLine1) {
        this.promptMessagedelivery.addressLine1 = delAddress.addressline1 || delAddress.addressLine1;
      }
      if (delAddress.addressline2 || delAddress.addressLine2) {
        this.promptMessagedelivery.addressLine2 = ", "+delAddress.addressline1 || delAddress.addressLine1;
      };
      if ( delAddress.city) {
        this.promptMessagedelivery.city = delAddress.city;
      };
      if (delAddress.suburb) {
        this.promptMessagedelivery.suburb = delAddress.suburb;
      };
      if (delAddress.state) {
        this.promptMessagedelivery.state = delAddress.state
      };
      if (delAddress.postcode) {
        this.promptMessagedelivery.postcode = delAddress.postcode
      };
      if (delAddress.country) {
        this.promptMessagedelivery.country = delAddress.country
      }
      this.setBillingAddress();
    }
    else {
      console.log("Message : " +JSON.stringify(message));
      this.promptMessagedelivery = JSON.parse(JSON.stringify(this.localStorage.get('saveRegDeliveryNewAdd')));
      this.localStorage.set('billingAddress', this.promptMessagedelivery);
      var suburbPostCode = JSON.parse(JSON.stringify(this.localStorage.get('statePostalCode')));
      this.promptMessagedelivery.suburb = suburbPostCode.suburb_name;
      this.promptMessagedelivery.postcode = suburbPostCode.postal_code.postal_code;
      this.promptMessagedelivery.state = suburbPostCode.state_name;
      console.log("billingAddress2 : " +JSON.stringify(this.promptMessagedelivery));
      let delAddress =  JSON.parse(JSON.stringify(this.localStorage.get('saveRegDeliveryNewAdd')));;
      if (delAddress.addressline1 || delAddress.addressLine1) {
        this.promptMessagedelivery.addressLine1 = delAddress.addressline1 || delAddress.addressLine1;
      }
      if (delAddress.addressline2 || delAddress.addressLine2) {
        this.promptMessagedelivery.addressLine2 = ", "+delAddress.addressline1 || delAddress.addressLine1;
      };
      if ( delAddress.city) {
        this.promptMessagedelivery.city =  delAddress.city;
      };
      if (delAddress.suburb) {
        this.promptMessagedelivery.suburb = delAddress.suburb;
      };
      if (delAddress.state) {
        this.promptMessagedelivery.state = delAddress.state
      };
      if (delAddress.postcode) {
        this.promptMessagedelivery.postcode = delAddress.postcode
      };
      if (delAddress.country) {
        this.promptMessagedelivery.country = delAddress.country
      }
      this.setBillingAddress();
    }
  }
});
}

setBillingAddress() {
  console.log('IS BILLING SAME AS DELIVERY'+ this.promptMessagedelivery);
  if (this.billAddressChk) {
    var savedAddress = JSON.parse(JSON.stringify(this.localStorage.get('billingAddress')));
    if (savedAddress.addressline1 !== null && savedAddress.addressline1 !== undefined){
      this.promptMessage = JSON.parse(JSON.stringify(this.localStorage.get('billingAddress')));
      let billAddress =  JSON.parse(JSON.stringify(this.localStorage.get('billingAddress')));;
      if (billAddress.addressline1 || billAddress.addressLine1) {
        this.promptMessage.addressLine1 = billAddress.addressline1 || billAddress.addressLine1;
      }
      if (billAddress.addressline2 || billAddress.addressLine2) {
        this.promptMessage.addressLine2 = ", "+billAddress.addressline1 || billAddress.addressLine1;
      };
      if ( billAddress.city) {
        this.promptMessage.city = billAddress.city;
      };
      if (billAddress.suburb) {
        this.promptMessage.suburb = billAddress.suburb;
      };
      if (billAddress.state) {
        this.promptMessage.state = billAddress.state
      };
      if (billAddress.postcode) {
        this.promptMessage.postcode = billAddress.postcode
      };
      if (billAddress.country) {
        this.promptMessage.country = billAddress.country
      }
    }
    else {
      this.promptMessage = JSON.parse(JSON.stringify(this.localStorage.get('saveRegDeliveryNewAdd')));
      var suburbPostCode = JSON.parse(JSON.stringify(this.localStorage.get('statePostalCode')));
      this.promptMessage.suburb = suburbPostCode.suburb_name;
      this.promptMessage.postcode = suburbPostCode.postal_code.postal_code;
      this.promptMessage.state = suburbPostCode.state_name;
      let billAddress = JSON.parse(JSON.stringify(this.promptMessage))
      if (billAddress.addressline1 || billAddress.addressLine1) {
        this.promptMessage.addressLine1 = billAddress.addressline1 || billAddress.addressLine1;
      }
      if (billAddress.addressline2 || billAddress.addressLine2) {
        this.promptMessage.addressLine2 = ", "+billAddress.addressline1 || billAddress.addressLine1;
      };
      if ( billAddress.city) {
        this.promptMessage.city = billAddress.city;
      };
      if (billAddress.suburb) {
        this.promptMessage.suburb = billAddress.suburb;
      };
      if (billAddress.state) {
        this.promptMessage.state = billAddress.state
      };
      if (billAddress.postcode) {
        this.promptMessage.postcode = billAddress.postcode
      };
      if (billAddress.country) {
        this.promptMessage.country = billAddress.country
      }
    }
  }
}

showPrompt(title, note) {
  this.dialogService.addDialog(AddressComponent, {
    title: title,
    note: note,
    editable: true
  })
  .subscribe((message) => {
    if(message) {
      if (message.addressline1 !== null && message.addressline1 !== undefined) {
        this.promptMessage = message;
        this.localStorage.set('billingAddress', message);
        this.setBillingAddress();
      }
      else {
        this.promptMessage = JSON.parse(JSON.stringify(this.localStorage.get('saveRegDeliveryNewAdd')));
        var suburbPostCode = JSON.parse(JSON.stringify(this.localStorage.get('statePostalCode')));
        this.promptMessage.suburb = suburbPostCode.suburb_name;
        this.promptMessage.postcode = suburbPostCode.postal_code.postal_code;
        this.promptMessage.state = suburbPostCode.state_name;
        this.localStorage.set('billingAddress', this.promptMessage);
        this.setBillingAddress();
      }
    }
  });
}

// Validate Cart Amount
validateMinimumOrderAmount(usrForm) {
const cartValidationObj = this.userRequestManager.cartAmountValidation(this.restaurantData.minimum_order, this.totalCartAmount);
if (this.cartItems &&  this.cartItems.length === 0) {
  this.dialogService.addDialog(AlertComponent, {title: 'Cart is empty!', message: 'Please add items to cart'});
} else if (!cartValidationObj.valid) {
  this.dialogService.addDialog(AlertComponent, {title: 'Minimum Order Amount Not Met!',
  message: 'Minimum order amount should be $ ' + cartValidationObj.minimumAmount});
} else {
  this.verifyMobile(usrForm);
}
}

//For Verifying Mobile
verifyMobile(usrForm) {
if (this.deliType === 'de' && (_.isEmpty(this.promptMessagedelivery ) || _.isEmpty(this.promptMessage))) {
  this.dialogService.addDialog(AlertComponent, {title: 'Address Missing!', message: 'Please enter both address'});
} else if (this.deliType === 'tk' && _.isEmpty(this.promptMessage)) {
  this.dialogService.addDialog(AlertComponent, {title: 'Billing Address Missing!', message: 'Please enter billing address'});
} else {
  this.onSubmit(usrForm);
}
}

/*Function for continue to paymeny options*/
onSubmit(data) {
  if ((this.mobile == null || this.mobile == undefined) && (this.email == null || this.email == undefined)){
    console.log('this.mobile : '+this.mobile);
    console.log('this.email : '+this.email);
  }
  let senddata = {};
  senddata['merchOrderId'] = this.orderId;
  senddata['token'] = this.token;
  senddata['items'] = this.cartItems;
  senddata['merchant_Id'] = this.restaurantData.merchantid;
  senddata['merchant_country_id'] = this.restaurantData.address.country_id;
  senddata['merchant_state_id'] = this.restaurantData.address.state_id;
  senddata['company_id'] = null;
  senddata['customer_DeliveryAddress_Id'] = null;
  senddata['customer_BillingAddress_id'] = null;
  senddata['businessunit_id'] = null;
  senddata['taxAmount'] = this.totalTaxAmnt;
  senddata['deliveryCharge'] = this.deliveryCharge;
  if(this.deliType === 'de') {
    senddata['orderType'] = 'Delivery';
    senddata['orderStatus'] = 'OD_Awaiting_Payment';
    senddata['delivery_addressline1'] = this.promptMessagedelivery.addressline1;
    senddata['delivery_addressline2'] = this.promptMessagedelivery.addressline2;
    senddata['delivery_city'] = this.promptMessagedelivery.city;
    senddata['delivery_country'] = this.promptMessagedelivery.country;
    senddata['delivery_country_id'] = this.promptMessagedelivery.country_Id;
    senddata['delivery_state'] = this.promptMessagedelivery.state;
    senddata['delivery_state_id'] = this.promptMessagedelivery.state_id;
    senddata['delivery_suburb'] = this.promptMessagedelivery.suburb;
    senddata['delivery_zipcode'] = this.promptMessagedelivery.postcode;
  }
  if(this.deliType === 'di') {
    senddata['orderType'] = 'DineIn';
  }
  senddata['orderType'] = 'TakeAway';
  senddata['orderStatus'] = 'OT_Awaiting_Payment';
  senddata['billing_addressline1'] = this.promptMessage.addressline1;
  senddata['billing_addressline2'] = this.promptMessage.addressline2;
  senddata['billing_city'] = this.promptMessage.city;
  senddata['billing_country'] = this.promptMessage.country;
  senddata['billing_country_id'] = this.promptMessage.country_Id;
  senddata['billing_state'] = this.promptMessage.state;
  senddata['billing_state_id'] = this.promptMessage.state_id;
  senddata['billing_suburb'] = this.promptMessage.suburb;
  senddata['billing_zipcode'] = this.promptMessage.postcode;
  senddata['customer_email'] = this.email.value;
  senddata['customer_mobile'] = this.mobile;
  if(this.token != null) {
    senddata['customer_BillingAddress_id'] = this.promptMessage.id;
    senddata['customer_email'] = this.email.value;
    senddata['customer_mobile'] = this.mobile;
    if( this.billAddressChk == true ) {
      senddata['customer_DeliveryAddress_Id'] = this.promptMessage.id;
    } else if( this.billAddressChk == false ) {
      senddata['customer_DeliveryAddress_Id'] = this.promptMessagedelivery.id;
    }
  }

  this.localStorage.set('cartData', senddata);
  this.userRequestManager.set('saveOrder', senddata)
  .then(data => {
    this.spinnerService.hide('registerLoading');
    var alldata  = JSON.parse(JSON.stringify(data));
    if(alldata.status === 1) {
      var dataObj =  alldata.data;
      if (dataObj.eligible_coupons) {
        this.localStorage.set('eligibleCoupons', dataObj.eligible_coupons);
      }
      if (dataObj.eligible_customer_points) {
        this.localStorage.set('customerPoints', dataObj.eligible_customer_points);
      }
      if (dataObj.address) {
        this.localStorage.set('myCart', dataObj.address);
      }
      this.localStorage.set('offerArray', dataObj.eligible_offers);
      this.localStorage.set('billingAddress', this.promptMessage);
      this.localStorage.set('deliType', this.deliType);
      if (this.deliType === 'de') {
        this.localStorage.set('deliveryAddress', this.promptMessagedelivery);
      }
      this.localStorage.set('guest_customer_email', this.email.value);
      this.localStorage.set('guest_customer_mobile', this.mobile);
      this.localStorage.set('billAddressChk', this.billAddressChk);
      this.router.navigate(['payment']);
    }
  }, error => {
    this.spinnerService.hide('registerLoading');
    this.showAlert('Error','Something went wrong please try again');
  });
}

///////////////////////////JCKS/////////////////////////////////
showAlert(title, msg) {
this.dialogService.addDialog(AlertComponent, {title:title, message:msg});
}
handleAddToCart() {
  const cartObj = this.userRequestManager.getCartItem();
  let updateCart = false;
  let updateIdx = 0;
  this.cartItems.forEach((item, idx) => {
    if (_.isEqual(item, cartObj)) {
      updateCart = true;
      updateIdx = idx;
    }
  });
  if(updateCart){
    this.cartItems[updateIdx] = cartObj;
  } else {
    this.cartItems.push(cartObj);
  }
  console.log('MY ORDERS', this.myOrders);
  this.getTotalCartAmount();
}

handleQtyUpdation() {
  const updatedCartObj = this.userRequestManager.getUpatedCartItem();
  this.cartItems[updatedCartObj.itemIdx] = updatedCartObj;
  this.getTotalCartAmount();
}

handleItemDeletion(e) {
  this.cartItems.splice(e.itemIdx, 1);
  this.getTotalCartAmount();
}

getTotalCartAmount() {
  this.myOrders = [];
  this.taxArray = [];
  this.myOrders = JSON.parse(JSON.stringify(this.cartItems));
  this.localStorage.set('myOrders', this.myOrders);
  this.totalItemPrice = 0;
  this.addOnCostTotal = 0;
  this.totalCartAmount = 0;
  this.totalCalorie = 0;
  this.cartItems.forEach(item => {
    this.totalItemPrice = this.totalItemPrice + (item.quantity * item.itemPrice);
    if(item.menuItem.Calorie){
      this.totalCalorie += parseFloat(item.menuItem.Calorie) * item.quantity;
    }
    this.addOnCostPerItem = 0;
    if(item.menuItem.IsoptionApplicable === '1') {
      this.getAddOnCost(item.menuItem.options.optionGroups, item.quantity);
    }
    this.totalCartAmount = this.totalItemPrice + this.addOnCostTotal;
    if(item.menuItem.IsPriceTaxInclusive && item.menuItem.IsPriceTaxInclusive === '1') {
      this.taxArray.push( ((item.quantity * item.itemPrice) + this.addOnCostPerItem) * (parseFloat(item.menuItem.taxrate) / 100));
    }
  });
  this.calculateTaxAmnt();
  if (this.deliType === 'de') {
    this.calculateDeliveryCharges();
  }
  const cartDetails = {
    'cartItems' :  this.cartItems,
    'totalCartAmount' : this.totalCartAmount,
    'totalTaxAmount' : this.totalTaxAmnt,
    'totalDeliveryCharge' :  this.deliveryCharge
  };
  this.localStorage.set('cartDetails', cartDetails);
}

calculateTaxAmnt() {
  this.totalTaxAmnt = 0;
  console.log("this.totalTaxAmnt : "+this.totalTaxAmnt)
  this.taxArray.forEach( item => {
    this.totalTaxAmnt += item;
  });
}

getAddOnCost(addOnArray, qty) {
  addOnArray.forEach(item => {
    item.optionItems.forEach( optionItem => {
      if (optionItem.checked && optionItem.AdditionalCost && optionItem.AdditionalCost) {
        this.addOnCostTotal += optionItem.AdditionalCost;
        this.addOnCostPerItem += optionItem.AdditionalCost;
        if (optionItem.Calorie) {
          this.totalCalorie += parseFloat(optionItem.Calorie) * qty;
        }
      }
    });
  });
  this.addOnCostTotal = this.addOnCostTotal * qty;
  this.addOnCostPerItem = this.addOnCostPerItem * qty;
}

calculateCalorie() {
  if(this.weightKG && this.heightCM && this.age){
    // Basal Metabolic Rate (BMR) (Harris Benedict Equation)
    var calorieRequire = (66.5 + ( 13.75 * this.weightKG ) + ( 5.003 * this.heightCM ) - ( 6.755 * this.age ))
    this.calorieRequired = calorieRequire.toFixed(2);
  } else {
    this.dialogService.addDialog(AlertComponent, {title: 'Missing Values', message: 'Please enter age, weight and height'});
  }
}

prepareSaveOrderPayLoad() {
  console.log('this.cartItems', this.cartItems);
  let posObj = JSON.parse(JSON.stringify(this.localStorage.get('postCodeItem')));
  let saveOrder = {
    'token' : this.token,
    'merchant_country_id' : this.restaurantData.address.country_id,
    'merchant_state_id' : this.restaurantData.address.state_id,
    'company_id' : null,
    'merchant_Id' : this.restaurantData.merchantid,
    'customer_DeliveryAddress_Id' : null,
    'customer_BillingAddress_id' : null,
    'businessunit_id' : null,
    'items': this.cartItems
  };
  saveOrder['postecode'] = (posObj && posObj.postcode) ? posObj.postcode : '';
  saveOrder['delivery_date'] = this.orderTimeDateObj.orderDate;
  saveOrder['delivery_time'] = this.orderTimeDateObj.orderTime;
  if (this.deliType == 'de') {
    saveOrder['orderType'] = 'Delivery';
    saveOrder['orderStatus'] = 'OD_Pending';
  }
  if(this.deliType == 'tk') {
    saveOrder['orderType'] = 'TakeAway';
    saveOrder['orderStatus'] = 'OT_Pending';
  }
  if(this.deliType == 'di') {
    saveOrder['orderType'] = 'DineIn';
    saveOrder['orderStatus'] = 'OT_Pending';
  }
  this.localStorage.set('cartData', saveOrder);
  console.log('saveOrder', saveOrder);
  this.userRequestManager.set('saveOrder', this.localStorage.get('cartData'))
  .then(data => {
    console.log('SAVE RESP',data);
    const resp = JSON.parse(JSON.stringify(data));
    if(resp.status === 1){
      this.orderId = resp.data.merchOrderId;
      this.localStorage.set('savedAddress', resp.data.address);
    }
  }, error => {
    console.log('SAVE ERROR', error);
  });
}

calculateDeliveryCharges() {
  this.deliveryCharge = 0;
  if (this.restaurantData.delivery_charge === 'D') {
    this.calculateDeliveryCostForDistance();
  } else if (this.restaurantData.delivery_charge === 'O') {
    this.calculateDeliveryCostForPriceRange();
  } else {
    this.deliveryCharge = 0;
  }
}

calculateDeliveryCostForDistance() {
  let continueLoop = true;
  const addressObj = JSON.parse(JSON.stringify(this.localStorage.get('postCodeObj')));
  const deliveySlab = this.restaurantData.deliverycharges;
  const deliiveryRadius = parseFloat(addressObj.distance);
  deliveySlab.forEach(item => {
    let toValue = parseFloat(item.to_value);
    let fromValue = parseFloat(item.from_value);
    if ((deliiveryRadius <= toValue)
    && (deliiveryRadius >= fromValue)
    && continueLoop ) {
      this.deliveryCharge = parseFloat(item.charge);
      continueLoop = false;
    }
  });
}

calculateDeliveryCostForPriceRange() {
  // Definition will change once rate slab api changes are done
  let continueLoop = true;
  const addressObj = JSON.parse(JSON.stringify(this.localStorage.get('postCodeObj')));
  const deliveySlab = this.restaurantData.deliverycharges;
  const cartValue = this.totalCartAmount + this.totalTaxAmnt;

  deliveySlab.forEach(item => {
    console.log(item,parseFloat(item.from_value));
    if ((cartValue <= parseFloat(item.to_value)
    && cartValue >= parseFloat(item.from_value))
    && continueLoop ) {
      this.deliveryCharge = parseFloat(item.charge);
      continueLoop = false;
    }
  });
}

//////////////////////SID ENDS/////////////////////////////////
}
