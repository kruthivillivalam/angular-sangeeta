import { Component,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { UserRequestManager } from '../../providers/user-request-manager';
import { DialogService } from "ng2-bootstrap-modal";
import { AlertComponent } from '../common/alert.component';
import { SpinnerService } from '../common/spinner.service';
import { VALIDATIONERROR, COMMONTEXT, MYONLINEORDERHISTORYPAGEALERTMSGS } from 'app/app.constants';

@Component({
    selector: 'myonlineorderhistory',
    template: require('./myonlineorderhistory.component.html')
  })
  export class MyOnlineOrderHistoryComponent  {
    p: number = 1;
    public perpage:number = 5;
    public userData:any;
    public myonlineorderhistorylist:any=[];
    public totalrecord;
    public resultsFound;
    public alertMsg: any;
    public alldata;
    public loading;
    public currentPage;
    public latitude;
    public longitude;
    public norecord;
    positions = [];
    @ViewChild('myModal') myModal;

    constructor(
      public localStorage:LocalStorageService,
      public userRequestManager:UserRequestManager,
      private dialogService:DialogService,
      public spinnerService: SpinnerService 
    ) {
      this.alertMsg = MYONLINEORDERHISTORYPAGEALERTMSGS;
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
                this.userRequestManager.set('getMyOrderHistoryList',{token:this.userData.token,type:'deliverytakeaway'})
              .then(myonlineorderhistorydata => {
                //this.allMerchantData = Searchdata;
                this.alldata  = JSON.parse(JSON.stringify(myonlineorderhistorydata));
                if(this.alldata.status == 1){
                  if( this.alldata.data != null && this.alldata.data.length != 0){                  
                    this.myonlineorderhistorylist=this.alldata.data;
                    console.log(this.myonlineorderhistorylist);
                  }
                  else  {
                    this.norecord = true;
                  }                  
                }
                if(this.alldata.status === 0) {
                  this.showAlert(this.alertMsg.MYONLINEORDERHISTORY_REQUEST_FAILED, this.alldata.msg);
                }  
              },error => {
                // Take action
                this.spinnerService.hide('homePageSpinner');
                this.showAlert(this.alertMsg.MYONLINEORDERHISTORY_REQUEST_FAILED,error + "\n" + this.alertMsg.MYONLINEORDERHISTORY_REQUEST_FAILED_MSG);
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