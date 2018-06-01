import { Component,ViewChild } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { CompleterService, CompleterData, CompleterItem, CompleterCmp } from 'ng2-completer';
import { LocalStorageService } from 'angular-2-local-storage';

//providers
import { UserRequestManager } from '../../providers/user-request-manager';

export interface PromptModel {
  title: string;
  note: string;
  editable: boolean;
  addAddress :any;
  countryData: any;
  stateData: any;
  suburbsByCountry: any;
  suburbData: any;
  color3: any;
  orderType: any;
}

@Component({
  selector: 'address',
  templateUrl: './address.component.html',
})
export class AddressComponent extends DialogComponent<PromptModel, any> implements PromptModel {
  title: string;
  note: string;
  editable: boolean;
  public addAddress:any=[];
  public countryData:any;
  public stateData:any=[];
  public suburbsByCountry:any=[];
  public suburbData:any=[];
  public color3:any;
  protected dataService: CompleterData;
  public orderType:any=[];
  public addressType:any;
  public IsExisting:any;
  public userStoredData:any;
  public addFormData:any;
  public storedMyCart:any=[];
  public addressNew:any;
  public selected :any;
  public selectedExistingAddress:any;
  @ViewChild('state') state;

  constructor(
    dialogService: DialogService,
    public userRequestManager:UserRequestManager,
    private completerService: CompleterService,
    public localStorage:LocalStorageService,
  ) {
    super(dialogService);
    this.getCountryData();
    console.log('this.suburbData in constructor ',this.suburbData);
    if(this.suburbData != null || this.suburbData != undefined) {
      this.dataService = this.completerService.local(this.suburbData, 'suburb_name', 'suburb_name');
    }
    console.log('this.localStorage.get(myCart)',this.localStorage.get('myCart'));
    if(this.localStorage.get('savedAddress') != undefined || this.localStorage.get('savedAddress') != null) {
      /* var storedData;
      storedData = this.localStorage.get('myCart');
      if(storedData.address != undefined) {
      this.storedMyCart = storedData.address;
      this.selectedExistingAddress = storedData.address[0];
      // this.addressNew=0;
    }*/
    this.storedMyCart = this.localStorage.get('savedAddress');
  }
  if(this.localStorage.get('userData') != null || this.localStorage.get('userData') != undefined) {

    //this.addressType = 'ex';
    //this.IsExisting = true;

    this.orderType.push({
      'name':'Existing Address',
      'value':'ex',
      'checked':true
    },{
      'name':'New Address',
      'value':'ne',
      'checked':false
    })
    this.selected = this.orderType[0];

  }

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
        this.addAddress.country = "1";
        //this.getStateData(this.merchant.country);
        this.getSuburbsByCountry(this.addAddress.country);
      }
    })
  })
}

/*Function for getting state data from API*/
getStateData (value) {
  console.log('value',this.addAddress.country);
  let url = '';
  return new Promise(resolve => {
    url = 'StateList?country_id='+this.addAddress.country;
    this.userRequestManager.get(url)
    .then(data => {
      var alldata = JSON.parse(JSON.stringify(data));
      console.log('alldata for state list',alldata);
      if(alldata.status == 1){
        this.stateData=alldata.data;
      } else {
        this.addAddress.state = '';
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

/*Function for getting country state suburb postal code from API*/
getSuburbsByCountry (id) {
  // this.suburbData = [];
  return new Promise(resolve => {
  this.userRequestManager.get('getSuburbsByCountry/'+id)
  .then(data => {
    var alldata = JSON.parse(JSON.stringify(data));
    console.log('alldata for suburb country list',alldata);
    if(alldata.status == 1){
      this.suburbsByCountry=alldata.data.states;
      for(var i=0; i<this.suburbsByCountry.length;i++) {
        for(var j=0; j<this.suburbsByCountry[i].suburbs.length;j++) {
          this.suburbData.push({
            'suburb_id':this.suburbsByCountry[i].suburbs[j].suburb_id,
            'suburb_name':this.suburbsByCountry[i].suburbs[j].suburb_name,
            'postal_code':this.suburbsByCountry[i].suburbs[j].postal_code,
            'state_id':this.suburbsByCountry[i].state_id,
            'state_name':this.suburbsByCountry[i].state_name,
          });
        }

      }

      console.log('this.suburbsByCountry',this.suburbsByCountry);
      console.log('this.suburbData',this.suburbData);

    }
  })
})
}

/*Function for getting postal code*/
getPostalcode(selected: CompleterItem) {
  if(selected != null) {
    console.log('id of selected value',selected);
    if(selected.originalObject != '') {
      this.addAddress.postalCode = selected.originalObject.postal_code.postal_code;
      this.addAddress.state = selected.originalObject.state_id;
      this.addAddress.stateName = selected.originalObject.state_name;
      this.localStorage.set('statePostalCode', selected.originalObject);
    }

  }

}

/*Function for reseting postal code and suburb*/
resetSuburbPostal () {
  this.addAddress.postalCode = '';
  this.color3 = '';
}

/*Function for checking the selected options from Address Type*/
showOptions(event,item) {
  this.selected = item;
  // event.target.parentNode.parentNode.classList.remove('active');
  if(item.value == "ex") {
  console.log('ex');
  this.IsExisting = true;
} else {
  console.log('ne');
  this.IsExisting = false;
}
}

isActive(item) {
  return this.selected === item;
};

/*Function for selecting alredy existing address*/
selectAddress(address) {
  this.selectedExistingAddress = address;
  console.log('address',address);
}

onSubmit(form) {
  console.log('form',form);
  var reqData={};
  if(this.localStorage.get('userData') != null || this.localStorage.get('userData') != undefined) {
    this.userStoredData = JSON.parse(JSON.stringify(this.localStorage.get('userData')));
    //reqData['token']=this.userStoredData.token;
    if (this.userStoredData.token === "Token is missing") {
    reqData['token'] = '';
  }
  else {
    reqData['token']= this.userStoredData.token;
  }
}
reqData['addressLine1']=form.businessAddress1;
reqData['addressLine2']=form.businessAddress2;
reqData['country_Id']=form.country;
reqData['suburb']=form.suburb;
reqData['city']=form.city;
reqData['zipcode']=form.postalCode;
reqData['state_id']=form.state;
reqData['address_id']='';
if(this.localStorage.get('userData') != null || this.localStorage.get('userData') != undefined) {
  return new Promise(resolve => {
    this.userRequestManager.set('saveCustomerDeliveryAddress',reqData)
    .then(data => {
      var alldata = JSON.parse(JSON.stringify(data));
      if(alldata.status == 1){
        this.addFormData=alldata.data;
        this.localStorage.set('saveRegDeliveryNewAdd', reqData);
        for(let result of this.suburbsByCountry){
          // console.log('(result.state_id == form.state',result.state_id+'=='+ form.state);
          if(result.state_id == form.state)
          {
            alldata.data['state']=result.state_name;
            break;
          }

        }
        for(let result of this.countryData){
          if(result.id == form.country)
          {
            alldata.data['country']=result.name;
            break;
          }

        }
        this.result = this.addFormData;
        this.close();
      }
    })
  })
}
else
{
  //debugger;
  console.log('reqData',  this.suburbsByCountry);
  reqData['addressline1']=form.businessAddress1;
  reqData['addressline2']=form.businessAddress2;
  reqData['country_Id']=form.country;
  reqData['state_id']=form.state;
  reqData['suburb']=form.suburb;
  reqData['city']=form.city;
  reqData['postcode']=form.postalCode;

  for(let result of this.suburbsByCountry){
    console.log('(result.state_id == form.state',result.state_id+'=='+ form.state);
    if(result.state_id == form.state)
    {
      reqData['state']=result.state_name;
      break;
    }

  }
  for(let result of this.countryData){
    if(result.id == form.country)
    {
      reqData['country']=result.name;
      break;
    }

  }
  console.log('statedetails.id', reqData['state_id']);
  // reqData['state_id']=form.state;
  reqData['address_id']='';
  this.result = reqData;
  this.close();
}

}

apply() {
  console.log('selectedExistingAddress',this.selectedExistingAddress);
  this.result = this.selectedExistingAddress;
  // this.result = this.message;
  this.close();
}
}
