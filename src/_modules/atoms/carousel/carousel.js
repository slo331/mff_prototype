'use strict';

import $ from 'jquery';
import 'slick-carousel';

export default class Carousel {
  constructor() {
    let $carousel = $('.carousel');
    let $numSlick = 0;

    $carousel.map((i,el) => {
      $numSlick++;
      let $el = $(el);
      let $wrap = $el.children('.carousel-wrap');
      let $carousel = $wrap.addClass('slider-' + $numSlick);
      
      $carousel.slick({
        speed: 800,
        infinite: true,
        autoplay: false,
        fade: false,
        draggable: true,
        pauseOnDotsHover: true,
        dots: true,
        arrows: true,
        mobileFirst: true,
        adaptiveHeight: true,
        appendDots: $('.carousel-pagination .dots', $el),
        appendArrows: $('.carousel-pagination', $el),
        prevArrow: $('.carousel-pagination .prev', $el),
        nextArrow: $('.carousel-pagination .next', $el)
      });
    });
  }
}
