import { Component,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { UserRequestManager } from '../../providers/user-request-manager';
import { DialogService } from "ng2-bootstrap-modal";
import { AlertComponent } from '../common/alert.component';
import { SpinnerService } from '../common/spinner.service';
import { VALIDATIONERROR, COMMONTEXT, MYFAVOURITESPAGEALERTMSGS } from 'app/app.constants';

@Component({
    selector: 'myfavourites',
    template: require('./myfavourites.component.html')
  })
  export class MyFavouritesComponent
  {
    p: number = 1;
    public perpage:number = 5;
    public userData:any;
    public myfavouriteslist:any=[];
    public totalrecord;
    public resultsFound;
    public alldata;
    public loading;
    public currentPage;
    public latitude;
    public longitude;
    public alertMsg: any;
    positions = [];
    @ViewChild('myModal') myModal;
    config: Object = {
      nextButton: '.swiper-button-next-1',
      prevButton: '.swiper-button-prev-1',
      spaceBetween: 20,
      // freeMode: true,
      slidesPerView: 4,
      autoplay: 1000,
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
    nextButton: '.swiper-button-next',
    prevButton: '.swiper-button-prev',
    spaceBetween: 20,
    freeMode: false,
    slidesPerView: 3,
    //autoplay: 1000,
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

    constructor(
      public localStorage:LocalStorageService,
      public userRequestManager:UserRequestManager,
      private dialogService:DialogService,
      public spinnerService: SpinnerService 
    ) {
        this.alertMsg = MYFAVOURITESPAGEALERTMSGS;
        this.getMyOnlineOrderHistory('0')
     }
     getMyOnlineOrderHistory(pageNumber)
     {
      this.p = pageNumber;
      this.userData = this.localStorage.get('userData');
      console.log('userData', this.userData.token);
      if( this.userData.token != '')
      {
         
         if(this.alldata == null)
         { 
          //this.userData.type = 'deliverytakeaway';
            return new Promise(resolve => {
                this.userRequestManager.set('getMyFavouritesList',{token:this.userData.token})
              .then(myonlineorderhistorydata => {
                //this.allMerchantData = Searchdata;
                this.alldata  = JSON.parse(JSON.stringify(myonlineorderhistorydata));
                if(this.alldata.status == 1){
                    this.myfavouriteslist=this.alldata.data;
                    console.log(this.myfavouriteslist);
                }
                else if(this.alldata.status === 0) {
                  this.showAlert(this.alertMsg.MYFAVOURITES_REQUEST_FAILED, this.alldata.msg);
                }  
              },error => {
                // Take action
                this.spinnerService.hide('homePageSpinner');
                this.showAlert(this.alertMsg.MYFAVOURITES_REQUEST_FAILED,error + "\n" + this.alertMsg.MYFAVOURITES_REQUEST_FAILED_MSG);
              })
          })
        }
      }
     }
           /*Function for changing the serach result based on the pagination click*/
  getPage(event) {
    console.log('event',event);
    this.loading = true;
    this.currentPage = event;
    this.getMyOnlineOrderHistory(event);
  }
  onMapReady(map) {
    //alert('hi');
    console.log('map', map);
    console.log('markers', map.markers);  // to get all markers as an array 
  }
  openModel(lat,long)
  {
    //alert(lat+long);
    this.latitude = lat;
    this.longitude = long;
    //this.myModal.nativeElement.className = 'modal fade show';
  }
  setPerPageValue($event, value)
  {
    this.perpage= value;
  }
  showAlert(title,msg) {
    this.dialogService.addDialog(AlertComponent, {title:title, message:msg});
  }   
  } 