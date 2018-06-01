import { Component ,ViewChild, OnDestroy} from '@angular/core';
import {
    Router,
    // import as RouterEvent to avoid confusion with the DOM Event
    Event as RouterEvent,
    NavigationStart,
    NavigationEnd,
    NavigationCancel,
    NavigationError
} from '@angular/router'
import 'rxjs/add/operator/pairwise';
import { FacebookService, InitParams } from 'ngx-facebook';
import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';
import { LocalStorageService } from 'angular-2-local-storage';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import { Observable } from 'rxjs/Observable';
import {Http} from '@angular/http';
import 'rxjs/Rx';
import { Subscription } from 'rxjs/Subscription';
import { DialogService } from "ng2-bootstrap-modal";
import { AlertComponent } from '../pages/common/alert.component';
import { filterService } from '../pages/common/filter.service';
import { SpinnerService } from '../pages/common/spinner.service';
//constants
import { COUNTRY } from '../app/app.constants';

//providers
import { UserRequestManager } from '../providers/user-request-manager';
import { IsLogin } from '../providers/is-login';

//declare var google: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers : [filterService]
})
export class AppComponent implements OnDestroy {
  loginStatus: any;
  subscription: Subscription;
  public someRange3:any;
  public someRange3config:any = {
    start: [0],
    step: 1,
    range: {
     min: 0,
     max: 1000
   }
  }
  public isStatic: boolean;
  public displayHeader: boolean;
  public displayMore:boolean;
  public sliderVal:any;
  @ViewChild('sliderRef') sliderRef;
  public childheader:any;
//rootPage:any = HomeComponent;
 // public csrfToken:any;
  public businessUnits:any;
  public foodData:any;
  public CuisineTypeData:any;
  public LocationData:any;
  public FeaturedRestaurants:any;
  public userData:any;
  public fName:any;
  public lName:any;
  protected dataService: CompleterData;
  // protected location:any=[];
  public selectedItem = "Not Selected";
  public checkedArray:any=[];
  public serachData:any;
  public alreadySearchedData:any;
  public homeSearch:any=[];
  public businessUnit:any=[];
  public units:any;
  public color4:any;
  public lat:any;
  public long:any;
  public request:any;
  public results:any;
  public city:any;
  public showMessage:any;
  public allapidata:any;
  public selectedFilters:boolean;
  public allFilters:any =[];
  public sideFilterData:any=[];
  public mealTypes:any=[];
  public serviceTypes:any=[];
  public parkingTypes:any=[];
  public merchantFeatures:any=[];
  public seatingLocation:any=[];
  public alcoholType:any=[];
  public postcodeSearch:any=[];
  public postalcodeKm:any;
  public postcodeData:any;
  private isSearchData:any;
  public locationDataForSide:any=[];
  public searchedPostCode: any;
  public nodes:any = [];
  public tempArray:any = [];
  public loggedin:boolean;
  public setAlert: any;
  public bgColor: any;
  public myNewArray:any = [];
  constructor(
    public router : Router,
    public userRequestManager :UserRequestManager,
    public localStorage:LocalStorageService,
    public fb: FacebookService,
    public islogin:IsLogin,
    private completerService: CompleterService,
    private _http: Http,
    public filterObject: filterService,
    public spinnerService: SpinnerService,
    private dialogService:DialogService
  ){
    this.localStorage.set('deliType', '');
    localStorage.set('childheader',true);
    if (this.localStorage.get('searchByPostCode') !== null && this.localStorage.get('searchByPostCode') !== undefined) {
      this.searchedPostCode = this.localStorage.get('searchByPostCode');
    }

    this.subscription = this.islogin.getLoggedInStatus().subscribe(loginStatus => {

      this.loginStatus = loginStatus;
      if((this.loginStatus.status === 'Logged In')
      && (this.localStorage.get('userData') != null || this.localStorage.get('userData') != undefined)) {
        this.userData = JSON.parse(JSON.stringify(this.localStorage.get('userData')));
        this.fName = this.userData.firstName;
        this.lName = this.userData.lastName;
      }

    });
     let initParams: InitParams = {
      appId: '125711328017266',
      xfbml: true,
      version: 'v2.9'
    };

    fb.init(initParams);
        //console.log('this.localStorage.get(userData)',this.localStorage.get('userData'));
    //this.getcsrfToken();
  }

  ngOnInit() {
    this.router.events
    .filter((event) => event instanceof NavigationEnd)
    .subscribe((event) => {
      //console.log('NavigationEnd:', event);
      this.showMessage='';
      this.navigationInterceptor(event);
      if((event.toString().indexOf("/register") != -1) || (event.toString().indexOf("/login") != -1) || (event.toString().indexOf("/home") != -1)){
        window.scrollTo(0, 0);
      }
    });
    if(this.localStorage.get('sliderval') != null || this.localStorage.get('sliderval') != undefined) {
      this.someRange3 = this.localStorage.get('sliderval');
      //console.log('sliderVal',this.sliderVal);
    }
    //console.log('ngAfterViewInit');

    this.getAllData();
    this.getLocationData();
    //this.filterObject.setSideMenu();
    this.setSideMenu();
    this.displayMore = false;
    if((this.localStorage.get('userData') != null || this.localStorage.get('userData') != undefined)) {
      this.userData = JSON.parse(JSON.stringify(this.localStorage.get('userData')));
      this.fName = this.userData.firstName;
      this.lName = this.userData.lastName;
    }
    //console.log('allFiltersNew',this.localStorage.get('allFilters'))
   // if(this.localStorage.get('allFilters') !== undefined && this.localStorage.get('allFilters') !== null) this.allFilters = this.localStorage.get('allFilters');
}

 /*Function for getting side menu from API*/
 setSideMenu(): Promise<any> {
  return new Promise(resolve => {
    this.userRequestManager.get('getSearchAdditionalFilters')
    .then(data => {
      var alldata  = JSON.parse(JSON.stringify(data));
      if(alldata.status == 1){
        this.allFilters = alldata.data.params;
        //console.log("this.allFilters.Meal_Type : "+JSON.stringify(this.allFilters.Meal_Type));
        this.allFilters.Alcohol_Type = this.addChecked(this.allFilters.Alcohol_Type,'alcoholType','Alcohol_Type');
        this.allFilters.Meal_Type = this.addChecked(this.allFilters.Meal_Type,'mealTypes','Meal_Type');
        this.allFilters.Merchant_Features = this.addChecked(this.allFilters.Merchant_Features,'merchantFeatures','Merchant_Features');
        this.allFilters.Parking_Type = this.addChecked(this.allFilters.Parking_Type,'parkingTypes','Parking_Type');
        this.allFilters.Seating_Location = this.addChecked(this.allFilters.Seating_Location,'seatingLocation','Seating_Location');
        this.allFilters.Service_Type = this.addChecked(this.allFilters.Service_Type,'serviceTypes','Service_Type');
        //if (this.allFilters !== undefined || this.allFilters !== null)  this.localStorage.set('allFilters',this.allFilters);
        //console.log("this.allFilters.Meal_Type : "+JSON.stringify(this.allFilters.Meal_Type));
     }
    })
  })
}
getFilterValue() {
  return this.allFilters;
}
/*   load(): Promise<any> {
  return this.http.get(this.BASEURL + 'api/client/hotel/load')
      .toPromise()
      .then(response => {
          return response.json();
      })
      .catch(err => err);
} */

/*Function for adding checked property in the response*/
addChecked(arr,type,name) {
 var tempArrOfFilters = [];
  for(let i = 0; i<arr.length; i++) {
    var unitChecked = false;
    if(this.localStorage.get(type) != null || this.localStorage.get(type) != undefined) {
      tempArrOfFilters = this.localStorage.get(type);
      if (tempArrOfFilters.indexOf(arr[i].id) > -1) {
        unitChecked = true;
      }
    }
      arr[i] = {
      'id':arr[i].id,
      'name':arr[i].name,
      'checked':unitChecked
    }
  }
  return arr;
}
  /*Function for getting the value of range slider*/
  onChange(value: any) {
    this.sliderVal = value;
    //console.log('this.sliderVal at change',this.sliderVal);
    this.localStorage.set('sliderval',this.sliderVal);
  }

 /*Function for getting values of side filters*/
  getExtraFilters(type,event) {
    //console.log("type : "+JSON.stringify(type));
    //console.log("event : "+JSON.stringify(event));
    //console.log("event : "+JSON.stringify(this.localStorage.get('mealTypes')));
    if(type == 'Meal_Type') {
      if(this.localStorage.get('mealTypes') != undefined || this.localStorage.get('mealTypes') != null) {
        this.mealTypes = this.localStorage.get('mealTypes');
      }
      if(this.localStorage.get('sideFilterData') != undefined || this.localStorage.get('sideFilterData') != null) {
        this.sideFilterData = this.localStorage.get('sideFilterData');
      }
      if(this.mealTypes.indexOf(event.target.value) <= -1) {
        if(event.target.checked) {
          //console.log("event.target.checked : "+event.target.checked);
          this.mealTypes.push(event.target.value);
          this.sideFilterData.push(event.target.value);
        } else {
          this.mealTypes.splice(this.mealTypes.indexOf(event.target.value), 1);
          this.sideFilterData.splice(this.sideFilterData.indexOf(event.target.value), 1);
        }
      } else {
        if(!event.target.checked) {
          this.mealTypes.splice(this.mealTypes.indexOf(event.target.value), 1);
          this.sideFilterData.splice(this.sideFilterData.indexOf(event.target.value), 1);
        }
      }
      this.localStorage.set('mealTypes',this.mealTypes);
      //console.log('this.localStorage.get(serviceTypes)'+JSON.stringify(this.mealTypes));
      //console.log('this.sideFilterData'+JSON.stringify(this.sideFilterData));
    }
    if(type == 'Service_Type') {
      if(this.localStorage.get('serviceTypes') != undefined || this.localStorage.get('serviceTypes') != null) {
        this.serviceTypes = this.localStorage.get('serviceTypes');
      }
      if(this.localStorage.get('sideFilterData') != undefined || this.localStorage.get('sideFilterData') != null) {
        this.sideFilterData = this.localStorage.get('sideFilterData');
      }
      if(this.serviceTypes.indexOf(event.target.value) <= -1) {
        if(event.target.checked) {
          //console.log("event.target.checked : "+event.target.checked);
          this.serviceTypes.push(event.target.value);
          this.sideFilterData.push(event.target.value);
        } else {
          this.serviceTypes.splice(this.serviceTypes.indexOf(event.target.value), 1);
          this.sideFilterData.splice(this.sideFilterData.indexOf(event.target.value), 1);
        }
      } else {
        if(!event.target.checked) {
          this.serviceTypes.splice(this.serviceTypes.indexOf(event.target.value), 1);
          this.sideFilterData.splice(this.sideFilterData.indexOf(event.target.value), 1);
        }
      }
      //console.log('this.localStorage.get(serviceTypes)'+JSON.stringify(this.serviceTypes));
      //console.log('this.sideFilterData : '+JSON.stringify(this.sideFilterData))
      this.localStorage.set('serviceTypes',this.serviceTypes);
      // this.localStorage.set('sideFilterData',this.sideFilterData);
    }
    if(type == 'Parking_Type') {
      if(this.localStorage.get('parkingTypes') != undefined || this.localStorage.get('parkingTypes') != null) {
        this.parkingTypes = this.localStorage.get('parkingTypes');
      }
      if(this.localStorage.get('sideFilterData') != undefined || this.localStorage.get('sideFilterData') != null) {
        this.sideFilterData = this.localStorage.get('sideFilterData');
      }
      if(this.parkingTypes.indexOf(event.target.value) <= -1) {
        if(event.target.checked) {
          this.parkingTypes.push(event.target.value);
          this.sideFilterData.push(event.target.value);
        } else {
          this.parkingTypes.splice(this.parkingTypes.indexOf(event.target.value), 1);
          this.sideFilterData.splice(this.sideFilterData.indexOf(event.target.value), 1);
        }
      } else {
        if(!event.target.checked) {
          this.parkingTypes.splice(this.parkingTypes.indexOf(event.target.value), 1);
          this.sideFilterData.splice(this.sideFilterData.indexOf(event.target.value), 1);
        }
      }
      //console.log('this.localStorage.get(parkingTypes)',this.parkingTypes)
      this.localStorage.set('parkingTypes',this.parkingTypes);
      // this.localStorage.set('sideFilterData',this.sideFilterData);
    }
    if(type == 'Merchant_Features') {
      if(this.localStorage.get('merchantFeatures') != undefined || this.localStorage.get('merchantFeatures') != null) {
        this.merchantFeatures = this.localStorage.get('merchantFeatures');
      }
      if(this.localStorage.get('sideFilterData') != undefined || this.localStorage.get('sideFilterData') != null) {
        this.sideFilterData = this.localStorage.get('sideFilterData');
      }
      if(this.merchantFeatures.indexOf(event.target.value) <= -1) {
        if(event.target.checked) {
          this.merchantFeatures.push(event.target.value);
          this.sideFilterData.push(event.target.value);
        } else {
          this.merchantFeatures.splice(this.merchantFeatures.indexOf(event.target.value), 1);
          this.sideFilterData.splice(this.sideFilterData.indexOf(event.target.value), 1);
        }
      } else {
        if(!event.target.checked) {
          this.merchantFeatures.splice(this.merchantFeatures.indexOf(event.target.value), 1);
          this.sideFilterData.splice(this.sideFilterData.indexOf(event.target.value), 1);
        }
      }
      //console.log('this.localStorage.get(merchantFeatures)',this.merchantFeatures)
      this.localStorage.set('merchantFeatures',this.merchantFeatures);
      // this.localStorage.set('sideFilterData',this.sideFilterData);
    }
    if(type == 'Seating_Location') {
      if(this.localStorage.get('seatingLocation') != undefined || this.localStorage.get('seatingLocation') != null) {
        this.seatingLocation = this.localStorage.get('seatingLocation');
      }
      if(this.localStorage.get('sideFilterData') != undefined || this.localStorage.get('sideFilterData') != null) {
        this.sideFilterData = this.localStorage.get('sideFilterData');
      }
      if(this.seatingLocation.indexOf(event.target.value) <= -1) {
        if(event.target.checked) {
          this.seatingLocation.push(event.target.value);
          this.sideFilterData.push(event.target.value);
        } else {
          this.seatingLocation.splice(this.seatingLocation.indexOf(event.target.value), 1);
          this.sideFilterData.splice(this.sideFilterData.indexOf(event.target.value), 1);
        }
      } else {
        if(!event.target.checked) {
          this.seatingLocation.splice(this.seatingLocation.indexOf(event.target.value), 1);
          this.sideFilterData.splice(this.sideFilterData.indexOf(event.target.value), 1);
        }
      }
      //console.log('this.localStorage.get(seatingLocation)',this.seatingLocation)
      this.localStorage.set('seatingLocation',this.seatingLocation);
      // this.localStorage.set('sideFilterData',this.sideFilterData);
    }
    if(type == 'Alcohol_Type') {
      if(this.localStorage.get('alcoholType') != undefined || this.localStorage.get('alcoholType') != null) {
        this.alcoholType = this.localStorage.get('alcoholType');
      }
      if(this.localStorage.get('sideFilterData') != undefined || this.localStorage.get('sideFilterData') != null) {
        this.sideFilterData = this.localStorage.get('sideFilterData');
      }
      if(this.alcoholType.indexOf(event.target.value) <= -1) {
        if(event.target.checked) {
          this.alcoholType.push(event.target.value);
          this.sideFilterData.push(event.target.value);
        } else {
          this.alcoholType.splice(this.alcoholType.indexOf(event.target.value), 1);
          this.sideFilterData.splice(this.sideFilterData.indexOf(event.target.value), 1);
        }
      } else {
        if(!event.target.checked) {
          this.alcoholType.splice(this.alcoholType.indexOf(event.target.value), 1);
          this.sideFilterData.splice(this.sideFilterData.indexOf(event.target.value), 1);
        }
      }
      //console.log('this.localStorage.get(alcoholType)',this.alcoholType)
      this.localStorage.set('alcoholType',this.alcoholType);
      // this.localStorage.set('sideFilterData',this.sideFilterData);
    }

    this.localStorage.remove("sideFilterData");
    this.sideFilterData = [];
    this.sideFilterData = this.sideFilterData.concat(this.localStorage.get('mealTypes'), this.localStorage.get('serviceTypes'),this.localStorage.get('parkingTypes'),this.localStorage.get('merchantFeatures'),this.localStorage.get('seatingLocation'),this.localStorage.get('alcoholType'));
    this.localStorage.set('sideFilterData',this.sideFilterData);
    //console.log('this.sideFilterData'+JSON.stringify(this.sideFilterData));

  }
  getCurrLocation () {
    navigator.geolocation.getCurrentPosition(position=> {
      this.lat = position.coords.latitude;
      this.long = position.coords.longitude;
      //console.log('this.lat',this.lat);
      //console.log('this.long',this.long);

      this.getCurrentLocation(this.lat,this.long).subscribe((response)=>{
        this.results = response.results;
        //console.log('cityname',this.results);
        var countryName = '';

        for (var i=0; i<this.results[0].address_components.length; i++) {
          for (var b=0;b<this.results[0].address_components[i].types.length;b++) {

          //there are different types that might hold a city admin_area_lvl_1 usually does in come cases looking for sublocality type will be more appropriate
          if (this.results[0].address_components[i].types[b] == "country") {
            //this is the object you are looking for
            countryName = this.results[0].address_components[i].long_name;
            if (countryName == COUNTRY) {
              this.city= this.results[0].address_components[i];
              break;
            }


          }
        }
      }
      if(this.city == undefined) {
        this.showMessage = "Sorry we are not operating in "+countryName+" currently";
      }
      });
    });
  }

  getCurrentLocation(lat,lng): Observable<any> {
    // return this._http.get('http://ipinfo.io/json')
    return this._http.get("http://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+lng+"&sensor=true")
    .map(response =>
      response.json()
    )
    .catch(error => {
        //console.log(error);
        return Observable.throw(error.json());
    });
  }

  navigationInterceptor(event) {
    //console.log('this.router.url',event.urlAfterRedirects);
    this.displayMore= false;
    //this.displayHeader = true;
    this.isStatic = false;
    if(event.urlAfterRedirects=='/' || event.urlAfterRedirects=='/home' ){
     if( event.urlAfterRedirects=='/')
     {
      this.displayMore = true;
     }
      // console.log('in if');
        this.localStorage.set('childheader',true);
      //this.getBusinessUnit();
      //this.getFoodData();
      //this.getCuisineTypeData();
      //this.getLocationData();
      // this.getFeaturedRestaurants();

     // console.log('this.localStorage.get(serachData nnhuu);',this.localStorage.get('serachData'));
      if(this.localStorage.get('serachData') != null || this.localStorage.get('serachData') != undefined) {
        this.alreadySearchedData = this.localStorage.get('serachData');
        //console.log('this.localStorage.get(serachData);',this.alreadySearchedData);

        if(this.alreadySearchedData.cusionFood != null || this.alreadySearchedData.cusionFood != undefined) {
          //console.log("this.alreadySearchedData.cusionFood : "+JSON.stringify(this.alreadySearchedData.cusionFood));
          this.homeSearch.cusionFood = this.alreadySearchedData.cusionFood;
        } else {
          this.homeSearch.cusionFood = '';
        }

        if(this.alreadySearchedData.orderFood != null || this.alreadySearchedData.orderFood != undefined) {
          //console.log("this.alreadySearchedData.orderFood : "+JSON.stringify(this.alreadySearchedData.orderFood));
          this.homeSearch.orderFood = this.alreadySearchedData.orderFood;
        } else {
          this.homeSearch.orderFood = '';
        }
        this.color4 = this.alreadySearchedData.locations.suburb;
      } else {

        this.homeSearch.cusionFood = '';
        this.homeSearch.orderFood = '';
      }

    } else {
      //console.log('in else');
      //console.log('event.urlAfterRedirects:',event.urlAfterRedirects);
      // if(event.urlAfterRedirects!='/fake' && event.urlAfterRedirects!='/restaurant') {
      //   this.islogin.isLoggedIn();
      // }
      //this.displayHeader = false;
      this.localStorage.set('childheader',false);
      if(event.urlAfterRedirects == "/aboutus" || event.urlAfterRedirects == "/careers" || event.urlAfterRedirects == "/press" || event.urlAfterRedirects == "/privacy-policy" || event.urlAfterRedirects == "/terms" || event.urlAfterRedirects == "/contact" || event.urlAfterRedirects == "/help" || event.urlAfterRedirects == "/blog" || event.urlAfterRedirects == "/sitemap")
      {
        this.displayHeader = true;
        this.isStatic = true;
      }

    }

    // console.log('this.localStorage.get',this.localStorage.get('childheader'));


  }
  ngAfterViewInit(){

  }
  ngOnDestroy(){
    this.subscription.unsubscribe();
    //console.log('ngOnDestroy')
  }
  // ngOnInit () {
  //   console.log('ngOnInit');
  // }

  /*Function for getting token from API*/
  getcsrfToken(){
   return new Promise(resolve => {
     this.userRequestManager.get('generateToken')
     .then(data=>{
       var alldata=JSON.parse(JSON.stringify(data));
       //console.log(alldata.data)
    //  if(alldata.status == 1){
        this.localStorage.set('userToken',alldata.data.token);
      //}

     })
   });

 }
/* Call All the API In Singel API*/

getAllData() {
 // debugger;

 if(this.localStorage.get('getallapidata') !== undefined && this.localStorage.get('getallapidata') !== null)
  {
    //console.log("If part");
    this.allapidata = JSON.parse(JSON.stringify(this.localStorage.get('getallapidata')));
    //console.log(this.localStorage.get('getallapidata'));
    if(this.allapidata)
    {
      this.getBusinessUnit();
      this.getFoodData();
      this.getCuisineTypeData();
    }
  }
  else
  {
    //console.log("Else part");
    return new Promise(resolve => {
      this.userRequestManager.get('getAllData')
      .then(data=>{
        this.allapidata = JSON.parse(JSON.stringify(data));
        if(this.allapidata)
        {
          this.localStorage.set('getallapidata',this.allapidata);
        //console.log("aaaa=>"+ JSON.stringify(this.localStorage.get('allapidata')['getBusinessUnit']));
          this.getBusinessUnit();
          this.getFoodData();
          this.getCuisineTypeData();
        }
      })
    });
  }
}

/*Function for oredering food and booking table*/
reserveTable(type, $event) {
   //console.log('allFilters : ' + JSON.stringify(type));
  this.localStorage.remove('tableBookingId');
  this.localStorage.remove('takeAwayId');
  this.localStorage.remove('deliveryId');
  var allfilters = this.allFilters.Service_Area;
  allfilters.forEach(data => {
        var parsedData = JSON.stringify(data.name);
        if (type === 'Table_Booking') {
            if (data.name === 'Table Booking') {
                var tableBooking = (data.id).toString();
                this.localStorage.set('tableBookingId', tableBooking);
            }
        }
        if (type === 'Order_food') {
            if (data.name === 'TakeAway') {
                var takeAwayId = parseInt(data.id);
                this.localStorage.set('takeAwayId', takeAwayId);
            }
            if (data.name === 'Delivery') {
                var deliveryId = parseInt(data.id);
                this.localStorage.set('deliveryId', deliveryId);
            }
        }
    });
    if (type === 'Table_Booking') {
        this.localStorage.remove('foodOrderId');
        var eventId = this.localStorage.get('tableBookingId');
        //if (this.localStorage.get('tableBookingId') == undefined && this.localStorage.get('tableBookingId') == null) {
            this.localStorage.set('tableBookingId', eventId);
        //}
    }
    if (type === 'Order_food') {
        this.localStorage.remove('tableBookingId');
        var foodOrder = this.localStorage.get('takeAwayId') + ',' + this.localStorage.get('deliveryId');
        if (this.localStorage.get('foodOrderId') == undefined && this.localStorage.get('foodOrderId') == null) {
            this.localStorage.set('foodOrderId', foodOrder);
        }
    }
    this.router.navigate(['fake']);
  }

/*Function for getting business units from API*/
 getBusinessUnit() {
    if(this.allapidata.data.getBusinessUnits[0].status == 1) {
    this.businessUnits = this.allapidata.data.getBusinessUnits[0].data;
    //this.businessUnits=JSON.parse(JSON.stringify(data));
    //console.log("this.businessUnits : "+JSON.stringify(this.businessUnits));
    for(let i = 0; i<this.businessUnits.length; i++) {
      var unitChecked = false;
      /*if(this.localStorage.get('serachData') != null || this.localStorage.get('serachData') != undefined) {
        this.alreadySearchedData = this.localStorage.get('serachData');
        console.log("this.businessUnits : "+JSON.stringify(this.businessUnits));
         if (this.alreadySearchedData.businessUnits.indexOf(this.businessUnits[i].businessUnitId) > -1) {
           console.log("614");
          unitChecked = true;
        } else {
        }
      }*/
      this.businessUnits[i] = {
        'businessUnitId':this.businessUnits[i].businessUnitId,
        'businessUnitName':this.businessUnits[i].businessUnitName,
        'checked':unitChecked
      }
    }
    //console.log('alldata.data All business unit'+JSON.stringify(this.businessUnits));
  }
}

/*Function for getting Order foods from API*/
 getFoodData() {
 if(this.allapidata.data.getFoodsData[0].status == 1) {
    this.foodData = this.allapidata.data.getFoodsData[0].data;
    //this.businessUnits=JSON.parse(JSON.stringify(data));
    //console.log('alldata.data All food data',this.foodData);
	}
}
 /*Function for getting Cuisine foods from API*/
 getCuisineTypeData(){
    if(this.allapidata.data.getCuisineTypeData[0].status == 1){
      this.CuisineTypeData =this.allapidata.data.getCuisineTypeData[0].data;
	}
 }
 /*Function for getting Location from API*/
 getLocationData(){
	 //console.log("this.localStorage.get('getLocationData') : " +JSON.stringify(this.localStorage.get('getLocationData')))
   if(this.localStorage.get('getLocationData') != null)
    {
      this.LocationData= JSON.parse(JSON.stringify(this.localStorage.get('getLocationData')));
      //console.log("this.SIDD : " +JSON.stringify(this.localStorage.get('getLocationData')));
      this.dataService = this.completerService.local(this.LocationData, 'location','location');
    }
    else
    {
      return new Promise(resolve => {
		  this.LocationData = [];
        this.userRequestManager.get('getLocationData')
        .then(data => {
          var alldata  = JSON.parse(JSON.stringify(data));
          //console.log('this.LocationData',alldata);
          if(alldata[0].status == 1){
			  var alldataArray = alldata[0].data;
			  for (var i = 0 ; i < alldataArray.length ; i++) {
				  var location = alldataArray[i].suburb + "-" + alldataArray[i].postcode.trim();
				  var locationObj = {
					  location: location
				  }
				  this.LocationData.push(locationObj);
			  }
//console.log("this.LocationData :"+JSON.stringify(this.LocationData));
			  this.dataService = this.completerService.local(this.LocationData, 'location','location');
			//console.log("Location Data  : "+JSON.stringify(this.LocationData));
			  this.localStorage.set('getLocationData',this.LocationData);
            /*this.LocationData=alldata[0].data;
			  console.log("Location Data : "+JSON.stringify(this.LocationData))
              this.localStorage.set('getLocationData',this.LocationData);
            //console.log('this.LocationData',this.LocationData);*/
            /*this.dataService = this.completerService.local(this.LocationData, 'suburb +postcode','suburb +postcode');*/
			//console.log("this.Location Data : "+JSON.stringify(this.dataService));
          }
        })

      });
    }
 }
 // /*Function for getting Featured Restaurant from API*/
 // getFeaturedRestaurants(){
 //   return new Promise(resolve => {
 //     this.userRequestManager.get('getFeaturedRestaurants')
 //     .then(data => {
 //       var alldata  = JSON.parse(JSON.stringify(data));
 //       if(alldata.status == 1){
 //         this.FeaturedRestaurants=alldata.data;
 //       }
 //     })
 //   })
 // }
/* Call to logout user function */
logoutUser()
 {
  this.spinnerService.show("homePageSpinner");
  this.userData = this.localStorage.get('userData');
  return new Promise(resolve => {
    this.userRequestManager.set('logout',{token:this.userData.token})
    .then(data => {
      this.spinnerService.hide("homePageSpinner");
      var alldata  = JSON.parse(JSON.stringify(data));
     if(alldata.status == 1){
      localStorage.clear();
        this.router.navigate(['/']);
      }
    })

  });
 }
 /*Function for getting values of search data form first page*/
 onSubmit(data){
   //console.log("All Data :"+JSON.stringify(data));
   this.localStorage.remove('tableBookingId');
   this.localStorage.remove('foodOrderId');
   this.localStorage.remove('deliveryId');
   this.localStorage.remove('takeAwayId');
   //console.log("this.selectedItem : "+JSON.stringify(this.selectedItem));
   if(this.selectedItem !== null && this.selectedItem !== undefined && this.selectedItem !== "Not Selected") {
      this.setAlert = "none";
      this.bgColor = '#FFFFFF'
      //let isSelected: any = this.businessUnits.filter((item) => item.checked === true);
      //let isSelected = this.businessUnits;
      /*console.log("isSelected : "+JSON.stringify(isSelected));
      for(let i = 0; i<isSelected.length; i++) {
        this.checkedArray.push(isSelected[i].businessUnitId);
      }*/
      //this.checkedArray = this.remove_duplicates(this.checkedArray);
      this.checkedArray = this.myNewArray;
      var mainLocation = '';
      mainLocation = this.selectedItem;
       /*else if(this.color4 != undefined) {
     mainLocation = this.color4;
   }*/

   //console.log('this.localStorage.get(serachData) IN SUBMIT',this.localStorage.get('serachData'));

  //  if(this.localStorage.get('serachData') == undefined || this.localStorage.get('serachData') == null) {
     this.serachData = {
       'businessUnits':this.checkedArray,
       'orderFood':data.orderFood,
       'cusionFood':data.cusionFood,
       'locations':mainLocation
     }
     this.localStorage.set('serachData',this.serachData);
     this.selectedItem = "Not Selected";
     //console.log('this.serachData',this.serachData);
  //  } else {
      //console.log("this.serachData : "+JSON.stringify(this.serachData));
      this.alreadySearchedData = this.localStorage.get('serachData');
      //console.log("this.serachData2 : "+JSON.stringify(this.serachData));
      if(this.alreadySearchedData.businessUnits == undefined || this.alreadySearchedData.businessUnits == null) {
        this.serachData = {
          'businessUnits':this.checkedArray,
          }
      } else {
        this.serachData = {
          'businessUnits':this.alreadySearchedData.businessUnits,
        }
      }
	  this.router.navigate(['fake']);
   }
   else {
     this.dialogService.addDialog(AlertComponent, {title: 'Alert!', message: 'Please select location'});
     this.setAlert = 'solid 1px red';
     this.bgColor = '#F78181';
   }
 }

 /*Function for removing duplicate values from array*/
 remove_duplicates(arr) {
    let obj = {};
    for (let i = 0; i < arr.length; i++) {
        obj[arr[i]] = true;
    }
    arr = [];
    for (let key in obj) {
        arr.push(key);
    }
    return arr;
  }

 /*Function for getting serached values from location*/
 onItemSelect(selected:CompleterItem){
  let selectedObj = selected.originalObject;
     if (selectedObj.location === this.color4) {
       this.setAlert = 'none';
       this.bgColor = '#FFFFFF';
        var selectdLocation = ((selectedObj.location).split(/\s*\-\s*/g))[0];
        this.selectedItem = selectdLocation;
        //console.log("this.color4 "+this.color4 + ' '+ " this.selectedItem "+ this.selectedItem)
      }

   //console.log('this.selectedItem'+JSON.stringify(this.selectedItem));
  }

  /*Function for providing showing and hiding the advanced filters in header */
  showSelectedFilters() {
    this.selectedFilters = !this.selectedFilters;
  }

  getSelectedBusiness(businessUnit) {
    console.log("Selected Business Id : "+JSON.stringify(businessUnit));
    if (businessUnit.checked == true) {
    this.myNewArray.push(businessUnit.businessUnitId);
  }
  else {
    this.myNewArray.splice(this.myNewArray.indexOf(businessUnit.businessUnitId), 1);
  }
  //console.log("this.myNewArray : "+JSON.stringify(this.myNewArray));
  }
}
