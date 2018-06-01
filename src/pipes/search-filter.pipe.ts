import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {

  transform(items: any[], criteria: any): any {
    if (criteria){
        return items.filter(item =>{
           for (let key in item ) {
             if(('' + item[key]).toLowerCase().includes(criteria.toLowerCase())){
                return true;
             }
           }
           return false;
        });
    } else {
      return items;
    }
  }

}
