import { Routes } from '@angular/router';

//pages
import {ConfirmComponent} from './../pages/payment/confirm.component';
import {PaymentComponent} from './../pages/payment/payment.component';
import {ConfirmOrderComponent} from './../pages/payment/confirmorder.component';
import {RestaurantComponent} from './../pages/restaurantRevamp/restaurant.component';
import {RestaurantDetailComponent} from './../pages/restaurantRevamp/restaurantdetail.component';
import {HomeComponent} from '../pages/home/home.component';
import {LoginComponent} from '../pages/login/login.component';
import {RegisterComponent} from '../pages/register/register.component';
import {CartComponent} from '../pages/cart/cart.component';
import {SubmitListing1Component} from '../pages/submitlisting/submitlisting1.component';
import {SubmitListing2Component} from '../pages/submitlisting/submitlisting2.component';
import {SubmitListing3Component} from '../pages/submitlisting/submitlisting3.component';
import {SubmitListing4Component} from '../pages/submitlisting/submitlisting4.component';
import {FakeComponent} from './../pages/restaurantRevamp/fake.component';
import {MyprofileComponent} from '../pages/dashboard/myprofile.component';
import {MyreservationComponent} from '../pages/dashboard/myreservation.component';
import {MyReviewsComponent} from '../pages/dashboard/myreviews.component';
import {MydinehistoryComponent} from '../pages/dashboard/mydinehistory.component';
import {MyOnlineOrderHistoryComponent} from '../pages/dashboard/myonlineorderhistory.component';
import {MyTrackOrderComponent} from '../pages/dashboard/mytrackorder.component';
import {MyFavouritesComponent} from '../pages/dashboard/myfavourites.component';
import {MyBenefitsComponent} from '../pages/dashboard/mybenefits.component';
import {ContactComponent} from '../pages/footer/contact.component';
import {AboutUsComponent} from '../pages/footer/aboutus.component';
import {PressComponent} from '../pages/footer/press.component';
import {PrivacyPolicyComponent} from '../pages/footer/privacy-policy.component';
import {TermsComponent} from '../pages/footer/terms.component';
import {HelpComponent} from '../pages/footer/help.component';
import {ForgotPasswordComponent} from '../pages/forgotPassword/forgotPassword.component';
import {ResetPasswordComponent} from '../pages/resetPassword/resetPassword.component';
// Route Configuration
export const routes:Routes= [
   {path: '',           component: HomeComponent },
   {path: 'home',       component: HomeComponent },
   {path: 'login',      component: LoginComponent },
   {path: 'register',   component: RegisterComponent },
   {path: 'cart/:id',       component: CartComponent },
   {path: 'submitlisting1',       component: SubmitListing1Component },
   {path: 'submitlisting2',       component: SubmitListing2Component },
   {path: 'submitlisting3',       component: SubmitListing3Component },
   {path: 'submitlisting4',       component: SubmitListing4Component },
   {path: 'restaurant',       component: RestaurantComponent },
   {path: 'fake',       component: FakeComponent },
   {path: 'myreservation',       component: MyreservationComponent },
   {path: 'myreviews',       component: MyReviewsComponent },
   {path: 'mydinehistory',       component: MydinehistoryComponent },
   {path: 'myprofile',       component: MyprofileComponent },
   {path: 'restaurantdetail/:id',       component: RestaurantDetailComponent },
   {path: 'payment', component: PaymentComponent },
   {path: 'confirm', component: ConfirmComponent },
   {path: 'confirmorder', component: ConfirmOrderComponent },
   {path: 'contact', component: ContactComponent },
   {path: 'aboutus', component: AboutUsComponent },
   {path: 'press', component: PressComponent },
   {path: 'privacy-policy', component: PrivacyPolicyComponent },
   {path: 'terms', component: TermsComponent },
   {path: 'help', component: HelpComponent },
   {path: 'myonlineorderhistory', component: MyOnlineOrderHistoryComponent },
   {path: 'mytrackorder', component: MyTrackOrderComponent },
   {path: 'mybenefits', component: MyBenefitsComponent },
   {path: 'myfavourites', component: MyFavouritesComponent },
   {path: 'forgotPassword', component: ForgotPasswordComponent },
    {path: 'resetPassword', component: ResetPasswordComponent },
   // {path: '/restaurant', component: RestaurantComponent },
];
