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

//providers
import { UserRequestManager } from '../../providers/user-request-manager';
import { IsLogin } from '../../providers/is-login';
import { AlertComponent } from '../common/alert.component';
import { VALIDATIONERROR, COMMONTEXT, ALERTMSGS } from 'app/app.constants';
import { SpinnerService } from '../common/spinner.service';

// import { IsLogin } from '../../providers/is-login';
@Component({
  selector: 'restaurantdetail',
  template: require('./restaurantdetail.component.html'),
  styles: [`
    .block {
      overflow: hidden;
      -webkit-transition: height .5s;
      transition: height .5s;
    }
  `],
})
export class RestaurantDetailComponent implements OnInit {

  public noResult = false;
  public alertMsg: any;
  public invalidDate = false;
  public validationError: any;
  public commonText: any;
  public id: number;
  private sub: any;
  public isMapViewFlag:boolean;
  public isViewMap:true;
  public positions:any=[];
  public centerLocation:any=[];
  public marker:any = [];
  public restaurantData:any=[];
  public detail:any;
  public height = 0;
  public addressOfRes:any;
  public reservation:any=[];
  @ViewChild(DirectionsRenderer) directionsRendererDirective: DirectionsRenderer;
  public initialized$;
  origin:any;
  destination:any;
  directionsRenderer: google.maps.DirectionsRenderer;
  directionsResult: google.maps.DirectionsResult;
  direction: any = {
    origin: '',
    destination: '',
    travelMode: 'DRIVING'
  };
  public openingHoursD1:any={};
  public openingHoursD2:any={};
  public openingHoursD3:any={};
  public openingHoursD4:any={};
  public openingHoursD5:any={};
  public openingHoursD6:any={};
  public openingHoursD7:any={};
  public aboutMe:any;
  public phoneNumbers:any;
  public todayDate:any;
  public servicesOfRest:any;
  public typeArr:any=[];
  public finalArray:any=[];
  public subarray:any=[];
  public restaurantMenuData:any=[];
  public menuitems:any=[];
  public isActiveAll:any;
  public isActiveSpecific:any;
  public nonVegChecked:boolean=false;
  public vegChecked:boolean=false;
  public vegNonveg:any=[];
  public selectedItems:any=[];
  public tempMenuItemsArr:any=[];
  public filterMenuItems:any=[];
  public selectedItem:any;
  public getAllMenues:any=[];
  public promptMessage:any;
  public addQuantity:any=[];
  public addQuantityMyOrderData:any=[];
  public inputElement:any;
  public inputElementMyOrder:any;
  public menuName:any;
  public value1:any;
  public searchText:any;
  public originmarker:any = [];
  public styledisplay:any;
  public myOrders:any=[];
  public addQuantityMyOrder:any=[];
  public subTotal:any=0;
  public finalSubTotal:any=0;
  public messageForpopup:any;
  public restaurantDetailURL:any;
  public userStoredData:any;
  public resData:any;
  public myOrderData:any;
  public myCartData:any;
  public displaylogin:boolean;
  public displaynotlogin:boolean;
  public deliveryType:any=[];
  public postecode:any;
  public deliType:any;
  public showMessage:any;
  public activemenu:any;
  public activedefault:any='active';
  public fragment:any;
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
    public localStorage:LocalStorageService,
    public userRequestManager:UserRequestManager,
    public router : Router,
    public activatedRoute:ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer,
    private dialogService:DialogService,
    public islogin:IsLogin,
    public spinnerService: SpinnerService,
  ) {
    console.log('inside restaurant detail constructor');
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
    })
  }

  ngOnInit() {
    this.localStorage.set('resDetail','');
    console.log('this.localStorage.get(resDetail) IN RES DETAIL',this.localStorage.get('resDetail'));
    console.log('inside restaurant detail Init');
    this.sub = this.activatedRoute.params.subscribe(params => {
       this.id = +params['id']; // (+) converts string 'id' to a number
    });
    this.activatedRoute.fragment.subscribe((fragment: string) => {
      if(fragment == 'menu')
      {
        this.activemenu = 'active';
        this.activedefault='';
      }
      
  })
   
   this.directionsRendererDirective['initialized$'].subscribe( directionsRenderer => {
      this.directionsRenderer = directionsRenderer;
    });
    this.getMerchantDetails(this.id);
    this.getMenuDetails(this.id);
    
    this.vegNonveg.push({
      'name':'Veg',
      'value':'V',
      'modelName':this.vegChecked
    },{
      'name':'Non Veg',
      'value':'N',
      'modelName':this.nonVegChecked
    });
    this.styledisplay='display:none';
    if(this.localStorage.get('myOrders') != undefined || this.localStorage.get('myOrders') != null) {
      console.log('this.localStorage.get(myOrders) in ngOnInit',this.localStorage.get('myOrders'));
      this.myOrders = this.localStorage.get('myOrders');

      if(this.myOrders.length > 0) {
        for(let i = 0; i< this.myOrders.length;i++) {
          this.myOrders[i].itemTotal = (parseInt(this.myOrders[i].quantity) * parseInt(this.myOrders[i].menuItem.unitPrice));
        }
      }
    }
    this.displaylogin = false;
    this.getSum();
  }

  ngAfterViewInit(){
    console.log('ngAfterViewInit restaurant detail');
  }

  // ngOnDestroy() {
  //  this.sub.unsubscribe();
  // }

  /*Function for getting specific restaurant*/
  getMerchantDetails(id) {
    return new Promise(resolve => {
      this.userRequestManager.get('getMerchantDetails/'+id)
      .then(data => {
        var alldata  = JSON.parse(JSON.stringify(data));
        if(alldata.status == 1){
          this.restaurantData = alldata.data.merchants;
          console.log('this.restaurantData for specific restaurant',this.restaurantData);

          // this.centerLocation = this.restaurantData.address.suburb;
          this.addressOfRes = this.restaurantData.address;
          this.openingHoursD1 = {
            'opening':this.restaurantData.openinghrs.day1.OpeningHrs,
            'closing':this.restaurantData.openinghrs.day1.ClosingHrs,
          }
          this.openingHoursD2 = {
            'opening':this.restaurantData.openinghrs.day2.OpeningHrs,
            'closing':this.restaurantData.openinghrs.day2.ClosingHrs,
          }
          this.openingHoursD3 = {
            'opening':this.restaurantData.openinghrs.day3.OpeningHrs,
            'closing':this.restaurantData.openinghrs.day3.ClosingHrs,
          }
          this.openingHoursD4 = {
            'opening':this.restaurantData.openinghrs.day4.OpeningHrs,
            'closing':this.restaurantData.openinghrs.day4.ClosingHrs,
          }
          this.openingHoursD5 = {
            'opening':this.restaurantData.openinghrs.day5.OpeningHrs,
            'closing':this.restaurantData.openinghrs.day5.ClosingHrs,
          }
          this.openingHoursD6 = {
            'opening':this.restaurantData.openinghrs.day6.OpeningHrs,
            'closing':this.restaurantData.openinghrs.day6.ClosingHrs,
          }
          this.openingHoursD7 = {
            'opening':this.restaurantData.openinghrs.day7.OpeningHrs,
            'closing':this.restaurantData.openinghrs.day7.ClosingHrs,
          }
          this.centerLocation.push([this.addressOfRes.loatitude,this.addressOfRes.longitude]);
          this.aboutMe = this.restaurantData.aboutMe;
          this.phoneNumbers = this.restaurantData.phone;
          this.servicesOfRest = this.restaurantData.Services;
            console.log(' this.servicesOfRest',this.servicesOfRest);
          var subarray = [];
          var paramType = '';
          var ii = 0;
          var j = 0;
          // debugger;
          for(let i=0;i<this.servicesOfRest.length;i++){
             if(this.servicesOfRest[i].paramType != paramType){

                 if(ii==0) {
                   subarray[ii] = {
                     'name':this.servicesOfRest[i].paramName,
                     'has':this.servicesOfRest[i].merchantHas
                   }
                   ii++;
                 } else {
                    ii = 0;
                    subarray = [];
                    subarray[ii] = {
                      'name':this.servicesOfRest[i].paramName,
                      'has':this.servicesOfRest[i].merchantHas
                    }
                    ii++;
                 }
                 this.finalArray[j] = {
                   'type':this.servicesOfRest[i].paramType,
                   'subarray':subarray
                 }
                 paramType = this.servicesOfRest[i].paramType;


                 j++;
             } else {
               subarray[ii] = {
                 'name':this.servicesOfRest[i].paramName,
                 'has':this.servicesOfRest[i].merchantHas
               }
               this.finalArray[j-1] = {
                 'type':this.servicesOfRest[i].paramType,
                 'subarray':subarray
               }
               ii++;
             }
         }

         console.log('finalArray',this.finalArray);
          this.isViewMap = true;
          console.log('this.addressOfRes',this.addressOfRes);
          this.todayDate = moment().day();
          console.log('this.todayDate',this.todayDate);
          this.localStorage.set('restaurantData',this.restaurantData);

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
        resAddress.push(this.detail.address.address1+','+ this.detail.address.address2+','+ this.detail.address.city + ','+
        this.detail.address.suburb+','+ this.detail.address.state+','+ this.detail.address.Postcode+','+ this.detail.address.country);
        resTitle.push(this.detail.merchantname);
      // }
    }
    this.marker.resTitle = resTitle, this.marker.resAddress = resAddress, e.nguiMapComponent.openInfoWindow("iw", e)
  }

  saveReservation(data) {
    const payLoad = {
      'token':this.localStorage.get('userToken'),
      'customer_mobile':data.customer_mobile,
      'customer_firstname':data.customer_firstname,
      'customer_lastname':data.customer_lastname,
      'customer_email':data.customer_email,
      'reservationDate':data.reservationDate,
      'reservationTime':data.reservationTime,
      'occasion':data.occasion,
      'NoOfGuests':data.NoOfGuests,
      'carpark_bay':data.carpark_bay,
      'notes':data.notes,
      'merchant_id': this.restaurantData.merchantid
    };

    if(moment(data.reservationDate) < moment()) {
      this.invalidDate = true;
    }else {
      this.spinnerService.show('homePageSpinner');
      this.invalidDate = false;
      this.userRequestManager.set('saveReservation', payLoad).then(resp => {
        // Handle Response
        this.spinnerService.hide('homePageSpinner');
        if(JSON.parse(JSON.stringify(resp)).status && JSON.parse(JSON.stringify(resp)).status === 1) {
          this.showAlert(this.alertMsg.RES_DONE, this.alertMsg.RES_SUC_MSG);
        }
        if(JSON.parse(JSON.stringify(resp)).status && JSON.parse(JSON.stringify(resp)).status === 0) {
          this.showAlert(this.alertMsg.RES_FAILED, JSON.parse(JSON.stringify(resp)).message);
        }
      },error => {
        // Take action
        this.spinnerService.hide('homePageSpinner');
        this.showAlert(this.alertMsg.RES_FAILED,error + this.alertMsg.RES_FAILED_MSG);
      });
    }
  }

  directionsChanged() {
    this.directionsResult = this.directionsRenderer.getDirections();
    this.cdr.detectChanges();
  }

  showDirection() {
    this.originmarker.display = true;
    this.direction.origin='-31.1100, 115.963';
    //this.origin= '-31.7300,116.1200';
    //this.destination =  this.direction.destination;
    console.log(this.direction);

    this.directionsRendererDirective['showDirections'](this.direction);
    this.styledisplay="overflow: overlay;height: 100PX;display:block;";
  }

  /*Function for collapsible panels in page*/
  scrollDiv(event,id) {
    console.log('event',event);
    console.log('document.getElementById(id)',document.getElementById(id).offsetHeight);
    if(document.getElementById(id).offsetHeight > 0) {
      event.target.parentNode.classList.remove('show-search-list');
      document.getElementById(id).style.height = '0px';
    } else if(document.getElementById(id).offsetHeight <= 0) {
      this.renderer.setElementClass(event.target.parentNode,"show-search-list",true);
      document.getElementById(id).style.height = (<HTMLInputElement>document.getElementById(id)).scrollHeight + 'px';
    }
  }

  /*Function for getting menu item of specific restaurant*/
  getMenuDetails(id) {
    return new Promise(resolve => {
      this.userRequestManager.get('getMenuDetails/'+id)
      .then(data => {
        var alldata  = JSON.parse(JSON.stringify(data));
        if(alldata.status == 1){
          this.isActiveAll = true;
          this.isActiveSpecific = false;
          var tempResMenuData = alldata.data.menueGroup;
          this.selectedItem = 'all';
          // this.restaurantMenuData = alldata.data.menueGroup;
          console.log('this.restaurantMenuData',this.restaurantMenuData);
          for(let i=0;i<tempResMenuData.length;i++) {
            for(let j=0;j<tempResMenuData[i].menuItems.length;j++) {
              if(tempResMenuData[i].menuItems[j].menuItemid != null) {
                if (this.restaurantMenuData.indexOf(tempResMenuData[i]) <= -1) {
                  this.restaurantMenuData.push(tempResMenuData[i]);
                }
                this.menuitems.push(tempResMenuData[i].menuItems[j]);
                  this.addQuantity[tempResMenuData[i].menuItems[j].menuItemid] =  0 ;
              }
            }
          }
          console.log('menuitems',this.menuitems);
          this.tempMenuItemsArr = this.menuitems;
          this.getAllMenues = this.menuitems;
        }
      })
    })
  }

  /*Function for filtering the data based on selected criteria*/
  getClickedMenus(event,element) {
    this.noResult = false;
    this.isActiveAll = false;
    this.isActiveSpecific = true;
    this.selectedItem = element;
    event.target.parentNode.classList.add('active');

    this.filterMenuItems = [];

    for(let i=0;i<this.restaurantMenuData.length;i++) {
      if(this.restaurantMenuData[i].menuGroupId == event.target.getAttribute('id')) {
        for(let j=0;j<this.restaurantMenuData[i].menuItems.length;j++) {
          if(this.restaurantMenuData[i].menuItems[j].menuItemid != null) {
            if(this.selectedItems.length > 0) {
              if (this.selectedItems.indexOf(this.restaurantMenuData[i].menuItems[j].vegOrNonVeg) > -1) {
                this.filterMenuItems.push(this.restaurantMenuData[i].menuItems[j]);
              }
            } else {
              this.filterMenuItems.push(this.restaurantMenuData[i].menuItems[j]);
            }
          } else {
            this.filterMenuItems = [];
          }
        }
      }
    }
    console.log('filterMenuItems',this.filterMenuItems);
    if(this.filterMenuItems.length > 0) {
      this.menuitems = [];
      this.menuitems = this.filterMenuItems;
      this.tempMenuItemsArr = this.filterMenuItems;
    } else if(this.filterMenuItems.length == 0) {
      this.menuitems = [];
    }
    console.log('inside side click menu item', this.menuitems);
  }

  /*Function for filtering veg / Nonveg data*/
  getVeg(val,event) {
    console.log('this.selectedItem',this.selectedItem);
    console.log('this.value1',this.value1);
    console.log('searchText',this.searchText);
    var searchTextVal = this.value1;
    var isSearch = false;
    // if (this.menuName.includes(this.value1)) {
    //   searchText.push(this.tempMenuItemsArr[i]);
    // }
    let vegNonVegArr = [];
    if(event.target.checked) {
      this.selectedItems.push(val);
    } else {
      this.selectedItems.pop(val);
    }
    if(this.selectedItems.length <= 0) {
      for(let i=0; i<this.tempMenuItemsArr.length;i++) {
        this.menuName = this.tempMenuItemsArr[i].menuItemName.toLowerCase();
        if (this.menuName.includes(this.value1)) {
          if(this.searchText =! null) {
            if (this.menuName.includes(this.value1)) {
              vegNonVegArr.push(this.tempMenuItemsArr[i]);
            }
          } else {
            vegNonVegArr.push(this.tempMenuItemsArr[i]);
          }
          var isSearch = true;
        }
      }

      if(!isSearch) {
        vegNonVegArr = this.tempMenuItemsArr;
      }

    } else {
      for(let i=0; i<this.tempMenuItemsArr.length;i++) {
        if (this.selectedItems.indexOf(this.tempMenuItemsArr[i].vegOrNonVeg) > -1) {
          if(this.searchText =! null) {
            this.menuName = this.tempMenuItemsArr[i].menuItemName.toLowerCase();
            if (this.menuName.includes(this.value1)) {
              vegNonVegArr.push(this.tempMenuItemsArr[i]);
            }
          } else {
            vegNonVegArr.push(this.tempMenuItemsArr[i]);
          }

        } else {
          // if(this.selectedItem == 'all') {
          //   vegNonVegArr.push(this.tempMenuItemsArr[i]);
          // }
        }
      }
    }
    console.log('selectedItems',this.selectedItems);
    console.log('vegNonVegArr',vegNonVegArr);
    this.menuitems = vegNonVegArr;
    this.searchText = this.value1;
    // this.filterMenuItems = vegNonVegArr;
  }

  /*Function for filtering search data*/
  getSearchData(event,value) {
    var searchText = [];
    this.noResult = false;
    console.log('event',event.target);
    console.log('value',value);
    console.log('this.menuitems',this.tempMenuItemsArr);
    for(let i=0; i<this.tempMenuItemsArr.length;i++) {
        this.menuName = this.tempMenuItemsArr[i].menuItemName.toLowerCase();
        this.value1 = value.toLowerCase();
      if (this.menuName.includes(this.value1)) {
        searchText.push(this.tempMenuItemsArr[i]);
      }
    }
    if(searchText.length > 0) {
      this.menuitems = searchText;
    }
    else{
      this.noResult = true;
    }
    console.log('searchText',searchText);
  }

  /*Function for getting all data*/
  getAllMenuItems(event) {
    this.noResult = false;
    this.selectedItem = 'all';
    console.log('this.restaurantMenuData',this.restaurantMenuData);
    this.filterMenuItems = [];
    for(let i=0;i<this.restaurantMenuData.length;i++) {
      for(let j=0;j<this.restaurantMenuData[i].menuItems.length;j++) {
        if(this.restaurantMenuData[i].menuItems[j].menuItemid != null) {
          if(this.selectedItems.length > 0) {
            if (this.selectedItems.indexOf(this.restaurantMenuData[i].menuItems[j].vegOrNonVeg) > -1) {
              this.filterMenuItems.push(this.restaurantMenuData[i].menuItems[j]);
            }
          } else {
            this.filterMenuItems.push(this.getAllMenues[j]);
          }
        } else {
          this.filterMenuItems = [];
        }
      }
    }
    if(this.filterMenuItems.length > 0) {
      this.menuitems = [];
      this.menuitems = this.filterMenuItems;
      this.tempMenuItemsArr = this.filterMenuItems;
    } else if(this.filterMenuItems.length == 0) {
      this.menuitems = [];
    }

    //  this.menuitems = this.getAllMenues;
    //  this.getAllMenues = this.menuitems;

    console.log('this.menuitems in all click',this.menuitems)
  }

  /*Function for displaying modal popup on click on comment icons*/
  showPrompt(title,note,isoptions,issize,options,menuId,fromWhere,index) {
    var tempOptions = [];
    if(options.optionGroups.length > 0) {
      for(let i=0;i<options.optionGroups.length;i++) {
        for(let j=0;j<options.optionGroups[i].optionItems.length;j++) {
          tempOptions.push({
            'optionitemname':options.optionGroups[i].optionItems[j].optionitemname,
            'AdditionalCost':options.optionGroups[i].optionItems[j].AdditionalCost,
            'Calorie':options.optionGroups[i].optionItems[j].Calorie,
            'checked':false
          })
        }
      }
    } else {
      tempOptions = options;
    }

    if(fromWhere != null || fromWhere != undefined) {
      if(fromWhere.popup.length > 0) {
        if(this.promptMessage != undefined) {
          if(this.promptMessage.length > 0) {
            if(this.promptMessage[0].message == '') {
              this.messageForpopup = fromWhere.popup[0].message;
            } else {
              this.messageForpopup = this.promptMessage[0].message;
            }
          } else {
            this.messageForpopup = fromWhere.popup[0].message;
          }
        } else {
          this.messageForpopup = fromWhere.popup[0].message;
        }
      } else {
        if(this.promptMessage != undefined) {
          this.messageForpopup = this.promptMessage[0].message;
        }

      }
    }
    console.log('fromWhere AFTER',fromWhere);
    console.log('this.promptMessage',this.promptMessage);
    this.dialogService.addDialog(PromptComponent, {
      title:title,
      note:note,
      isoptions:isoptions,
      issize:issize,
      options:options,
      menuId:menuId,
      message:this.messageForpopup,
      updatedData:this.promptMessage
    })
      .subscribe((message)=>{
        //We get dialog result
        console.log('fromWhere AFTER OK',fromWhere);
        console.log('this.promptMessage AFTER OK',this.promptMessage);
        console.log('message',message);
        if(fromWhere != undefined) {
          if(fromWhere.popup.length > 0) {
            if(message != undefined) {
              if(message.length > 0) {
                message[0].optionsArr = message[0].optionsArr.concat(fromWhere.popup[0].optionsArr);
                message[0].sizesArr = fromWhere.popup[0].sizesArr;
              }
            }
          }
        }
        this.promptMessage = message;
        console.log('this.myorders after prompt',this.myOrders);

        if(this.myOrders != undefined) {
          if(this.myOrders.length > 0) {
            for(let i=0;i<this.myOrders.length;i++) {
              if(this.promptMessage != undefined) {
                if(this.promptMessage.length > 0) {
                  if(this.myOrders[i].menuItem.menuItemid == this.promptMessage[0].menuId) {
                    this.myOrders[i].popup[0] = this.promptMessage[0];
                  }
                }
              }
            }
          }
        }
        console.log('this.promptMessage',this.promptMessage);
      });
  }

  /*Function for updating quantity count*/
  addQuantityFun(event,id,type,elementId,price) {
    var initialVal = 1;
    this.inputElement = (<HTMLInputElement>document.getElementById(elementId));
    if(type == 'plus') {
      this.inputElement.value = parseInt(this.inputElement.value) + initialVal;
      this.addQuantity[id] =  parseInt(this.addQuantity[id]) + initialVal ;
    } else {

      if(parseInt(this.inputElement.value) - initialVal < 0 ) {
        this.inputElement.value = 0;
        this.addQuantity[id] =  0 ;
      } else {
        this.inputElement.value = parseInt(this.inputElement.value) - initialVal;
        this.addQuantity[id] =  parseInt(this.addQuantity[id]) - initialVal ;
      }

    }
  }

  /*Function for adding menu item to my order section*/
  addMenuItem(event, menuItem, quantity) {
    var inputElement = (<HTMLInputElement>document.getElementById(quantity));
    if(inputElement.value == '0') {
      this.showAlert('Error','Please add some quantity');
    } else {
      var extraAddons = '';
      console.log('this.promptMessage',this.promptMessage);
      if(this.promptMessage != null || this.promptMessage != undefined) {
        extraAddons = this.promptMessage;
      } else {
        extraAddons = '';
      }

      console.log('menuItem',menuItem);
      var isPushFalg = true;
      var qntyforMyOrders = inputElement.value;
      // debugger;
      if(this.myOrders != null) {
        if(this.myOrders.length > 0) {
          for(let i = 0; i< this.myOrders.length;i++) {
            if(this.myOrders[i].menuItem.menuItemid == menuItem.menuItemid) {
              this.myOrders[i].quantity = inputElement.value
              isPushFalg = false;
              // this.myOrders[i].itemTotal = (parseInt(qntyforMyOrders) * parseInt(menuItem.unitPrice));
              this.subTotal = (parseInt(inputElement.value) * parseInt(menuItem.unitPrice));
            } else {
              this.subTotal = (parseInt(inputElement.value) * parseInt(menuItem.unitPrice));
            }
          }
        } else {
          this.subTotal = (parseInt(inputElement.value) * parseInt(menuItem.unitPrice));
        }
      } else {
        this.myOrders = [];
        this.subTotal = (parseInt(inputElement.value) * parseInt(menuItem.unitPrice));
      }

      if(isPushFalg) {
        this.myOrders.push({
          'menuItem':menuItem,
          'popup':extraAddons,
          'quantity':qntyforMyOrders,
          'itemTotal':this.subTotal,
        });
      }
      this.getSum();
      // for(let j = 0; j < this.myOrders.length; j++) {
      //   if(this.myOrders[j].menuItem.menuItemid == menuItem.menuItemid) {
      //     this.finalSubTotal = this.myOrders[j].itemTotal;
      //   } else {
      //     if(this.finalSubTotal == 0) {
      //       this.finalSubTotal = this.myOrders[j].itemTotal;
      //     } else {
      //       this.finalSubTotal = this.finalSubTotal + this.myOrders[j].itemTotal;
      //     }
      //   }
      //
      // }

      console.log('this.myOrders',this.myOrders);
      this.localStorage.set('myOrders',this.myOrders);
    }
  }

  showAlert(title,msg) {
    this.dialogService.addDialog(AlertComponent, {title:title, message:msg});
  }

  /*Function for updating quantity count in Myorder section*/
  addQuantityMyOrderFun(event,id,type,elementId,price,index) {
    var initialVal = 1;
    console.log('elementId',elementId);
    console.log('id',id);
    console.log('type',type);
    console.log('price',price);
    console.log('index',index);
    this.inputElementMyOrder = (<HTMLInputElement>document.getElementById(elementId));
    console.log('this.inputElement',this.inputElementMyOrder);
    if(type == 'plus') {
      this.inputElementMyOrder.value = parseInt(this.inputElementMyOrder.value) + initialVal;
      this.addQuantityMyOrderData[id] =  parseInt(this.addQuantityMyOrderData[id]) + initialVal ;
      this.finalSubTotal = this.finalSubTotal + parseInt(price);
      this.myOrders[index].quantity = this.inputElementMyOrder.value;
    } else {

      this.finalSubTotal = this.finalSubTotal - parseInt(price);
      if(parseInt(this.inputElementMyOrder.value) - initialVal < 0 ) {
        this.inputElementMyOrder.value = 0;
        this.addQuantityMyOrderData[id] =  0 ;
      } else if(parseInt(this.inputElementMyOrder.value) - initialVal == 0 ) {
        this.deleteOrder(id);
      } else {
        this.inputElementMyOrder.value = parseInt(this.inputElementMyOrder.value) - initialVal;
        this.addQuantityMyOrderData[id] =  parseInt(this.addQuantityMyOrderData[id]) - initialVal ;
        this.myOrders[index].quantity = this.inputElementMyOrder.value;
      }

    }
    console.log('this.myOrders',this.myOrders);
    this.localStorage.set('myOrders',this.myOrders);
  }

  /*Function for deleteing items from myorder section*/
  deleteOrder(id) {
    console.log('id',id);
    for(let i = 0; i< this.myOrders.length;i++) {
      if(this.myOrders[i].menuItem.menuItemid == id) {
        this.myOrders.splice(i, 1);
      }
    }
    console.log('this.myOrders',this.myOrders);
  }

  /*Function for addition of the items in myorder section*/
  getSum():number{
    this.finalSubTotal = 0;
    this.myOrders.forEach(model => {
      this.finalSubTotal += parseInt(model.itemTotal);
    });
    return this.finalSubTotal;
  }

  /*Function for checking user is logged in or not on checkout button click*/
  checkUser(val) {
/*     console.log('this.promptMessage on check user',this.promptMessage);
    console.log('this.myOrders on check user',this.myOrders);

    console.log('this.localStorage.get(myOrders)',this.localStorage.get('myOrders'));
    console.log('this.localStorage.get(restaurantData)',this.localStorage.get('restaurantData'));
    console.log('this.localStorage.get(cartData)',this.localStorage.get('cartData')); */
    console.log('val',val);
    
    //debugger;
    if(val === 'login')
    {
      this.localStorage.set('resDetail','/cart/'+this.id);
      this.router.navigate(['login']);
    }
    else if(val == 'cancel') 
    {
/*    if(this.localStorage.get('userData') == null || this.localStorage.get('userData') == undefined) {
      console.log('inside');
      this.router.navigate(['login']);
    } else {
*/      
      var cartData = {};
      var uid = '';
      var cartMenuItems = [];
      var tempArrforOptions = [];
      //if(this.localStorage.get('userData') != null || this.localStorage.get('userData') != undefined) {
        uid= null;
        if(this.localStorage.get('userData') !== undefined)
        {
          this.userStoredData = JSON.parse(JSON.stringify(this.localStorage.get('userData')));
          //console.log('inside',this.userStoredData);
          if(this.userStoredData !== null) uid = this.userStoredData.userId;
        }
       this.resData = JSON.parse(JSON.stringify(this.localStorage.get('restaurantData')));
        if(this.localStorage.get('myOrders') != null || this.localStorage.get('myOrders') != undefined) {
          this.myOrderData = JSON.parse(JSON.stringify(this.localStorage.get('myOrders')));
          console.log("COMING  ?>>>>>>>>")
          if(this.localStorage.get('cartData') != null || this.localStorage.get('cartData') != undefined) {
            console.log("COMING  ?>>>>>>>> INSIDE TOO")
            this.localStorage.remove('cartData');
          }

          for(let i =0; i< this.myOrderData.length;i++) {
            var cartOptionsArr=[];
            var cartSizesArr=[];
            if(this.myOrderData[i].menuItem.options != undefined || this.myOrderData[i].menuItem.options != null) {
              for(let j=0;j<this.myOrderData[i].menuItem.options.optionGroups.length;j++) {
                for(let k=0;k<this.myOrderData[i].menuItem.options.optionGroups[j].optionItems.length;k++) {
                  console.log('this.myOrderData[i].popup',this.myOrderData[i].popup);
                  if(this.myOrderData[i].popup) {
                    if(this.myOrderData[i].popup[0].optionsArr.indexOf(this.myOrderData[i].menuItem.options.optionGroups[j].optionItems[k].optionitemname) > -1) {
                      cartOptionsArr.push({
                        'optionGroupId':this.myOrderData[i].menuItem.options.optionGroups[j].optionGroupId,
                        'menuOptionId':this.myOrderData[i].menuItem.options.optionGroups[j].optionItems[k].optionId,
                        'optionItemName':this.myOrderData[i].menuItem.options.optionGroups[j].optionItems[k].optionitemname,
                        'additionalCost':this.myOrderData[i].menuItem.options.optionGroups[j].optionItems[k].AdditionalCost
                      });
                    }
                  }
                }
              }
              console.log('this.myOrderData[i].menuItem.options.size.length',this.myOrderData[i].popup);
              if(this.myOrderData[i].popup) {
                // console.log('this.myOrderData[i].popup[0].sizesArr.length',this.myOrderData[i].popup[0].sizesArr.length);
                if(this.myOrderData[i].popup[0].sizesArr) {
                  for(let j=0;j<this.myOrderData[i].menuItem.options.size.length;j++) {
                    if(this.myOrderData[i].popup[0].sizesArr.indexOf(this.myOrderData[i].menuItem.options.size[j].size_name) > -1) {
                      cartSizesArr.push({
                        'id':this.myOrderData[i].menuItem.options.size[j].id,
                        'size_name':this.myOrderData[i].menuItem.options.size[j].size_name,
                        'AdditionalCost':this.myOrderData[i].menuItem.options.size[j].additionalcost
                      });
                    }
                  }
                }
              }
            }

            console.log('cartOptionsArr AAA', cartOptionsArr);
            console.log('cartSizesArr AAA', cartSizesArr);

            var merchOrderItemId = '';
            if(this.localStorage.get('myCart') != undefined || this.localStorage.get('myCart') != null ) {
              this.myCartData = JSON.parse(JSON.stringify(this.localStorage.get('myCart')));

              console.log('this.myCartData',this.myCartData);
              cartData['merchOrderId'] = this.myCartData.Id;
              // debugger;
              for(let j=0;j<this.myCartData.items.length;j++) {
                if(this.myCartData.items[j].menuItem_Id == this.myOrderData[i].menuItem.menuItemid) {
                  merchOrderItemId = this.myCartData.items[j].Id;
                }
              }


            }

            cartMenuItems.push({
              'menuItem_Id' : this.myOrderData[i].menuItem.menuItemid,
              'menuItemName': this.myOrderData[i].menuItem.menuItemName,
              'quantity'    : this.myOrderData[i].quantity,
              'unit'        : this.myOrderData[i].menuItem.unit,
              'unitPrice'   : this.myOrderData[i].menuItem.unitPrice,
              'options'     : cartOptionsArr,
              'size'        : cartSizesArr,
              'merch_OrderItems_id':merchOrderItemId
            })
          }

          console.log('cartMenuItems',this.userStoredData);
          if(this.userStoredData !== null) cartData['token'] = this.userStoredData.token;
          cartData['userID'] = uid;
          cartData['merchant_country_id'] = this.resData.address.country_id;
          cartData['merchant_state_id'] = this.resData.address.state_id;
          cartData['company_id'] = '';
          cartData['merchant_Id'] = this.resData.merchantid;
          cartData['customer_id'] = '';
          cartData['customer_DeliveryAddress_Id'] = null;
          cartData['customer_BillingAddress_id'] = null;
          cartData['businessunit_id'] = null;
          cartData['items'] = cartMenuItems;
        }
        
        console.log('cartData',cartData);
        this.localStorage.set('cartData',cartData);
        console.log('this.localStorage.get(cartData) in res details',this.localStorage.get('cartData'));
        this.router.navigate(['cart',this.id]);
      }
        //}
      if(this.localStorage.get('userData') != null || this.localStorage.get('userData') != undefined) {      
        this.router.navigate(['cart',this.id]);
      }  
   // }
  }
  originclicked (event){
    this.originmarker.display = true;
    var e = event.target;
/*      var resTitle = [];
    var resAddress = [];
  console.log(event.target);
    if(this.detail!= undefined || this.detail != null) {
      // for(let i=0;i<this.restaurantDetail.length;i++) {
        resAddress.push('Start Position');
        resTitle.push('Current Location');
      // }
    }
  */
    this.originmarker.resTitle = 'Current Location', this.originmarker.resAddress = 'Start Position', e.nguiMapComponent.openInfoWindow("iwo", e)
  }
  onSubmit(form)
  {
//    alert('hi');
    
/*     if (typeof this.localStorage.get('userData') !== 'undefined' && this.localStorage.get('userData') !== null) {
      this.displaylogin = false;
    } else {
      this.displaylogin = true;
     // this.asklogin.show();
    } */
  //this.checkUser(true);
    if(this.deliType !== null && this.deliType !== undefined) {
        this.localStorage.set('deliType',this.deliType);
        if(this.postecode !== null && this.postecode !== undefined)
        {
          this.localStorage.set('postecode',this.postecode);
        }
    }
   if(this.localStorage.get('userData') !== null && this.localStorage.get('userData') !== undefined) {
      this.router.navigate(['cart',this.id]);
   }
  }

  updateBookMark(merchantID) {
    let userToken = null;
    if(merchantID) {
      if(this.localStorage.get('userData') !== undefined) {
        userToken  = this.localStorage.get('userToken');
      }
      this.userRequestManager.set('updateBookMark',{'token': userToken, 'merchantId': merchantID})
        .then(data => {
          const alldata  = JSON.parse(JSON.stringify(data));
          console.log('BOOK MARK DATA',alldata);
          if(alldata.status === 1) {
            this.dialogService.addDialog(
              AlertComponent, {
                title: 'Bookmark',
                message: alldata.msg
              });
          }
        }, error => {
          console.log('BOOKMARK ERROR', error);
        });
    }
  }

  displayDialog(event){
    if(this.deliType !== null && this.deliType !== undefined) {
        if(this.localStorage.get('userData') === null || this.localStorage.get('userData') === undefined) {
            this.displaylogin = true;
            this.localStorage.set('deliType',this.deliType);
            if(this.postecode !== null && this.postecode !== undefined)
            {
              this.localStorage.set('postecode',this.postecode);
            }
        }
        else this.displaylogin = false;
      }

    }

      
}
