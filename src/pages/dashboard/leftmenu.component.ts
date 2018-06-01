import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: "leftmenu",
    template: require('./leftmenu.component.html')
  })
  export class LeftMenuComponent  {
    public menulist: any;
  constructor(
    ) {
      this.menulist =[
        {title: 'My Profile', link: '/myprofile' },
        {title: 'My Reservations', link: '/myreservation' },
        {title: 'Online Order History', link: '/myonlineorderhistory' },
        {title: 'Dine in Orders History', link: '/mydinehistory'},
        {title: 'My Favourites', link: '/myfavourites' },
        {title: 'Track Order', link: '/mytrackorder' },
        {title: 'My Reviews', link: '/myreviews' },
        {title: 'My Benefits', link: '/mybenefits' }
    ];
     }
  } 