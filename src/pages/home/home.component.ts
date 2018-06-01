import {OnInit, ViewChild, ViewChildren, Component, QueryList, ElementRef, Injectable} from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import {Router, Event as RouterEvent, NavigationStart, NavigationEnd, NavigationCancel, NavigationError} from '@angular/router'
//providers
import { UserRequestManager } from '../../providers/user-request-manager';
import { SpinnerService } from '../common/spinner.service';


@Component({
  selector: 'app-home',
  template: require('./home.component.html'),
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent  {

  config: Object = {
      nextButton: '.swiper-button-next-1',
      prevButton: '.swiper-button-prev-1',
      spaceBetween: 20,
      // freeMode: true,
      slidesPerView: 4,
      autoplay: 10000,
      loopedSlides:4,
      autoplayDisableOnInteraction: false,
      loop: true,
      breakpoints: {
        1000: {
            slidesPerView: 3,
        },
        768: {
            slidesPerView: 2,
        },
        480: {
            slidesPerView: 1
        }
    }
  };

  configLast: Object = {
      nextButton: '.swiper-button-next-3',
      prevButton: '.swiper-button-prev-3',
      spaceBetween: 20,
      freeMode: true,
      slidesPerView: 4,
      autoplay: 1000,
      loopedSlides:4,
      autoplayDisableOnInteraction: false,
      loop: true,
      // onInit:'onSwiperInit',
      breakpoints: {
        1000: {
            slidesPerView: 3,
        },
        768: {
            slidesPerView: 2,
        },
        480: {
            slidesPerView: 1
        }
    }
  };

  configMiddle: Object = {
      nextButton: '.swiper-button-next-2',
      prevButton: '.swiper-button-prev-2',
      spaceBetween: 20,
      // freeMode: true,
      slidesPerView: 1,
      // autoplay: 1000,
      loopedSlides:1,
      // autoplayDisableOnInteraction: false,
      loop: true,
  };
  public serachData:any;
  public CuisineData:any;
  busy: Promise<any>;
  public mostPopularData:any;
  public featuredRestaurantData:any =[];
  public heighty:any=[];
  public tempArray:any = [];
  //private things: number[][];
  public allapidata:any;
  //public pngImage = ".png";
  public imageURL = "https://adminstaging.azurewebsites.net/uploadedimages/RestaurantLogo/";

  public featuredImageUrl = "https://adminstaging.azurewebsites.net/uploadedimages/MerchantGeneralSetting/"



  constructor(
    public userRequestManager :UserRequestManager,
    public localStorage:LocalStorageService,
    public spinnerService: SpinnerService,
    public router : Router,
  ) {
  }

ngOnInit () {
  if(this.localStorage.get('getallapidata') != null)
    {
      this.allapidata = JSON.parse(JSON.stringify(this.localStorage.get('getallapidata')));
      console.log(this.allapidata);
      //console.log(this.localStorage.get('getallapidata'));
      //this.busy = this.getCuisineData();
      this.getMostPopularLocality();
      this.getFeaturedRestaurants();
    }
    else
    {
      return new Promise(resolve => {
        this.userRequestManager.get('getAllData')
        .then(data=>{
          this.allapidata = JSON.parse(JSON.stringify(data));
          this.localStorage.set('getallapidata',this.allapidata);
          //console.log("aaaa=>"+ JSON.stringify(this.localStorage.get('allapidata')['getBusinessUnit']));
          //this.busy = this.getCuisineData();
          this.getMostPopularLocality();
          this.getFeaturedRestaurants();
        })
      });
    }

  }
  onSwiperInit(){
    //console.log('scjdhbc');
  }
  // /*Function for getting cuisin data from API*/
  /*getCuisineData(){
  //debugger;
    this.allapidata = JSON.parse(JSON.stringify(this.localStorage.get('getallapidata')));
     if(this.allapidata.data.getCuisineData !== undefined && this.allapidata.data.getCuisineData[0].status == 1) {
      this.CuisineData=this.allapidata.data.getCuisineData[0].data;
      //console.log('this.CuisineData',this.CuisineData);
    }
    return new Promise(resolve => {  this.CuisineData})
  }*/

  getResListOnImgClick(item) {
    this.serachData = {
      'businessUnits':[],
      'orderFood':'',
      'cusionFood':item.cuisineId,
      'locations':'',
    }
    console.log("item : "+JSON.stringify(item));
    this.localStorage.set('serachData',this.serachData);
    if(this.serachData) {
      this.router.navigate(['fake']);
    }
  }

  /*Function for getting Most popular locality from API*/
  getMostPopularLocality(){
    this.allapidata = JSON.parse(JSON.stringify(this.localStorage.get('getallapidata')));
    if(this.allapidata.data.getPopularRestaurantsByLocality[0].status == 1) {
	  this.mostPopularData=this.allapidata.data.getPopularRestaurantsByLocality[0].data;
	  let mainCounter = 0;
	  let totalSlides = 4;
	  let counterArray = 0;
	  this.tempArray[counterArray] = [];
	  for(let i = 0; i < this.mostPopularData.length; ++i) {
		if(mainCounter == totalSlides) {
		  mainCounter = 0;
		  counterArray++;
		  this.tempArray[counterArray] = [];
		  this.tempArray[counterArray].push(this.mostPopularData[i]);
      //console.log("this.tempArray :"+JSON.stringify(this.tempArray));
		} else {
		  this.tempArray[counterArray].push(this.mostPopularData[i]);
      //console.log("this.tempArray :"+JSON.stringify(this.tempArray));
		}
		  mainCounter++;
	  }	  
  }
    console.log(this.tempArray);
  }

  /*Function for getting featured restaurants from API*/
  getFeaturedRestaurants(){
  this.allapidata = JSON.parse(JSON.stringify(this.localStorage.get('getallapidata')));
    if(this.allapidata.data.getFeaturedRestaurants[0].status == 1) {
    var featuredRestaurantData=this.allapidata.data.getFeaturedRestaurants[0].data;
    featuredRestaurantData.forEach(data => {

      var feturedData  = {
        'imageUrl': this.featuredImageUrl + data.featureItemImageUrl,
        'MerchantName': data.MerchantName,
        'cuisineNames': data.cuisineNames,
        'id': data.merchantId
      }
      this.featuredRestaurantData.push(feturedData)
    });

    var tempArray: any = [];
    var rowArray: any = [];
    var count = 0;
    for(let restaurant of this.featuredRestaurantData){
        if(count == 6){
          count = 0;
          tempArray.push(rowArray);
          rowArray = [];
        }
        rowArray.push(restaurant);
        count++;
    }

    this.featuredRestaurantData = tempArray;

    console.log("RES DATA : "+JSON.stringify(this.featuredRestaurantData))
    //this.featuredRestaurantData.imageUrl = this.imageURL + this.allapidata.data.getFeaturedRestaurants[0].data.imageUrl;
      //console.log('this.featuredRestaurantData',this.featuredRestaurantData);
    }
  }
}
