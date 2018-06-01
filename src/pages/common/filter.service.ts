import { 
   Injectable 
} from '@angular/core';  
import { LocalStorageService } from 'angular-2-local-storage';
import { UserRequestManager } from '../../providers/user-request-manager';
@Injectable()
export class filterService {
 public allFilters:any =[];
public  hello:any;  

	constructor(
	public userRequestManager:UserRequestManager,
	public localStorage:LocalStorageService
	){
	}
	getApp(): string { 
		this.allFilters="Hello world"
		return this.allFilters; 
	}
 /*Function for getting side menu from API*/
  setSideMenu(): Promise<any> {
    return new Promise(resolve => {
      this.userRequestManager.get('getSearchAdditionalFilters')
      .then(data => {
        var alldata  = JSON.parse(JSON.stringify(data));
        if(alldata.status == 1){
          this.allFilters = alldata.data.params;
          this.allFilters.Alcohol_Type = this.addChecked(this.allFilters.Alcohol_Type,'alcoholType','Alcohol_Type');
          this.allFilters.Meal_Type = this.addChecked(this.allFilters.Meal_Type,'mealTypes','Meal_Type');
          this.allFilters.Merchant_Features = this.addChecked(this.allFilters.Merchant_Features,'merchantFeatures','Merchant_Features');
          this.allFilters.Parking_Type = this.addChecked(this.allFilters.Parking_Type,'parkingTypes','Parking_Type');
          this.allFilters.Seating_Location = this.addChecked(this.allFilters.Seating_Location,'seatingLocation','Seating_Location');
          this.allFilters.Service_Type = this.addChecked(this.allFilters.Service_Type,'serviceTypes','Service_Type');
          if (this.allFilters !== undefined || this.allFilters !== null)  this.localStorage.set('allFilters',this.allFilters);
          console.log('this.allFilters', this.localStorage.get('allFilters'));
          console.log('this.allFilter123',alldata);
          return  this.allFilters;
       }
      })
    })
  }
	getFilterValue() {
		return this.allFilters;
  }
/*   load(): Promise<any> {
    return this.http.get(this.BASEURL + 'api/client/hotel/load')
        .toPromise()
        .then(response => {
            return response.json();
        })
        .catch(err => err);
} */

  /*Function for adding checked property in the response*/
  addChecked(arr,type,name) {
    var tempArrOfFilters = [];
    for(let i = 0; i<arr.length; i++) {
      var unitChecked = false;
      if(this.localStorage.get(type) != null || this.localStorage.get(type) != undefined) {
        tempArrOfFilters = this.localStorage.get(type);
        if (tempArrOfFilters.indexOf(arr[i].id) > -1) {
          unitChecked = true;
        }
      }
        arr[i] = {
        'id':arr[i].id,
        'name':arr[i].name,
        'checked':unitChecked
      }
    }
    return arr;
  }	
} 