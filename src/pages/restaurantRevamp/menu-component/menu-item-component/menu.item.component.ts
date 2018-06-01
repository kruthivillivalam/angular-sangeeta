import { Component, OnInit, ViewChild, Input, AfterViewInit } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { OnClickEvent, OnRatingChangeEven, OnHoverRatingChangeEvent } from 'angular-star-rating';
import { Observable} from 'rxjs/Observable';
import * as moment from 'moment';
import { ConfirmComponent } from '../../confirm.component';
import { PromptComponent } from '../../prompt.component';
import { DialogService } from 'ng2-bootstrap-modal';
import { Subject } from 'rxjs/Subject';
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
import { UserRequestManager } from '../../../../providers/user-request-manager';
import { IsLogin } from '../../../../providers/is-login';
import { AlertComponent } from '../../../common/alert.component';
import { VALIDATIONERROR, COMMONTEXT, ALERTMSGS } from '../../../../app/app.constants';
import { SpinnerService } from '../../../common/spinner.service';

declare var $: any;

@Component({
  selector: 'menu-item',
  templateUrl: './menu.item.component.html',
  styleUrls: ['./menu.item.component.scss']
})

export class MenuItemComponent implements OnInit {
  @Input() foodItemObj: any;
  @Input() qty: number;
  @Input() cartItemIdx: number;

  public merchantID: number;
  public userName: string;
  public alertMsg: any;
  public validationError: any;
  public commonText: any;
  public userDetails: any;
  public foodItem: any;
  public readMore: any = "True";
  private addToCartTrigger = new Subject<any>();
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
    // Function which handles price updation of menu items based on order type change
    this.orderTypeTrigger = this.userRequestManager.getOrderTypeChangeTrigger().subscribe(ordrTyp => {
    if (ordrTyp.type === 'de') {
      this.changePriceDelivery();
    }
    if (ordrTyp.type === 'tk') {
      this.changePriceTakeAway();
    }
    if (ordrTyp.type === 'di') {
      this.changePriceDineIn();
    }
  });
}


ngOnInit() {
  // $('[data-toggle="popover"]').popover();
  this.initFoddItem();
}

// Function which initializes menu item
initFoddItem() {
this.foodItem = {
  quantity : this.qty ? this.qty : 0,
};
console.log("foodItemObj : "+JSON.stringify(this.foodItemObj));
this.foodItem.details = this.foodItemObj;
}

increaseQty() {
  this.foodItem.quantity += 1;
}

decreaseQty() {
  this.foodItem.quantity !== 0 ? this.foodItem.quantity = this.foodItem.quantity - 1 : this.foodItem.quantity = 0;
}

// Function which prpares cart obj json before adding to cart
prepareCartItem(obj) {
const itemPrice = obj.unitPrice ? parseFloat(obj.unitPrice) : 0;
const payLoad = {
  'menuItem': obj,
  'quantity': this.foodItem.quantity,
  'itemPrice': itemPrice,
  'itemIdx' : this.cartItemIdx
};
this.userRequestManager.setCartItem(payLoad);
}

// Function which sets menu price for order type delivery
changePriceDelivery() {
const menuItemObj = JSON.parse(JSON.stringify(this.foodItem));
console.log("CHANGE PRICE", this.foodItem);
this.foodItem.details.unitPrice = this.foodItem.details.deliveryPrice;
console.log("NEW PRICE", this.foodItem, this.foodItem.details.deliveryPrice);
}

// Function which sets menu price for order type takeaway
changePriceTakeAway() {
const menuItemObj = JSON.parse(JSON.stringify(this.foodItem));
console.log("CHANGE PRICE", this.foodItem);
this.foodItem.details.unitPrice = this.foodItem.details.takeAwayPrice;
console.log("NEW PRICE", this.foodItem, this.foodItem.details.takeAwayPrice);
}

// Function which sets menu price for order type dine in
changePriceDineIn() {
const menuItemObj = JSON.parse(JSON.stringify(this.foodItem));
console.log("CHANGE PRICE", this.foodItem);
this.foodItem.details.unitPrice = this.foodItem.details.dineInPrice;
console.log("NEW PRICE", this.foodItem, this.foodItem.details.dineInPrice);
}

// Add on prompt which shows add on options , size and extra note
showAddToCartPrompt() {
const resetMenuItem = JSON.parse(JSON.stringify(this.foodItem));
console.log('resetMenuItem SID'+JSON.stringify(resetMenuItem));
console.log('this.userRequestManager.getOrderType', this.userRequestManager.getOrderType());
console.log('this.foodItem : '+this.foodItem.details.options.size.length);
if (!this.userRequestManager.getOrderType()
|| this.userRequestManager.getOrderType() == null
|| this.userRequestManager.getOrderType() === '') {
  this.dialogService.addDialog(AlertComponent, {title: this.commonText.ALERT_TITLE, message: this.alertMsg.PLS_SLCT_ORDRTYPE});
} else if (this.foodItem.quantity < 1) {
  this.dialogService.addDialog(AlertComponent, {title: this.commonText.ALERT_TITLE, message: this.alertMsg.PLS_ADD_QTY});
} else if (this.foodItem.details.options.size.length > 0) {
  const sizeOption = this.foodItem.details.IsSizeApplicable !== '0' ? false : true;
  const addOnOption = this.foodItem.details.IsoptionApplicable === '0' ? false : true;
  const promptTilte: string = this.foodItem.details.menuItemName.toString();
  const extraNote: string = this.foodItem.details.extraNote ? this.foodItem.details.extraNote : '';

  this.dialogService.addDialog(PromptComponent, {
    title: promptTilte,
    note: 'Extra Note',
    isoptions: addOnOption,
    issize: sizeOption,
    message: extraNote,
    promptItem: this.foodItem.details,
    showAddToCart: true
  }).subscribe((message) => {
    console.log("Message : " +JSON.stringify(message));
    // We get dialog result
    if(message && message[0] && message[0].addToCart === true) {
    const cartObj = JSON.parse(JSON.stringify(message[0].updatedMenuItem));
    console.log("CART OBJ->>>"+JSON.stringify(cartObj));
    this.prepareCartItem(cartObj);
    this.resetMenuItem(resetMenuItem);
  }
  console.log('message 172'+ JSON.stringify(message));
});
} else {
  const sizeOption = this.foodItem.details.IsSizeApplicable === '0' ? false : true;
  const addOnOption = this.foodItem.details.IsoptionApplicable === '0' ? false : true;
  const promptTilte: string = this.foodItem.details.menuItemName.toString();
  const extraNote: string = this.foodItem.details.extraNote ? this.foodItem.details.extraNote : '';
  var details = this.foodItem.details;
  const cartObj = JSON.parse(JSON.stringify(details));
  this.prepareCartItem(cartObj);
}
}

// Function which resets menu items to previous state after adding to cart,
// like set qty to zero, reset all add on options, size and extra note
resetMenuItem(obj){
this.foodItem = JSON.parse(JSON.stringify(obj));
this.foodItem.quantity = 0;
console.log('resetMenuItem AFTER', obj);
console.log('FOOD ITEM AFTER RESET', this.foodItem);
}
// showPrompt() {
//   console.log('POP UP ITEM' , this.foodItem.details);
//   console.log('POP UP ITEM' , this.foodItem.details);
//   const resetMenuItem = JSON.parse(JSON.stringify(this.foodItem));
//   const sizeOption = this.foodItem.details.IsSizeApplicable === '0' ? false : true;
//   const addOnOption = this.foodItem.details.IsoptionApplicable === '0' ? false : true;
//   const promptTilte: string = this.foodItem.details.menuItemName.toString();
//   const extraNote: string = this.foodItem.details.MenuItemNote === null ? '' : this.foodItem.details.MenuItemNote.toString();

//   this.dialogService.addDialog(PromptComponent, {
//     title: promptTilte,
//     note: 'Extra Note',
//     isoptions: sizeOption,
//     issize: addOnOption,
//     message: extraNote,
//     promptItem: this.foodItem.details,
//     showAddToCart: false
//   }).subscribe((message) => {
//     // We get dialog result
//     console.log('resetMenuItem AFTER', resetMenuItem);
//     console.log('FOOD ITEM', this.foodItem);
//   });
// }

// showNote(note){
//   if(note.length == 0){
//     return "No description added for this dish";
//   }
//   return note.replace(/^(.{35}[^\s]*).*/, "$1");
// }

getMenuDetai(foodItemObj) {
  if(this.readMore == "True") {
    this.readMore = "False"
  }
  else {
    this.readMore = "True";
  }
}
}
