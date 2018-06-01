import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Angular2SocialLoginModule } from "angular2-social-login";
import { TwitterService } from 'ng2-twitter';
import { RouterModule } from '@angular/router';
import { LocalStorageModule } from 'angular-2-local-storage';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import {routes} from './app.routes';
import { AppComponent } from './app.component';
import { SwiperModule } from 'angular2-useful-swiper'; //or for angular-cli the path will be ../../node_modules/angular2-useful-swiper
import { NgxGalleryModule } from 'ngx-gallery'; // gallery silder
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BusyModule} from 'angular2-busy';
import { Ng2CompleterModule } from "ng2-completer";
import { NouisliderModule } from 'ng2-nouislider';
import {NgxPaginationModule} from 'ngx-pagination';
import { StarRatingModule } from 'angular-star-rating';
import { TreeModule } from 'angular-tree-component';
import { NguiMapModule} from '@ngui/map';
import { BootstrapModalModule } from 'ng2-bootstrap-modal';



import { MomentModule } from 'angular2-moment';
import { FacebookModule } from 'ngx-facebook';


//pages
import {HomeComponent} from '../pages/home/home.component';
import {CartComponent} from '../pages/cart/cart.component';
import {PaymentComponent} from '../pages/payment/payment.component';
import {ConfirmComponent} from '../pages/payment/confirm.component';
import {ConfirmOrderComponent} from './../pages/payment/confirmorder.component';
import {RestaurantComponent} from '../pages/restaurantRevamp/restaurant.component';
import {RestaurantDetailComponent} from '../pages/restaurantRevamp/restaurantdetail.component';
import {LoginComponent} from '../pages/login/login.component';
import {RegisterComponent} from '../pages/register/register.component';
import {FakeComponent} from '../pages/restaurantRevamp/fake.component';
import {SubmitListing1Component} from '../pages/submitlisting/submitlisting1.component';
import {SubmitListing2Component} from '../pages/submitlisting/submitlisting2.component';
import {SubmitListing3Component} from '../pages/submitlisting/submitlisting3.component';
import {SubmitListing4Component} from '../pages/submitlisting/submitlisting4.component';
import {MyprofileComponent} from '../pages/dashboard/myprofile.component';
import {MyreservationComponent} from '../pages/dashboard/myreservation.component';
import {MyReviewsComponent} from '../pages/dashboard/myreviews.component';
import {MydinehistoryComponent} from '../pages/dashboard/mydinehistory.component';
import {MyFavouritesComponent} from '../pages/dashboard/myfavourites.component';
import {confirmCancellationPopupComponent} from '../pages/dashboard/confirmCancellationPopup.component';
import {MyOnlineOrderHistoryComponent} from '../pages/dashboard/myonlineorderhistory.component';
import {MyTrackOrderComponent} from '../pages/dashboard/mytrackorder.component';
import {ContactComponent} from '../pages/footer/contact.component';
import {AboutUsComponent} from '../pages/footer/aboutus.component';
import {PressComponent} from '../pages/footer/press.component';
import {PrivacyPolicyComponent} from '../pages/footer/privacy-policy.component';
import {TermsComponent} from '../pages/footer/terms.component';
import {HelpComponent} from '../pages/footer/help.component';
import {MyBenefitsComponent} from '../pages/dashboard/mybenefits.component';
import {LeftMenuComponent} from '../pages/dashboard/leftmenu.component';
import { ReviewComponent } from '../pages/restaurantRevamp/review-component/review.component';
import { MenuComponent } from '../pages/restaurantRevamp/menu-component/menu.component';
import { MenuItemComponent } from '../pages/restaurantRevamp/menu-component/menu-item-component/menu.item.component';
import { CartItemComponent } from '../pages/restaurantRevamp/cart.item.component';
import { RestaurantInfoComponent } from '../pages/restaurantRevamp/restaurant-info-component/restaurant-info.component';
import { GalleryComponent } from '../pages/restaurantRevamp/gallery-component/gallery.component';
import { ReservationComponent } from '../pages/restaurantRevamp/reservation-component/reservation.component';
import { RestaurantSearchComponent } from '../pages/restaurantRevamp/restaurant.search.component';
import {RestaurantTimingComponent} from '../pages/restaurantRevamp/restaurant.timing.component';
import {ForgotPasswordComponent} from '../pages/forgotPassword/forgotPassword.component';
import {ResetPasswordComponent} from '../pages/resetPassword/resetPassword.component';
//derective

import { EqualValidator } from '../directives/equal-validator.directive';

//Pipe
import { ObjNgFor } from '../pipes/obj-ng-for';
import { SearchFilterPipe } from '../pipes/search-filter.pipe';
import { VegNonVegFilter } from '../pipes/veg-nonveg-filter.pipe';

//Provider
import { UserRequestManager } from '../providers/user-request-manager';
import { SocialLogin } from '../providers/social-login';
import { IsLogin } from '../providers/is-login';
import { SpinnerService } from '../pages/common/spinner.service';

// import { ConfirmComponent } from '../pages/restaurant/confirm.component';
import { PromptComponent } from '../pages/restaurantRevamp/prompt.component';
import { AlertComponent } from '../pages/common/alert.component';
import { AddressComponent } from '../pages/cart/address.component';
import { SpinnerComponent } from '../pages/common/spinner.component';
import { DeliveryAddressComponent } from '../pages/cart/delivery.address.component';


let providers = {
    "google": {
      //old deprecated "clientId": "887236121689-klk40bitg8e4k49fun4tf95dt8ma4bgo.apps.googleusercontent.com"
      "clientId": "969578544738-31i4nl98dt06p1m0kh1n2e3di9kois40.apps.googleusercontent.com"
    },
    // "linkedin": {
    //   "clientId": "LINKEDIN_CLIENT_ID"
    // },
    "facebook": {
      "clientId": "125711328017266",
      "apiVersion": "v2.9" //like v2.4
    }
  };

@NgModule({
  imports: [
    BrowserModule,
    Ng2CompleterModule,
    FormsModule,
    Angular2SocialLoginModule,
    LocalStorageModule.withConfig({storageType: 'localStorage'}),
    HttpModule,
    SwiperModule,
    RouterModule.forRoot(routes),
    FacebookModule.forRoot(),
    BusyModule,
    NouisliderModule,
    NgxPaginationModule,
    StarRatingModule.forRoot(),
    TreeModule,
    NguiMapModule.forRoot({apiUrl: 'https://maps.google.com/maps/api/js?key=AIzaSyD1pXm32yIZCZzsJGIOnp1PPdyiuA0W7gg'}),
    MomentModule,
    BootstrapModalModule,
    NgxGalleryModule
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    CartComponent,
    SubmitListing1Component,
    SubmitListing2Component,
    SubmitListing3Component,
    SubmitListing4Component,
    RestaurantComponent,
    RestaurantDetailComponent,
    PaymentComponent,
    ConfirmOrderComponent,
    ConfirmComponent,
    FakeComponent,
    EqualValidator,
    ObjNgFor,
    RegisterComponent,
    MyprofileComponent,
    MyreservationComponent,
    MydinehistoryComponent,
    MyOnlineOrderHistoryComponent,
    MyTrackOrderComponent,
    MyFavouritesComponent,
    SearchFilterPipe,
    VegNonVegFilter,
    MyBenefitsComponent,
    MyReviewsComponent,
     // ConfirmComponent,
    PromptComponent,
    AlertComponent,
    AddressComponent,
    DeliveryAddressComponent,
    ContactComponent,
    AboutUsComponent,
    PressComponent,
    PrivacyPolicyComponent,
    TermsComponent,
    HelpComponent,
    LeftMenuComponent,
    confirmCancellationPopupComponent,
    SpinnerComponent,
    ReviewComponent,
    MenuComponent,
    MenuItemComponent,
    CartItemComponent,
    RestaurantInfoComponent,
    GalleryComponent,
	ReservationComponent,
	RestaurantSearchComponent,
	RestaurantTimingComponent,
  ForgotPasswordComponent,
  ResetPasswordComponent
  ],
  providers: [UserRequestManager,TwitterService,CookieService,SocialLogin,IsLogin,SpinnerService],
  bootstrap: [AppComponent],
  entryComponents: [SpinnerComponent,ConfirmComponent,PromptComponent,AlertComponent,AddressComponent,DeliveryAddressComponent,confirmCancellationPopupComponent]
})
export class AppModule { }
Angular2SocialLoginModule.loadProvidersScripts(providers);
