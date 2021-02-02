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
      let $carouselWrap = $wrap.addClass('slider-' + $numSlick);

      let $galleryHeight = () => {
        let $carouselItem = $('.carousel-item', $carouselWrap);
        let $gallery = $('.gallery', $carouselItem);

        $('.item-desc', $gallery).matchHeight({
          byRow: false
        });

        let $descHeight = $('.item-desc', $gallery).outerHeight();
        let $imgHeight = $('.item-img', $gallery).outerHeight();

        $('.item-img', $gallery).css({
          height: $imgHeight - $descHeight
        });

      }

      $.when($galleryHeight())
      .done(() => {
        $carouselWrap.slick({
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
    });
  }
}
