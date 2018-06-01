import {Component, OnInit, ViewChild, Input, AfterViewInit, Output, EventEmitter, Renderer} from '@angular/core';
import {LocalStorageService} from 'angular-2-local-storage';
import {OnClickEvent, OnRatingChangeEven, OnHoverRatingChangeEvent} from 'angular-star-rating';
import {Observable} from 'rxjs/Observable';
import * as moment from 'moment';
import {ConfirmComponent} from './confirm.component';
import {PromptComponent} from './prompt.component';
import {DialogService} from 'ng2-bootstrap-modal';
import {
    Router,
    ActivatedRoute,
    Event as RouterEvent,// import as RouterEvent to avoid confusion with the DOM Event
    NavigationStart,
    NavigationEnd,
    NavigationCancel,
    NavigationError,
} from '@angular/router';

import {SpinnerService} from './../common/spinner.service';

declare var $: any;

@Component({
    selector: 'restaurant-search',
    templateUrl: './restaurant.search.component.html',
    styleUrls: ['./restaurant.search.component.scss'],
})

export class RestaurantSearchComponent implements OnInit {
    @Input() restaurants: any;
    @Input() addClear: number;
    @Input() skip: boolean;
    public clearfix: boolean;
    public dontClear : boolean;
    public item: any;
    public serviceArray: any;
    public featuresArray: any;
    public phoneNo: any;
    private renderer: Renderer;
    // public imageURL = "https://orderpointAdminStaging.azurewebsites.net/uploadedimages/RestaurantLogo/";
    public imageURL = "https://adminstaging.azurewebsites.net/uploadedimages/RestaurantLogo/";
    public resAddress = {
      suburb:'',
      state: '',
      postcode: '',
      country: '',
      address1: '',
      address2: '',
      city: ''
    };
    //public addressLine1 = {address1: '', address2: '', city: ''};

    constructor(public localStorage: LocalStorageService,
                public spinnerService: SpinnerService,) {
    }


    ngOnInit() {
        this.clearfix = (this.addClear + 1) % 2 == 0;
        this.dontClear = this.skip;
        $('[data-toggle="popover"]').popover();
        this.restaurantSearch();
    }

    restaurantSearch() {
        let restaurants = this.restaurants;
        if (restaurants != null && restaurants != undefined) {
            this.item = restaurants;
            var addressOfRes = this.item.address;
            if (addressOfRes.address1) {
              this.resAddress.address1 = addressOfRes.address1;
            }
            if (addressOfRes.address2) {
              this.resAddress.address2 = ", "+ addressOfRes.address2;
            }
            if (addressOfRes.city) {
              this.resAddress.city = ", "+ addressOfRes.city
            }
            //this.addressLine1 = address1 + address2 + city;
            if (addressOfRes.suburb) {
              this.resAddress.suburb = addressOfRes.suburb;
            }
            if (addressOfRes.state) {
              this.resAddress.state = ", "+ addressOfRes.state;
            }
            if (addressOfRes.Postcode) {
              this.resAddress.postcode = ", "+ addressOfRes.Postcode;
            }
            if (addressOfRes.country) {
              this.resAddress.country = ", "+ addressOfRes.country
            }
            this.item.photoUrl = this.imageURL + this.item.photoUrl
        }
    }

    scrollDiv(event, type) {
        if (type === 'service') {
            if (this.serviceArray === 'service' || this.serviceArray === 'noService') {
                this.serviceArray = null;
                this.featuresArray = null;
                this.phoneNo = null;
            }
            else {
                if (this.item.service.length > 0) {
                    this.serviceArray = 'service';
                }
                else {
                    this.serviceArray = 'noService';
                }
            }
        }
        else if (type === 'features') {
            if (this.featuresArray === 'features' || this.featuresArray === 'noFeatures') {
                this.serviceArray = null;
                this.featuresArray = null;
                this.phoneNo = null;
            }
            else {
                if (this.item.features.length > 0) {
                    this.featuresArray = 'features';
                }
                else {
                    this.featuresArray = 'noFeatures';
                }
            }
        }
        else if (type === 'phone') {
            if (this.phoneNo === 'phone' || this.phoneNo === 'noPhone') {
                this.serviceArray = null;
                this.featuresArray = null;
                this.phoneNo = null;
            }
            else {
                if (this.item.phone) {
                    this.phoneNo = 'phone';
                }
                else {
                    this.phoneNo = 'noPhone';
                }
            }
        }

    }

    listCuisines(c, l){

        if(c.length == 0){
            return "No Cuisines";
        }

        let cuisines = '';
        if(l != 0){
            for(var i=0; i < c.length; i++){
                if(i > l){
                    break;
                }
                cuisines += c[i].cuisinename + ', ';
            }
        }else{
            for(var i=0; i < c.length; i++){
                cuisines += c[i].cuisinename + ', ';
            }
        }
        cuisines = cuisines.slice(0, -2);
        return cuisines;
    }
}
