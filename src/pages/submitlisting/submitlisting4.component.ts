import {Component} from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
@Component({
    selector: 'submitlisting4',
    template: require('./submitlisting4.component.html')
  })


  export class SubmitListing4Component  {
    constructor(
      public localStorage:LocalStorageService,
      ) {
        this.localStorage.remove('step1');
        this.localStorage.remove('step2');
       }
  }
