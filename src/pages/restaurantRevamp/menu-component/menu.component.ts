import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { OnClickEvent, OnRatingChangeEven, OnHoverRatingChangeEvent } from 'angular-star-rating';
import { Observable} from 'rxjs/Observable';
import * as moment from 'moment';
import { ConfirmComponent } from '../confirm.component';
import { PromptComponent } from '../prompt.component';
import { DialogService } from 'ng2-bootstrap-modal';
import {
  Router,
  ActivatedRoute,
  Event as RouterEvent,// import as RouterEvent to avoid confusion with the DOM Event
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
} from '@angular/router';

//providers
import { UserRequestManager } from '../../../providers/user-request-manager';
import { IsLogin } from '../../../providers/is-login';
import { AlertComponent } from '../../common/alert.component';
import { VALIDATIONERROR, COMMONTEXT, ALERTMSGS } from '../../../app/app.constants';
import { SpinnerService } from '../../common/spinner.service';

@Component({
  selector: 'menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})

export class MenuComponent implements OnInit {

    @Output() addToCartEvent = new EventEmitter();

    public merchantID: number;
    public restaurantMenu: any;
    public alertMsg: any;
    public validationError: any;
    public commonText: any;
    public userDetails: any;
    public menu: any;
    public selectedCategory = 'All';
    public noItemsFound = false;
    public searchText = '';
    public searchKey: string;
    public vegNonveg: any = [];
    public nonVegChecked = false;
    public vegChecked = false;
    public VNChecked = true;
    public allMenuItems: any= [];
    vegNonVegValue: string;

    constructor(
      public localStorage:LocalStorageService,
      public userRequestManager:UserRequestManager,
      private dialogService:DialogService,
      public activatedRoute:ActivatedRoute,
      public islogin:IsLogin,
      public spinnerService: SpinnerService,
    ) {
      console.log('inside restaurant detail constructor');
      this.validationError = VALIDATIONERROR;
      this.alertMsg = ALERTMSGS;
      this.commonText = COMMONTEXT;
      this.userDetails = JSON.parse(JSON.stringify(this.localStorage.get('userData')));
      this.searchText = '';
      this.vegNonVegValue = '';
    }

    ngOnInit() {
      this.activatedRoute.params.subscribe(params => {
        this.merchantID = +params['id'];
        // (+) converts string 'id' to a number
        this.getRestaurantMenu(this.merchantID);
      });
    }

    // Function which calls API to get the menu for a particular restaurant by passing restaurant id
    getRestaurantMenu(id) {
        this.spinnerService.show('homePageSpinner');
        this.userRequestManager.get('getMenuDetails/' + id).then(data => {
          this.spinnerService.hide("homePageSpinner");  
          const alldata  = JSON.parse(JSON.stringify(data));
          if(alldata.status === 1) {
            this.restaurantMenu = alldata.data.menueGroup;
            this.restaurantMenu.forEach(element => {
              this.allMenuItems = this.allMenuItems.concat(element.menuItems);
            });
            this.setCategory('All');
            console.log('Restaurant Menu ->>>>>>>>>>', this.restaurantMenu);
          }
        }, error => {
          this.spinnerService.hide('homePageSpinner');
          console.log('Error Fetching Menu', error);
        });
    }

    // Function which handles menu category change
    setCategory(category) {
      this.searchText = '';
      this.searchKey = '';
      if (category === 'All') {
        this.selectedCategory = 'All';
        this.menu = this.allMenuItems;
      } else {
        this.selectedCategory = category;
        this.menu = category.menuItems;
      }
      if (this.menu && this.menu.length === 0) {
        this.noItemsFound = true;
      } else {
        this.noItemsFound = false;
      }
    }

    // Function which handles search btn click
    onSearchBtnClick(searchTerm) {
      console.log('NOITEMS', this.noItemsFound);
      this.menu = this.allMenuItems;
      this.selectedCategory = 'All';
      this.searchText = searchTerm;
      if (this.menu && this.menu.length === 0) {
        this.noItemsFound = true;
      } else {
        this.noItemsFound = false;
      }
      console.log('NOITEMS', this.noItemsFound);
    }
}