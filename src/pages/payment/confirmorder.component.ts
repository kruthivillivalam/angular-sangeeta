import {Component, OnInit, OnChanges, ViewChild, ChangeDetectorRef, Renderer} from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { SpinnerService } from '../common/spinner.service';
import {
    Router,
    ActivatedRoute,
    // import as RouterEvent to avoid confusion with the DOM Event
    Event as RouterEvent,
    NavigationStart,
    NavigationEnd,
    NavigationCancel,
    NavigationError,
} from '@angular/router';
import { UserRequestManager } from '../../providers/user-request-manager';
@Component({
    selector: 'confirmorder',
	template: require('./confirmorder.component.html'),
	styleUrls:['./confirmorder.component.scss']
    // directives: [ExperimentDetailComponent]
  })

export class ConfirmOrderComponent implements OnInit {
	public allPaymentData: any;
	public total: any;
	public OrderDetailsData: any;
	public orderddata: any;
	public OrderNo: any;
	public OrderType: any;
	public Orderdate: any;
	public Ordertime: any;
	public customername: any;
	public billingaddress: any = {};
	public deliveryaddress: any = {};
	public customerphone: any;
	public OrderItems: any;
	public MerchantName: any;
	public Address1: any;
	public Address2: any;
	public registeredby_mobile: any;
	public coupons: any;
	public offers: any;
	public LoyaltyPoints: any;
	public paymentDate: any;
	public paymenttime: any;
	public payment_type: any;
	public PaymentAmt: any;
	public taxtotal: any;
	public guest_customer_email: any;
	public guest_customer_mobile: any;
	constructor(
		public localStorage: LocalStorageService,
		public userRequestManager: UserRequestManager,
		public router: Router,
		public spinnerService: SpinnerService
	) {
		this.onlinePaymentData();
/* 		this.localStorage.remove('OrderDetailsData');
		this.localStorage.remove('deliType');
		this.localStorage.remove('guest_customer_email');
		this.localStorage.remove('guest_customer_mobile'); */
	}

	ngAfterContentInit(){
		this.onlinePaymentData();
	 }


	ngOnInit() {
		console.log("INIT");
		//this.onlinePaymentData();
	}
	sum() {
		this.total = 0;
		if (this.OrderItems) {
			let i = 0;
			for (i = 0; i < this.OrderItems.length; i++) {
				this.total += (this.OrderItems[i].OrderQty * this.OrderItems[i].UnitRate);
			}
		}
		return (this.total);
	}
	goToHome() {
		this.userRequestManager.resetCartData();
		this.router.navigate(['/']);
	}
	onlinePaymentData() {
//		debugger;
		//this.spinnerService.hideAll();
		this.OrderDetailsData = this.localStorage.get('OrderDetailsData');
		//console.log("OrderDetailsData", this.OrderDetailsData);
		if (this.OrderDetailsData.status === 1) {
			this.orderddata = this.OrderDetailsData.data;
			//console.log('OrderDATA'+ JSON.stringify(this.orderddata));
			this.OrderNo = this.orderddata.OrderDetails.OrderNo;
			this.OrderItems = this.orderddata.OrderDetails.OrderItems;
			//			console.log(this.orderddata.OrderDetails.MerchantDetails.MerchantName);
			this.paymentDate = this.orderddata.OrderDetails.paymentDate;
			this.paymenttime = this.orderddata.OrderDetails.paymenttime;
			this.payment_type = this.orderddata.OrderDetails.payment_type;
			this.PaymentAmt = this.orderddata.OrderDetails.PaymentAmt;
			this.taxtotal = this.orderddata.OrderDetails.taxtotal;
			if (this.orderddata.OrderDetails.MerchantDetails.MerchantName != null) {
				this.MerchantName = this.orderddata.OrderDetails.MerchantDetails.MerchantName;
			}
			else {
				this.MerchantName = "N/A";
			}
			if (this.orderddata.OrderDetails.MerchantDetails.Address1 != null) {
				this.Address1 = this.orderddata.OrderDetails.MerchantDetails.Address1;
			}
			else {
				this.Address1 = "N/A";
			}
			if (this.orderddata.OrderDetails.MerchantDetails.Address2 != null) {
				this.Address2 = this.orderddata.OrderDetails.MerchantDetails.Address2;
			}
			else {
				this.Address2 = "N/A";
			}
			if (this.orderddata.OrderDetails.MerchantDetails.registeredby_mobile != null) {
				this.registeredby_mobile = this.orderddata.OrderDetails.MerchantDetails.registeredby_mobile;
			}
			else {
				this.registeredby_mobile = "N/A";
			}

			if(this.localStorage.get('guest_customer_email') != null && this.localStorage.get('guest_customer_email') != undefined) {
				 this.guest_customer_email = this.localStorage.get('guest_customer_email');

			}
			else this.guest_customer_email = "N/A";
			if(this.localStorage.get('guest_customer_mobile') != null && this.localStorage.get('guest_customer_mobile') != undefined) {
				 this.guest_customer_mobile = this.localStorage.get('guest_customer_mobile');

			}
			else this.guest_customer_mobile = "N/A";

			if(this.localStorage.get('deliType') != null || this.localStorage.get('deliType') != undefined) {
				//sendPaymentData['deliType']= this.localStorage.get('deliType');
				if(this.localStorage.get('deliType') == 'tk') this.OrderType = 'Take Away';
				else if(this.localStorage.get('deliType') == 'de') this.OrderType = 'Delivery';
				else this.OrderType = "N/A";
			}
			if(this.localStorage.get('deliType') != null || this.localStorage.get('deliType') != undefined) {
				//sendPaymentData['deliType']= this.localStorage.get('deliType');
				if(this.localStorage.get('deliType') == 'tk') this.OrderType = 'Take Away';
				else if(this.localStorage.get('deliType') == 'de') this.OrderType = 'Delivery';
				else this.OrderType = "N/A";

			// if (this.orderddata.OrderDetails.OrderType != null) {
			// 	this.OrderType = this.orderddata.OrderDetails.OrderType;
			// }
			// else {
			// 	this.OrderType = "N/A";
			// }
			if (this.orderddata.OrderDetails.Orderdate != null) {
				this.Orderdate = this.orderddata.OrderDetails.Orderdate;
			}
			else {
				this.Orderdate = "N/A";
			}
			if (this.orderddata.OrderDetails.Ordertime != null) {
				this.Ordertime = this.orderddata.OrderDetails.Ordertime;
			}
			else {
				this.Ordertime = "00:00";
			}
			let billingadd;
			let deliveryadd;
			  if(this.localStorage.get('deliveryAddress') != null && this.localStorage.get('deliveryAddress') != undefined) {
				deliveryadd = JSON.parse(JSON.stringify(this.localStorage.get('deliveryAddress')));
				//console.log('this.deliveryAddress'+ JSON.stringify(deliveryadd));
				let deliveryaddress = deliveryadd;
        if (deliveryaddress.addressline1 || deliveryaddress.addressLine1) {
          this.deliveryaddress.addressLine1 = deliveryaddress.addressline1 || deliveryaddress.addressLine1;
        }
        if (deliveryaddress.addressline2 || deliveryaddress.addressLine2) {
          this.deliveryaddress.addressLine2 = deliveryaddress.addressline2 || deliveryaddress.addressLine2;
        }
        if (deliveryaddress.suburb) {
          this.deliveryaddress.suburb = deliveryaddress.suburb.replace(/\,/g,"");
        }
        if (deliveryaddress.city) {
          this.deliveryaddress.city = deliveryaddress.city.replace(/\,/g,"");
        }
        if (deliveryaddress.postcode) {
          this.deliveryaddress.postcode = deliveryaddress.postcode.replace(/\,/g,"");
        }
        if (deliveryaddress.state) {
          this.deliveryaddress.suburb = deliveryaddress.state.replace(/\,/g,"");
        }
        if (deliveryaddress.country) {
          this.deliveryaddress.country = deliveryaddress.state.replace(/\,/g,"");
        }
			  }
			  if(this.localStorage.get('billingAddress') != null && this.localStorage.get('billingAddress') != undefined) {
				billingadd = JSON.parse(JSON.stringify(this.localStorage.get('billingAddress')));
				//console.log('this.billingAddress'+ JSON.stringify(billingadd));
				let billingaddress = billingadd;
        if (billingaddress.addressline1 || billingaddress.addressLine1) {
          this.billingaddress.addressLine1 = billingaddress.addressline1 || billingaddress.addressLine1;
        }
        if (billingaddress.addressline2 || billingaddress.addressLine2) {
          this.billingaddress.addressLine2 = billingaddress.addressline2 || billingaddress.addressLine2;
        }
        if (billingaddress.suburb) {
          this.billingaddress.suburb = billingaddress.suburb.replace(/\,/g,"");
        }
        if (billingaddress.city) {
          this.billingaddress.city = billingaddress.city.replace(/\,/g,"");
        }
        if (billingaddress.postcode) {
          this.billingaddress.postcode = billingaddress.postcode.replace(/\,/g,"");
        }
        if (billingaddress.state) {
          this.billingaddress.suburb = billingaddress.state.replace(/\,/g,"");
        }
        if (billingaddress.country) {
          this.billingaddress.country = billingaddress.state.replace(/\,/g,"");
        }
        //console.log("Line 2"+this.billingaddress.addressline2 || this.billingaddress.addressLine2)
			  }
			if (this.orderddata.OrderDetails.CustomerDetails.phone != null  && this.orderddata.OrderDetails.phone != undefined) {
				this.customerphone = this.orderddata.OrderDetails.CustomerDetails.phone;
			}
			else {
				this.customerphone = "N/A";
			}
			if (this.orderddata.OrderDetails.CustomerDetails.name != null  && this.orderddata.OrderDetails.CustomerDetails.name != undefined &&  this.orderddata.OrderDetails.CustomerDetails.name != " ") {
				this.customername = this.orderddata.OrderDetails.CustomerDetails.name;
			}
			else {
				this.customername = "N/A";
			}
			if (this.orderddata.OrderDetails.CustomerDetails.phone != null  && this.orderddata.OrderDetails.CustomerDetails.phone != undefined) {
				this.customerphone = this.orderddata.OrderDetails.CustomerDetails.phone;
			}
			else {
				this.customerphone = "N/A";
			}
			if (this.orderddata.OrderDetails.BenefitsEarned.coupons != null  && this.orderddata.OrderDetails.BenefitsEarned.coupons != undefined) {
				this.coupons = this.orderddata.OrderDetails.BenefitsEarned.coupons;
			}
			else {
				this.coupons = "0";
			}
			if (this.orderddata.OrderDetails.BenefitsEarned.offers != null  && this.orderddata.OrderDetails.BenefitsEarned.offers != undefined) {
				this.offers = this.orderddata.OrderDetails.BenefitsEarned.offers;
			}
			else {
				this.offers = "N/A";
			}
			if (this.orderddata.OrderDetails.BenefitsEarned.LoyaltyPoints != null  && this.orderddata.OrderDetails.BenefitsEarned.LoyaltyPoints != undefined) {
				this.LoyaltyPoints = this.orderddata.OrderDetails.BenefitsEarned.LoyaltyPoints;
			}
			else {
				this.LoyaltyPoints = "Nil";
			}

		}
	}
	}
}
