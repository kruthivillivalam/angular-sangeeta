import { Component, ViewChild, ElementRef, ViewChildren } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';

import { Router } from '@angular/router';
import { UserRequestManager } from '../../providers/user-request-manager';
import { DialogService } from "ng2-bootstrap-modal";
import { AlertComponent } from '../common/alert.component';
import { SpinnerService } from '../common/spinner.service';
import { VALIDATIONERROR, COMMONTEXT, MYRESERVATIONPAGEALERTMSGS } from 'app/app.constants';

declare var $: any;

@Component({
  selector: 'myreservation',
  template: require('./myreservation.component.html'),
})
export class MyreservationComponent {
  @ViewChildren('viewLinks') viewMores;
  p: number = 1;
  public perpage: number = 5;
  public userData: any;
  public reservationlist: any = [];
  public totalrecord;
  public resultsFound;
  public alldata;
  public loading;
  public currentPage;
  public latitude;
  public longitude;
  public alertMsg: any;
  public norecord: any = null;
  public center;
  public position;

  constructor(
    public localStorage: LocalStorageService,
    public userRequestManager: UserRequestManager,
    private dialogService: DialogService,
    public spinnerService: SpinnerService
  ) {
    this.alertMsg = MYRESERVATIONPAGEALERTMSGS;
    this.getMyrservation('0')
  }

  ngOnInit() {
    $('[data-toggle="popover"]').popover();
}


  setPerPageValue($event, value) {
    this.perpage = value;
  }
  filterStatus($event, value) {
    //alert(this.alldata.data.length);
    //this.reservationlist='';
    // console.log(this.reservationlist);
    for (let i = 0; i < this.alldata.length; i++) {
      if (this.alldata.data[i].status_name == value) this.reservationlist[i] = this.alldata.data[i];
      console.log(this.reservationlist[i])
      console.log(this.alldata.data[i])
    }
    console.log(this.reservationlist);
  }
  getMyrservation(pageNumber) {
    this.p = pageNumber;
    this.userData = this.localStorage.get('userData');
    console.log('userData', this.userData.token);
    if (this.userData.token != '') {
      if (this.alldata == null) {
        return new Promise(resolve => {
          this.userRequestManager.set('getMyReservationList', { token: this.userData.token })
            .then(myreservationdata => {
              //this.allMerchantData = Searchdata;
              this.alldata = JSON.parse(JSON.stringify(myreservationdata));
              if (this.alldata.status == 1) {
                if (this.alldata.data != null && this.alldata.data.length != 0) {
                  this.reservationlist = this.alldata.data;
                  console.log('this.reservationlist', this.reservationlist);
                }
                else {
                  this.norecord = true;
                }
              }
              else if (this.alldata.status === 0) {
                this.showAlert(this.alertMsg.MYRESERVATION_REQUEST_FAILED, this.alldata.msg);
              }
            }, error => {
              // Take action
              this.spinnerService.hide('homePageSpinner');
              this.showAlert(this.alertMsg.MYRESERVATION_REQUEST_FAILED, error + "\n" + this.alertMsg.MYRESERVATION_REQUEST_FAILED_MSG);
            })
        })
      }
    }
  }
  /*Function for changing the serach result based on the pagination click*/
  getPage(event) {
    console.log('event', event);
    this.loading = true;
    this.currentPage = event;
    this.getMyrservation(event);
  }
  onMapReady(map) {
    //alert('hi');
    console.log('map', map);
    console.log('markers', map.markers);  // to get all markers as an array
  }
  openModel(lat, long) {
    //alert(lat+long);
    this.latitude = lat;
    this.longitude = long;
    this.center = (this.longitude + ', '+this.latitude) +""
    this.position = (this.longitude + ', '+this.latitude) +""
    console.log("this.latitude : "+this.latitude + "  "+ "  this.longitude "+  this.longitude);
    //this.myModal.nativeElement.className = 'modal fade show';
  }
  showAlert(title, msg) {
    this.dialogService.addDialog(AlertComponent, { title: title, message: msg });
  }
  listCuisines(c, l) {
    if (c.length == 0) {
      return "No Cuisines";
    }

    var cuisines = "";
    if (l != 0) {
      for (var i = 0; i < c.length; i++) {
        if (i > l) {
          break;
        }
        cuisines += c[i].cuisinename.trim() + ", ";
      }
    } else {
      for (var i = 0; i < c.length; i++) {
        cuisines += c[i].cuisinename.trim() + ", ";
      }
    }
    cuisines = cuisines.slice(0, -2);
    return cuisines;

  }

  reservedCuisines(i, c){
    let cus = this.listCuisines(c, 0);
    $(this.viewMores.toArray()[i].nativeElement).popover({
      container: "body",
      trigger : 'focus',
      placement : 'top',
      html: true,
      content: cus
    });;
  }
}
