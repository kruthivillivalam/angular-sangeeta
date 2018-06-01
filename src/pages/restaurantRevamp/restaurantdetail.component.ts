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
import { ConfirmComponent } from './confirm.component';
import { PromptComponent } from './prompt.component';
import { DialogService } from "ng2-bootstrap-modal";
import * as _ from 'lodash';
import { DirectionsRenderer } from '@ngui/map';
import { ReviewComponent} from './review-component/review.component';
import { Subscription } from 'rxjs/Subscription';

//providers
import { UserRequestManager } from '../../providers/user-request-manager';
import { IsLogin } from '../../providers/is-login';
import { AlertComponent } from '../common/alert.component';
import { VALIDATIONERROR, COMMONTEXT, ALERTMSGS } from 'app/app.constants';
import { SpinnerService } from '../common/spinner.service';
import { Subscribable } from 'rxjs/Observable';

// import { IsLogin } from '../../providers/is-login';
@Component({
selector: 'restaurantdetail',
template: require('./restaurantdetail.component.html'),
styleUrls: ['./restaurantdetail.component.scss'],
})
export class RestaurantDetailComponent implements OnInit {

  cartStatus: Subscription;
  orderTypeChange: Subscription;
  public alertMsg: any;
  public validationError: any;
  public commonText: any;
  public id: number;
  private sub: any;
  public isMapViewFlag: boolean;
  public isViewMap: true;
  public positions: any=[];
  public centerLocation: any=[];
  public marker: any = [];
  public restaurantData: any=[];
  public detail: any;
  public height = 0;
  public foodTruckTimingArray: any=[];
  public addressOfRes: any;
  isChecked:boolean = false;
  // public imageURL = "https://orderpointAdminStaging.azurewebsites.net/uploadedimages/RestaurantLogo/";
  public imageURL = "https://adminstaging.azurewebsites.net/uploadedimages/RestaurantLogo/";

  public  restaurantAddress = {
    suburb:'',
    state: '',
    postcode: '',
    country: '',
    address1: '',
    address2: '',
    city: ''
  };
  cartItems: any=[];
  @ViewChild(DirectionsRenderer) directionsRendererDirective: DirectionsRenderer;
  public initialized$;
  origin: any;
  destination: any;
  directionsRenderer: google.maps.DirectionsRenderer;
  directionsResult: google.maps.DirectionsResult;
  direction: any = {
    origin: '',
    destination: '',
    travelMode: 'DRIVING'
  };
  public aboutMe: any;
  public phoneNumbers: any;
  public todayDate: any;
  public servicesOfRest: any;
  public typeArr: any=[];
  public restaurantMenuData:any=[];
  public isActiveAll: any;
  public isActiveSpecific: any;
  public searchText: any;
  public originmarker: any = [];
  public styledisplay: any;
  public myOrders: any=[];
  public restaurantDetailURL: any;
  public userStoredData: any;
  public resData: any;
  public myOrderData: any;
  public myCartData: any;
  public deliveryType: any=[];
  public postCodeObj: any;
  public deliType: any;
  public activemenu: any;
  public activedefault: any = 'active';
  public fragment: any;
  public merchant_id: number;
  public restaurantTimingArray: any;
  public preDate: any;
  public preTime: any;
  public showTakeaway = false;
  public showPreorder = false;
  public showDelivery = false;
  public showDineIn = false;
  public invalidPreTime = false;
  public invalidPreDate = false;
  public showTableReservation = false;
  public isServiceableTime = false;
  public showDeliveryTime = true;
  public resAddress: any;
  public taxArray: any = [];
  public totalCalorie = 0;
  public addOnCostPerItem = 0;
  public deliveryCharge = 0;
  public totalTaxAmnt = 0;
  public postCodeItem: any;
  public postCode: any;
  public postalCode: any;
  public defaultValue: any = [];
  public newDefaultValue: any;
  public selectOption: any;
  public selectLanguage: any;
  public showOffers: any;
  public showCoupons: any;
  public monday: any;
  public tuesday: any;
  public wednesday: any;
  public thursday: any;
  public friday: any;
  public saturday: any;
  public sunday: any;
  //public isChecked: any;
  totalCartAmount = 0;
  addOnCostTotal = 0;
  totalItemPrice = 0;
  configCoupons: Object = {
    nextButton: '.swiper-button-next',
    prevButton: '.swiper-button-prev',
    spaceBetween: 20,
    slidesPerView: 1,
    autoplay: 3000,
    autoplayDisableOnInteraction: false,
    loop: true,
    // freeMode:true,
  };
  configOffers: Object = {
    nextButton: '.swiper-button-next-4',
    prevButton: '.swiper-button-prev-4',
    spaceBetween: 20,
    slidesPerView: 1,
    autoplay: 3000,
    autoplayDisableOnInteraction: false,
    loop: true,
    // freeMode:true,
  };
  constructor(
    public localStorage: LocalStorageService,
    public userRequestManager: UserRequestManager,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer,
    private dialogService: DialogService,
    public islogin: IsLogin,
    public spinnerService: SpinnerService,
  ) {
    //console.log('inside restaurant detail constructor');
    // Function which listens to addToCartTrigger from user-request-manager.ts setCartItem()
    this.cartStatus = this.userRequestManager.getAddToCartTrigger().subscribe(cartStat => {
    if(cartStat.status === 'added') {
      this.handleAddToCart();
    }
    if(cartStat.status === 'updated') {
      this.handleQtyUpdation();
    }
  });
  this.validationError = VALIDATIONERROR;
  this.alertMsg = ALERTMSGS;
  this.commonText = COMMONTEXT;
  this.deliveryType.push({
    'name':'Takeaway',
    'value':'tk',
    'checked':true
  },{
    'name':'Delivery',
    'value':'de',
    'checked':false
  },
  {
    'name':'Dine In',
    'value':'di',
    'checked':false
  });
  // The event listener for delivery type change. menu price will change based on that
  this.orderTypeChange = this.userRequestManager.getOrderTypeChangeTrigger().subscribe(ordrTyp => {
  //console.log("ordrTyp : "+JSON.stringify(ordrTyp));
  if (ordrTyp.type === 'de' && this.cartItems && this.cartItems.length && this.cartItems.length>0) {
  this.cartItems.forEach(item => {
    item.itemPrice = item.menuItem.deliveryPrice;
    item.menuItem.unitPrice = item.menuItem.deliveryPrice;
  });
  this.myOrders = JSON.parse(JSON.stringify(this.cartItems));
  this.localStorage.set('myOrders', this.myOrders);
  this.getTotalCartAmount();
}
if (ordrTyp.type === 'tk' && this.cartItems && this.cartItems.length && this.cartItems.length>0) {
  this.cartItems.forEach(item => {
    item.itemPrice = item.menuItem.takeAwayPrice;
    item.menuItem.unitPrice = item.menuItem.takeAwayPrice;
  });
  this.myOrders = JSON.parse(JSON.stringify(this.cartItems));
  this.localStorage.set('myOrders', this.myOrders);
  this.getTotalCartAmount();
}
if (ordrTyp.type === 'di' && this.cartItems && this.cartItems.length && this.cartItems.length>0) {
  this.cartItems.forEach(item => {
    item.itemPrice = item.menuItem.dineInPrice;
    item.menuItem.unitPrice = item.menuItem.dineInPrice;
  });
  this.myOrders = JSON.parse(JSON.stringify(this.cartItems));
  this.localStorage.set('myOrders', this.myOrders);
  this.getTotalCartAmount();
}
});

//this.isChecked = Number(data['status']) === 0 ? false : true;
}

ngOnInit() {
  this.activemenu = 'active';
  const today = new Date();
  if (this.localStorage.get('preDate') !== null && this.localStorage.get('preDate') !== undefined) {
    this.preDate = this.localStorage.get('preDate')
  }
  else {
    this.preDate = today.toISOString().substring(0, 10);
  }
  if(this.localStorage.get('deliType') !== null && this.localStorage.get('deliType') !== undefined) {
    if(this.localStorage.get('deliType') === 'de' ) {
      //this.deliveryType[1] = true;
      this.deliType = "de"
      //console.log("this.deliveryType[1].value : "+this.deliveryType[1].value)

    }
    if (this.localStorage.get('deliType') === 'tk') {
      this.deliType = "tk"
      //console.log("this.deliveryType[0].value : "+this.deliveryType[0].value)
      //this.deliveryType[0] = true
      //this.deliveryType[0].value = true
    }
    if (this.localStorage.get('deliType') === 'di') {
      this.deliType = "tk"
      //console.log("this.deliveryType[2].value : "+this.deliveryType[2].value)
      //this.deliveryType[0] = true
      //this.deliveryType[0].value = true
    }
  }
  /*if (this.localStorage.get('postCodeObj') !== null && this.localStorage.get('postCodeObj') !== undefined) {
  this.postCode = JSON.parse(JSON.stringify(this.localStorage.get('postCodeObj')));
  this.postCodeItem.suburb = this.postCode.suburb;
  this.postCodeItem.postcode = this.postCode.postcode;
}*/
//var hours = today.getHours();
//var minutes = today.getMinutes();
var time = moment().format('HH:mm').split(':');
this.preTime = time[0] + ':' + time[1];
if (this.localStorage.get('preTime') !== undefined && this.localStorage.get('preTime') !== null) {
  this.preTime = this.localStorage.get('preTime');
}
else {
  this.preTime = time[0] + ':' + time[1];
}
//console.log('TIME>>>>>>>>>>>', this.preTime);
//this.localStorage.set('resDetail','');
//console.log('this.localStorage.get(resDetail) IN RES DETAIL',this.localStorage.get('resDetail'));
//console.log('inside restaurant detail Init');
this.sub = this.activatedRoute.params.subscribe(params => {
this.id = +params['id']; // (+) converts string 'id' to a number
});
this.activatedRoute.fragment.subscribe((fragment: string) => {
  if(fragment == 'menu')
  {
    this.activemenu = 'active';
    this.activedefault = '';
  }
});
//  this.directionsRendererDirective['initialized$'].subscribe( directionsRenderer => {
//     this.directionsRenderer = directionsRenderer;
//   });
this.getMerchantDetails(this.id);
this.foodTruckInfo(this.id);
this.styledisplay='display:none';
if(this.localStorage.get('myOrders') != undefined || this.localStorage.get('myOrders') != null) {
  //console.log('this.localStorage.get(myOrders) in ngOnInit',this.localStorage.get('myOrders'));
  this.myOrders = this.localStorage.get('myOrders');
  this.cartItems = JSON.parse(JSON.stringify(this.myOrders));
  //console.log('CART ITEMS>>>>>', this.cartItems);

  this.getTotalCartAmount();
  if(this.myOrders.length > 0) {
    for(let i = 0; i< this.myOrders.length;i++) {
      this.myOrders[i].itemTotal = (parseInt(this.myOrders[i].quantity) * parseInt(this.myOrders[i].menuItem.unitPrice));
    }
  }
}
}

/*Function for getting specific restaurant*/
getMerchantDetails(id) {
  this.restaurantTimingArray = [];
  return new Promise(resolve => {
    this.userRequestManager.get('getMerchantDetails/'+id)
    .then(data => {
      var alldata  = JSON.parse(JSON.stringify(data));
      //console.log('alldata : '+alldata)
      if(alldata.status == 1) {
      this.restaurantData = alldata.data.merchants;
      let defaultValue = alldata.data.merchants.deliverypostcodes;
      for (var i = 0 ; i < defaultValue.length ; i++) {
        var newObj = {
          suburb: defaultValue[i].suburb
        }
        this.defaultValue.push(newObj)
      }
      //console.log("this.defaultValue : "+JSON.stringify(this.defaultValue));
      if (this.restaurantData
      && this.restaurantData.serviceArea.preorder
      && this.restaurantData.serviceArea.preorder.merchantHas === '1'
      && this.restaurantData.merchantOpenStatus
      && this.restaurantData.merchantOpenStatus === '1') {
        this.showPreorder = true;
      }
      if (this.restaurantData
        && this.restaurantData.serviceArea.takeaway
        && this.restaurantData.serviceArea.takeaway.merchantHas === '1'
        && this.restaurantData.merchantOpenStatus
        && this.restaurantData.merchantOpenStatus === '1'
        && this.restaurantData.merch_takeAway_open_status
        && this.restaurantData.merch_takeAway_open_status === '1') {
          this.showTakeaway = true;
        }
        if (this.restaurantData
          && this.restaurantData.serviceArea.delivery
          && this.restaurantData.serviceArea.delivery.merchantHas === '1'
          && this.restaurantData.merchantOpenStatus
          && this.restaurantData.merchantOpenStatus === '1'
          && this.restaurantData.merch_delivery_open_status
          && this.restaurantData.merch_delivery_open_status === '1') {
            this.showDelivery = true;
          }
          // ADD CONDITIONAL CHECK FOR ENABLING DINE IN ONCE IT IS ADDED IN THE API RESPONSE
          // Following is the sample code for delivery change the property name after uncommenting
          this.showDineIn = true;//Have to comment this line once Dine In coming from the API and do conditional chk as mentioned above
          //   if (this.restaurantData
          //     && this.restaurantData.serviceArea.delivery
          //     && this.restaurantData.serviceArea.delivery.merchantHas === '1'
          //     && this.restaurantData.merchantOpenStatus
          //     && this.restaurantData.merchantOpenStatus === '1'
          //     && this.restaurantData.merch_delivery_open_status
          //     && this.restaurantData.merch_delivery_open_status === '1') {
          //   this.showDineIn = true;
          // }
          if (this.restaurantData
          && this.restaurantData.serviceArea.tbooking
          && this.restaurantData.serviceArea.tbooking.merchantHas === '1'
          && this.restaurantData.merchantOpenStatus
          && this.restaurantData.merchantOpenStatus === '1') {
            this.showTableReservation = true;
          }
          let restaurantCoupons = this.restaurantData.coupons;
          let restaurantOffers = this.restaurantData.offers;
          if (restaurantOffers.length > 0) {
            this.showOffers = true;
          }
          if (restaurantCoupons.length > 0) {
            this.showCoupons = true
          }
          if (!this.showPreorder && this.restaurantData.merch_delivery_current_status === 0) {
            this.showDelivery = false;
          }
          if (!this.showPreorder && this.restaurantData.merch_takeAway_current_status === 0) {
            this.showTakeaway = false;
          }
          //this.timeSelectionCheck();
          let restaurantOpeninghrs = this.restaurantData.openinghrs;
          let openingHrObj = {
            restaurantOpeninghrs
          };
          this.restaurantTimingArray.push(openingHrObj);
          //console.log('this.restaurantData for specific restaurant', this.restaurantData);
          this.localStorage.set('restaurantData', this.restaurantData);
          // this.centerLocation = this.restaurantData.address.suburb;
          this.addressOfRes = this.restaurantData.address;
          if (this.addressOfRes.address1) {
            this.restaurantAddress.address1 = this.addressOfRes.address1;
          }
          if (this.addressOfRes.address2) {
            this.restaurantAddress.address2 = ", "+this.addressOfRes.address2;
          }
          if (this.addressOfRes.city) {
            this.restaurantAddress.city = ", "+this.addressOfRes.city
          }
          //this.addressLine1 = address1 + address2 + city;
          if (this.addressOfRes.suburb) {
          this.restaurantAddress.suburb = this.addressOfRes.suburb;
        }
        if (this.addressOfRes.state) {
          this.restaurantAddress.state = ", "+this.addressOfRes.state;
        }
        if (this.addressOfRes.Postcode) {
          this.restaurantAddress.postcode = ", "+this.addressOfRes.Postcode;
        }
        if (this.addressOfRes.country) {
          this.restaurantAddress.country = ", "+this.addressOfRes.country
        }
        //this.addressLine2 =  suburb + state + postcode + country;
        this.merchant_id = this.restaurantData.merchantid;
        this.centerLocation = (this.addressOfRes.longitude +","+this.addressOfRes.loatitude)+"";
        this.aboutMe = this.restaurantData.aboutMe;
        this.phoneNumbers = this.restaurantData.phone;
        this.servicesOfRest = this.restaurantData.Services;
        let restauranServiceList = {
          'servicesOfRest':this.servicesOfRest,
          'webUrl':this.restaurantData.webUrl,
          'phoneNumbers':this.phoneNumbers,
          'merchantid':this.restaurantData.merchantid,
        }
        this.userRequestManager.setRestaurantInfoData(restauranServiceList);
        this.isViewMap = true;
        //console.log('this.addressOfRes',this.addressOfRes);
        this.todayDate = moment().day();
        //console.log('this.todayDate',this.todayDate);
        this.direction.destination=this.addressOfRes.loatitude+","+this.addressOfRes.longitude;
      }
    })
  })
}

onMapReady(map) {
  this.positions = [];
  var latlong = [];
  var lat = 0;
  var lng = 0;

  this.detail = this.localStorage.get('restaurantData');
  if(this.detail!= undefined || this.detail != null) {
    //for(let i=0;i<this.restaurantDetail.length;i++) {
    lat = parseFloat(this.detail.address.loatitude);
    lng = parseFloat(this.detail.address.longitude);
    latlong.push(lat,lng);
    this.positions.push(new google.maps.LatLng(lat,lng));

    //}
  }
}

onMapClick(event) {
  event.target.panTo(event.latLng);
}

clicked (event) {
  this.marker.display = true;
  var e = event.target;
  var resTitle = [];
  var resAddress = [];

  if(this.detail!= undefined || this.detail != null) {
    // for(let i=0;i<this.restaurantDetail.length;i++) {
    this.resAddress = this.detail.address.address1+','+ this.detail.address.address2+','+ this.detail.address.city + ','+
    this.detail.address.suburb+','+ this.detail.address.state+','+ this.detail.address.Postcode+','+ this.detail.address.country;
    resAddress.push(this.detail.address.address1+','+ this.detail.address.address2+','+ this.detail.address.city + ','+
    this.detail.address.suburb+','+ this.detail.address.state+','+ this.detail.address.Postcode+','+ this.detail.address.country);
    resTitle.push(this.detail.merchantname);
    // }
  }
  this.marker.resTitle = resTitle, this.marker.resAddress = resAddress, e.nguiMapComponent.openInfoWindow("iw", e)
}

directionsChanged() {
  this.directionsResult = this.directionsRenderer.getDirections();
  this.cdr.detectChanges();
}

showDirection() {
  this.originmarker.display = true;
  //this.direction.origin='-31.1100, 115.963';
  //this.origin= '-31.7300,116.1200';
  //this.destination =  this.direction.destination;
  //console.log(this.direction);

  this.directionsRendererDirective['showDirections'](this.direction);
  this.styledisplay="overflow: overlay;height: 100PX;display:block;";
}

/*Function for collapsible panels in page*/
scrollDiv(event,id) {
  //console.log('event',event);
  //console.log('document.getElementById(id)',document.getElementById(id).offsetHeight);
  if(document.getElementById(id).offsetHeight > 0) {
  event.target.parentNode.classList.remove('show-search-list');
  document.getElementById(id).style.height = '0px';
} else if(document.getElementById(id).offsetHeight <= 0) {
  this.renderer.setElementClass(event.target.parentNode,"show-search-list",true);
  document.getElementById(id).style.height = (<HTMLInputElement>document.getElementById(id)).scrollHeight + 'px';
}
}

showAlert(title,msg) {
  this.dialogService.addDialog(AlertComponent, {title:title, message:msg});
}

originclicked (event) {
  this.originmarker.display = true;
  var e = event.target;
  this.originmarker.resTitle = ''+this.resAddress;
  this.originmarker.resAddress = '';
  e.nguiMapComponent.openInfoWindow("iwo", e);
}

validateDineInTiming(pDate, pTime) {
  this.checkTimeValidity(pDate, pTime, this.restaurantData.openinghrs.Business);
  if (!this.isServiceableTime) {
    this.showAlert('Dine In not available!', 'Dine In service is not available during this time. Please choose another time');
  }
}

validateTakeAwayTiming(pDate, pTime) {
  this.checkTimeValidity(pDate, pTime, this.restaurantData.openinghrs.Takeaway);
  if (!this.isServiceableTime) {
    this.showAlert('Takeaway not available!', 'Takeaway service is not available during this time. Please choose another time');
  }
}

validateDeliveryTiming(pDate, pTime) {
  this.checkTimeValidity(pDate, pTime, this.restaurantData.openinghrs.Delivery);
  if (!this.isServiceableTime) {
    this.showAlert('Delivery not available!', 'Delivery service is not available during this time. Please choose another time');
  }
}

// Validation function for Delivery Time, Take Away Time and Business Time validation
checkTimeValidity (pDate, pTime, timingArray) {
this.isServiceableTime = false;
let dayOfWeek = moment(pDate).format('dddd');
timingArray.forEach(element => {
  element.timing.forEach(time => {
    let opnT = this.timeConvertor(time.OpeningHrs);
    let cloT = this.timeConvertor(time.ClosingHrs);
    let openHrs = opnT.hour.toString() + opnT.minutes.toString();
    let closeHrs = cloT.hour.toString() + cloT.minutes.toString();
    let openingTime = moment(moment(openHrs, 'Hmm').format('H:mm'), 'H:mm');
    let preTime = moment(moment(pTime).format('H:mm'), 'H:mm');
    let closingTime =  moment(moment(closeHrs, 'Hmm').format('H:mm'), 'H:mm');
    //console.log('Closing Hrs', closingTime, closeHrs);
    //console.log('Opening Hrs', openingTime, openHrs);
    if ( dayOfWeek == element.day
    && openingTime.isBefore(preTime)
    && closingTime.isAfter(preTime)) {
      this.isServiceableTime = true;
    }
  });
});
}

// Converter for time from API response in to 24 hrs format for validation calculation
timeConvertor(time) {
let PM = time.match('PM') ? true : false;
time = time.split(':');
let min = time[1];
let hour = 0;
if (PM && parseInt(time[0]) != 12) {
  hour = 12 + parseInt(time[0], 10);
} else if(!PM && parseInt(time[0]) == 12) {
  hour = 0;
} else {
  hour = time[0];
}
let timein24hrs = {
  hour : hour,
  minutes : min.split(' ')[0]
};
//console.log( timein24hrs.hour + ':' + timein24hrs.minutes);
return timein24hrs;
}

timeSelectionCheck() {
  const now = moment().format('LL');
  //console.log("Now Time : "+now);
  const preOrderDate = moment(this.preDate).format('LL');
  this.localStorage.set('preDate', moment(this.preDate).toISOString().substring(0, 10));
  //console.log("preOrderDate : "+moment(this.preDate).toISOString().substring(0, 10));
  // if (this.showPreorder && preOrderDate == now &&
  //   (this.restaurantData.merch_delivery_current_status === 1
  //     && this.restaurantData.merch_takeAway_current_status === 1) ) {
  //   this.showDeliveryTime = false;
  // } else {
  //   this.showDeliveryTime = true;
  // }
  if (this.showPreorder) {
  this.showDeliveryTime = true;
}
}

// The function which takes care the preorder validations (The starting point of validation)
validatePreOrder(form) {
//console.log("this.preTime : "+this.preTime);
this.invalidPreDate = false;
this.invalidPreTime = false;
const now = moment().format('LL');
const preOrderDate = moment(this.preDate).format('LL');
const timeObj = this.preTime.split(':');
const preOrderTime = new Date();
preOrderTime.setHours(timeObj[0], timeObj[1], 0);
const timeNow = new Date();
const orderDateAndTime = {
  orderDate: preOrderDate ? preOrderDate : moment().format('LLL'),
  orderTime: preOrderTime ? moment(preOrderTime).format('LLL') : moment().add(30, 'minutes').format('LLL')
};
this.localStorage.set('orderTimeDate', orderDateAndTime);
if (!this.showPreorder) {
  this.onSubmit(form);
} else {
  if (this.showPreorder && moment(preOrderDate) < moment(now) && this.isChecked == true) {
    this.invalidPreDate = true;
  }
  else if (this.showDeliveryTime && (this.showPreorder && preOrderDate == now) && (preOrderTime < timeNow) && this.isChecked == true) {
    this.invalidPreTime = true;
  }
  else if (this.deliType === 'tk' && this.isChecked == true) {
    this.validateTakeAwayTiming(preOrderDate, preOrderTime);
  }
  else if (this.deliType === 'de' && this.isChecked == true) {
    this.validateDeliveryTiming(preOrderDate, preOrderTime);
  }
  else if (this.deliType === 'di' && this.isChecked == true) {
    this.validateDineInTiming(preOrderDate, preOrderTime);
  } else {
    this.onSubmit(form);
  }

  if (!this.invalidPreTime && !this.invalidPreDate && this.isServiceableTime) {
    this.onSubmit(form);
  }
}
}

onSubmit(form){
  console.log("this.totalCartAmount : " +(this.totalCartAmount));
  this.localStorage.set('deliType', this.deliType);
  const minOrder =  this.restaurantData.minimum_order ? this.restaurantData.minimum_order : null ;
  const cartValidationObj = this.userRequestManager.cartAmountValidation(minOrder, this.totalCartAmount);
  console.log("cartValidationObj : "+cartValidationObj);
  if (this.cartItems &&  this.cartItems.length === 0) {
    this.showAlert('Cart is empty!', 'Please add items to cart');
  } else if (!cartValidationObj.valid) {
    this.showAlert('Minimum Order Amount Not Met!', 'Minimum order amount should be $ ' + cartValidationObj.minimumAmount);
  } else {
    this.router.navigate(['cart', this.id]);
  }
}

setPostCode(obj) {
  this.localStorage.set('postCodeObj', obj);
  //console.log('this.postCodeObj->>>>>>>>>>>>>>>', obj);
}

updateBookMark(merchantID) {
  let userToken = '';
  if(merchantID) {
    if(this.localStorage.get('userData') !== undefined && this.localStorage.get('userData') !== null) {
      //console.log("userToken1 : "+this.localStorage.get('userData'));
      userToken  = this.localStorage.get('userToken');
      //console.log("userToken2 : "+userToken);
    }
    else {
      userToken = '';
      //console.log("userToken : "+userToken);
    }
    this.userRequestManager.set('updateBookMark',{'token': userToken, 'merchantId': merchantID})
    .then(data => {
      const alldata  = JSON.parse(JSON.stringify(data));
      //console.log('BOOK MARK DATA',alldata);
      if(alldata.status === 1) {
      this.dialogService.addDialog(
        AlertComponent, {
          title: 'Bookmark',
          message: alldata.msg
        });
      }
    }, error => {
      //console.log('BOOKMARK ERROR', error);
      this.dialogService.addDialog(
      AlertComponent, {
        title: 'Bookmark',
        message: "Please login to use Bookmark"
      });
    });
  }
}

//////////////////////JCKS/////////////////////////////////
// Function which handles addition of items to cart.
// It is triggered based on event recieved from cart item set function setCartItem() in user-request-manager.ts
handleAddToCart() {
const cartObj = this.userRequestManager.getCartItem();
//console.log("cartObj : " +JSON.stringify(cartObj));
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
//console.log('MY ORDERS', this.myOrders);
//console.log('this.cartItems :  '+JSON.stringify(this.cartItems));
this.getTotalCartAmount();
}

// Function which handles qty updation
handleQtyUpdation() {
const updatedCartObj = this.userRequestManager.getUpatedCartItem();
this.cartItems[updatedCartObj.itemIdx] = updatedCartObj;
this.getTotalCartAmount();
}

// Function which handles item deletion
handleItemDeletion(e) {
this.cartItems.splice(e.itemIdx, 1);
this.getTotalCartAmount();
}

// Function which calculates Total Cart amount Includes Tax and Delivery charge calculation functions
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
  //console.log("this.totalCartAmount : "+this.totalCartAmount );
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
//console.log("cartDetails + "+JSON.stringify(cartDetails));
}

// getTotalCartAmount() {
//   this.myOrders = [];
//   this.myOrders = JSON.parse(JSON.stringify(this.cartItems));
//   this.localStorage.set('myOrders', this.myOrders);
//   this.totalItemPrice = 0;
//   this.addOnCostTotal = 0;JSON.parse(JSON.stringify(this.localStorage.get('postCodeObj')));
//   this.totalCartAmount = 0;
//   this.cartItems.forEach(item => {
//     this.totalItemPrice = this.totalItemPrice + (item.quantity * item.itemPrice);
//     if(item.menuItem.IsoptionApplicable === '1'){
//       this.getAddOnCost(item.menuItem.options.optionGroups, item.quantity);
//     }
//     this.totalCartAmount = parseFloat(Number(this.totalItemPrice + this.addOnCostTotal).toFixed(2));
//   });
// }

// Function which calculates tax for cart items
calculateTaxAmnt() {
this.totalTaxAmnt = 0;
this.taxArray.forEach( item => {
  this.totalTaxAmnt += item;
});
}

// Function which calculates add on cost for cart items
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

// Function which calculates delievry charges based on distance slab and total cart amount
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

// Function which calculates Delivery cost based on distance
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
//console.log("this.deliveryCharge : " +this.deliveryCharge);
}

// Function which calculates Delivery cost based on cart amount
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

onPreOrderSelect($event) {
  this.isChecked = !this.isChecked;
  console.log("this.isChecked : "+this.isChecked);
}

timeCheck() {
  //console.log("this.preTime : "+this.preTime);
  this.localStorage.set('preTime', this.preTime);
}


// getAddOnCost(addOnArray,qty) {
//   addOnArray.forEach(item => {
//     item.optionItems.forEach( optionItem => {
//       if(optionItem.checked && optionItem.AdditionalCost) {
//         this.addOnCostTotal += optionItem.AdditionalCost;
//       }
//     });
//   });
//   this.addOnCostTotal = this.addOnCostTotal * qty;
// }

foodTruckInfo (id) {
  this.userRequestManager.get('getFoodTruckLocations/'+id)
  .then(allData => {
    let resp = JSON.parse(JSON.stringify(allData));
    //console.log("resp : "+resp)
    if (resp.status == 1) {
    let foodTruckData = resp.data;
    let merchantFoodTruckData = foodTruckData.merchants;
    let merchantsOpeningHours = merchantFoodTruckData.operatinghrs;
    //console.log("merchantsOpeningHours : " +JSON.stringify(merchantsOpeningHours))
    let foodTruckLocations = merchantsOpeningHours.FoodtruckLocations;
    //console.log("Opening Hours : " +JSON.stringify(foodTruckLocations));
    foodTruckLocations.forEach(data => {
    console.log("Opening Hours : " +JSON.stringify(data));
    //this.foodTruckTimingArray.push(data);
    let day = data.day;
    let timingArray = data.timing;
    if (day === "Monday") {
      this.monday = timingArray
    }
    else if (day === "Tuesday") {
      this.tuesday = timingArray
    }
    else if (day === "Wednesday") {
      this.wednesday = timingArray
    }
    else if (day === "Thursday") {
      this.thursday = timingArray
    }
    else if (day === "Friday") {
      this.friday = timingArray
    }
    else if (day === "Saturday") {
      this.saturday = timingArray
    }
    else if (day === "Sunday") {
      this.sunday = timingArray
    }
  })
}
//console.log("getFoodTruckLocations : " +JSON.stringify(resp));
})
}

}


//////////////////////SID ENDS/////////////////////////////////
