import { Component,ViewChild,ElementRef   } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { UserRequestManager } from '../../providers/user-request-manager';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import {confirmCancellationPopupComponent} from './confirmCancellationPopup.component';
import { AlertComponent } from '../common/alert.component';
import { SpinnerService } from '../common/spinner.service';
import { VALIDATIONERROR, COMMONTEXT, MYTRACKORDERPAGEALERTMSGS } from 'app/app.constants';
@Component({
    selector: 'mytrackorder',
    template: require('./mytrackorder.component.html')
  })
  export class MyTrackOrderComponent  {
    p: number = 1;
    public perpage:number = 2;
    public userData:any;
    public mytrackorderhistorylist:any=[];
    public cancelordermsg:any=[];
    public totalrecord;
    public resultsFound;
    public alldata;
    public loading;
    public currentPage;
    public latitude;
    public longitude;
    public progressBarVal:any;
    public alertMsg: any;
    public norecord: any=null;
    positions = [];
    public center;
    public position;

    @ViewChild('myModal') myModal;

    constructor(
      public localStorage:LocalStorageService,
      public userRequestManager:UserRequestManager,
      private dialogService:DialogService,
      public spinnerService: SpinnerService
    ) {
        this.alertMsg = MYTRACKORDERPAGEALERTMSGS;
        this.getMyDineHistory('0')
     }
     getMyDineHistory(pageNumber)
     {
      this.p = pageNumber;
      this.userData = this.localStorage.get('userData');
      console.log('userData', this.userData.token);
      if( this.userData.token != '')
      {

         if(this.alldata == null)
         {
            return new Promise(resolve => {
                this.userRequestManager.set('getMyTrackOrderHistoryList',{token:this.userData.token})
              .then(mydinehistorydata => {
                //this.allMerchantData = Searchdata;
                this.alldata  = JSON.parse(JSON.stringify(mydinehistorydata));
                if(this.alldata.status == 1){
                  if( this.alldata.data != null && this.alldata.data.length != 0){
                    this.mytrackorderhistorylist=this.alldata.data;
                    console.log('mytrackorderhistorylist'+this.mytrackorderhistorylist);
                  }
                  else  {
                    this.norecord = true;
                  }
                }
                if(this.alldata.status === 0) {
                  this.showAlert(this.alertMsg.MYTRACKORDER_REQUEST_FAILED, this.alldata.msg);
                }
              },error => {
                // Take action
                this.spinnerService.hide('homePageSpinner');
                this.showAlert(this.alertMsg.MYTRACKORDER_REQUEST_FAILED,error + "\n" + this.alertMsg.MYTRACKORDER_REQUEST_FAILED_MSG);
              })
          })
        }
      }
     }
     /*dyanmic display progress bar */
     dyanmicProgressBar(orderstatus: string)
     {
        switch (orderstatus) {
          case "OD_Confirmed": return "progress-bar progress-bar-success progress-pt-1";
          case "OD_Preparation": return "progress-bar progress-bar-success progress-pt-33";
          case "OD_Delivery_Started": return "progress-bar progress-bar-success progress-pt-66";
          case "OD_Delivered": return "progress-bar progress-bar-success progress-pt-100";
          case "OT_Confirmed": return "progress-bar progress-bar-success progress-pt-1";
          case "OT_Preparation": return "progress-bar progress-bar-success progress-pt-33";
          case "OT_Awaiting_Pickup": return "progress-bar progress-bar-success progress-pt-66";
          case "OT_Pickedup": return "progress-bar progress-bar-success progress-pt-100";
          case "R_Pending": return "progress-bar progress-bar-success progress-pt-1";
          case "R_Confirmed": return "progress-bar progress-bar-success progress-pt-33";
          case "R_TableReserved": return "progress-bar progress-bar-success progress-pt-66";
          case "R_Completed": return "progress-bar progress-bar-success progress-pt-100";
          default :  return "progress-bar progress-bar-success progress-pt-1";
        }
     }
     /*Function for changing the serach result based on the pagination click*/
    getPage(event) {
      console.log('event',event);
      this.loading = true;
      this.currentPage = event;
      this.getMyDineHistory(event);
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
      this.center = (this.longitude + ', '+this.latitude) +""
      this.position = (this.longitude + ', '+this.latitude) +""
      console.log("this.latitude : "+this.latitude + "  "+ "  this.longitude "+  this.longitude);
      //this.myModal.nativeElement.className = 'modal fade show';
    }
    setPerPageValue($event, value)
    {
      this.perpage= value;
    }
    cancelOrder(orderNo,merchantid,ordettype)
    {
      let date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var seconds = date.getSeconds();
      let  cancelTime = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
      if(orderNo != '' && merchantid != '' && ordettype != '')
      {

          return new Promise(resolve => {
              this.userRequestManager.set('CancelOrder',{'orderNo':orderNo,'merchantid':merchantid,'orderType':ordettype,'cancelTime':cancelTime})
            .then(cancelorderdata => {
              //this.allMerchantData = Searchdata;
              this.alldata  = JSON.parse(JSON.stringify(cancelorderdata));
              if(this.alldata.status == 1){
                  //this.cancelordermsg=this.alldata.data;
                  console.log('CancelOrder'+this.alldata.msg);
                  this.showConfirm(this.alldata.msg);
              }
            }).catch()
        })
      }
    }
 showConfirm(mesg) {
    let disposable = this.dialogService.addDialog(confirmCancellationPopupComponent, {
        title:'Cancellation Confirmation',
        message:mesg})
        .subscribe((isConfirmed)=>{
            //We get dialog result

          /*   if(isConfirmed) {
                alert('accepted'+isConfirmed);
            }
            else {
                alert('declined');
            } */
            this.alldata =  null;
            this.getMyDineHistory('0')
        });

}
showAlert(title,msg) {
  this.dialogService.addDialog(AlertComponent, {title:title, message:msg});
}

phase1(code: string)
{
  console.log(code);

  if(code == "OD_Confirmed" || code == "OT_Confirmed" || code == "R_Pending" || code == "OD_Preparation" || code == "OT_Preparation" || code == "R_Confirmed" || code == "OD_Delivery_Started" || code == "OT_Awaiting_Pickup" || code == "R_TableReserved" || code == "OD_Delivered" || code == "OT_Pickedup" || code == "R_Completed")
  {
    return true;
  }
  return false;
}

phase2(code: string)
{
  console.log(code);
  if(code == "OD_Preparation" || code == "OT_Preparation" || code == "R_Confirmed" || code == "OD_Delivery_Started" || code == "OT_Awaiting_Pickup" || code == "R_TableReserved" || code == "OD_Delivered" || code == "OT_Pickedup" || code == "R_Completed")
  {
    return true;
  }
  return false;
}

phase3(code: string)
{
  console.log(code);
  if(code == "OD_Delivery_Started" || code == "OT_Awaiting_Pickup" || code == "R_TableReserved" || code == "OD_Delivered" || code == "OT_Pickedup" || code == "R_Completed")
  {
    return true;
  }
  return false;
}

phase4(code: string)
{
  console.log(code);
  if(code == "OD_Delivered" || code == "OT_Pickedup" || code == "R_Completed")
  {
    return true;
  }
  return false;
}

} 
