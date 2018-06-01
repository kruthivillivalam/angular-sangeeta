import { Component,ViewChild,ElementRef   } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { DialogService } from "ng2-bootstrap-modal";
import { AlertComponent } from '../common/alert.component';
import { SpinnerService } from '../common/spinner.service';
//providers
import { SocialLogin } from '../../providers/social-login';
import { UserRequestManager } from '../../providers/user-request-manager';
import { VALIDATIONERROR, COMMONTEXT, MYPROFILEPAGEALERTMSGS } from 'app/app.constants';
@Component({
  selector: 'myprofile',
  template: require('./myprofile.component.html'),
})
export class MyprofileComponent  {
  title: string = 'Sign up';
  public userData:any;
  public user:any=[];
  public PermanentAddress:any=[];
  public deliveryAddress:any=[];
  public countryData:any;
  public stateData:any;
  public deliveryCountryData:any;
  public deliveryStateData:any;
  delivery_address_checkox: boolean = true;
  public display_message: string = '';
  change_password: string ='';
  confirm_password: string ='';
  display_password_update_message = '';
  months:any=['January','February','March','April','May','June','July','August','September','Octomber','November','December'];
  public years:any=[];
  public days:any=[];
  public alertMsg: any;
  public validationError: any;
  public commonText: any;
  public  dateofbirth: any ={
    days:null,
    month:null,
    year:null
  }
  //@ViewChild('state') email: ngModel;
constructor(
    public localStorage:LocalStorageService,
    public userRequestManager:UserRequestManager,
    public router:Router,
    private dialogService:DialogService,
    public spinnerService: SpinnerService        
  ){
      for(var i=1;i<=31;i++){
        this.days.push(i);
      }
      for(var q=1970;q<=2017;q++){
          this.years.push(q)
      }
      this.alertMsg = MYPROFILEPAGEALERTMSGS;
      localStorage.set('childheader',false);
     this.getMyAccountProfileData();
      this.getCountryData();
  }
    /*Function for getting country data from API*/
  getMyAccountProfileData () {
    return new Promise(resolve => {
      this.userData = this.localStorage.get('userData');
      console.log('userData', this.userData.token);
     if( this.userData.token != '')
      {
        this.userRequestManager.set('getMyAccountProfile',{token:this.userData.token})
        .then(data => {
          var alldata = JSON.parse(JSON.stringify(data));
         if(alldata.status === 1) {
            if(alldata.data.myAccount != '')
            {      
                this.user=alldata.data.myAccount;
                let dob = alldata.data.myAccount.dateOfbirth;
                dob = dob.split(" ");
                dob = dob[0].split("-");
                console.log('this.dateofbirth', this.dateofbirth);
                 this.dateofbirth.days = dob[2];
                this.dateofbirth.month = dob[1];
                this.dateofbirth.year = dob[0]; 
                console.log('this.dateofbirth', this.dateofbirth);
                this.PermanentAddress=alldata.data.PermanentAddress;
                this.deliveryAddress=alldata.data.DeliveryAddress;
            }
          }
          else if(alldata.status === 0) {
            this.showAlert(this.alertMsg.MYPROFILE_REQUEST_FAILED, alldata.msg);
          }  
        },error => {
          // Take action
          this.spinnerService.hide('homePageSpinner');
          this.showAlert(this.alertMsg.MYPROFILE_REQUEST_FAILED,error + "\n" + this.alertMsg.MYPROFILE_REQUEST_FAILED_MSG);
        })
      }
    })
  }
  onSubmit(data){
     this.userData = this.localStorage.get('userData');
     data.token=this.userData.token;
     if( data.token != '')
      {
        this.userRequestManager.set('updateMyAccountProfile',data) .then(data => {
          var alldata = JSON.parse(JSON.stringify(data));
          if(alldata.status === 1){
          this.showAlert(this.alertMsg.MYPROFILE_REQUEST_DONE, this.alertMsg.MYPROFILE_REQUEST_SUC_MSG);
           // this.display_message='Your profile detail\'s successfully updated.';
          }
          if(alldata.status === 0) {
            this.showAlert(this.alertMsg.MYPROFILE_REQUEST_FAILED, alldata.msg);
          }
        },error => {
          // Take action
          this.spinnerService.hide('homePageSpinner');
          this.showAlert(this.alertMsg.MYPROFILE_REQUEST_FAILED,error + "\n" + this.alertMsg.MYPROFILE_REQUEST_FAILED_MSG);
        }).catch( ( errorRes: Response ) => {
          if( errorRes.status === 500 )
          {
            //this.router.navigate(['/login']);
          }
        })  
      }
  }       
  onChangePassword(data){
    this.userData = this.localStorage.get('userData');
     data.token=this.userData.token;
     this.userRequestManager.set('updatePassword',data) .then(data => {
        var alldata = JSON.parse(JSON.stringify(data));
        if(alldata.status === 1){
          this.showAlert(this.alertMsg.MYPROFILE_CHNGPASS_REQUEST_DONE, this.alertMsg.MYPROFILE_CHNGPASS_REQUEST_SUC_MSG);
           // this.display_message='Your profile detail\'s successfully updated.';
          }
          if(alldata.status === 0) {
            this.showAlert(this.alertMsg.MYPROFILE_CHNGPASS_REQUEST_FAILED, alldata.message);
          }        
      },error => {
        // Take action
        this.spinnerService.hide('homePageSpinner');
        this.showAlert(this.alertMsg.MYPROFILE_CHNGPASS_REQUEST_FAILED,error + "\n" + this.alertMsg.MYPROFILE_CHNGPASS_REQUEST_FAILED_MSG);
      })
      
  }  
  /*Function for getting country data from API*/
  getCountryData () {
    return new Promise(resolve => {
      this.userRequestManager.get('CountryList')
      .then(data => {
        var alldata = JSON.parse(JSON.stringify(data));
        if(alldata.status == 1){
          this.countryData=alldata.data;
          this.deliveryCountryData=alldata.data;
          this.user.country= "1";
          this.getStateData(this.user.country);
        }
      })
    })
  }

  /*Function for getting state data from API*/  
  getStateData (value) {
    // console.log('value',this.user.country);
    let url = '';
    return new Promise(resolve => {
      url = 'StateList?country_id='+value;
      this.userRequestManager.get(url)
      .then(data => {
        var alldata = JSON.parse(JSON.stringify(data));
        //console.log('alldata for state list',alldata);
        if(alldata.status == 1){
          this.stateData=alldata.data;
          this.deliveryStateData=alldata.data;
          
        } else {
          this.user.state = '';
          this.stateData=[];
          this.deliveryStateData=[];
          
        }
        console.log('this.stateData',this.stateData);
      },function(err){
        console.log('err',err);
        this.user.state = '';
        this.stateData=[];
         this.deliveryStateData=[];
      }).catch((ex) => {
        this.user.state = '';
        this.stateData=[];
        this.deliveryStateData=[];        
      })

    })
  }   
  onCheckDeliveryAddress(e)
  {
    if(e.target.checked == true)
    {
     // alert(this.state+'aa');
      this.deliveryAddress=this.PermanentAddress;
    }  
    //alert('aaaa'+e.target.checked);
  } 
  showAlert(title,msg) {
    this.dialogService.addDialog(AlertComponent, {title:title, message:msg});
  }  
}
