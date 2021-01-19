// Main javascript entry point
// Should handle bootstrapping/starting application
'use strict';

// Import Modules
import ScrollTop from '../_modules/atoms/scroll-top/scroll-top';
import SiteNav from '../_modules/molecules/site-nav/site-nav';
import MegaMenu from '../_modules/molecules/mega-menu/mega-menu';
import SiteSearch from '../_modules/molecules/site-search/site-search';
import HomeCarousel from '../_modules/organisms/home-carousel/home-carousel';

$(() => {
  let config = {
		breakpoints: {
			tablet: 768,
			desktop: 1024,
			lgDesktop: 1280
		}
  };

  if($('.nav-wrap').length) {
    new SiteNav(config);
  }

  if($('.site-search').length) {
    new SiteSearch();
  }

  if($('.mega-menu').length) {
    new MegaMenu(config);
  }

  if($('.scroll-top').length) {
    new ScrollTop();
  }

  if($('.carousel-home').length) {
    new HomeCarousel();
  }
});

