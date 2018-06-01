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

@Component({
    selector: 'restaurant-timing',
    templateUrl: './restaurant.timing.component.html',
    styleUrls: ['./restaurant.timing.component.scss']
})

export class RestaurantTimingComponent implements OnInit {
    @Input() timing;
    @Input() delivery;
    @Input() takeAway;
    public businesstiming;
    public deliveryTimings;
    public takeAwaytimings;
    public businessTimingsArray;
    public deliveryTimingsArray;
    public takeAwayTimingsArray;
    public activedefault: any = 'active';


    constructor(public localStorage: LocalStorageService,
                public spinnerService: SpinnerService) {
    }


    ngOnInit() {
        this.restaurantSearch();
    }

    restaurantSearch() {
        console.log("delivery : "+this.delivery);
        console.log("takeAway : "+this.takeAway);
        var currentDay = moment().day() + '';
        this.businessTimingsArray = [];
        this.deliveryTimingsArray = [];
        this.takeAwayTimingsArray = [];
        var openingHours = this.timing.restaurantOpeninghrs;
        var businessTimingArray = openingHours.Business;
        var deliveryTimingArray = openingHours.Delivery;
        var takeAwayTimingArray = openingHours.Takeaway;
        for (let i = 0; i < businessTimingArray.length; i++) {
            this.businesstiming = [];
            var businessObj = businessTimingArray[i];
            var businessDay = businessObj.day;
            if (businessDay === 'Monday') {
                var businessWeeksDay = 'Mon';
                var businessDayNo = '1';
            }
            if (businessDay === 'Tuesday') {
                businessWeeksDay = 'Tue';
                businessDayNo = '2';
            }
            if (businessDay === 'Wednesday') {
                businessWeeksDay = 'Wed';
                businessDayNo = '3';
            }
            if (businessDay === 'Thursday') {
                businessWeeksDay = 'Thu';
                businessDayNo = '4';
            }
            if (businessDay === 'Friday') {
                businessWeeksDay = 'Fri';
                businessDayNo = '5';
            }
            if (businessDay === 'Saturday') {
                businessWeeksDay = 'Sat';
                businessDayNo = '6';
            }
            if (businessDay === 'Sunday') {
                businessWeeksDay = 'Sun';
                businessDayNo = '7';
            }
            var businessTim = businessObj.timing;
            for (var j = 0; j < businessTim.length; j++) {
                var businessTimingObj = businessTim[j];
                if (businessTimingObj.OpeningHrs) {
                    var businessOpeningHrs = businessTimingObj.OpeningHrs;
                }
                if (businessTimingObj.ClosingHrs) {
                    var businessClosingHrs = businessTimingObj.ClosingHrs;
                }
                var businessDayTiming = businessOpeningHrs + '  -  ' + businessClosingHrs;
                if (businessDayTiming) {
                    this.businesstiming.push(businessDayTiming);
                }
            }
            if (currentDay === businessDayNo) {
                var businessActiveDay = 'True'
            }
            else {
                businessActiveDay = 'False'
            }
            if (this.businesstiming != null) {
                var businessTiming = {
                    day: businessWeeksDay,
                    timings: this.businesstiming.join(" "),
                    activeDay: businessActiveDay
                };
                this.businessTimingsArray.push(businessTiming);
            }
        }
        for (let k = 0; k < deliveryTimingArray.length; k++) {
            this.deliveryTimings = [];
            var deliveryObj = deliveryTimingArray[k];
            var deliveryday = deliveryObj.day;
            if (deliveryday === 'Monday') {
                var deliveryWeeksDay = 'Mon';
                var deliveryDayNo = '1';
            }
            if (deliveryday === 'Tuesday') {
                deliveryWeeksDay = 'Tue';
                deliveryDayNo = '2';
            }
            if (deliveryday === 'Wednesday') {
                deliveryWeeksDay = 'Wed';
                deliveryDayNo = '3';
            }
            if (deliveryday === 'Thursday') {
                deliveryWeeksDay = 'Thu';
                deliveryDayNo = '4';
            }
            if (deliveryday === 'Friday') {
                deliveryWeeksDay = 'Fri';
                deliveryDayNo = '5';
            }
            if (deliveryday === 'Saturday') {
                deliveryWeeksDay = 'Sat';
                deliveryDayNo = '6';
            }
            if (deliveryday === 'Sunday') {
                deliveryWeeksDay = 'Sun';
                deliveryDayNo = '7';
            }
            var deliveryTimings = deliveryObj.timing;
            for (var l = 0; l < deliveryTimings.length; l++) {
                var deliveryTimingObj = deliveryTimings[l];
                if (deliveryTimingObj.OpeningHrs) {
                    var deliveryOpeningHrs = deliveryTimingObj.OpeningHrs;
                }
                if (deliveryTimingObj.ClosingHrs) {
                    var deliveryClosingHrs = deliveryTimingObj.ClosingHrs;
                }
                var deliveryDayTiming = deliveryOpeningHrs + '-' + deliveryClosingHrs;
                if (deliveryDayTiming) {
                    this.deliveryTimings.push(deliveryDayTiming);
                }
            }
            if (currentDay === deliveryDayNo) {
                var deliveryActiveDay = 'True';
            }
            else {
                deliveryActiveDay = 'False';
            }
            if (this.deliveryTimings != null) {
                var deliveryTiming = {
                    day: deliveryWeeksDay,
                    timings: this.deliveryTimings.join(" "),
                    activeDay: deliveryActiveDay
                };
                this.deliveryTimingsArray.push(deliveryTiming);
            }
        }
        for (let m = 0; m < takeAwayTimingArray.length; m++) {
            this.takeAwaytimings = [];
            var takeAwayObj = takeAwayTimingArray[m];
            var takeAway = takeAwayObj.day;
            if (takeAway === 'Monday') {
                var takeAwayWeeksDay = 'Mon';
                var takeAwayDayNo = '1';
            }
            if (takeAway === 'Tuesday') {
                takeAwayWeeksDay = 'Tue';
                takeAwayDayNo = '2';
            }
            if (takeAway === 'Wednesday') {
                takeAwayWeeksDay = 'Wed';
                takeAwayDayNo = '3';
            }
            if (takeAway === 'Thursday') {
                takeAwayWeeksDay = 'Thu';
                takeAwayDayNo = '4';
            }
            if (takeAway === 'Friday') {
                takeAwayWeeksDay = 'Fri';
                takeAwayDayNo = '5';
            }
            if (takeAway === 'Saturday') {
                takeAwayWeeksDay = 'Sat';
                takeAwayDayNo = '6';
            }
            if (takeAway === 'Sunday') {
                takeAwayWeeksDay = 'Sun';
                takeAwayDayNo = '7';
            }
            var takeAwayTimings = takeAwayObj.timing;
            for (var n = 0; n < takeAwayTimings.length; n++) {
                var takeAwaytimingObj = takeAwayTimings[n];
                if (takeAwaytimingObj.OpeningHrs) {
                    var takeAwayOpeningHrs = takeAwaytimingObj.OpeningHrs;
                }
                if (takeAwaytimingObj.ClosingHrs) {
                    var takeAwayClosingHrs = takeAwaytimingObj.ClosingHrs;
                }
                var takeAwaydayTiming = takeAwayOpeningHrs + ' - ' + takeAwayClosingHrs;
                if (takeAwaydayTiming) {
                    this.takeAwaytimings.push(takeAwaydayTiming);
                }
            }
            if (currentDay === takeAwayDayNo) {
                var takeAwayActiveDay = 'True';
            }
            else {
                takeAwayActiveDay = 'False';
            }
            if (this.takeAwaytimings != null) {
                var takeAwayTiming = {
                    day: takeAwayWeeksDay,
                    timings: this.takeAwaytimings.join(" "),
                    activeDay: takeAwayActiveDay
                };
                this.takeAwayTimingsArray.push(takeAwayTiming);
            }
        }
        console.log('businessTimingsArray : ' + JSON.stringify(this.businessTimingsArray));
    }
}
