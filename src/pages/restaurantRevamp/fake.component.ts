import {Component, OnInit, ViewChild} from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import {
    Router,
    // import as RouterEvent to avoid confusion with the DOM Event
    Event as RouterEvent,
    NavigationStart,
    NavigationEnd,
    NavigationCancel,
    NavigationError,
} from '@angular/router';

//providers
// import { IsLogin } from '../../providers/is-login';

@Component({
  selector: 'fake',
  template: ''
})
export class FakeComponent implements OnInit {

  constructor(
    public localStorage:LocalStorageService,
    public router : Router,
    // public islogin:IsLogin,
  ) {
    console.log('inside restaurant listing constructor');
    // this.islogin.isLoggedIn();
  }

  ngOnInit() {
    this.router.navigate(['restaurant']);
  }
}
