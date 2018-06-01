import { Component} from '@angular/core';
import { Subject } from 'rxjs/Subject';
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
import { VALIDATIONERROR, COMMONTEXT, ALERTMSGS } from '../../../app/app.constants';
import { SpinnerService } from '../../common/spinner.service';

@Component({
    selector: 'restaurant-info',
    templateUrl: './restaurant-info.component.html',
    styleUrls: ['./restaurant-info.component.scss']
  })

  export class RestaurantInfoComponent {
    public restaurantInfoList:any;
    private restaurantData: any;
    public webUrl: any;
    public servicesOfRest:any;
    public merchantid:any;
    public phoneNumbers:any=null;
    constructor(
        public userRequestManager:UserRequestManager,
        public activatedRoute:ActivatedRoute,
        public islogin:IsLogin,
        public spinnerService: SpinnerService
      ) {
        console.log('inside restaurant detail constructor');
        /* we created seprate component for restaurant tab. For that we fecthing data from observer displaying this in component's html file*/
        this.restaurantData = this.userRequestManager.getRestaurantServiceTrigger().subscribe(serviceData => {
        this.restaurantInfoList = this.userRequestManager.getRestaurantInfoData();
        if(this.restaurantInfoList.phoneNumbers != '' && this.restaurantInfoList.phoneNumbers != null && this.restaurantInfoList.phoneNumbers != undefined) this.phoneNumbers = this.restaurantInfoList.phoneNumbers;
        else this.phoneNumbers = 'N/A';
        if(this.restaurantInfoList.servicesOfRest != ''  && this.restaurantInfoList.servicesOfRest != null && this.restaurantInfoList.servicesOfRest != undefined) this.servicesOfRest = this.restaurantInfoList.servicesOfRest;
        else this.servicesOfRest = null;
        if(this.restaurantInfoList.merchantid != ''  && this.restaurantInfoList.merchantid != null && this.restaurantInfoList.merchantid != undefined) this.merchantid = this.restaurantInfoList.merchantid;
        else this.merchantid = null;
        if(this.restaurantInfoList.webUrl != ''  && this.restaurantInfoList.webUrl != null && this.restaurantInfoList.webUrl != undefined) this.webUrl = this.restaurantInfoList.webUrl;
        else this.webUrl = 'N/A';
        console.log('this.restaurantData',this.restaurantData );
      });
    }
  }