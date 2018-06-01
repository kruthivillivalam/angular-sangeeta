import { Component,OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
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
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';

@Component({
    selector: 'gallery',
    templateUrl: './gallery.component.html',
    styleUrls: ['./gallery.component.scss']
  })

  export class GalleryComponent implements OnInit {
    galleryOptions: NgxGalleryOptions[];
    galleryImages: NgxGalleryImage[];
 
    ngOnInit(): void {     
 
        this.galleryOptions = [
            {
                width: '100%',
                height: '400px',
                thumbnailsColumns: 4,
                imageAnimation: NgxGalleryAnimation.Slide
            },
            // max-width 800
            {
                breakpoint: 800,
                width: '100%',
                height: '600px',
                imagePercent: 80,
                thumbnailsPercent: 20,
                thumbnailsMargin: 20,
                thumbnailMargin: 20
            },
            // max-width 400
            {
                breakpoint: 400,
                preview: false
            }
        ];
 
        this.galleryImages = [
            {
                small: '/assets/images/gallery-slider.jpg',
                medium: '/assets/images/gallery-slider.jpg',
                big: '/assets/images/gallery-slider.jpg'
            },
            {
                small: '/assets/images/about-us-banner.jpg',
                medium: '/assets/images/about-us-banner.jpg',
                big: '/assets/images/about-us-banner.jpg'
            },
            {
                small: '/assets/images/c-restaurant.png',
                medium: '/assets/images/c-restaurant.png',
                big: '/assets/images/c-restaurant.png'
            }
        ];
    }
 
    /*   public galleryList:any;
    public images: string[];
     config: any = {
        nextButton: '.swiper-button-next-7',
        prevButton: '.swiper-button-next-7',
        pagination: '.swiper-pagination',
        paginationClickable: true,
        spaceBetween: 30,
        loop:true,
        autoplay:3000
    };
    configGallery: Object = {
        nextButton: '.swiper-button-next-5',
        prevButton: '.swiper-button-prev-5',
        spaceBetween: 20,
        slidesPerView: 1,
        autoplay: 3000,
        autoplayDisableOnInteraction: false,
        loop: true,
        // freeMode:true,
      };    
    constructor(
        public userRequestManager:UserRequestManager,
        public activatedRoute:ActivatedRoute,
        public islogin:IsLogin,
        public spinnerService: SpinnerService
    ) {
        this.images = [
            '/assets/images/gallery-slider.jpg',
            '/assets/images/about-us-banner.jpg',
            '/assets/images/c-restaurant.png'
        ];
        this.galleryList = { "imagelist":[
             {"imagepath":"/assets/images/about-us-banner.jpg"},
             {"imagepath":"/assets/images/gallery-slider.jpg"},
             {"imagepath":"/assets/images/c-restaurant.png"}]
        }
    } */
}          