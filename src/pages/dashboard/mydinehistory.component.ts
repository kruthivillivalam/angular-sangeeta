import { Component,ViewChild,ElementRef   } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { UserRequestManager } from '../../providers/user-request-manager';
import { DialogService } from "ng2-bootstrap-modal";
import { AlertComponent } from '../common/alert.component';
import { SpinnerService } from '../common/spinner.service';
import { VALIDATIONERROR, COMMONTEXT, MYDINEORDERHISTORYPAGEALERTMSGS } from 'app/app.constants';
@Component({
  selector: 'mydinehistory',
  template: require('./mydinehistory.component.html'),
})
export class MydinehistoryComponent  {
  p: number = 1;
  public perpage:number = 5;
  public userData:any;
  public mydinehistorylist:any=[];
  public totalrecord;
  public resultsFound;
  public alldata;
  public loading;
  public currentPage;
  public latitude;
  public longitude;
  public alertMsg: any;
  public norecord: any=null;
  public center;
  public position;
  positions = [];
  @ViewChild('myModal') myModal;

  constructor(
    public localStorage:LocalStorageService,
    public userRequestManager:UserRequestManager,
    private dialogService:DialogService,
    public spinnerService: SpinnerService
  ) {
    this.alertMsg = MYDINEORDERHISTORYPAGEALERTMSGS;
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
        //this.userData.type = 'reservation';
        return new Promise(resolve => {
        this.userRequestManager.set('getMyOrderHistoryList',{token:this.userData.token,type:'Dinein'})
        .then(mydinehistorydata => {
          //this.allMerchantData = Searchdata;
          this.alldata  = JSON.parse(JSON.stringify(mydinehistorydata));
          if(this.alldata.status == 1){
            if( this.alldata.data != null && this.alldata.data.length != 0){
              this.mydinehistorylist=this.alldata.data;
              console.log(this.mydinehistorylist);
            }
            else  {
              this.norecord = true;
            }

          }
          else if(this.alldata.status === 0) {
            this.showAlert(this.alertMsg.MYDINEORDERHISTORY_REQUEST_FAILED, this.alldata.msg);
          }
        },error => {
          // Take action
          this.spinnerService.hide('homePageSpinner');
          this.showAlert(this.alertMsg.MYDINEORDERHISTORY_REQUEST_FAILED,error + "\n" + this.alertMsg.MYDINEORDERHISTORY_REQUEST_FAILED_MSG);
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
showAlert(title,msg) {
  this.dialogService.addDialog(AlertComponent, {title:title, message:msg});
}
}
