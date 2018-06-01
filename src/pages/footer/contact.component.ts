import { Component,ViewChild,ElementRef  } from '@angular/core';
import { Router } from '@angular/router';
import { UserRequestManager } from '../../providers/user-request-manager';
import { LocalStorageService } from 'angular-2-local-storage';
import { DialogService } from "ng2-bootstrap-modal";
import { AlertComponent } from '../common/alert.component';
@Component({
    selector: 'contact',
    template: require('./contact.component.html')
  })
  export class ContactComponent  {
    public userData:any;
    public error_message: any;
    public customer_email: any;
 
    constructor(
      public localStorage:LocalStorageService,
      public userRequestManager:UserRequestManager,
      public router:Router,
      private dialogService:DialogService
    ){

    }
    onSubmit(data){
      this.userData = this.localStorage.get('userData');
      data.token=this.userData.token;
      
      if( data.token != '')
       {
         this.userRequestManager.set('sendContactUsDetail',data).then(data => {
           var alldata = JSON.parse(JSON.stringify(data));
           if(alldata.status == 1)
           this.dialogService.addDialog(AlertComponent, {
            title:'Status',
            message:'Thanks.Message is send to admin. Admin will contact you.',
          })
          .subscribe((message)=>{
            this.router.navigate(['home']);
          });
          })
         .catch( ( errorRes: Response  ) => {
//alert(errorRes.msg);
          if( errorRes.status === 500 )
          {

            this.error_message = "There is some Error. Please try this later. ";

          }
        }) 
       }
   }  
  }    