import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { UserRequestManager } from '../../providers/user-request-manager';
import { DialogService } from "ng2-bootstrap-modal";
import { AlertComponent } from '../common/alert.component';
import { SpinnerService } from '../common/spinner.service';
import { VALIDATIONERROR, COMMONTEXT, MYREVIEWSPAGEALERTMSGS } from 'app/app.constants';
@Component({
  selector: 'myreviews',
  template: require('./myreviews.component.html')
})
export class MyReviewsComponent  {
  p: number = 1;
  public perpage:number = 10;
  public userData:any;
  public reviewlist:any=[];
  public totalrecord;
  public resultsFound;
  public alldata;
  public loading;
  public currentPage;
  public norecord: any=null;
  public latitude;
  public longitude;
  public showMessage;
  public alertMsg: any;
  public resInfo;
  public mapView;
  public center;
  public position;
  constructor(
    public localStorage:LocalStorageService,
    public userRequestManager:UserRequestManager,
    private dialogService:DialogService,
    public spinnerService: SpinnerService
  ) {
    this.alertMsg = MYREVIEWSPAGEALERTMSGS;
    this.getReviews('0');
    this.getViews
  }
  setPerPageValue($event, value)
  {
    this.perpage= value;
  }
  onMapReady(map) {
    console.log("this.latitude : "+this.latitude + "  "+ "  this.longitude "+  this.longitude);
    console.log('map', map);
    console.log('markers', map.markers);  // to get all markers as an array
  }
  openModel(lat,long)
  {
    this.latitude = lat;
    this.longitude = long;
    this.center = (this.longitude + ', '+this.latitude) +""
    this.position = (this.longitude + ', '+this.latitude) +""
    //this.myModal.nativeElement.className = 'modal fade show';
  }
  getReviews(pageNumber)
  {
    this.p = pageNumber;
    this.userData = this.localStorage.get('userData');
    if( this.userData.token != '')
    {
      console.log('this.alldata', this.alldata);
      if(this.alldata == null){
        return new Promise(resolve => {
          this.userRequestManager.set('getMyReviewsList',{token:this.userData.token})
          .then(myreviewsdata => {
            this.alldata  = JSON.parse(JSON.stringify(myreviewsdata));
            if(this.alldata.status == 1){
              if( this.alldata.data != null && this.alldata.data.length != 0){
                this.reviewlist=this.alldata.data;
              }
              else  {
                this.norecord = true;
              }
            }
            if(this.alldata.status === 0) {
              this.showAlert(this.alertMsg.MYREVIEWS_REQUEST_FAILED, this.alldata.msg);
            }
          },error => {
            // Take action
            this.spinnerService.hide('homePageSpinner');
            this.showAlert(this.alertMsg.MYREVIEWS_REQUEST_FAILED,error + "\n" + this.alertMsg.MYREVIEWS_REQUEST_FAILED_MSG);
          })/* .catch(err => {
            console.log('Error callback', err); // This will NOT be called
            this.showMessage = 'Error while loading data.Please try this later.';
            this.norecord = true;
          }) */
        })
      }
    }
  }
  /*Function for changing the serach result based on the pagination click*/
  getPage(event) {
    console.log('event',event);
    this.loading = true;
    this.currentPage = event;
    this.getReviews(event);
  }
  showAlert(title,msg) {
    this.dialogService.addDialog(AlertComponent, {title:title, message:msg});
  }

  getViews() {
       if (this.resInfo !== true) {
         this.resInfo = true;
         console.log("Info");
       }
         else {
           console.log("Map");
           this.mapView = true
         }
     }
}
