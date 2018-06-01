import { Component, OnInit, ViewChild, Input, AfterViewInit, Output, EventEmitter  } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { OnClickEvent, OnRatingChangeEven, OnHoverRatingChangeEvent } from 'angular-star-rating';
import { Observable} from 'rxjs/Observable';
import * as moment from 'moment';
import { ConfirmComponent } from './confirm.component';
import { PromptComponent } from './prompt.component';
import { DialogService } from 'ng2-bootstrap-modal';
import { Subscription } from 'rxjs/Subscription';
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
import { UserRequestManager } from './../../providers/user-request-manager';
import { IsLogin } from './../../providers/is-login';
import { AlertComponent } from './../common/alert.component';
import { VALIDATIONERROR, COMMONTEXT, ALERTMSGS } from './../../app/app.constants';
import { SpinnerService } from './../common/spinner.service';

@Component({
  selector: 'cart-item',
  templateUrl: './cart.item.component.html',
  styleUrls: ['./cart.item.component.scss']
})

export class CartItemComponent implements OnInit {
    @Input() cartItemObj: any;
    @Input() qty: number;
    @Input() cartItemIdx: number;
    @Input() hideItemPrice: boolean;
    @Input() editable: boolean;
    @Input() freeItemFlag: boolean;
    @Input() isOnSidebar: boolean;

    @Output() cartItemObjUpdated = new EventEmitter();
    @Output() cartItemDeletion = new EventEmitter();
    public merchantID: number;
    public userName: string;
    public alertMsg: any;
    public validationError: any;
    public commonText: any;
    public userDetails: any;
    public cartItem: any;
    public allAdditionalAddedItem: any = [];
    totalAddOnPrice: number;
    public isSidebar: boolean;
    orderTypeTrigger: Subscription;
    constructor(
      public localStorage: LocalStorageService,
      public userRequestManager: UserRequestManager,
      private dialogService: DialogService,
      public activatedRoute: ActivatedRoute,
      public islogin: IsLogin,
      public spinnerService: SpinnerService,
    ) {
      this.validationError = VALIDATIONERROR;
      this.alertMsg = ALERTMSGS;
      this.commonText = COMMONTEXT;
      this.userDetails = JSON.parse(JSON.stringify(this.localStorage.get('userData')));
      this.orderTypeTrigger = this.userRequestManager.getOrderTypeChangeTrigger().subscribe(ordrTyp => {
        if (ordrTyp.type === 'de') {
          this.cartItem.details.unitPrice = this.cartItem.details.deliveryPrice;
          console.log("cartItem.details.unitPrice : "+this.cartItem.details.unitPrice);
        }
        if (ordrTyp.type === 'tk') {
          this.cartItem.details.unitPrice = this.cartItem.details.takeAwayPrice;
          console.log("cartItem.details.unitPrice : "+this.cartItem.details.takeAwayPrice);
        }
        if (ordrTyp.type === 'di') {
          this.cartItem.details.unitPrice = this.cartItem.details.dineInPrice;
          console.log("cartItem.details.unitPrice : "+this.cartItem.details.dineInPrice);
        }
      });

    }


    ngOnInit() {
      this.initFoddItem();
    }

    // Function which initializes cart item 
    initFoddItem() {
      this.cartItem = {
        quantity : this.qty ? this.qty : 0,
      };
      this.cartItem.details = this.cartItemObj;
      this.isSidebar = this.isOnSidebar;
      this.totalAddOnPrice = 0;
      if (this.cartItem.details.IsoptionApplicable === '1') {
        this.getAddOnCost(this.cartItem.details.options.optionGroups);
      }
    }

    // handles qty updation and triggers event to restaurantdetail.component.ts
    increaseQty() {
      this.cartItem.quantity += 1;
      this.fireCartItemUpdation(this.cartItem.details);
    }

    // handles qty updation and triggers event to restaurantdetail.component.ts
    decreaseQty() {
      this.cartItem.quantity !== 0 ? this.cartItem.quantity = this.cartItem.quantity - 1 : this.cartItem.quantity = 0;
        if(this.cartItem.quantity === 0) {
          this.cartItemDeletion.emit({'itemIdx': this.cartItemIdx});
        } else {
          this.fireCartItemUpdation(this.cartItem.details);
        }
    }

    // Handles cart item addition
    fireCartItemUpdation(obj) {
      const itemPrice = obj.unitPrice ? parseFloat(obj.unitPrice) : 0;
      this.getAddOnCost(this.cartItem.details.options.optionGroups);
      const updatedObj = {
        'menuItem': obj,
        'quantity': this.cartItem.quantity,
        'itemPrice': itemPrice,
        'itemIdx' : this.cartItemIdx
      };
      const cartObjCopy = Object.assign({}, updatedObj);
      this.userRequestManager.setUpatedCartItem(cartObjCopy);
    }

    // Calculates add on cost for cart items
    getAddOnCost(addOnArray) {
      addOnArray.forEach(item => {
        console.log("addOnArray : " +JSON.stringify(addOnArray));
        item.optionItems.forEach( optionItem => {
          if(optionItem.checked && optionItem.AdditionalCost) {
            if (optionItem.AdditionalCost) {
              let itemObj = {
                optionItem
              }
              this.allAdditionalAddedItem.push(itemObj)
            }
            console.log(" optionItem.AdditionalCost : "+ optionItem.AdditionalCost);
            this.totalAddOnPrice += optionItem.AdditionalCost;
            //console.log("this.totalAddOnPrice : "+this.totalAddOnPrice);
            console.log("cartItem.details.unitPrice : "+  this.cartItem.details.unitPrice  + "  cartItem.quantity: "+ this.cartItem.quantity + " this.totalAddOnPrice : "+ this.totalAddOnPrice  + "  this.cartItem.quantity : " + this.cartItem.quantity);
          }
        });
      });
      //console.log("optionItem12 : "+  this.totalAddOnPrice);
    }

    // Add on pop up prompt
    showPrompt() {
      //console.log('POPUP CART ITEM _>>', this.cartItem.details);
      const sizeOption = this.cartItem.details.IsSizeApplicable === '0' ? false : true;
      const addOnOption = this.cartItem.details.IsoptionApplicable === '0' ? false : true;
      const promptTilte: string = this.cartItem.details.menuItemName.toString();
      const extraNote: string = this.cartItem.details.extraNote ? this.cartItem.details.extraNote : '';

      this.dialogService.addDialog(PromptComponent, {
        title: promptTilte,
        note: 'Extra Note',
        isoptions: addOnOption,
        issize: sizeOption,
        message: extraNote,
        promptItem: this.cartItem.details,
        showAddToCart: false
      }).subscribe((res) => {
        //We get dialog result
        //console.log('message', res);
        if(res && res[0] && res[0].addToCart === false){
          this.fireCartItemUpdation(this.cartItem.details);
        }
      });
    }

}
