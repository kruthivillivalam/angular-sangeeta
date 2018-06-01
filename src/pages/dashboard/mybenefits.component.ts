import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { UserRequestManager } from '../../providers/user-request-manager';
import { DialogService } from "ng2-bootstrap-modal";
import { AlertComponent } from '../common/alert.component';
import { SpinnerService } from '../common/spinner.service';
import { VALIDATIONERROR, COMMONTEXT, MYBENEFITSPAGEALERTMSGS } from 'app/app.constants';

@Component({
  selector: 'mybenefits',
  template: require('./mybenefits.component.html')
})
export class MyBenefitsComponent  {
  p: number = 1;
  public perpage:number = 5;
  public userData:any;
  public loyaltypointcouponlist:any=[];
  public loyaltypointlist:any=[];
  public couponlist:any=[];
  public totalrecord;
  public resultsFound;
  public alldata;
  public loading;
  public currentPage;
  public norecord: any=null;
  public alertMsg: any;
  public center;
  public longitude;
  public latitude;
  public position;

  constructor(
    public localStorage:LocalStorageService,
    public userRequestManager:UserRequestManager,
    private dialogService:DialogService,
    public spinnerService: SpinnerService
  ) {
    this.alertMsg = MYBENEFITSPAGEALERTMSGS;
    this.getMyLoyaltyPointCoupon('0')
  }
  setPerPageValue($event, value)
  {
    this.perpage= value;
  }
  filterStatus($event, value)
  {
    //alert(this.alldata.data.length);
    //this.reservationlist='';
    // console.log(this.reservationlist);
    for(let i =0;i<this.alldata.length;i++)
    {
      if(this.alldata.data[i].status_name == value ) this.loyaltypointcouponlist[i]= this.alldata.data[i];
      console.log(this.loyaltypointcouponlist[i])
      console.log(this.alldata.data[i])
    }
    console.log(this.loyaltypointcouponlist);
  }

  onMapReady(map) {
    console.log('markers', map.markers);  // to get all markers as an array
  }

  openModel(lat,long)
  {
    //console.log(JSON.stringify(this.reviewlist));+
    this.latitude = lat;
    this.longitude = long;
    this.center = (this.longitude + ', '+this.latitude) +""
    this.position = (this.longitude + ', '+this.latitude) +""
    console.log("this.latitude : "+this.latitude + "  "+ "  this.longitude "+  this.longitude);
    //this.myModal.nativeElement.className = 'modal fade show';
  }


  getMyLoyaltyPointCoupon(pageNumber)
  {
    this.p = pageNumber;
    this.userData = this.localStorage.get('userData');
    console.log('userData', this.userData.token);
    if( this.userData.token != '')
    {
      if(this.alldata == null)
      {
        return new Promise(resolve => {
          this.userRequestManager.set('getMyLoyaltyPointCouponList',{token:this.userData.token})
          .then(myloyaltypointcoupondata => {
            //this.allMerchantData = Searchdata;
            this.alldata  = JSON.parse(JSON.stringify(myloyaltypointcoupondata));
            if(this.alldata.status == 1){
              this.loyaltypointcouponlist=this.alldata.data;
              if( this.loyaltypointcouponlist)
              {
                this.loyaltypointlist= this.loyaltypointcouponlist.LoyaltyPoint;
                this.couponlist= this.loyaltypointcouponlist.CouponDetails;
              }
              else  {
                this.norecord = true;
              }
            }
            if(this.alldata.status === 0) {
              this.showAlert(this.alertMsg.MYBENEFITS_REQUEST_FAILED, this.alldata.msg);
            }
          },error => {
            // Take action
            this.spinnerService.hide('homePageSpinner');
            this.showAlert(this.alertMsg.MYBENEFITS_REQUEST_FAILED,error + "\n" + this.alertMsg.MYBENEFITS_REQUEST_FAILED_MSG);
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
    this.getMyLoyaltyPointCoupon(event);
  }
  showAlert(title,msg) {
    this.dialogService.addDialog(AlertComponent, {title:title, message:msg});
  }
}
