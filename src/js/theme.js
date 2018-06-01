// jQuery(document).ready(function() {

  // Toggle menu
  jQuery('.mobile-menu-btn').click(function() {
    jQuery('.main-menu').slideToggle();
  });


  // Thumbails owl carousel slider
  var slider = jQuery('.gallery-wrap #slider');
  var thumbnailSlider = jQuery('.gallery-wrap #thumbnailSlider');
  var duration = 500;
  slider.owlCarousel({
    loop: false,
    nav: true,
    items: 1,
    autoplay: false,
    dots: true,
    autoplayTimeout: 2000,
  }).on('changed.owl.carousel', function (e) {
   thumbnailSlider.trigger('to.owl.carousel', [e.item.index, duration, true]);
  });
  // carousel function for thumbnail slider
  thumbnailSlider.owlCarousel({
    loop: false,
    margin: 15,
    center: false,
    nav: false,
    dots: false,
    responsive:{
    320:{
      items:1
    },
    480:{
      items:2
    },
    767:{
      items:3
    },
    1000:{
      items:4
      }
    }
  }).on('click', '#slider .owl-item', function () {
  // On click of thumbnail items to trigger same main item
    slider.trigger('to.owl.carousel', [jQuery(this).index(), duration, true]);
  }).on('changed.owl.carousel', function (e) {
  // On change of thumbnail item to trigger main item
    slider.trigger('to.owl.carousel', [e.item.index, duration, true]);
  });


  // Track Order Progress bar
  // jQuery('.restaurant-cancel-order .cancel-btn').click(function(){
  //   var mainwidth = jQuery(".progress-bar").width() / jQuery('.progress-bar').parent().width() * 100;
  //   alert(mainwidth);
  //   var percent = (100 / 4);
  //   alert(percent);
  //   var totalwidth = mainwidth + percent;
  //   alert(totalwidth);
  //   jQuery(this).parents('.restaurant-table-detail-wrap').find('.track-order .progress .progress-bar').css({width: totalwidth + '%'});
  // });


  //These two are navigation for main items
  jQuery('.slider-right').click(function() {
    slider.trigger('next.owl.carousel');
  });
  jQuery('.slider-left').click(function() {
    slider.trigger('prev.owl.carousel');
  });


  // Popular Gird of Home Page
  jQuery('.popular-section .popular-grid-slider').owlCarousel({
    loop: true,
    margin: 24,
    nav: true,
    autoplay: false,
    dots: true,
    lazyLoad: true,
    autoplayTimeout: 2000,
    autoWidth: false,
    slideBy: 1,
    items:3,
    responsive:{
      320:{
        items:1
      },
      480:{
        items:1
      },
      767:{
        items:1
      },
      1000:{
        items:1
      }
    }
  });

  // Cusine Types of Home Page
  jQuery('.cusine-type-section').owlCarousel({
    loop: true,
    margin: 24,
    nav: true,
    autoplay: true,
    dots: false,
    lazyLoad: true,
    autoplayTimeout: 2000,
    autoWidth: false,
    slideBy: 1,
    items:3,
    responsive:{
      320:{
        items:1
      },
      480:{
        items:2
      },
      767:{
        items:3
      },
      1000:{
        items:4
      }
    }
  });

  // Featured Grid of Home Page
  jQuery('.featured-grid-view').owlCarousel({
    loop: true,
    margin: 30,
    nav: false,
    autoplay: true,
    dots: false,
    lazyLoad: true,
    autoplayHoverPause: true,
    autoplayTimeout: 2000,
    autoWidth: false,
    slideBy: 1,
    items:3,
    responsive:{
      320:{
        items:1
      },
      480:{
        items:2
      },
      767:{
        items:3
      },
      1000:{
        items:4
      }
    }
  });

  // Search Page Slider
  jQuery('.event-slider-wrap').owlCarousel({
    loop: true,
    margin: 0,
    nav: true,
    autoplay: true,
    dots: false,
    lazyLoad: true,
    autoplayTimeout: 5000,
    autoWidth: false,
    slideBy: 1,
    items: 1,
  });

  // Add class for Restaurant detail - Menu tab
  jQuery('.categories-list ul li').click(function(){
    jQuery(this).closest('.categories-list ul li').toggleClass('active');
  });

  // Slide Toggle for change profile image
  jQuery('.change-image-link').click(function() {
    jQuery('.update-profile-image').slideToggle();
  });

  // My Favourite Grid Slider

  // Calculate number of Slides
  jQuery('.favourite-slider-wrap .fav-grid-wrapper').each(function(){
    var totalItems = jQuery(this).children('.favourite-grid').length;


    if(jQuery(window).width() > 1200) {
      if (totalItems <= 3) {
        var isLooped = false;
        var isNav = false;
      }
      else {
        var isLooped = true;
        var isNav = true;
      }
    }
    else if(jQuery(window).width() > 480) {
      if (totalItems <= 2) {
        var isLooped = false;
        var isNav = false;
      }
      else {
        var isLooped = true;
        var isNav = true;
      }
    }
    else {
      if (totalItems = 1) {
        var isLooped = false;
        var isNav = false;
      }
      else {
        var isLooped = true;
        var isNav = true;
      }
    }

    jQuery(this).owlCarousel({
      loop: isLooped,
      margin: 30,
      nav: isNav,
      autoplay: true,
      dots: false,
      lazyLoad: true,
      autoplayHoverPause: true,
      autoplayTimeout: 2000,
      autoWidth: false,
      slideBy: 1,
      items: 3,
      responsive:{
        320:{
          items: 1,
        },
        480:{
          items:2
        },
        1200:{
          items:3
        }
      }
    });

  });

  // Press page slider js
  jQuery('.press-video-content-wrap .press-video-content').each(function(){
    var totalItems = jQuery(this).children('.grid').length;


    if(jQuery(window).width() > 1200) {
      if (totalItems <= 3) {
        var isLooped = false;
        var isNav = false;
      }
      else {
        var isLooped = true;
        var isNav = true;
      }
    }
    else if(jQuery(window).width() > 480) {
      if (totalItems <= 2) {
        var isLooped = false;
        var isNav = false;
      }
      else {
        var isLooped = true;
        var isNav = true;
      }
    }
    else {
      if (totalItems = 1) {
        var isLooped = false;
        var isNav = false;
      }
      else {
        var isLooped = true;
        var isNav = true;
      }
    }

    jQuery(this).owlCarousel({
      loop: isLooped,
      margin: 25,
      nav: isNav,
      autoplay: true,
      dots: false,
      lazyLoad: true,
      autoplayHoverPause: true,
      autoplayTimeout: 2000,
      autoWidth: false,
      slideBy: 1,
      items: 4,
      responsive:{
        320:{
          items: 1,
        },
        480:{
          items: 2
        },
        767:{
          items: 3
        },
        1200:{
          items: 4
        }
      }
    });
  });

  // Show more links jQuery
  jQuery('.show-more .show-more-link').click(function(){
    jQuery(this).closest('ul').find('.show-more-plan').slideDown();
    jQuery(this).closest('ul').find('.show-more').addClass('hide-show-more');
  });
  jQuery('.show-more .show-more-less').click(function(){
    jQuery(this).closest('ul').find('.show-more-plan').slideUp();
    jQuery(this).closest('ul').find('.show-more').removeClass('hide-show-more');
  });
  // Plan Grid Slider
  // jQuery('.step-detail-wrap .plan-grid-wrap').owlCarousel({
  //   loop: true,
  //   margin: 0,
  //   nav: true,
  //   autoplay: false,
  //   dots: false,
  //   lazyLoad: true,
  //   autoplayTimeout: 2000,
  //   autoWidth: false,
  //   slideBy: 1,
  //   items: 3,
  //   responsive:{
  //     320:{
  //       items:1
  //     },
  //     767:{
  //       items:2
  //     },
  //     1200:{
  //       items:3
  //     }
  //   }
  // });

   // Custom input type file js
  jQuery('.upload-image .input-file-sub input').change(function() {
    var filename = jQuery(this).val();
    jQuery(this).parent().parent().children('.upload-image .input-file .input-file-name').text(filename);
    var target = event.target || event.srcElement;
    if (target.value.length == 0) {
      jQuery(this).parent().parent().children('.input-file-name').text('No file chosen');
    }
  });

  // background-image
  var bg_img = jQuery('.search-grid-view-event .search-event-grid .serch-event-details-wrap .search-event-image img').attr('src');
  jQuery('.search-grid-view-event .search-event-grid .serch-event-details-wrap').css('background-image', 'url(' + bg_img + ')');

  // Same height for event grid
  var highestBox = 0;
    jQuery('.search-event-grid-2 .search-event-detail').each(function(){
      if(jQuery(this).height() > highestBox){
      highestBox = jQuery(this).height();
    }
  });
  jQuery('.search-event-grid-2 .search-event-detail').height(highestBox);

  var highestBox1 = 0;
    jQuery('.search-event-grid-3 .search-event-detail').each(function(){
      if(jQuery(this).height() > highestBox1){
      highestBox1 = jQuery(this).height();
    }
  });
  jQuery('.search-event-grid-3 .search-event-detail').height(highestBox1);

  // Social Share icon in Restaurant detail Page
  jQuery('.share-icon-wrap a').click(function(){
    jQuery(this).parents('.reviewer-share-section').children('.add-toggel-class').toggleClass('toggle-social-class');
  });

// });
