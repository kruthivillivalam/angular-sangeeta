import { Component,OnInit,Input} from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { LocalStorageService } from 'angular-2-local-storage';
import { DialogService } from "ng2-bootstrap-modal";
import { VALIDATIONERROR, COMMONTEXT, ALERTMSGS } from 'app/app.constants';
import {
    Router,
    ActivatedRoute,
    Event as RouterEvent,// import as RouterEvent to avoid confusion with the DOM Event
    NavigationStart,
    NavigationEnd,
    NavigationCancel,
    NavigationError,
  } from '@angular/router';
//providers
import { UserRequestManager } from '../../../providers/user-request-manager';
import { IsLogin } from '../../../providers/is-login';
import { AlertComponent } from '../../common/alert.component';
import { SpinnerService } from '../../common/spinner.service';
import * as moment from "moment";
@Component({
    selector: 'reservation',
    templateUrl: './reservation.component.html',
    styleUrls: ['./reservation.component.scss']
  })
  export class ReservationComponent  implements OnInit {
    //public restaurantData:any=[];
    public invalidDate = false;
    public alertMsg: any;
    public validationError: any;
    public commonText: any;
    @Input() merchant_id: number;
    constructor(
 /*        public userRequestManager:UserRequestManager,
        public activatedRoute:ActivatedRoute,
        public islogin:IsLogin,
        public spinnerService: SpinnerService,
        public localStorage:LocalStorageService,
        private dialogService:DialogService */
        public localStorage:LocalStorageService,
        public userRequestManager:UserRequestManager,
        public router : Router,
        public activatedRoute:ActivatedRoute,
        private dialogService:DialogService,
        public islogin:IsLogin,
        public spinnerService: SpinnerService
    ) {
      this.validationError = VALIDATIONERROR;
      this.alertMsg = ALERTMSGS;
      this.commonText = COMMONTEXT;
    }
    ngOnInit(): void {
    }

    saveReservation(data) {
      console.log('reservation-data',data);
      const payLoad = {
        'token':this.localStorage.get('userToken'),
        'customer_mobile':data.customer_mobile,
        'customer_firstname':data.customer_firstname,
        'customer_lastname':data.customer_lastname,
        'customer_email':data.customer_email,
        'reservationDate':data.reservationDate,
        'reservationTime':data.reservationTime,
        'occasion':data.occasion,
        'NoOfGuests':data.NoOfGuests,
        'carpark_bay':data.carpark_bay?  data.carpark_bay : 0,
        'notes':data.notes,
        'merchant_id': this.merchant_id
      };

      if(moment(data.reservationDate) < moment()) {
        this.invalidDate = true;
      }else {
        this.spinnerService.show('homePageSpinner');
        this.invalidDate = false;
        this.userRequestManager.set('saveReservation', payLoad).then(resp => {
          // Handle Response
          this.spinnerService.hide('homePageSpinner');
          if(JSON.parse(JSON.stringify(resp)).status && JSON.parse(JSON.stringify(resp)).status === 1) {
            this.showAlert(this.alertMsg.RES_DONE, this.alertMsg.RES_SUC_MSG);
          }
          if(JSON.parse(JSON.stringify(resp)).status && JSON.parse(JSON.stringify(resp)).status === 0) {
            this.showAlert(this.alertMsg.RES_FAILED, JSON.parse(JSON.stringify(resp)).message);
          }
        },error => {
          // Take action
          this.spinnerService.hide('homePageSpinner');
          this.showAlert(this.alertMsg.RES_FAILED,error + this.alertMsg.RES_FAILED_MSG);
        });
      }
    }
    showAlert(title,msg) {
      this.dialogService.addDialog(AlertComponent, {title:title, message:msg});
    }
  }    
