import {Component, OnInit, ElementRef,ViewChild} from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, FormArray, FormBuilder, Validators }      from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CompleterService, CompleterData } from 'ng2-completer';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';
import { AlertComponent } from '../common/alert.component';
import { DialogService } from "ng2-bootstrap-modal";

//providers
import { UserRequestManager } from '../../providers/user-request-manager';
import { viewDef } from '@angular/core/src/view/view';
//import { IsLogin } from '../../providers/is-login';

@Component({
  selector: 'submitlisting2',
  template: require('./submitlisting2.component.html')
})
export class SubmitListing2Component implements OnInit {
public businessUnit:any=[];
public planData:any;
public addonData:any;
public usertempData:any;
public addonValue:any=[];
public addonName:any=[];
public isSelectPlan:any;
public planValue:any=[];
public step2Data:any;
public tempData:any;
public selectPlans:any;
public termConditions:any;
public readPdfs:any;
public selectPlaned:any=[];
public setAlert: any;
public bgColor: any;
@ViewChild('selectPlan') selectPlan;
// public planForm:any={};
configMiddle: Object = {
    nextButton: '.swiper-button-next',
    prevButton: '.swiper-button-prev',
    spaceBetween: 20,
    slidesPerView: 3,
    loop: true,
    freeMode:true,
    breakpoints: {
      1000: {
          slidesPerView: 2,
      },
      768: {
          slidesPerView: 2,
      },
      640: {
          slidesPerView: 1,
      }
  }
};

  constructor(
    private dialogService:DialogService,
    private completerService: CompleterService,
    public localStorage:LocalStorageService,
    public userRequestManager:UserRequestManager,
   // public islogin:IsLogin,
    public elementRef:ElementRef,
    public router:Router
  ) {
      console.log('step1',this.localStorage.get('step1'));
      if(this.localStorage.get('step2') != null || this.localStorage.get('step2') != undefined) {
        this.tempData = JSON.parse(JSON.stringify(this.localStorage.get('step2')));
        this.addonValue = this.tempData.addon;
        this.isSelectPlan = this.tempData.plan.id;
        this.selectPlans = true;
        this.termConditions= true;
        this.readPdfs = true;
        console.log('this.planForm.selectPlan',this.selectPlans);
        console.log('this.tempData',this.tempData);
      }
      // if(this.localStorage.get('userData') == null || this.localStorage.get('userData') == undefined) {
      //   this.localStorage.set('submitlistinglink', 'submitlisting2');
      // }
    //  this.islogin.isLoggedIn();
  }

  ngAfterViewInit(){
    console.log('ngAfterViewInit')
    if(this.localStorage.get('step1') == null || this.localStorage.get('step1') == undefined) {
      this.router.navigate(['submitlisting1']);
    }
    this.getPlans();
    this.getAddons();
  }
  ngOnInit() {
  }

  /*Function for submitting data to localstorage of step2*/
  onSubmit(data){
   console.log('this.addonValue',this.addonValue);
    console.log('this.planValue',this.planValue);
 /*     console.log('data of step 2',data);
    console.log('this.localStorage.get 2',this.localStorage.get('step2')); */
//    debugger;
    //if(this.localStorage.get('step2') == null || this.localStorage.get('step2') == undefined) {
    if(this.planValue.length != 0 && this.planValue !== null && this.planValue !== undefined && this.planValue.name !== null && this.planValue.name !== '')  {
      this.step2Data = {
          'plan':this.planValue,
          'addon':this.addonValue
        }
        this.localStorage.set('step2',this.step2Data);
        this.router.navigate(['submitlisting3']);
    }
    else
    {
      this.selectPlaned.errors = true;
    }
  }

  /*Function for getting plans from API*/
  getPlans() {
    let uid = '';
    if(this.localStorage.get('userData') != null || this.localStorage.get('userData') != undefined) {
      this.usertempData = JSON.parse(JSON.stringify(this.localStorage.get('userData')));
      uid = this.usertempData.userId;
    }
    return new Promise(resolve => {
      /*
      Commented:Sachin. Because we are not opening this page for only login users it is used for without login users also.
      this.userRequestManager.get('getSubscriptionPlans'+uid)*/
      this.userRequestManager.get('getSubscriptionPlans')
      .then(data => {
        var alldata  = JSON.parse(JSON.stringify(data));
        if(alldata.status == 1){
          this.planData=alldata.data;
          console.log('this.planData',this.planData);
        }
      },(err) => {
        this.dialogService.addDialog(AlertComponent, {title: 'Alert!', message: 'Error Occure, Please Visit After Sometime'});
        this.setAlert = 'solid 1px red';
        this.bgColor = '#F78181';
      })
    })
  }

  /*Function for getting addons*/
  getAddons() {
    let uid = '';
    if(this.localStorage.get('userData') != null || this.localStorage.get('userData') != undefined) {
      this.usertempData = JSON.parse(JSON.stringify(this.localStorage.get('userData')));
      uid = this.usertempData.userId;
    }

    return new Promise(resolve => {
    /*
    Commented:Sachin. Because we are not opening this page for only login users it is used for without login users also.
    this.userRequestManager.get('getAddonList'+uid)  */
      this.userRequestManager.get('getAddonList')
      .then(data => {
        var alldata  = JSON.parse(JSON.stringify(data));
        if(alldata.status == 1){
          this.addonData=alldata.data;
          console.log('this.planData',this.addonData);
        }
      },(err) => {
        this.dialogService.addDialog(AlertComponent, {title: 'Alert!', message: 'Error Occure, Please Visit After Sometime'});
        this.setAlert = 'solid 1px red';
        this.bgColor = '#F78181';
      })
    })
  }

  /*Function for setting values of selected addon for localstorage*/
  setHiddenValue(event,price) {
    console.log('event.target.attributes.id.nodeValue',event.target.attributes.id.nodeValue)
    console.log('this.addonValue.indexOf(',this.addonValue.indexOf(event.target.attributes.id.nodeValue))
    /* sachin: Bug no 1732 error no. changes is done. Below code commented to this error*/

   /* if (this.addonValue.indexOf(event.target.attributes.id.nodeValue) < 0) {
        let totalPrice = parseInt(price)*1;
         this.addonValue.push(
          {
            'name':event.target.attributes.name.nodeValue,
            'id':event.target.attributes.id.nodeValue,
            'price':price,
            'default':1,
            'totalPrice':totalPrice
          }
        );
    }
  */
      var flag = 'new';
      // for 2nd time or more add that product
      this.addonValue.forEach(obj => {
        console.log("object:", obj);
        if(event.target.attributes.name.nodeValue == obj.name)
        {
          obj.default = obj.default+1;
          obj.totalPrice =  obj.default * obj.price;
           flag = 'exists';
        }
      });
      // for 1st time add addon product
      if(flag == 'new')
      {
        let totalPrice = parseInt(price)*1;
        this.addonValue.push(
          {
            'name':event.target.attributes.name.nodeValue,
            'id':event.target.attributes.id.nodeValue,
            'price':price,
            'default':1,
            'totalPrice':totalPrice
          }
        );
      }
  }

  /*Function for setting values of selected plan for localstorage*/
  markSelectPlan(planName,id,price,duration) {
    this.isSelectPlan = id;
    console.log('event.target.attributes.id.nodeValue',planName)
//    debugger;
    //if (this.planValue.indexOf(event.target.attributes.id.nodeValue) < 0) {
      this.planValue =
        {
          'name':planName,
          'id':id,
          'price':price,
          'duration':duration
        };
    //}
  }

  getColor(value){
    return value == 0 ? 'red' : 'green';
  }
}
