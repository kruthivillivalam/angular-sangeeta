/**
 * System configuration
 */
(function (global) {
  System.config({
    paths: {
      // paths serve as alias
      'npm:': 'node_modules/'
    },
    // map tells the System loader where to look for things
    map: {
      // our app is within the app folder
      app: 'dist',

      // angular bundles
      '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
      '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
      '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
      '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
      '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
      '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
      '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
      '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',
      '@angular/animations': 'npm:@angular/animations/bundles/animations.umd.js',
      '@angular/animations/browser': 'npm:@angular/animations/bundles/animations-browser.umd.js',
      '@angular/platform-browser/animations': 'npm:@angular/platform-browser/bundles/platform-browser-animations.umd.js',

      // other libraries
      'rxjs':                      'npm:rxjs',
      'ng2-file-upload':           'npm:ng2-file-upload',
      'cloudinary-core':           'npm:cloudinary-core',
      '@cloudinary/angular':       'npm:@cloudinary/angular',
      'angular2-cookie':           'npm:angular2-cookie',
      'angular2-social-login': 'node_modules/angular2-social-login/dist/bundles/angular2-social-login.min.js',
      'angular-in-memory-web-api': 'npm:angular-in-memory-web-api/bundles/in-memory-web-api.umd.js',
      'angular2-useful-swiper': 'node_modules/angular2-useful-swiper/lib',
      'ng2-completer': 'node_modules/ng2-completer/ng2-completer.umd.js',
      'nouislider': 'node_modules/nouislider',
      'ng2-nouislider': 'node_modules/ng2-nouislider',
      '@ngui/map' : 'node_modules/@ngui/map/dist/map.umd.js',
      'ngx-gallery': 'node_modules/ngx-gallery/bundles/ngx-gallery.umd.js'

    },
    // packages tells the System loader how to load when no filename and/or no extension
    packages: {
      app: {
        main: './main.js',
        defaultExtension: 'js'
      },
      rxjs: {
        defaultExtension: 'js'
      },
      'ng2-file-upload': {
        main: 'ng2-file-upload.js',
        defaultExtension: 'js'
      },
      'cloudinary-core': {
        main: 'cloudinary-core-shrinkwrap.js',
        defaultExtension: 'js'
      },
      '@cloudinary/angular': {
        main: 'index.js',
        defaultExtension: 'js'
      },
      'moment': {
          main: './moment.js',
          defaultExtension: 'js'
      },
      'angular2-moment': {
          main: './index.js',
          defaultExtension: 'js'
      },
      'angular2-useful-swiper': {
        main: 'swiper.module.js',
         defaultExtension: 'js'
       },
       'angular2-busy': {
            main: './index.js',
            defaultExtension: 'js'
        },
        'nouislider': {
            main: 'distribute/nouislider.js',
            defaultExtension: 'js'
        },
        'ng2-nouislider': {
            main: 'src/nouislider.js',
            defaultExtension: 'js'
        }

    }
  });
})(this);
