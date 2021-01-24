// Main javascript entry point
// Should handle bootstrapping/starting application
'use strict';

// Import Modules
import Carousel from '../_modules/atoms/carousel/carousel';
import ScrollTop from '../_modules/atoms/scroll-top/scroll-top';
import SiteNav from '../_modules/molecules/site-nav/site-nav';
import MegaMenu from '../_modules/molecules/mega-menu/mega-menu';
import SiteSearch from '../_modules/molecules/site-search/site-search';
import Listing from '../_modules/molecules/listing/listing';
import Spotlight from '../_modules/molecules/spotlight/spotlight';
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

  if($('.carousel').length) {
    new Carousel();
  }

  if($('.listing').length) {
    let $listing = $('.listing');

		$listing.map((i,el) => {
      let $el = $(el);
			new Listing($el);
    });
  }

  if($('.spotlight').length) {
    let $spotlight = $('.spotlight');

    $spotlight.map((i,el) => {
      let $el = $(el);
      new Spotlight($el);
    });
  }
});

