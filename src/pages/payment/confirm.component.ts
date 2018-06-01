import {Component, OnInit,ViewChild,ChangeDetectorRef, Renderer} from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import {
    Router,
    ActivatedRoute,
    // import as RouterEvent to avoid confusion with the DOM Event
    Event as RouterEvent,
    NavigationStart,
    NavigationEnd,
    NavigationCancel,
    NavigationError,
} from '@angular/router';
import 'rxjs/add/operator/pairwise';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/delay';
import * as moment from "moment";
import { DialogService } from "ng2-bootstrap-modal";
import * as _ from 'lodash';
import { DirectionsRenderer } from '@ngui/map';
import {Http, Response,RequestOptions,Headers} from '@angular/http';

//providers
import { UserRequestManager } from '../../providers/user-request-manager';
import { IsLogin } from '../../providers/is-login';

import { AlertComponent } from '../common/alert.component';
import { AddressComponent } from '../cart/address.component';

@Component({
  selector: 'confirm',
  template: require('./confirm.component.html'),
  // directives: [ExperimentDetailComponent]
})
export class ConfirmComponent implements OnInit {

  public usertempData:any;
  public paymentMethod:any=[];
  public currentTab:any;
  public userStoredData:any;
  public resData:any;
  public myOrderData:any;
  public myCart:any;
  public itemTotal:any=0;
  public subtotal:any=0;
  public taxtotal:any=0;
  public grandTotal:any=0;
  public itemTotalArr:any=[];
  public deliveryAddress:any;
  public deliType:any;
  public promptMessage:any={};
  public accessTokenFromPaypal:any;
  public urls:any;
  public paymentId:any;
  public finalPayerId:any;
  // public paypal = require('../../../node_modules/paypal-rest-sdk');
  constructor(
    public localStorage:LocalStorageService,
    public userRequestManager:UserRequestManager,
    public router : Router,
    public activatedRoute:ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer,
    private dialogService:DialogService,
    public islogin:IsLogin,
    public http: Http
   ) {
   }

  ngOnInit() {
    console.log('inside confirm constructor');
  }
  ngAfterViewInit(){
    console.log('inside confirm ngOnInit');
  }
}
