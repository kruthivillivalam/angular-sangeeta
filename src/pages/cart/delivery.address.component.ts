import { Component,ViewChild } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { CompleterService, CompleterData, CompleterItem, CompleterCmp } from 'ng2-completer';
import { LocalStorageService } from 'angular-2-local-storage';

//providers
import { UserRequestManager } from '../../providers/user-request-manager';

export interface PromptModel {

}

@Component({
  selector: 'delivery-address',
  templateUrl: './delivery.address.component.html',
})
export class DeliveryAddressComponent extends DialogComponent<PromptModel, any> implements PromptModel {
  public addAddress: any=[];
  public countryData: any;
  public addressObj: any;
  protected dataService: CompleterData;
  public token: any;
  @ViewChild('state') state;

  constructor(
    dialogService: DialogService,
    public userRequestManager: UserRequestManager,
    private completerService: CompleterService,
    public localStorage: LocalStorageService,
  ) {
    super(dialogService);
    this.getAddress();
  }

  getAddress(){
    this.addressObj = JSON.parse(JSON.stringify(this.localStorage.get('postCodeObj')));
    this.addAddress.postalCode = this.addressObj.postcode;
    this.addAddress.suburb = this.addressObj.suburb;
    this.addAddress.state = this.addressObj.state;
    this.addAddress.country = this.addressObj.country;
    this.addAddress.state_Id = this.addressObj.state_Id
    this.token = this.localStorage.get('userToken');
    console.log('ADDRESS OBJ'+ JSON.stringify(this.addressObj, this.addAddress));
  }


  onSubmit(form) {
    let reqData = {};
    reqData['token'] = this.token;
    reqData['addressLine1'] = form.businessAddress1;
    reqData['addressLine2'] = form.businessAddress2;
    reqData['country_Id'] = this.addressObj.country_Id;
    reqData['suburb'] =  this.addressObj.suburb;
    reqData['city'] = form.city;
    reqData['zipcode'] = this.addressObj.postcode;
    reqData['state_id'] = this.addressObj.state_Id;
    reqData['address_id'] = '';
    if (this.token !== '' &&  this.token !== null && this.token !== undefined && this.token !== "Token is missing") {
      this.userRequestManager.set('saveCustomerDeliveryAddress', reqData)
      .then(data => {
        const alldata = JSON.parse(JSON.stringify(data));
        if(alldata.status === 1) {
          //this.result = reqData;
        }
      }, error => {
        console.log('Address Not Saved', error);
      });
    }
    reqData['addressline1'] = form.businessAddress1;
    reqData['addressline2'] = form.businessAddress2;
    reqData['country_Id'] = this.addressObj.country_Id;
    reqData['state_id'] = this.addressObj.state_id;
    reqData['postcode'] =this.addressObj.postcode;
    this.result = reqData;
    this.close();
  }

  apply() {
    this.close();
  }
}
