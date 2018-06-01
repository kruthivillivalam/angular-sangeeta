import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'vegNonFilter'
})
export class VegNonVegFilter implements PipeTransform {

  transform(items: any[], criteria: any): any {
    if (criteria) {
        return items.filter(item => {
             if (item.vegOrNonVeg === criteria) {
                return true;
             } else {
              return false;
             }
        });
    } else {
      return items;
    }
  }

}
