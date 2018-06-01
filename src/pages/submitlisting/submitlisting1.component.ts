import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, FormArray, FormBuilder, Validators }      from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CompleterService, CompleterData, CompleterItem, CompleterCmp } from 'ng2-completer';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';
import { DialogService } from "ng2-bootstrap-modal";
import { AlertComponent } from '../common/alert.component';
//providers
import { UserRequestManager } from '../../providers/user-request-manager';
//import { IsLogin } from '../../providers/is-login';


@Component({
  selector: 'submitlisting1',
  template: require('./submitlisting1.component.html')
})
export class SubmitListing1Component implements OnInit {
  public merchant:any=[];
  public businessUnit:any=[];
  protected searchStr: string;
  protected captain: string;
  protected dataService: CompleterData;
  public businessUnits:any;
  public optionsMap:any;
  public suburbsByCountry:any=[];
  public suburbData:any=[];
  public postalCode:any;
  public businessItems:any=[];
  public color3:any;
  public countryData:any;
  public stateData:any;
  public checkedArray:any = [];
  public usertempData:any = [];
  public step1Data:any;
  public step1StorageData:any;
  public subrubName:any;
  public merchantRoleData:any;
  public allapidata:any;
  public LocationData:any;
  public emailexistMessage:any;
  public merchantexistMessage:any;
  public exist:boolean = true;
  public merchantData:any;
  public setAlert: any;
  public bgColor: any;
  @ViewChild('firstName') firstNameTextbox: ElementRef;;

  constructor(
    private completerService: CompleterService,
    public localStorage:LocalStorageService,
    public userRequestManager:UserRequestManager,
    private dialogService:DialogService,
   // public islogin:IsLogin,
    public router:Router
  ) {
    this.getCountryData();

    if(this.suburbData != null || this.suburbData != undefined) {
      this.dataService = this.completerService.local(this.suburbData, 'suburb_name', 'suburb_name');
    }
    this.getAllData();
//    this.getLocationData();
   // console.log('this.localStorage.get(step1)',this.localStorage.get('step1'));
    if(this.localStorage.get('step1') != null || this.localStorage.get('step1') != undefined) {
      this.step1StorageData = JSON.parse(JSON.stringify(this.localStorage.get('step1')));
      this.subrubName = 'red';
      this.merchant = {
        'firstName':this.step1StorageData.firstName,
        'lastName':this.step1StorageData.lastName,
        'email':this.step1StorageData.email,
        'mobile':this.step1StorageData.mobile,
        'prorganisation':this.step1StorageData.primaryRoleAtOrganization,
        'merchantBusiness':this.step1StorageData.merchantBusinessName,
        'businessNumber':this.step1StorageData.merchantRegistrationNumber,
        'businessAddress1':this.step1StorageData.businessAddress1,
        'businessAddress2':this.step1StorageData.businessAddress2,
        'city':this.step1StorageData.city,
        'postalCode':this.step1StorageData.postalCode,
        'state':this.step1StorageData.state,
        'country':this.step1StorageData.country
      }
      console.log('this.businessItems',this.businessItems);
      this.businessItems.checked = this.step1StorageData.buss_unit;
      this.color3 = this.step1StorageData.suburb;
            this.getAllData();
     // this.islogin.isLoggedIn();
    }
    this.getMerchantRoles();
    this.localStorage.set('getallapidata',this.allapidata);
  }

  ngOnInit() {
    //this.getMerchantRoles();

    //this.localStorage.set('getallapidata',this.allapidata);
    //console.log("aaaa=>"+ JSON.stringify(this.localStorage.get('allapidata')['getBusinessUnit']));
      //this.getBusinessUnit();

//      this.getBusinessUnit();

}

  /*Function for submitting values to localstorage of step1*/
  onSubmit(data){
   // this.onCheckEmailBussinessName(data);
      let finalData;
      finalData = {
        'email':data.email,
        'mname':data.merchantBusiness
      };
      // this.exist=true;
      this.exist = true;
      this.merchantData = data;
      new Promise(resolve => {
        this.userRequestManager.set('validateMerchantDetails',finalData)
        .then(data => {
          var alldata  = JSON.parse(JSON.stringify(data));
          this.merchantexistMessage =undefined;
          this.emailexistMessage = undefined;
            // debugger;
        /*let isSelected: any = this.businessUnits.filter((item) => item.checked === true);
        if(this.checkedArray !== null && this.checkedArray !== undefined) {
          this.businessUnit.errors = true;
        }*/
        //else this.businessUnit.errors = false;
          if(alldata.status == 1){
              // This code is run when a response from the server is received
              if(alldata.data.emailMsg !== undefined){
                this.emailexistMessage = alldata.data.emailMsg;
              }
              if(alldata.data.merchantnameMsg !== undefined){
                this.merchantexistMessage = alldata.data.merchantnameMsg;
              }
          }
          if(alldata.status == 0 && this.checkedArray.length > 0){
          //let isSelected: any = this.businessUnits.filter((item) => item.checked === true);
          /*this.checkedArray= this.businessUnits.filter((item) => item.checked === true);*/
            /*for(let i = 0; i<isSelected.length; i++) {
              this.checkedArray.push(isSelected[i].businessUnitId);
            }*/
            console.log("this.checkedArray : "+JSON.stringify(this.checkedArray))
			var alldata = this.merchantData;
            this.step1Data = {
              'email':alldata.email,
              'firstName':alldata.firstName,
              'lastName':alldata.lastName,
              'mobile':alldata.mobile,
              'primaryRoleAtOrganization':alldata.prorganisation,
              'merchantBusinessName':alldata.merchantBusiness,
              'merchantRegistrationNumber':alldata.businessNumber,
              'valide_bus_number':'',
              'businessAddress1':alldata.businessAddress1,
              'businessAddress2':'',
              'suburb':alldata.suburb,
              'city':alldata.city,
              'postalCode':alldata.postalCode,
              'state':alldata.state,
              'country':alldata.country,
              'buss_unit':this.checkedArray,
            }
            this.localStorage.set('step1',this.step1Data);
            this.router.navigate(['submitlisting2']);
        }
        else {
          this.dialogService.addDialog(AlertComponent, {title: 'Alert!', message: 'Please select business unit'});
          this.setAlert = 'solid 1px red';
          this.bgColor = '#F78181';
        }
      },)
    })
  }

  selectBusinessUnit(merchant) {
    this.checkedArray = [];
    console.log('merchant : '+merchant.businessUnitId)
    this.localStorage.set('buss_unit', merchant);
    this.checkedArray.push(merchant.businessUnitId);
    console.log('merchant : '+this.checkedArray)
  }

  /*Function for getting country data from API*/
  getCountryData () {
    return new Promise(resolve => {
      this.userRequestManager.get('CountryList')
      .then(data => {
        var alldata = JSON.parse(JSON.stringify(data));
        console.log('alldata for country list',alldata);
        if(alldata.status == 1){
          this.countryData=alldata.data;
          this.merchant.country = "1";
          //this.getStateData(this.merchant.country);
          this.getSuburbsByCountry(this.merchant.country);
        }
      })
    })
  }

  /*Function for getting state data from API*/
  getStateData (value) {
    console.log('value',this.merchant.country);
    let url = '';
    return new Promise(resolve => {
      url = 'StateList?country_id='+this.merchant.country;
      this.userRequestManager.get(url)
      .then(data => {
        var alldata = JSON.parse(JSON.stringify(data));
        console.log('alldata for state list',alldata);
        if(alldata.status == 1){
          this.stateData=alldata.data;
        } else {
          this.merchant.state = '';
          this.stateData=[];
        }
        console.log('this.stateData',this.stateData);
      },function(err){
        console.log('err',err);
        this.user.state = '';
        this.stateData=[];
      }).catch((ex) => {
        // this.merchant.state = '';
        this.stateData=[];
      })

    })
  }
  getAllData() {
    if(this.localStorage.get('getallapidata') !== undefined && this.localStorage.get('getallapidata') !== null)
     {
       this.allapidata = JSON.parse(JSON.stringify(this.localStorage.get('getallapidata')));
       //console.log(this.localStorage.get('getallapidata'));
       if(this.allapidata)
       {
         this.getBusinessUnit();
       }
     }
     else
     {
       return new Promise(resolve => {
         this.userRequestManager.get('getAllData')
         .then(data=>{
           this.allapidata = JSON.parse(JSON.stringify(data));
           if(this.allapidata)
           {
             this.localStorage.set('getallapidata',this.allapidata);
           console.log("aaaa=>"+ JSON.stringify(this.localStorage.get('allapidata')['getBusinessUnit']));
             this.getBusinessUnit();
            }
         },(err) => {
           this.dialogService.addDialog(AlertComponent, {title: 'Alert!', message: 'Error Occure, Please Visit After Sometime'});
           this.setAlert = 'solid 1px red';
           this.bgColor = '#F78181';
         })
       });
     }
   }
  /*Function for getting business units from API*/
  getBusinessUnit() {
    let tempBusinessArray = [];
    console.log('123this.allapidata.data',this.allapidata.data);
    this.businessUnits = this.allapidata.data.getBusinessUnits[0].data;
    console.log('this.businessUnits', this.businessUnits);
    if(this.allapidata.data.getBusinessUnits[0].status == 1) {
      if(this.businessUnits.status == 1) {
        this.businessUnits = this.businessUnits.data;

        for(let i = 0; i<this.businessUnits.length; i++) {
          var unitChecked = false;
          var unitCheckedAttr = '';
          if(this.localStorage.get('step1') != null || this.localStorage.get('step1') != undefined) {
            this.step1StorageData = JSON.parse(JSON.stringify(this.localStorage.get('step1')));

            if (this.step1StorageData.buss_unit.indexOf(this.businessUnits[i].businessUnitId) > -1) {
              unitChecked = true;
              unitCheckedAttr = 'checked';
            }

          }
          console.log('unitChecked',unitChecked);
          console.log('this.businessUnits[i].businessUnitId',this.businessUnits[i].businessUnitId);
          this.businessUnits[i] = {
            'businessUnitId':this.businessUnits[i].businessUnitId,
            'businessUnitName':this.businessUnits[i].businessUnitName,
            'checked':unitChecked,
            'unitCheckedAttr':unitCheckedAttr
          }
        }
        console.log('alldata.data All business unit',this.businessUnits);
      }
    }
/*       return new Promise(resolve => {
      this.userRequestManager.get('getBusinessUnits')
      .then(data=>{
        this.businessUnits = JSON.parse(JSON.stringify(data));
        if(this.businessUnits.status == 1) {
          this.businessUnits = this.businessUnits.data;

          for(let i = 0; i<this.businessUnits.length; i++) {
            var unitChecked = false;
            var unitCheckedAttr = '';
            if(this.localStorage.get('step1') != null || this.localStorage.get('step1') != undefined) {
              this.step1StorageData = JSON.parse(JSON.stringify(this.localStorage.get('step1')));

              if (this.step1StorageData.buss_unit.indexOf(this.businessUnits[i].businessUnitId) > -1) {
                unitChecked = true;
                unitCheckedAttr = 'checked';
              }

            }
            console.log('unitChecked',unitChecked);
            console.log('this.businessUnits[i].businessUnitId',this.businessUnits[i].businessUnitId);
            this.businessUnits[i] = {
              'businessUnitId':this.businessUnits[i].businessUnitId,
              'businessUnitName':this.businessUnits[i].businessUnitName,
              'checked':unitChecked,
              'unitCheckedAttr':unitCheckedAttr
            }
          }
          console.log('alldata.data All business unit',this.businessUnits);
        }
      })
    }); */
  }

  /*Function for getting Merchant Roles from API*/
  getMerchantRoles () {
    return new Promise(resolve => {
      this.userRequestManager.get('getMerchantRoles')
      .then(data => {
        var alldata = JSON.parse(JSON.stringify(data));
        console.log('alldata for country list',alldata);
        if(alldata.status == 1){
          this.merchantRoleData=alldata.data;
          console.log('this.merchantRoleData',this.merchantRoleData);
          if(this.step1StorageData.primaryRoleAtOrganization) {
            this.merchant.prorganisation = this.step1StorageData.primaryRoleAtOrganization;
          }
        }
      },(err) => {
        this.dialogService.addDialog(AlertComponent, {title: 'Alert!', message: 'Error Occure, Please Visit After Sometime'});
        this.setAlert = 'solid 1px red';
        this.bgColor = '#F78181';
      })
    })
  }

  /*Function for getting country state suburb postal code from API*/
  getSuburbsByCountry (id) {
    return new Promise(resolve => {
      this.userRequestManager.get('getSuburbsByCountry/'+id)
      .then(data => {
        var alldata = JSON.parse(JSON.stringify(data));
        console.log('alldata for suburb country list',alldata);
        if(alldata.status == 1){
          this.suburbsByCountry=alldata.data.states;
          this.suburbsByCountry.forEach(suburbData => {
            let suburbDetail = suburbData.suburbs;
            suburbDetail.forEach( suburb => {
              this.suburbData.push({
                suburb_id: suburb.suburb_id,
                suburb_name: suburb.suburb_name,
                postal_code: suburb.postal_code,
                state_id: suburbData.state_id,
                state_name: suburbData.state_name
              })
            })
          })
          console.log('1suburbDetail'+JSON.stringify(this.suburbData));
        }
      },(err) => {
        this.dialogService.addDialog(AlertComponent, {title: 'Alert!', message: 'Error Occure, Please Visit After Sometime'});
        this.setAlert = 'solid 1px red';
        this.bgColor = '#F78181';
      })
    })
  }

  /*Function for getting postal code*/
  getPostalcode(selected: CompleterItem) {
    if(selected != null) {
      console.log('id of selected value',selected);
      if(selected.originalObject != '') {
        this.merchant.postalCode = selected.originalObject.postal_code.postal_code;
        this.merchant.state = selected.originalObject.state_id;
      }

    }

  }

  ngAfterViewInit(){
    console.log('spet 1 after init')
  }

  /*Function for reseting postal code and suburb*/
  resetSuburbPostal () {
    this.merchant.postalCode = 'Postal Code*';
    this.color3 = '';
  }
  getLocationData(){
    if(this.localStorage.get('getLocationData') != null)
     {
       this.LocationData= JSON.parse(JSON.stringify(this.localStorage.get('getLocationData')));
       console.log(this.localStorage.get('getLocationData'));
       this.dataService = this.completerService.local(this.LocationData, 'suburb', 'suburb');
     }
     else
     {
       return new Promise(resolve => {
         this.userRequestManager.get('getLocationData')
         .then(data => {
           var alldata  = JSON.parse(JSON.stringify(data));
           console.log('this.LocationData',alldata);
           debugger;
           if(alldata[0].status == 1){
             this.LocationData=alldata[0].data;
            this.localStorage.set('getLocationData',this.LocationData);
             console.log('this.LocationData',this.LocationData);
             this.dataService = this.completerService.local(this.LocationData, 'suburb', 'suburb');
           }
         },(err) => {
           this.dialogService.addDialog(AlertComponent, {title: 'Alert!', message: 'Error Occure, Please Visit After Sometime'});
           this.setAlert = 'solid 1px red';
           this.bgColor = '#F78181';
         })

       });
     }
  }
}
