import { Component, OnInit, ViewChild } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { OnClickEvent, OnRatingChangeEven, OnHoverRatingChangeEvent } from 'angular-star-rating';
import { Observable} from 'rxjs/Observable';
import * as moment from 'moment';
import { ConfirmComponent } from '../confirm.component';
import { PromptComponent } from '../prompt.component';
import { DialogService } from 'ng2-bootstrap-modal';
import {Http, Response,RequestOptions,Headers} from '@angular/http';
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
  selector: 'review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})

export class ReviewComponent implements OnInit {
    public merchantID: number;
    public userName: string;
    public ratingDate: any;
    public alertMsg: any;
    public validationError: any;
    public commonText: any;
    public userCommentObj: any;
    public userDetails: any;
    public userReviews: any;
    onClickResult:OnClickEvent;
    onHoverRatingChangeResult:OnHoverRatingChangeEvent;
    onRatingChangeResult:OnRatingChangeEven;

    constructor(
      public localStorage:LocalStorageService,
      public userRequestManager:UserRequestManager,
      private dialogService:DialogService,
      public activatedRoute:ActivatedRoute,
      public islogin:IsLogin,
      public spinnerService: SpinnerService,
      public http: Http
    ) {
      //console.log('inside restaurant detail constructor');
      this.validationError = VALIDATIONERROR;
      this.alertMsg = ALERTMSGS;
      this.commonText = COMMONTEXT;
      this.userDetails = JSON.parse(JSON.stringify(this.localStorage.get('userData')));
    }


    ngOnInit() {
      this.initRatingObj();
      this.getReviews();
    }

    getReviews() {
      //console.log("Get Review");
      //const apiURL = 'https://orderpointdev.azurewebsites.net/api/v1/getReviewList' + '?merchantId=' + this.merchantID;
      this.userRequestManager.getRestaurantReviews('getReviewList', this.merchantID).then(resp => {
        if (resp['data'] && resp['data']['reviews']) {
          this.userReviews = resp['data']['reviews'];
        }
        //console.log('REVIEW RESPONSE', this.userReviews);
      }, function(error) {
         //console.log('REVIEW ERRROR', error);
      });
    }

    initRatingObj() {

      this.activatedRoute.params.subscribe(params => {
        this.merchantID = +params['id'];
        // (+) converts string 'id' to a number
      });
      this.ratingDate = moment().format('DD-MMM-YYYY');
      this.userName = '';
      if(this.userDetails){
        this.userName = this.userDetails.firstName + this.userDetails.lastName;
      }

      if (this.localStorage.get('userToken') !== null && this.localStorage.get('userToken') !== undefined) {
        var token = this.localStorage.get('userToken');
      }
      else {
        token = '';
      }
      this.userCommentObj = {
        merchantId : this.merchantID,
        review_title : '',
        review_text : '',
        star_rating : 5,
        sentiment_rating : 5,
        avg_user_rating : 5,
        token :  token,
      };
      //console.log('INIT RATING OBJ',  this.userCommentObj);
    }

    onRatingClick = ($event: OnClickEvent) => {
        this.userCommentObj.star_rating = $event.rating;
        this.onClickResult = $event;
        //console.log('onClick $event: ', this.userCommentObj.star_rating);
    }

    onPostComment(obj){
      //console.log("Comment : " +JSON.stringify(this.userCommentObj));
      if(this.userCommentObj.review_text && this.userCommentObj.review_title) {
        this.postComment(this.userCommentObj.review_text);
      } else {
        this.dialogService.addDialog(
          AlertComponent, {
            title: this.validationError.COMMENT_EMPTY_TITLE,
            message: this.validationError.COMMENT_EMPTY_ERR
          });
      }
    }

    onCancelBtnClick(){
      this.initRatingObj();
    }

    postComment(comment) {
      this.spinnerService.show('homePageSpinner');
      // TEXT ANALYSIS API CALL
      this.userRequestManager.textSentimentAnalysis(comment).then((data) => {
        this.spinnerService.hide('homePageSpinner');
        const sentimentScore = Math.round((JSON.parse(JSON.stringify(data)).documents[0].score * 10) / 2);
        //console.log('ANALYSIS RESULT', sentimentScore);
        this.userCommentObj.sentiment_rating = sentimentScore;
        this.userCommentObj.avg_user_rating = Math.round((sentimentScore +  this.userCommentObj.star_rating) / 2);
        // Post Review API Call

        this.userRequestManager.set('updateReview', this.userCommentObj).then(response => {
          if(response['status'] === 1){
            this.userCommentObj.review_text = '';
            this.userCommentObj.review_title = '';
            this.dialogService.addDialog(
              AlertComponent, {
                title: this.alertMsg.POSTCMNT_SUC_TITLE,
                message: this.alertMsg.POSTCMNT_SUC_MSG
              });
              this.getReviews();
          }
        }, error => {
          this.spinnerService.hide('homePageSpinner');
          console.log(error);
        });
      }, (err) => {
        this.spinnerService.hide('homePageSpinner');
        //console.log('ANALYSIS ERROR', err);
        this.dialogService.addDialog(
          AlertComponent, {
            title: this.alertMsg.POSTCMNT_FAIL_TITLE,
            message: this.alertMsg.POSTCMNT_FAIL_MSG
          });
      });
    }
}
