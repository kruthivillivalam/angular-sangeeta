import {Component, OnInit, ViewChild, ChangeDetectionStrategy,ChangeDetectorRef, Input, Renderer} from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import {
    Router,
    // import as RouterEvent to avoid confusion with the DOM Event
    Event as RouterEvent,
    NavigationStart,
    NavigationEnd,
    NavigationCancel,
    NavigationError,
} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/delay';
import { TreeComponent, TreeModel, TreeNode } from 'angular-tree-component';

import { DirectionsRenderer } from '@ngui/map';
//constants
import { PERPAGE } from '../../app/app.constants';

//providers
import { UserRequestManager } from '../../providers/user-request-manager';
// import { IsLogin } from '../../providers/is-login';
import { 
   filterService 
} from '../common/filter.service'; 
import { SpinnerService } from '../../pages/common/spinner.service';
@Component({
  selector: 'restaurant',
  template: require('./restaurant.component.html'),
  styles: [`
    .block {
      overflow: hidden;
      -webkit-transition: height .5s;
      transition: height .5s;
    }
  `],
  providers : [filterService] 
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class RestaurantComponent implements OnInit {
  public someRange3:any;
  // @Input('data') meals: string[] = [];
  // asyncMeals: Observable<string[]>;
  
  p: number = 1;
  public perpage:number = 10;
  total: number;
  public currentPage:any;
  // total: number;
  loading: boolean;
  public height = 0;
  public heightF = 0;
  public sideFilterData:any=[];
  public someRange3config:any = {
     start: [0],
     step: 1,
     range: {
      min: 0,
      max: 1000
    }
  }
  direction: any = {
    origin: '',
    destination: '',
    travelMode: 'DRIVING'
  };
  public startprice: number = 0;
  public endprice: number;
  public allFilters:any =[];
  public alreadySearchedData:any=[];
  public allSearchData:any=[];
  public sliderVal:any;
  public cusionData:any=[];
  public allMerchantData:any=[];
  public mealTypes:any=[];
  //public serviceTypes:any=[];
  public serviceArea:any=[];  
  public parkingTypes:any=[];
  public merchantFeatures:any=[];
  public seatingLocation:any=[];
  public alcoholType:any=[];
  public postcodeSearch:any=[];
  public suburblocation:any;
  public postalcodeKm:any;
  public postcodeData:any;
  private isSearchData:any;
  private isRecordFound:any;
  public locationDataForSide:any=[];
  public nodes:any = [];
  public tempArray:any = [];
  @ViewChild('sliderRef') sliderRef;
  @ViewChild('tree') treeComponent: TreeComponent;
  public isMapViewFlag:boolean;
  public positions:any=[];
  public centerLocation:any;
  public marker:any = [];
  public originmarker:any = [];
  public zoomlevel :any;
  @ViewChild(DirectionsRenderer) directionsRendererDirective: DirectionsRenderer;
  directionsRenderer: google.maps.DirectionsRenderer;
  directionsResult: google.maps.DirectionsResult;
  constructor(
    public localStorage:LocalStorageService,
    public userRequestManager:UserRequestManager,
    public router : Router,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer,
    public filterObject: filterService,
    public spinnerService: SpinnerService,
  ) {
    console.log('inside restaurant listing constructor');

    if(this.localStorage.get('serachData') != null || this.localStorage.get('serachData') != undefined) {
      this.alreadySearchedData = this.localStorage.get('serachData');
    }
    this.postcodeSearch.postalcodeKm = '5';
	 this.zoomlevel=13;
  }

  ngOnInit() {
	console.log('filterObject',this.filterObject.getApp()); 
    this.localStorage.set('childheader',true);
    console.log('this.alreadySearchedData',this.alreadySearchedData);
	/*this.directionsRendererDirective['initialized$'].subscribe( directionsRenderer => {
      this.directionsRenderer = directionsRenderer;
    });*/
    this.isRecordFound=false;
    if(this.localStorage.get('sliderval') != null || this.localStorage.get('sliderval') != undefined) {
      this.someRange3 = this.localStorage.get('sliderval');
      console.log('sliderVal',this.sliderVal);
    }
   // this.filterObject.setSideMenu();
//console.log('allFilters', this.localStorage.get('allFilters'));
    //this.filterObject.setSideMenu();
    //this.allFilters = this.localStorage.set('childheader',true);
   // if(this.localStorage.get('allFilters') !== null) this.allFilters = this.localStorage.get('allFilters');
    this.setSideMenu();
    this.getPage(1);
    // this.getStateSuburbByMerchant();
    this.getExtraFilters('', '') ;


  }

  ngAfterViewInit(){
    console.log('ngAfterViewInit restaurant');

    console.log('nodesnodes',this.nodes);
    console.log('this.locationDataForSide',this.locationDataForSide);
    // const treeModel:TreeModel = this.treeComponent.treeModel;
    // const firstNode:TreeNode = treeModel.getFirstRoot();
    //
    // firstNode.setActiveAndVisible();
    // this.getAllRestaurant(this.alreadySearchedData,1);
  }


   /*Function for getting side menu from API*/
   setSideMenu(): Promise<any> {
    return new Promise(resolve => {
      this.userRequestManager.get('getSearchAdditionalFilters')
      .then(data => {
        var alldata  = JSON.parse(JSON.stringify(data));
        if(alldata.status == 1){
          this.allFilters = alldata.data.params;
          this.allFilters.Alcohol_Type = this.addChecked(this.allFilters.Alcohol_Type,'alcoholType','Alcohol_Type');
          this.allFilters.Meal_Type = this.addChecked(this.allFilters.Meal_Type,'mealTypes','Meal_Type');
          this.allFilters.Merchant_Features = this.addChecked(this.allFilters.Merchant_Features,'merchantFeatures','Merchant_Features');
          this.allFilters.Parking_Type = this.addChecked(this.allFilters.Parking_Type,'parkingTypes','Parking_Type');
          this.allFilters.Seating_Location = this.addChecked(this.allFilters.Seating_Location,'seatingLocation','Seating_Location');
          /*this.allFilters.Service_Type = this.addChecked(this.allFilters.Service_Type,'serviceTypes','Service_Type');*/
          this.allFilters.Service_Area = this.addChecked(this.allFilters.Service_Area,'serviceArea','Service_Area');
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
  /*Function for getting Search result from API*/
  getAllRestaurant(filters:any,pageNumber) {
    this.isMapViewFlag = false;
    const perPage = PERPAGE;
    const start = (pageNumber - 1) * parseInt(perPage);
    const end = start + perPage;

    if(filters.cusionFood != '')
      this.cusionData.push(filters.cusionFood);
    this.cusionData = this.cusionData.filter(function(n){ return n != undefined });

    if(this.cusionData.length > 0) {
      this.cusionData.push(parseInt(this.cusionData));
    }

    let finalData = {};
    let servicesArr = [];
    let isServices = false;

    finalData = {
      // 'businessUnitId':filters.businessUnits,
      // 'businessUnitId':null,
      // 'serviceId':null,
      // 'cuisineId':this.cusionData,
      // 'cuisineId':null,
      // 'mealTypeId':null,
      // 'suburb':filters.locations.suburb,
      // 'postcode':null,
      // 'radius':0,
      // 'mincft':0,
      // 'maxcft':this.someRange3,
      'pagesize':this.perpage,
      'pageno':pageNumber
    }
    this.suburblocation = '';
    if(filters.locations != undefined) {
      finalData['suburb'] = filters.locations.suburb;
      this.suburblocation = filters.locations.suburb;
     } else {
      delete finalData['suburb'];
    }
    if(filters.postcode != undefined) {
      finalData['postcode'] = filters.postcode;
    } else {
      delete finalData['postcode'];
    }
    if(filters.postDistance != undefined) {
      finalData['radius'] = parseInt(filters.postDistance);
    }
    if(this.someRange3 != undefined) {
      finalData['mincft'] = 0;
      finalData['maxcft'] = this.someRange3;
    }

    if(this.localStorage.get('mealTypes') != undefined) {
 //     console.log('this.mealTypes',this.mealTypes.length);
      finalData['mealTypeId'] = this.localStorage.get('mealTypes').toString();
    } else {
    //  console.log('this.mealTypes ELSE',this.mealTypes);
      delete finalData['mealTypeId'];
    }

   // console.log('this.localStorage.get(sideFilterData)',this.localStorage.get('sideFilterData'));

    if(this.localStorage.get('sideFilterData') != undefined || this.localStorage.get('sideFilterData') != null) {
      var sideData = [];
       sideData = this.localStorage.get('sideFilterData');

      sideData = sideData.filter(function(n){ return n != undefined });

      isServices = true;
      finalData['serviceId']  = sideData.toString()
    }

    //console.log('isServices',isServices);

    if(!isServices) {
      delete finalData['serviceId'];
    }

    //console.log('this.cusionData in ssssss',this.cusionData);

    if(this.cusionData != undefined) {
      if(this.cusionData.length > 0) {
        finalData['cuisineId'] = this.cusionData.toString();
      } else {
        delete finalData['cuisineId'];
      }
    } else {
      delete finalData['cuisineId'];
    }

    if(filters.businessUnits != undefined) {
      if(filters.businessUnits.length > 0) {
        finalData['businessUnitId'] = filters.businessUnits.toString();
      } else {
        delete finalData['businessUnitId'];
      }
    } else {
      delete finalData['businessUnitId'];
    }

    this.spinnerService.show("homePageSpinner");    
    return new Promise(resolve => {
//      console.log('finalData before post',finalData);
      this.userRequestManager.set('search',finalData)
      .then(Searchdata => {
        this.spinnerService.show("homePageSpinner");
        //this.allMerchantData = Searchdata;
        var alldata  = JSON.parse(JSON.stringify(Searchdata));
        if(alldata.status == 1){
          this.isSearchData = true;
          this.allSearchData  = alldata.data;
          this.allMerchantData  = alldata.data.merchants;
          this.total = alldata.data.resultsFound;
          this.p = pageNumber;
          this.loading = false;
        }
        else if(alldata.status == 0){
 //        console.log('i am in else part', this.isSearchData);
           this.isSearchData = false;
           this.isRecordFound=true;
        }
      }).catch(Searchdata => {
 //       console.log('daaata',Searchdata.status);
        this.spinnerService.hide("homePageSpinner");
        this.isSearchData = false;
      })
    })
  }

  /*Function for getting the value of range slider*/
  onChange(value: any) {
    this.sliderVal = value;
    this.localStorage.set('sliderval',this.sliderVal);
    //this.someRange3 = this.localStorage.get('sliderval');
    //this.getAllRestaurant(this.alreadySearchedData,1);
  }

  ngOnDestroy(){
//    console.log('ngOnDestroy')
  }

  /*Function for changing the serach result based on the pagination click*/
  getPage(event) {
//    console.log('event',event);
    this.loading = true;
    this.currentPage = event;
//    console.log('this.alreadySearchedData in getPage',this.alreadySearchedData);
    this.getAllRestaurant(this.alreadySearchedData,event);
  }

  /*Function for collapsible panels in page*/
  scrollDiv(event,id) {
 //   console.log('event',event);
 //   console.log('document.getElementById(id)',document.getElementById(id).offsetHeight);
    if(document.getElementById(id).offsetHeight > 0) {
      event.target.parentNode.classList.remove('show-search-list');
      document.getElementById(id).style.height = '0px';
    } else if(document.getElementById(id).offsetHeight <= 0) {
      this.renderer.setElementClass(event.target.parentNode,"show-search-list",true);
      document.getElementById(id).style.height = (<HTMLInputElement>document.getElementById(id)).scrollHeight + 'px';
    }
  }

  /*Function for getting values of side filters*/
  getExtraFilters(type,event) {

    if(type == 'Meal_Type') {
      if(this.localStorage.get('mealTypes') != undefined || this.localStorage.get('mealTypes') != null) {
        this.mealTypes = this.localStorage.get('mealTypes');
      }
      if(this.mealTypes.indexOf(event.target.value) <= -1) {
        if(event.target.checked) {
          this.mealTypes.push(event.target.value);
        } else {
          this.mealTypes.splice(this.mealTypes.indexOf(event.target.value), 1);
        }
      } else {
        if(!event.target.checked) {
          this.mealTypes.splice(this.mealTypes.indexOf(event.target.value), 1);
        }
      }
      this.localStorage.set('mealTypes',this.mealTypes);
    }
/*     if(type == 'Service_Type') {
      if(this.localStorage.get('serviceTypes') != undefined || this.localStorage.get('serviceTypes') != null) {
        this.serviceTypes = this.localStorage.get('serviceTypes');
      }
      if(this.localStorage.get('sideFilterData') != undefined || this.localStorage.get('sideFilterData') != null) {
        this.sideFilterData = this.localStorage.get('sideFilterData');
      }
      if(this.serviceTypes.indexOf(event.target.value) <= -1) {
        if(event.target.checked) {
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
  //    console.log('this.localStorage.get(serviceTypes)',this.serviceTypes)
      this.localStorage.set('serviceTypes',this.serviceTypes);
      // this.localStorage.set('sideFilterData',this.sideFilterData);
    } */
    if(type == 'Service_Area') {
      if(this.localStorage.get('serviceArea') != undefined || this.localStorage.get('serviceArea') != null) {
        this.serviceArea = this.localStorage.get('serviceArea');
      }
      if(this.localStorage.get('sideFilterData') != undefined || this.localStorage.get('sideFilterData') != null) {
        this.sideFilterData = this.localStorage.get('sideFilterData');
      }
      if(this.serviceArea.indexOf(event.target.value) <= -1) {
        if(event.target.checked) {
          this.serviceArea.push(event.target.value);
          this.sideFilterData.push(event.target.value);
        } else {
          this.serviceArea.splice(this.serviceArea.indexOf(event.target.value), 1);
          this.sideFilterData.splice(this.sideFilterData.indexOf(event.target.value), 1);
        }
      } else {
        if(!event.target.checked) {
          this.serviceArea.splice(this.serviceArea.indexOf(event.target.value), 1);
          this.sideFilterData.splice(this.sideFilterData.indexOf(event.target.value), 1);
        }
      }
  //    console.log('this.localStorage.get(serviceArea)',this.serviceArea)
      this.localStorage.set('serviceArea',this.serviceArea);
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
  //    console.log('this.localStorage.get(parkingTypes)',this.parkingTypes)
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
  //    console.log('this.localStorage.get(merchantFeatures)',this.merchantFeatures)
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
   //   console.log('this.localStorage.get(seatingLocation)',this.seatingLocation)
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
  //    console.log('this.localStorage.get(alcoholType)',this.alcoholType)
      this.localStorage.set('alcoholType',this.alcoholType);
      // this.localStorage.set('sideFilterData',this.sideFilterData);
    }

    this.localStorage.remove("sideFilterData");
    this.sideFilterData = [];
    /*this.localStorage.get('serviceTypes')*/
    this.sideFilterData = this.sideFilterData.concat(this.localStorage.get('serviceArea'),this.localStorage.get('parkingTypes'),this.localStorage.get('merchantFeatures'),this.localStorage.get('seatingLocation'),this.localStorage.get('alcoholType'));
    this.localStorage.set('sideFilterData',this.sideFilterData);
   // console.log('this.sideFilterData',this.sideFilterData);

  }

  /*Function for getting value of postal code.*/
  onSubmit (data) {
    console.log('data',data);
    this.postcodeData = {
      'postcode': data.postalcode,
      'postDistance':data.postalcodeKm
    }
    this.getAllRestaurant(this.postcodeData,1);
    this.someRange3 = 0;
    this.allFilters.Alcohol_Type = [];
    this.allFilters.Meal_Type = [];
    this.allFilters.Merchant_Features = [];
    this.allFilters.Parking_Type = [];
    this.allFilters.Seating_Location = [];
    //this.allFilters.Service_Type = [];
	this.allFilters.Service_Area = [];
 }

  /*Function for getting side menu from API*/
  getStateSuburbByMerchant(tree) {
    return new Promise(resolve => {
      this.userRequestManager.get('getStateSuburbByMerchant/1')
      .then(data => {
        var alldata  = JSON.parse(JSON.stringify(data));
        if(alldata.status == 1){
          for(let i=0; i < alldata.data.length;i++) {
 //           console.log('inside loop',alldata.data[i].stateId);
            this.nodes[i]= {
              'id':"state"+alldata.data[i].stateId,
              'name':alldata.data[i].stateName,
              'subTitle':alldata.data[i].totalrecord,
              'isExpanded': true,
              'children':[]
            }
            for(let j=0;j<alldata.data[i].suburb.length;j++) {
             /* this.nodes[i].children[j] = {
                  'id':"suburb"+alldata.data[i].suburb[j].id,
                  'name':alldata.data[i].suburb[j].name,
                  'subTitle':alldata.data[i].suburb[j].totalrecord,
              };*/
              this.nodes[i].children[j] = {};
              this.nodes[i].children[j]['id'] = "suburb"+alldata.data[i].suburb[j].id;
              this.nodes[i].children[j]['name'] = alldata.data[i].suburb[j].name;
              this.nodes[i].children[j]['subTitle'] = alldata.data[i].suburb[j].totalrecord;
            }
          }
  //        console.log('alldata.data for state and suburb',this.nodes);
         tree.treeModel.update();
        }
      }).catch(Searchdata => {
//        console.log('daaata',Searchdata.status);
        this.nodes = [];
      })
    })
  }

  /*Function for initializing the tree view*/
  onEvent(event) {
    console.log('tree',event);
    this.getStateSuburbByMerchant(event);
  }

  /*Function for again initialising the local storage*/
  getSuburbId(event) {
//    console.log('getSuburbId event',event.node.data.name);
//    console.log('this.alreadySearchedData',this.alreadySearchedData );

    if(event.node.parent.parent != null) {
      var extraSuburb = {};
      extraSuburb = {
        'locations':{
          'suburb':event.node.data.name
        }
      }
//      console.log('getSuburbId event parent',event.node.parent.parent);

      this.localStorage.remove('serachData');
      this.localStorage.set('serachData',extraSuburb);
      this.alreadySearchedData = this.localStorage.get('serachData');
      this.getAllRestaurant(extraSuburb,1);
    }
  }

  /*Function for initiating map view on map view click from html*/
  isMapView (type) {
    if(type == 'map') {
      this.isMapViewFlag = true;
      this.centerLocation = this.alreadySearchedData.locations.suburb;
    } else {
      this.isMapViewFlag = false;
    }
  }

 /*Function for initializing markers on map init*/
  onMapReady(map) {
    this.positions = [];
    var resTitle = '';
    var resAddress = '';
    var latlong = [];
    var lat = 0;
    var lng = 0;
    if(this.allMerchantData.length > 0) {
      for(let i=0;i<this.allMerchantData.length-1;i++) {
        lat = parseFloat(this.allMerchantData[i].address.latitude+ i);
        lng = parseFloat(this.allMerchantData[i].address.longitude + i);




        resAddress = this.allMerchantData[i].address.address1+','+ this.allMerchantData[i].address.address2+','+ this.allMerchantData[i].address.city + ','+
        this.allMerchantData[i].address.suburb+','+ this.allMerchantData[i].address.state+','+ this.allMerchantData[i].address.Postcode+','+ this.allMerchantData[i].address.country;
        resTitle = this.allMerchantData[i].merchantname;
        this.positions[i] ={'latlong': lat+', '+lng,resAddress:resAddress,resTitle:resTitle,'markerno':i};
     }
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

    /*if(this.allMerchantData.length > 0) {
      for(let i=0;i<this.allMerchantData.length;i++) {
        resAddress.push(this.allMerchantData[i].address.address1+','+ this.allMerchantData[i].address.address2+','+ this.allMerchantData[i].address.city + ','+
        this.allMerchantData[i].address.suburb+','+ this.allMerchantData[i].address.state+','+ this.allMerchantData[i].address.Postcode+','+ this.allMerchantData[i].address.country);
        resTitle.push(this.allMerchantData[i].merchantname);
        //infowinid="iw"+i;
        ////alert(i)
        e.nguiMapComponent.openInfoWindow(row, e)
      }
// e.nguiMapComponent.openInfoWindow(row, e)
    this.marker.resTitle = pos.resTitle, this.marker.resAddress = pos.resAddress,this.marker.latlong = pos.latlong, e.nguiMapComponent.openInfoWindow("iw", e)
  }
  directionsChanged() {
   // this.directionsResult = this.directionsRenderer.getDirections();
    this.cdr.detectChanges();
  }

  onGetDirection(event, pos){
    var latlong = [];
    var e = event.target;  
    this.direction.origin='-31.1100, 115.963';
    this.direction.destination=this.marker.latlong;
    //this.origin= '-31.7300,116.1200';
   // this.destination =  this.marker.latlong;
    console.log(this.marker.latlong);
    //this.originmarker.resTitle = 'Current Location', this.originmarker.resAddress = 'Start Position', e.nguiMapComponent.openInfoWindow("iwo", e)
    this.directionsRendererDirective['showDirections'](this.direction);
    this.zoomlevel=13;
    //this.desinationlable = 'B';
    //aaa
    
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
  setPerPageValue($event, value)
  {
    this.perpage= value;
    this.getAllRestaurant(this.alreadySearchedData,1);
  } 
}