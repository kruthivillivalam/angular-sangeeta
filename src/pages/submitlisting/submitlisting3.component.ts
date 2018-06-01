import {Component, OnInit, ElementRef, ComponentRef, ContentChildren, QueryList,Input, ViewChild,Renderer2} from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, FormArray, FormBuilder, Validators, NgForm }      from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CompleterService, CompleterData } from 'ng2-completer';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';
import { ISADAPTIVE } from '../../app/app.constants';
import { AlertComponent } from '../common/alert.component';
import { SpinnerService } from '../common/spinner.service';
import {Http, Response,RequestOptions,Headers} from '@angular/http';
import { DialogService } from "ng2-bootstrap-modal";
//providers
import { UserRequestManager } from '../../providers/user-request-manager';
//import { IsLogin } from '../../providers/is-login';

@Component({
  selector: 'submitlisting3',
  template: require('./submitlisting3.component.html')
})


export class SubmitListing3Component implements OnInit {
public hideOtherMethod: boolean;
public planForm:any=[];
public businessUnit:any=[];
public planData:any;
public addonData:any;
public usertempData:any;
public addonValue:any;
public isSelectPlan:any;
public step2tempData:any=[];
public sumOfAll:any= [];
public newSum:any;
public step2newData:any=[];
public step2Data:any;
public step1Data:any;
public addonLience:any=[];
public inputElement:any;
public paymentMethod:any=[];
public step1tempData:any;
public cardHolderName:any={};
public cartForm:NgForm;
public currentTab:any;
public addonChangedValues:any=[];
public submitted:any;
public showMessage:any;
public commissionPercent:any;
public getAccessToken:any;
public accessTokenFromPaypal:any;
public paymentThroughpaypal:any;
public pSelected: boolean = false;
public setAlert: any;
public bgColor: any;
@ViewChild('someVar') el:ElementRef;
@ViewChild('cartForm') currentForm: NgForm;
configMiddle: Object = {
    nextButton: '.swiper-button-next',
    prevButton: '.swiper-button-prev',
    spaceBetween: 20,
    slidesPerView: 3,
    loopedSlides:1,
    loop: true,
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
//  public islogin:IsLogin,
  public elementRef:ElementRef,
  public router:Router,
  private rd: Renderer2
) {
    this.hideOtherMethod = true;
    console.log('step1',this.localStorage.get('step1'));
    console.log('step2',this.localStorage.get('step2'));
    //this.islogin.isLoggedIn();
  }

  ngAfterViewInit(){
    console.log('ngAfterViewInit')
    if((this.localStorage.get('step1') == null || this.localStorage.get('step1') == undefined) && this.localStorage.get('step2') == null || this.localStorage.get('step2') == undefined) {
      this.router.navigate(['submitlisting1']);
    }

    if(this.localStorage.get('step2') != null || this.localStorage.get('step2') != undefined) {
      this.step2tempData = JSON.parse(JSON.stringify(this.localStorage.get('step2')));
      for(let i = 0; i<this.step2tempData.addon.length; i++ ) {
        this.sumOfAll.push(this.step2tempData.addon[i].totalPrice);
        this.addonLience[this.step2tempData.addon[i].id] =  1 ;

      }
//      debugger;
//      console.log('this.sumOfAlls',this.sumOfAll);
//      console.log('this.addonLience',this.addonLience);
//      this.newSum = this.sumOfAll.reduce((a, b) => a + b, 0);
//      this.newSum = parseInt(this.newSum)+parseInt(this.step2tempData.plan.price);
        if (this.sumOfAll.length > 0) {
                this.newSum = this.sumOfAll.reduce((a, b) => a + b, 0);
        }
        else {
          this.newSum = 0
        }
     }

     if(this.localStorage.get('step2') != null || this.localStorage.get('step2') != undefined) {
       this.step2tempData = JSON.parse(JSON.stringify(this.localStorage.get('step2')));
       console.log('this.step2tempData',this.step2tempData);
     }
     this.currentTab = 'tab1';
     this.getPaymentMethod();

  }

  ngOnInit() {


  }
  onSubmit(data){

    console.log('data',data);
    console.log('data.value',data.value);

    if(this.localStorage.get('step2') != null || this.localStorage.get('step2') != undefined) {
      this.step2Data = JSON.parse(JSON.stringify(this.localStorage.get('step2')));
      console.log('this.step2Data',this.step2Data);
    }
    if(this.localStorage.get('step1') != null || this.localStorage.get('step1') != undefined) {
      this.step1Data = JSON.parse(JSON.stringify(this.localStorage.get('step1')));
      console.log('this.step1Data',this.step1Data);
    }
    console.log('this.currentTab',this.currentTab);
    var gatewayName = ''
    if(this.currentTab == 'tab3') {
      gatewayName = 'paypal'
    }
    if(this.currentTab == 'tab2') {
      gatewayName = 'debit'
    }
    if(this.currentTab == 'tab1') {
      gatewayName = 'credit'
    }
    let finalData;
    finalData = {
      'token':this.localStorage.get('userToken'),
      'email':this.step1Data.email,
      'first_name':this.step1Data.firstName,
      'last_name':this.step1Data.lastName,
      'mobile_number':this.step1Data.mobile,
      'primary_role':this.step1Data.primaryRoleAtOrganization,
      'merch_bus_name':this.step1Data.merchantBusinessName,
      'merch_bus_number': this.step1Data.merchantRegistrationNumber ? this.step1Data.merchantRegistrationNumber : '',
      'valide_bus_number':'',
      'bus_addr1':this.step1Data.businessAddress1,
      'bus_addr2':'',
      'suburb':this.step1Data.suburb,
      'city':this.step1Data.city ? this.step1Data.city : '',
      'postal_code':this.step1Data.postalCode,
      'state':this.step1Data.state,
      'country':this.step1Data.country,
      'buss_unit':this.step1Data.buss_unit,
      'selcted_plan':this.step2Data.plan.id,
      'user_id':this.step1Data.user_id,
      'gateway':gatewayName,
      'from_api':'1',
      'cancel_url':'https://orderpointenduser.azurewebsites.net/submitlisting3',
      'return_url':'https://orderpointenduser.azurewebsites.net/submitlisting3',
      'credit_cardh_name':data.cardHolderName,
      'credit_card_number':data.creditCard,
      'credit_sec_code':data.securityCode,
      'credit_exp_month':data.selectMonth,
      'credit_exp_year':data.selectYear,
      'debit_cardh_name':data.debitCardHolderName,
      'debit_card_number':data.debitCard,
      'debit_sec_code':data.debitSecurityCode,
      'debit_exp_month':data.debitSelectMonth,
      'debit_exp_year':data.debitSelectYear
    };
      var keyName = '';

      Object.keys(data.value).forEach(function(key) {
        keyName = 'license_count_'+key.replace( /^\D+/g, '');
        finalData[keyName]=data.value[key];
      });

      return new Promise(resolve => {
         this.userRequestManager.set('merchantRegistration',finalData)
         .then(data => {
           //console.log('data after submit listing step 1',data);
           var alldata  = JSON.parse(JSON.stringify(data));
           if(alldata.status == 1){
             if(alldata.data.paypal_url != null || alldata.data.paypal_url != undefined)
              window.open(alldata.data.paypal_url);
            else
            //this.showMessage = alldata.msg;
            this.router.navigate(['submitlisting4']);
              console.log('Successfully integrated user')
           } else {
             this.showMessage = alldata.msg;

             window.scrollTo(0,0);
           }
         },function(e){
           var errorData  = JSON.parse(JSON.stringify(e));
           console.log('error data',errorData);
			if( errorData.status === 500 )
			{

				this.showMessage = "There is some Error. Please try this later. ";

			}
         }).catch(err => {
          console.log('Error callback', err); // This will NOT be called
          this.showMessage = 'payment not done due to some technical problem, you can try with other payment method.'
        })
      })
	}

  payWithPayPal () {
        var commissionPercent = 0;
        if(ISADAPTIVE) {
            console.log("SID");
            this.commissionPercent = 200;
            var tempPaykey='';
            //const commissionAmnt = this.grandTotal * (this.commissionPercent / 100);
            var Paypal = require('paypal-adaptive');
            var paypalSdk = new Paypal({
                userId:    'sekar.nagarajan_api1.bartertechnologies.onmicrosoft.com',
                password:  'B9U7TE3YWXZTZFUX',
                signature: 'A3bGH27SxpA5baY.y3vROHFTc9tZAlNdAVbhowIrfLeZJQjhHqwhh-kz',
                sandbox:   true //defaults to false
            });
            var payload = {
                requestEnvelope: {
                    errorLanguage:  'en_US'
                },
                actionType:     'PAY',
                currencyCode:   'USD',
                feesPayer:      'EACHRECEIVER',
                memo:           'Chained payment example',
  //              cancelUrl:      'http://enduserstaging.azurewebsites.net/home',
  //              returnUrl:      'http://enduserstaging.azurewebsites.net/home?payKey=${payKey}',
                cancelUrl:      'http://localhost:4210/home',
                returnUrl:      'http://localhost:4210/home?payKey=${payKey}',
                receiverList: {
                    receiver: [
                        {
                            email:  'sekar.nagarajan@bartertechnologies.onmicrosoft.com',
                            amount: 200,
                            primary:'true'
                        },
                        {
                            email:  'barterOrderpoint-facilitator@gmail.com',
                            amount: 200,
                            primary:'false'
                        }
                    ]
                }
            };
            var ctx = this;
            paypalSdk.pay(payload, function (err, response)  {
                if (err) {
                    //var currentCtx = this;
                    var ctx = this;
                    console.log("ctx : " +ctx);
                    //this.spinnerService.hide('homePageSpinner');
                    this.showAlert('Payment Failed','Payment Failed due to some technical issues');
                } else if(response.error && response.error[0] && response.error[0].message) {
                    //this.spinnerService.hide('homePageSpinner');
                    var ctx = this;
                    console.log("ctx2 : " +ctx);
                    this.showAlert('Payment Failed', response.error[0].message);
                } else {
                    //this.spinnerService.hide('homePageSpinner');
                    var ctx = this;
                    window.open(response.paymentApprovalUrl,'_self');
                }
            });
        } else {
            this.getAccessToken()
            .then(data=>{
                    console.log('data',data);
                    var alldata  = JSON.parse(JSON.stringify(data));
                    this.accessTokenFromPaypal = alldata.access_token;
                    this.localStorage.set('accessTokenFromPaypal',this.accessTokenFromPaypal);
                    var app_id = alldata.app_id;

                    //let logedinUserData = this.userStoredData;
                    //let delAddress = this.deliveryAddress;
                    let total = 0;

                    this.paymentThroughpaypal(this.accessTokenFromPaypal).then(paymentData=>{
                        //this.spinnerService.hide('homePageSpinner');
                        var allpaymentData  = JSON.parse(JSON.stringify(paymentData));

                        console.log('allpaymentData',allpaymentData);
                        let redirectURL = '';
                        if(allpaymentData != undefined) {
                            for(let i=0;i<allpaymentData.links.length;i++) {
                                if(allpaymentData.links[i].rel == 'approval_url') {
                                    redirectURL = allpaymentData.links[i].href;
                                }
                            }
                        }
                        console.log('redirectURL',redirectURL);
                        window.open(redirectURL,'_self');

                    }).catch(err => {
                        //this.spinnerService.hide('homePageSpinner');
                        console.log('Error callback', err); // This will NOT be called
                        this.showMessage = 'payment not done due to some technical problem, you can try with other payment method.'
                    })

                },(err) => {
                  this.dialogService.addDialog(AlertComponent, {title: 'Alert!', message: 'Error Occure, Please Visit After Sometime'});
                  this.setAlert = 'solid 1px red';
                  this.bgColor = '#F78181';
                });
        }
  }


  /*Function for removing addon*/
  removeAddon(event,id,price) {
    console.log('id',id);
    console.log('price',price);
    this.newSum = parseInt(this.newSum)-parseInt(price);

    event.target.parentNode.parentNode.remove(
      this.setLocalStorageStep2(event,id,price)
    );
  }

  /*Function for setting Local storage*/
  setLocalStorageStep2(event,id,price) {
    if(this.localStorage.get('step2') != null || this.localStorage.get('step2') != undefined) {
      this.step2tempData = JSON.parse(JSON.stringify(this.localStorage.get('step2')));
      this.step2newData = [];
      for (var i = 0; i<this.step2tempData.addon.length;i++) {
        if(this.step2tempData.addon[i].id != id) {
          this.step2newData.push(this.step2tempData.addon[i]);
        }
      }
      this.step2tempData = {
        'plan':this.step2tempData.plan,
        'addon':this.step2newData
      }
      this.localStorage.set('step2',this.step2tempData);
      console.log('this.step2newData',this.step2newData);
    }
  }

  /*Function for updating licence count*/
  addLienceCount(event,id,type,elementId,price) {
    var initialVal = 1;
    this.inputElement = (<HTMLInputElement>document.getElementById(elementId));
    if(type == 'plus') {
      this.inputElement.value = parseInt(this.inputElement.value) + initialVal;
      this.addonLience[id] =  parseInt(this.addonLience[id]) + initialVal ;
    } else {
      this.inputElement.value = parseInt(this.inputElement.value) - initialVal;
      this.addonLience[id] =  parseInt(this.addonLience[id]) - initialVal ;
    }

    var toPayval = parseInt(this.inputElement.value) * parseInt(price);
    document.getElementById('toPay'+id).innerText = '$'+toPayval;

    if(type == 'plus') {
      this.newSum = this.newSum + parseInt(price);
    } else {
      this.newSum = this.newSum - parseInt(price);
    }

    if (this.addonChangedValues.indexOf(id) > -1) {
      this.addonChangedValues.push({
        'id':id,
        'value':parseInt(this.inputElement.value)
      });
    }
  }

  /*Function for getting payment method from API*/
  getPaymentMethod () {
    let uid = '';
    if(this.localStorage.get('userData') != null || this.localStorage.get('userData') != undefined) {
      this.usertempData = JSON.parse(JSON.stringify(this.localStorage.get('userData')));
      uid = this.usertempData.userId;
    }
    return new Promise(resolve => {
      this.userRequestManager.get('getPaymentMethods')
      .then(data => {
        var alldata  = JSON.parse(JSON.stringify(data));
        if(alldata.status == 1){
          this.paymentMethod = alldata.data;
          console.log('this.paymentMethod',this.paymentMethod);
        }
		}).catch(err => {
			console.log('Error callback', err); // This will NOT be called
			this.showMessage = 'payment not done due to some technical problem, you can try with other payment method.'
		})
	})
  }

  /*Function for checking which tab is active*/
  checkTab(id) {
    //console.log('event.target.attributes.id',event.target.attributes.id);
    this.currentTab = (<HTMLInputElement>document.getElementById('tab'+id)).id;
    if(this.currentTab == 'tab1') {
      var resetForm = (<HTMLFormElement>document.getElementById('cartForm'));
      resetForm.reset();
    }
  }

  togglePaymentMethodVisibility(method) {
    console.log(method);
    this.pSelected = true;
    if (method == 'Credit Card') {
      this.hideOtherMethod = true;
    } else {
      this.hideOtherMethod = false;
    }
  }

  availableAsAMethod(method) {
    var exists = false;
    this.paymentMethod.forEach(paymentItem => {
      if(paymentItem.method_name == method){
        exists = true;
      }
    });
    return exists;
  }

  paymentExpress(){
    // this method handles paypal method type
    this.pSelected = false;
  }

}
